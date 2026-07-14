import OpenAI from "openai";
import type { ResponseInput } from "openai/resources/responses/responses";
import { toResponseInputItems } from "openai/lib/responses/ResponseInputItems";
import { zodTextFormat } from "openai/helpers/zod";
import {
  executeReadOnlyTool,
  isAgentToolName,
  readOnlyAgentTools,
  summarizeToolOutput,
} from "./agent-tools";
import { analysisResultSchema, type AgentTraceStep, type AnalysisResult } from "./schema";

export const MAX_AGENT_ITERATIONS = 6;

const SYSTEM_INSTRUCTIONS = `You are a senior B2B SaaS Customer Success agent.
You receive only a customer message and identifiers. Use the available read-only tools to gather the evidence needed for a reliable analysis.
Before finalizing, inspect the customer profile, usage metrics, subscription, and support history. Search the knowledge base for approved policy and playbook guidance relevant to the customer's issue. You may choose the order and can call independent tools together.
Never invent facts, discounts, policies, or product capabilities. Never request or execute a side-effecting action.
Prioritize retention without making guarantees. Write a concise, empathetic email draft.
Every risk factor, source, and action must be traceable to tool output. For knowledge-base evidence, include the returned citation and chunk id in the structured source detail.
When enough evidence is available, return the requested structured result.`;

type AgentRunInput = {
  conversationId: number;
  customerId: string;
  subject: string;
  message: string;
};

export async function runCustomerSuccessAgent(agentInput: AgentRunInput) {
  const model = process.env.OPENAI_MODEL || "gpt-5.5";
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const input: ResponseInput = [
    {
      role: "user",
      content: JSON.stringify(agentInput),
    },
  ];
  const trace: AgentTraceStep[] = [];
  let modelTurns = 0;

  for (let iteration = 0; iteration < MAX_AGENT_ITERATIONS; iteration += 1) {
    modelTurns += 1;
    const modelStartedAt = Date.now();
    const response = await client.responses.parse({
      model,
      instructions: SYSTEM_INSTRUCTIONS,
      input,
      tools: readOnlyAgentTools,
      tool_choice: "auto",
      parallel_tool_calls: true,
      text: {
        format: zodTextFormat(analysisResultSchema, "customer_success_analysis"),
        verbosity: "low",
      },
    });

    input.push(...toResponseInputItems(response.output));
    const toolCalls = response.output.filter((item) => item.type === "function_call");

    if (toolCalls.length === 0) {
      if (!response.output_parsed) {
        throw new Error("Agent stopped without a structured analysis.");
      }

      trace.push({
        id: `decision-${response.id}`,
        kind: "decision",
        label: "Retention plan prepared",
        tool: null,
        status: "completed",
        durationMs: Date.now() - modelStartedAt,
        summary: "Risk assessment, retention plan, and approval-safe draft created",
        readOnly: true,
      });

      return {
        result: response.output_parsed as AnalysisResult,
        model,
        trace,
        modelTurns,
      };
    }

    for (const call of toolCalls) {
      const toolStartedAt = Date.now();
      if (!isAgentToolName(call.name)) {
        throw new Error(`Agent requested an unregistered tool: ${call.name}`);
      }

      const output = await executeReadOnlyTool(call.name, call.parsed_arguments);
      trace.push({
        id: call.call_id,
        kind: "tool",
        label: call.name.replaceAll("_", " "),
        tool: call.name,
        status: "completed",
        durationMs: Date.now() - toolStartedAt,
        summary: summarizeToolOutput(call.name, output),
        readOnly: true,
      });
      input.push({
        type: "function_call_output",
        call_id: call.call_id,
        output: JSON.stringify(output),
      });
    }
  }

  throw new Error(`Agent exceeded the ${MAX_AGENT_ITERATIONS}-iteration safety limit.`);
}
