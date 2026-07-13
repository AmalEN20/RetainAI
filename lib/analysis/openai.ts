import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { analysisResultSchema, type AnalysisResult } from "./schema";
import type { CustomerContext } from "./tools";

const SYSTEM_INSTRUCTIONS = `You are a senior B2B SaaS Customer Success analyst.
Analyze only the supplied customer context. Never invent facts, discounts, policies, or product capabilities.
Prioritize retention without making guarantees. Write a concise, empathetic email draft.
Every risk factor and action must be traceable to the supplied tool data.
Return only the requested structured result.`;

export async function analyzeWithOpenAI(context: CustomerContext) {
  const model = process.env.OPENAI_MODEL || "gpt-5.5";
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await client.responses.parse({
    model,
    instructions: SYSTEM_INSTRUCTIONS,
    input: JSON.stringify(context),
    text: {
      format: zodTextFormat(analysisResultSchema, "customer_success_analysis"),
      verbosity: "low",
    },
  });

  if (!response.output_parsed) {
    throw new Error("OpenAI returned no structured analysis.");
  }

  return { result: response.output_parsed as AnalysisResult, model };
}
