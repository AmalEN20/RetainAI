# RetainAI

**AI Customer Success Copilot for B2B SaaS teams.**

RetainAI is a portfolio-grade SaaS product that helps customer success teams identify churn risk, understand the evidence, and prepare the next best action. Customer-facing actions remain behind an explicit human approval step.

This repository contains a polished SaaS shell and an end-to-end customer-risk workflow powered by a validated tool-calling agent. It runs in a deterministic replay mode by default, so the public portfolio demo requires no API key, database, or paid service. A live OpenAI mode can be enabled locally.

## What is included

- Dashboard with portfolio metrics, prioritized risk, and copilot activity.
- Customers workspace with health scores, usage trends, and renewal signals.
- Inbox centered on the core cancellation-risk demo scenario.
- Approvals queue showing a human-in-the-loop safety model.
- Interactive `Analyze → Retention plan → Approval` workflow.
- A Responses API agent that selects from four validated, read-only business tools.
- Animated, auditable tool-execution timeline with model-turn and safety-limit metadata.
- A six-iteration agent-loop limit and an allowlisted tool registry.
- Schema-validated analysis results and safe mock fallback.
- Editable email drafts and working approve/reject decisions.
- Responsive sidebar and mobile navigation.
- Reusable shadcn/ui-style primitives built on Radix UI and Tailwind CSS.
- Product and architecture documentation.

## Screens and routes

| Route | Purpose |
| --- | --- |
| `/` | Portfolio overview and urgent customer signals |
| `/customers` | Customer health and renewal-risk table |
| `/inbox` | Customer conversations and AI-analysis entry point |
| `/approvals` | Review proposed actions before execution |

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui conventions with Radix UI primitives
- Lucide icons
- OpenAI JavaScript SDK and Responses API
- Zod for runtime request and model-output validation
- Vinext/Vite development and build runtime

Supabase and external business integrations are intentionally deferred until the core workflow is stable.

## Run locally

Requirements: Node.js 22.13 or newer and npm.

```bash
git clone <your-repository-url>
cd RetainAI
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The default `AI_MODE=mock` is free and deterministic. To enable live analysis:

```bash
AI_MODE=openai
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-5.5
```

If the live model is unavailable or no key is configured, the server returns the verified mock analysis and labels it as a safe fallback. API keys are used only on the server and must never be committed.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Documentation

- [Product specification](docs/PRODUCT_SPEC.md)
- [Architecture](docs/ARCHITECTURE.md)

## Project structure

```text
app/
  api/analyze/        Validated analysis endpoint
  approvals/          Approvals route
  customers/          Customers route
  inbox/              Inbox route
  globals.css         Tailwind theme and global styles
  layout.tsx          Root metadata and application shell
  page.tsx            Dashboard route
components/
  approvals/          Interactive human-review queue
  inbox/              Analysis execution and result UI
  ui/                 Reusable UI primitives
  app-shell.tsx       Sidebar, header, and mobile navigation
docs/
  ARCHITECTURE.md
  PRODUCT_SPEC.md
lib/
  analysis/           Schemas, validated tool registry, replay result, agent loop
  mock-data.ts        Typed portfolio demo data
  utils.ts            Shared class-name helper
```

## Core portfolio story

The flagship demo begins with a customer email: “We are thinking about canceling.” The live agent receives only the message and identifiers, selects the customer evidence it needs through read-only tools, generates a risk assessment and retention plan, drafts a response, then places every proposed side effect in the approvals queue.

The workflow is functional end to end. Every tool name and argument is validated before execution, model output must satisfy a strict Zod contract, and the loop stops after six turns. Replay and OpenAI modes share the same response contract and execution-trace UI.

## Roadmap

1. Supabase repositories and seed data.
2. Knowledge-base retrieval with source citations.
3. Persistent agent runs and approval audit log.
4. One carefully selected real-world integration.

## Portfolio deployment strategy

The project is designed to stay inexpensive. A public demo can render mock data and saved agent runs, while real AI calls are enabled only for local demos or rate-limited sessions.

## License

Created as a personal portfolio project.
