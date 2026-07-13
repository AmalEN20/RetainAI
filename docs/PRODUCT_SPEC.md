# RetainAI — Product specification

## Product summary

RetainAI is an AI Customer Success Copilot for B2B SaaS teams. It helps a customer success manager detect churn risk, understand the evidence behind that risk, prepare a retention plan, and review customer-facing actions before execution.

The portfolio version demonstrates a production-minded workflow without requiring paid integrations or an always-on AI backend.

## Problem

Customer success managers must assemble customer context from conversations, product usage, support tickets, subscriptions, and renewal dates. Important risk signals are often noticed late, while repetitive investigation and follow-up work limits the number of accounts one manager can handle.

## Target user

- Primary: Customer Success Manager at a B2B SaaS company.
- Secondary: Head of Customer Success reviewing risk across the portfolio.

## Value proposition

RetainAI turns fragmented customer signals into a clear next action. It does not send messages or modify business systems without human approval.

## Core demo scenario

1. A customer writes that they are considering cancellation.
2. The manager opens the conversation in Inbox.
3. RetainAI analyzes the customer profile, subscription, usage, and support history.
4. The system returns a risk assessment, evidence, recommended actions, and an email draft.
5. The proposed email and follow-up task enter the Approvals queue.
6. A human approves, edits, or rejects each action.

## Milestone one: UI shell

This milestone is intentionally front-end only and uses typed mock data.

- Responsive SaaS application shell and sidebar.
- Dashboard with portfolio metrics, at-risk customers, and copilot activity.
- Customers table with health, risk, usage, and renewal signals.
- Inbox with realistic conversations and an AI analysis entry point.
- Approvals queue that communicates the human-in-the-loop safety model.

## Out of scope for milestone one

- OpenAI or any LLM call.
- Supabase, authentication, or persistent storage.
- Gmail, HubSpot, Slack, Stripe, or calendar integrations.
- Real email delivery or task creation.
- Background agents and scheduled jobs.

## Milestone two: controlled analysis workflow

- A working Analyze action in the cancellation-risk conversation.
- Server-side customer context tools for profile, usage, subscription, and support data.
- A shared Zod contract for mock and OpenAI analysis results.
- An agent execution timeline that exposes safe summaries, not hidden reasoning.
- Risk evidence, retention actions, editable email draft, and source labels.
- Session-local handoff into Approvals with approve, edit, reject, and undo controls.
- Deterministic mock mode by default, with OpenAI mode and automatic safe fallback.

## Milestone three: validated tool-calling agent

- The OpenAI Responses API receives the conversation and customer identifiers, not a preassembled customer dossier.
- The model selects from four allowlisted read-only tools: customer profile, usage, subscription, and support tickets.
- Each tool call is validated with Zod before execution; unknown tools and customer IDs fail closed.
- Tool results are returned to the model until it produces the strict analysis schema.
- The loop is capped at six model turns to prevent runaway cost or execution.
- The UI exposes an auditable execution trace without storing private chain-of-thought.
- Replay mode mirrors the live trace so the public portfolio demo remains free and deterministic.

## Milestone four: persistent customer-success workspace

- A repository boundary supplies Dashboard, Customers, Inbox, agent tools, and Approvals.
- Supabase stores customers, conversations, usage, subscriptions, support tickets, agent runs, and approval decisions.
- Every completed analysis writes its structured result and safe execution trace to an audit-friendly agent run.
- Creating, editing, approving, rejecting, and undoing approval decisions uses validated server endpoints.
- Row Level Security is enabled and the service-role credential never reaches client code.
- A zero-credential demo repository keeps the public portfolio experience usable at no cost.

## Milestone five: grounded RAG knowledge base

- Four curated company documents are divided into ten citation-ready chunks.
- A deterministic retrieval engine normalizes the query, expands a controlled synonym set, scores approved chunks, and returns the top matches.
- The agent receives a fifth validated read-only tool, `search_knowledge_base`.
- Policy retrieval is required before the agent recommends cancellation, billing, credits, onboarding, or retention actions.
- Structured sources can include an exact citation and chunk ID; private chain-of-thought remains excluded.
- A dedicated Knowledge Base route lets reviewers run the same retrieval used by the agent and inspect ranked evidence.
- The local index remains free and portable until the knowledge storage is moved to Supabase pgvector.

## Milestone six: agent observability and evals

- Every demo and persisted analysis can be represented as an Agent Run with safe trace summaries, latency, tool count, model turns, citations, mode, and safety state.
- The Runs & Evals route shows recent executions alongside the current evaluation health.
- Five deterministic scenarios cover cancellation quality, billing retrieval, adoption recovery, expansion guidance, and prompt-injection safety.
- Nineteen assertions verify structured output, tool selection, citation coverage, retrieval relevance, safe language, and the side-effect boundary.
- A CLI evaluation runner exits non-zero on regression and publishes clear evidence for each assertion.
- GitHub Actions runs type checking, linting, the production build, tests, and the evaluation suite on pushes and pull requests.

## Milestone seven: portfolio launch

- A recruiter-first case study explains the problem, outcome, flagship workflow, architecture, safety model, and evaluation evidence.
- Direct calls to action route reviewers into the cancellation demo, Runs & Evals, and source code.
- The README includes a concise product narrative, architecture diagram, route map, and links to the evaluation report.
- A three-minute demo script keeps the walkthrough focused on engineering decisions rather than UI navigation.
- Resume, portfolio, LinkedIn, and interview copy is packaged with the repository.
- The public deployment runs in zero-cost replay mode with no credentials or paid services required.

## Success criteria

- A reviewer understands the product and primary workflow in under two minutes.
- All four application sections work as responsive routes.
- Realistic mock data makes the churn-risk scenario demonstrable.
- The project builds without credentials or external services.
- Architecture leaves clear seams for replacing mock tools with real adapters.

## Later milestones

1. Add live-model evals with token, cost, and latency budgets.
2. Move knowledge chunks to Supabase pgvector and add optional embedding retrieval.
3. Add an approval audit timeline and filtering.
4. Add one real integration only after the core workflow is reliable.
