# Architecture

## Milestone-one architecture

```text
Next.js App Router
│
├── Shared AppShell
│   ├── responsive sidebar
│   ├── global header
│   └── route navigation
│
├── Dashboard route
├── Customers route
├── Inbox route
├── Approvals route
│
├── shadcn-style UI primitives
│   ├── Button
│   ├── Card
│   ├── Badge
│   └── Avatar
│
└── Typed mock-data module
```

All pages are server-rendered by default. Only the application shell is a client component because it manages mobile navigation and reads the current route.

## Current request flow

```text
Inbox client
   │ POST /api/analyze
   ▼
Validated request (Zod)
   │
   ├── AI_MODE=mock ─────► deterministic result + replay trace
   │
   └── AI_MODE=openai
          │
          ▼
      Responses API agent ◄──────────────────────┐
          │                                      │
          │ function calls                       │ function outputs
          ▼                                      │
      allowlisted registry                       │
          │ name + Zod argument validation       │
          ├── get_customer_profile ──────────────┤
          ├── get_usage_metrics ─────────────────┤
          ├── get_subscription ──────────────────┤
          └── get_support_tickets ───────────────┘
          │
          └── strict structured analysis
   │
   ▼
Validated analysis response
   │
   ├── risk evidence and retention plan
   ├── editable email draft
   └── session-local approval handoff
```

Both modes return the same `AnalysisResponse` contract and execution-trace shape. The UI only uses provider metadata for display. This keeps the public demo free and makes the OpenAI adapter replaceable.

The live agent begins with only the conversation and customer identifiers. It must retrieve evidence through tools instead of receiving a preassembled context object. Responses API output items are replayed into the next model turn together with validated `function_call_output` items. The loop ends when the model returns the strict analysis schema or when the six-turn safety limit is reached.

## Planned application boundaries

```text
UI routes
   │
Application services
   ├── AnalyzeConversation
   ├── ProposeRetentionPlan
   └── ReviewApproval
   │
Domain models
   ├── Customer
   ├── Conversation
   ├── AgentRun
   └── Approval
   │
Ports / interfaces
   ├── CustomerRepository
   ├── KnowledgeSearch
   ├── LLMProvider
   └── ActionExecutor
   │
Adapters
   ├── Supabase
   ├── OpenAI
   └── External integrations
```

The UI must not import vendor SDKs directly. Future external services will sit behind application-facing interfaces so mock adapters remain available for tests and portfolio demos.

## Safety model

- Structured, validated model outputs rather than free-form action execution.
- Only allowlisted read-only analysis tools are exposed to the model.
- Tool names and arguments are validated before application code executes them.
- The agent loop stops after six model turns.
- Side-effecting actions create approval records instead of executing immediately.
- Approval execution is idempotent and audit logged.
- User-facing evidence summaries are stored; private chain-of-thought is not.

## Suggested future folder structure

```text
app/
  api/
  approvals/
  customers/
  inbox/
components/
  ui/
features/
  analysis/
  approvals/
  customers/
lib/
  ai/
  repositories/
  tools/
  validation/
docs/
tests/
```
