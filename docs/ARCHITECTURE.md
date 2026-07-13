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

## Milestone-two request flow

```text
Inbox client
   │ POST /api/analyze
   ▼
Validated request (Zod)
   │
   ├── get_customer_profile
   ├── get_usage_metrics
   ├── get_subscription
   └── get_support_tickets
   │
   ├── AI_MODE=mock   ──► verified deterministic result
   └── AI_MODE=openai ──► Responses API + strict Zod format
                              │ failure / missing key
                              └──► verified safe fallback
   │
   ▼
Validated analysis response
   │
   ├── risk evidence and retention plan
   ├── editable email draft
   └── session-local approval handoff
```

Both modes return the same `AnalysisResponse` contract. The UI does not know which provider produced the result beyond display metadata. This keeps the public demo free and makes the OpenAI adapter replaceable.

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
- Read-only analysis tools are separate from side-effecting tools.
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
