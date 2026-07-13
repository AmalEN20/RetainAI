import { NextResponse } from "next/server";
import { analyzeWithOpenAI } from "@/lib/analysis/openai";
import { mockAnalysisResult } from "@/lib/analysis/mock";
import { analysisRequestSchema, type AnalysisMode, type AnalysisResponse } from "@/lib/analysis/schema";
import { loadCustomerContext } from "@/lib/analysis/tools";

export async function POST(request: Request) {
  const startedAt = Date.now();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = analysisRequestSchema.safeParse(body);
  if (!parsed.success || parsed.data.conversationId !== 1) {
    return NextResponse.json({ error: "Conversation not found." }, { status: 404 });
  }

  const context = loadCustomerContext();
  const requestedMode = process.env.AI_MODE === "openai" ? "openai" : "mock";
  let mode: AnalysisMode = "mock";
  let model: string | null = null;
  let result = mockAnalysisResult;
  let note: string | undefined;

  if (requestedMode === "openai" && process.env.OPENAI_API_KEY) {
    try {
      const openaiAnalysis = await analyzeWithOpenAI(context);
      result = openaiAnalysis.result;
      model = openaiAnalysis.model;
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
      ...(note ? { note } : {}),
    },
  };

  return NextResponse.json(response, {
    headers: { "Cache-Control": "no-store" },
  });
}
