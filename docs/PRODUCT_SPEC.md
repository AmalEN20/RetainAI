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

## First milestone: UI shell

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

## Success criteria

- A reviewer understands the product and primary workflow in under two minutes.
- All four application sections work as responsive routes.
- Realistic mock data makes the churn-risk scenario demonstrable.
- The project builds without credentials or external services.
- Architecture leaves clear seams for replacing mock tools with real adapters.

## Later milestones

1. Add a controlled server-side analysis workflow with structured output.
2. Replace mock data access with Supabase repositories.
3. Expose customer data access as validated AI tools.
4. Add knowledge-base retrieval with source citations.
5. Persist agent runs and approval decisions.
6. Add one real integration only after the core workflow is reliable.
