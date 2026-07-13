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
