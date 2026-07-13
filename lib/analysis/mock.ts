import type { AgentTraceStep, AnalysisResult } from "./schema";

export const mockAgentTrace: AgentTraceStep[] = [
  { id: "call-profile", kind: "tool", label: "Customer profile retrieved", tool: "get_customer_profile", status: "completed", durationMs: 18, summary: "Acme Inc. · Pro plan · Health 34", readOnly: true },
  { id: "call-usage", kind: "tool", label: "Usage metrics analyzed", tool: "get_usage_metrics", status: "completed", durationMs: 24, summary: "Weekly active usage -42% · 18/50 seats active", readOnly: true },
  { id: "call-support", kind: "tool", label: "Support history reviewed", tool: "get_support_tickets", status: "completed", durationMs: 21, summary: "3 open tickets · oldest 12 days", readOnly: true },
  { id: "call-subscription", kind: "tool", label: "Subscription checked", tool: "get_subscription", status: "completed", durationMs: 15, summary: "Renewal in 14 days · $249 MRR", readOnly: true },
  { id: "call-knowledge", kind: "tool", label: "Knowledge base searched", tool: "search_knowledge_base", status: "completed", durationMs: 12, summary: "3 policy chunks · billing, credits, and recovery guidance", readOnly: true },
  { id: "decision-retention", kind: "decision", label: "Retention plan prepared", tool: null, status: "completed", durationMs: 41, summary: "High-risk plan and customer-safe draft created", readOnly: true },
];

export const mockAnalysisResult: AnalysisResult = {
  intent: "cancellation_risk",
  riskLevel: "high",
  confidence: 0.96,
  healthScore: 34,
  summary:
    "Acme is at immediate churn risk. Their explicit cancellation message is reinforced by a 42% usage decline, an unresolved billing issue, and a renewal in 14 days.",
  riskFactors: [
    { label: "Cancellation intent", evidence: "The customer explicitly said they are thinking about canceling.", severity: "high" },
    { label: "Product adoption decline", evidence: "Weekly active usage fell 42% over the last 30 days.", severity: "high" },
    { label: "Unresolved support friction", evidence: "Three tickets remain open; the duplicate invoice has waited 12 days.", severity: "high" },
    { label: "Renewal proximity", evidence: "The Pro subscription renews in 14 days.", severity: "medium" },
  ],
  recommendedActions: [
    { title: "Resolve billing issue", description: "Escalate the duplicate invoice today and give Sarah a named owner and 24-hour resolution target.", priority: "now" },
    { title: "Book a recovery call", description: "Offer a 30-minute workflow review focused on restoring value for Acme’s 50-seat team.", priority: "now" },
    { title: "Offer account credit", description: "After the billing issue is resolved, offer the approved $125 credit as a trust-recovery gesture.", priority: "this_week" },
  ],
  emailDraft: {
    subject: "Let’s get Acme back on track before renewal",
    body: "Hi Sarah,\n\nThank you for being direct with us — I understand why the unresolved billing issue and lower team usage have made the subscription feel difficult to justify.\n\nI’m escalating the duplicate invoice today with a 24-hour resolution target. I’d also like to schedule a 30-minute working session this week to review your team’s current workflow and create a focused adoption plan before renewal.\n\nOnce the billing issue is resolved, I can also apply a $125 account credit. Would Tuesday or Wednesday work for a short call?\n\nBest,\nAmal\nCustomer Success",
  },
  sources: [
    { tool: "get_customer_profile", label: "Customer profile", detail: "Acme Inc. · Pro plan · Health score 34" },
    { tool: "get_usage_metrics", label: "Usage metrics", detail: "Weekly active users down 42% in 30 days" },
    { tool: "get_subscription", label: "Subscription", detail: "Renews in 14 days · $249 MRR" },
    { tool: "get_support_tickets", label: "Support history", detail: "3 open tickets · oldest open for 12 days" },
    { tool: "search_knowledge_base", label: "Retention policy", detail: "Credits require approval after a resolution path is assigned", citation: "Cancellation & Billing Policy § Retention credits", chunkId: "kb-cancel-03" },
  ],
};
