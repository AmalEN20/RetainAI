import { z } from "zod";

export const analysisRequestSchema = z.object({
  conversationId: z.number().int().positive(),
});

export const analysisResultSchema = z.object({
  intent: z.enum(["cancellation_risk", "product_question", "expansion_signal", "support_escalation"]),
  riskLevel: z.enum(["high", "medium", "low"]),
  confidence: z.number().min(0).max(1),
  summary: z.string().min(20),
  healthScore: z.number().int().min(0).max(100),
  riskFactors: z.array(
    z.object({
      label: z.string(),
      evidence: z.string(),
      severity: z.enum(["high", "medium", "low"]),
    }),
  ),
  recommendedActions: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      priority: z.enum(["now", "this_week", "monitor"]),
    }),
  ),
  emailDraft: z.object({
    subject: z.string(),
    body: z.string(),
  }),
  sources: z.array(
    z.object({
      tool: z.enum(["get_customer_profile", "get_usage_metrics", "get_subscription", "get_support_tickets"]),
      label: z.string(),
      detail: z.string(),
    }),
  ),
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;

export type AnalysisMode = "mock" | "openai" | "fallback";

export type AgentTraceStep = {
  id: string;
  kind: "tool" | "decision";
  label: string;
  tool: string | null;
  status: "completed" | "blocked";
  durationMs: number;
  summary: string;
  readOnly: boolean;
};

export type AnalysisResponse = {
  result: AnalysisResult;
  meta: {
    mode: AnalysisMode;
    model: string | null;
    runId: string;
    durationMs: number;
    trace: AgentTraceStep[];
    toolCallCount: number;
    modelTurns: number;
    maxIterations: number;
    note?: string;
  };
};
