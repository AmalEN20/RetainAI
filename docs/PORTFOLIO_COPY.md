# RetainAI — portfolio copy

## Resume project entry

**RetainAI — AI Customer Success Copilot**  
Next.js, TypeScript, OpenAI Responses API, Zod, RAG, Supabase, GitHub Actions

- Built a controlled tool-calling agent that investigates churn risk across customer profile, product usage, subscription, support, and policy data.
- Designed a human-in-the-loop approval boundary that prevents customer-facing actions from executing without review.
- Implemented citation-ready RAG, deterministic replay, agent-run observability, and a 19-check evaluation suite covering retrieval quality and prompt-injection safety.

## One-line portfolio description

A production-minded Customer Success Copilot that turns fragmented churn signals into grounded, approval-safe retention actions.

## LinkedIn project description

RetainAI is an AI Customer Success Copilot for B2B SaaS teams. It uses a validated Responses API agent, five read-only business tools, grounded knowledge retrieval, structured outputs, and a human approval queue to investigate churn risk and prepare retention plans. The public replay demo runs without paid services, while the same architecture supports live OpenAI and Supabase adapters. Reliability is measured through observable agent runs and 19 deterministic CI checks covering schemas, citations, retrieval relevance, safe language, and prompt injection.

## Interview talking points

- Why a controlled agent loop was chosen over unconstrained autonomy.
- How tool names and arguments fail closed through Zod validation.
- Why side-effecting actions are modeled as approval records.
- How replay mode keeps the public demo deterministic and inexpensive.
- How RAG citations and stable chunk IDs improve auditability.
- What the deterministic eval suite measures—and what it does not claim to measure.
