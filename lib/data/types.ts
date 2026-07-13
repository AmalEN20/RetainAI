import type { RiskLevel } from "@/lib/mock-data";
import type { AgentTraceStep, AnalysisMode } from "@/lib/analysis/schema";

export type CustomerRecord = {
  id: string;
  name: string;
  contact: string;
  email: string;
  initials: string;
  plan: string;
  health: number;
  risk: RiskLevel;
  renewal: string;
  renewalDays: number;
  activity: string;
  change: number;
};

export type ConversationRecord = {
  id: number;
  customerId: string;
  customer: string;
  initials: string;
  contact: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  unread: boolean;
  risk: RiskLevel;
  intent: string;
};

export type ApprovalStatus = "pending" | "approved" | "rejected";

export type ApprovalRecord = {
  id: string;
  customerId: string;
  customer: string;
  initials: string;
  action: string;
  description: string;
  created: string;
  risk: RiskLevel;
  owner: string;
  status: ApprovalStatus;
  subject?: string;
  body?: string;
  runId?: string;
};

export type AgentRunRecord = {
  id: string;
  customer: string;
  initials: string;
  conversation: string;
  created: string;
  mode: AnalysisMode;
  model: string | null;
  status: "completed" | "blocked";
  riskLevel: "high" | "medium" | "low";
  summary: string;
  durationMs: number;
  toolCallCount: number;
  modelTurns: number;
  citationCount: number;
  safety: "passed" | "blocked";
  trace: AgentTraceStep[];
};
