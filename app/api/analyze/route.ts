import { NextResponse } from "next/server";
import { MAX_AGENT_ITERATIONS, runCustomerSuccessAgent } from "@/lib/analysis/openai";
import { mockAgentTrace, mockAnalysisResult } from "@/lib/analysis/mock";
import { analysisRequestSchema, type AnalysisMode, type AnalysisResponse } from "@/lib/analysis/schema";
import { getConversationById, saveAgentRun } from "@/lib/data/repository";

export async function POST(request: Request) {
  const startedAt = Date.now();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = analysisRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  }

  const conversation = await getConversationById(parsed.data.conversationId);
  if (!conversation || conversation.id !== 1 || conversation.customerId !== "cus_acme_001") {
    return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  }
  const requestedMode = process.env.AI_MODE === "openai" ? "openai" : "mock";
  let mode: AnalysisMode = "mock";
  let model: string | null = null;
  let result = mockAnalysisResult;
  let trace = mockAgentTrace;
  let modelTurns = 2;
  let note: string | undefined;

  if (requestedMode === "openai" && process.env.OPENAI_API_KEY) {
    try {
      const agentRun = await runCustomerSuccessAgent({
        conversationId: conversation.id,
        customerId: conversation.customerId,
        subject: conversation.subject,
        message: conversation.body,
      });
      result = agentRun.result;
      model = agentRun.model;
      trace = agentRun.trace;
      modelTurns = agentRun.modelTurns;
      mode = "openai";
    } catch {
      mode = "fallback";
      note = "The live model was unavailable, so RetainAI returned the verified demo analysis.";
    }
  } else if (requestedMode === "openai") {
    mode = "fallback";
    note = "OPENAI_API_KEY is not configured, so RetainAI returned the verified demo analysis.";
  }

  const response: AnalysisResponse = {
    result,
    meta: {
      mode,
      model,
      runId: crypto.randomUUID(),
      durationMs: Date.now() - startedAt,
      trace,
      toolCallCount: trace.filter((step) => step.kind === "tool").length,
      modelTurns,
      maxIterations: MAX_AGENT_ITERATIONS,
      ...(note ? { note } : {}),
    },
  };

  await saveAgentRun(response, conversation).catch(() => false);

  return NextResponse.json(response, {
    headers: { "Cache-Control": "no-store" },
  });
}
