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
          ├── get_support_tickets ───────────────┤
          └── search_knowledge_base ─────────────┘
          │
          └── strict structured analysis
   │
   ▼
Validated analysis response
   │
   ├── risk evidence and retention plan
   ├── editable email draft
   └── persisted approval handoff
```

Both modes return the same `AnalysisResponse` contract and execution-trace shape. The UI only uses provider metadata for display. This keeps the public demo free and makes the OpenAI adapter replaceable.

The live agent begins with only the conversation and customer identifiers. It must retrieve evidence through tools instead of receiving a preassembled context object. Responses API output items are replayed into the next model turn together with validated `function_call_output` items. The loop ends when the model returns the strict analysis schema or when the six-turn safety limit is reached.

## Retrieval flow

```text
Customer issue
   │
   ▼
search_knowledge_base (validated query + limit)
   │
   ├── normalize terms
   ├── expand controlled synonyms
   ├── score title, section, keywords, and content
   └── return top 1–5 approved chunks
            │
            ▼
chunk id + content + exact citation
            │
            ▼
structured analysis sources + visible execution trace
```

The local retrieval index is deliberately deterministic: portfolio reviewers get the same ranking without API cost or credentials. The storage and search boundary can later move to Supabase pgvector and OpenAI embeddings without changing the agent tool contract or UI response schema.

## Persistence boundary

```text
Server-rendered routes ─┐
Analysis tools ─────────┼──► data repository ──► Supabase PostgreSQL
Agent-run writer ───────┤          │
Approvals API ──────────┘          └──► demo repository (no credentials)
```

Supabase is optional and server-only. The repository selects it when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are configured, otherwise it uses deterministic demo records. UI modules never import the Supabase SDK or credentials.

The schema separates operational customer data from AI history. `agent_runs` stores the validated result and safe execution trace as JSONB. `approvals` references an agent run when available and records each human decision independently. Usage, subscription, and support tables are queried by the same read-only tools exposed to the model.

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
- Row Level Security is enabled on every persisted table.
- The service-role key is restricted to server-side repository code.
- Knowledge retrieval can return only curated chunks included in the approved index.
- Citations identify both a human-readable document section and a stable chunk ID.

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
