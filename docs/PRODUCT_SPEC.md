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

## Success criteria

- A reviewer understands the product and primary workflow in under two minutes.
- All four application sections work as responsive routes.
- Realistic mock data makes the churn-risk scenario demonstrable.
- The project builds without credentials or external services.
- Architecture leaves clear seams for replacing mock tools with real adapters.

## Later milestones

1. Replace mock data access with Supabase repositories.
2. Add knowledge-base retrieval with source citations.
3. Persist agent runs and approval decisions.
4. Add one real integration only after the core workflow is reliable.
