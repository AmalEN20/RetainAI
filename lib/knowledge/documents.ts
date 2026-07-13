export type KnowledgeChunk = {
  id: string;
  documentId: string;
  title: string;
  section: string;
  content: string;
  keywords: string[];
  citation: string;
};

export type KnowledgeDocument = {
  id: string;
  title: string;
  category: "Policy" | "Playbook" | "Guide" | "Product";
  description: string;
  updatedAt: string;
  owner: string;
  chunks: number;
};

export const knowledgeDocuments: KnowledgeDocument[] = [
  { id: "cancellation-policy", title: "Cancellation & Billing Policy", category: "Policy", description: "Notice periods, billing disputes, refunds, and account-credit guardrails.", updatedAt: "Jul 8, 2026", owner: "Finance & Legal", chunks: 3 },
  { id: "retention-playbook", title: "At-Risk Customer Playbook", category: "Playbook", description: "Evidence-based recovery sequence for churn-risk accounts.", updatedAt: "Jul 10, 2026", owner: "Customer Success", chunks: 3 },
  { id: "onboarding-guide", title: "Team Adoption Guide", category: "Guide", description: "A practical onboarding and adoption recovery program for SaaS teams.", updatedAt: "Jul 6, 2026", owner: "Enablement", chunks: 2 },
  { id: "plans-and-seats", title: "Plans & Seat Management", category: "Product", description: "Plan capabilities, seat reviews, and usage-report guidance.", updatedAt: "Jul 1, 2026", owner: "Product", chunks: 2 },
];

export const knowledgeChunks: KnowledgeChunk[] = [
  { id: "kb-cancel-01", documentId: "cancellation-policy", title: "Cancellation & Billing Policy", section: "Cancellation requests", content: "Cancellation requests must be confirmed by an authorized account contact. Customer Success may discuss recovery options, but must not delay, reject, or execute cancellation without explicit human review.", keywords: ["cancel", "cancellation", "renewal", "authorized", "human review"], citation: "Cancellation & Billing Policy § Cancellation requests" },
  { id: "kb-cancel-02", documentId: "cancellation-policy", title: "Cancellation & Billing Policy", section: "Billing disputes", content: "Open billing disputes should be escalated to Finance on the same business day. The customer must receive a named owner and a target response time within 24 hours.", keywords: ["billing", "invoice", "duplicate", "dispute", "finance", "24 hours", "escalation"], citation: "Cancellation & Billing Policy § Billing disputes" },
  { id: "kb-cancel-03", documentId: "cancellation-policy", title: "Cancellation & Billing Policy", section: "Retention credits", content: "A Customer Success Manager may propose an account credit only up to the approved limit returned by the subscription system. Credits require human approval and should be offered after the underlying service or billing issue has an assigned resolution path.", keywords: ["credit", "discount", "retention", "approved limit", "human approval", "billing"], citation: "Cancellation & Billing Policy § Retention credits" },
  { id: "kb-retain-01", documentId: "retention-playbook", title: "At-Risk Customer Playbook", section: "First response", content: "Acknowledge the customer's stated concern without arguing. Summarize the concrete blockers, name the immediate owner, and provide the next update time. Do not promise an outcome that has not been confirmed.", keywords: ["churn", "risk", "first response", "empathy", "owner", "promise"], citation: "At-Risk Customer Playbook § First response" },
  { id: "kb-retain-02", documentId: "retention-playbook", title: "At-Risk Customer Playbook", section: "Recovery call", content: "Offer a 30-minute recovery call when usage has materially declined. Review the customer's original success goals, identify one high-value workflow, and agree on a two-week adoption checkpoint with measurable owners.", keywords: ["recovery call", "usage decline", "adoption", "30 minute", "success goals", "checkpoint"], citation: "At-Risk Customer Playbook § Recovery call" },
  { id: "kb-retain-03", documentId: "retention-playbook", title: "At-Risk Customer Playbook", section: "Escalation sequence", content: "Resolve trust-breaking operational issues before presenting commercial incentives. Sequence the plan as: acknowledge, assign the blocker, schedule the recovery session, then request approval for any credit or plan adjustment.", keywords: ["escalation", "retention plan", "credit", "incentive", "trust", "sequence"], citation: "At-Risk Customer Playbook § Escalation sequence" },
  { id: "kb-onboard-01", documentId: "onboarding-guide", title: "Team Adoption Guide", section: "Adoption reset", content: "For teams below 50% active-seat adoption, run an adoption reset: confirm an executive sponsor, choose an admin champion, select one repeatable workflow, and schedule enablement for the users responsible for that workflow.", keywords: ["onboarding", "adoption", "active seats", "champion", "enablement", "workflow"], citation: "Team Adoption Guide § Adoption reset" },
  { id: "kb-onboard-02", documentId: "onboarding-guide", title: "Team Adoption Guide", section: "Success measures", content: "Track adoption recovery with weekly active users, activated seats, completion of the selected workflow, and a two-week customer checkpoint. Avoid reporting logins alone as proof of value.", keywords: ["metrics", "weekly active users", "seats", "checkpoint", "value", "success"], citation: "Team Adoption Guide § Success measures" },
  { id: "kb-plan-01", documentId: "plans-and-seats", title: "Plans & Seat Management", section: "Seat review", content: "Pro accounts can receive a seat-utilization review from Customer Success. The review should compare licensed seats with active users and identify teams that need role-specific enablement.", keywords: ["pro plan", "seats", "licensed", "active users", "utilization"], citation: "Plans & Seat Management § Seat review" },
  { id: "kb-plan-02", documentId: "plans-and-seats", title: "Plans & Seat Management", section: "Usage exports", content: "Usage reports include active users, activation dates, and workflow events. Customer Success may share the report with an authorized account contact after confirming the reporting period.", keywords: ["usage report", "export", "active users", "reporting", "authorized"], citation: "Plans & Seat Management § Usage exports" },
];
