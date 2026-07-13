# RetainAI

**AI Customer Success Copilot for B2B SaaS teams.**

RetainAI is a portfolio-grade SaaS product that helps customer success teams identify churn risk, understand the evidence, and prepare the next best action. Customer-facing actions remain behind an explicit human approval step.

This repository currently contains milestone one: a polished, responsive UI shell running entirely on typed mock data. It requires no API keys, database, or paid services.

## What is included

- Dashboard with portfolio metrics, prioritized risk, and copilot activity.
- Customers workspace with health scores, usage trends, and renewal signals.
- Inbox centered on the core cancellation-risk demo scenario.
- Approvals queue showing a human-in-the-loop safety model.
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
- Vinext/Vite development and build runtime

No Supabase or OpenAI SDK is included in this milestone by design.

## Run locally

Requirements: Node.js 22.13 or newer and npm.

```bash
git clone <your-repository-url>
cd RetainAI
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run lint
npm run build
```

## Documentation

- [Product specification](docs/PRODUCT_SPEC.md)
- [Architecture](docs/ARCHITECTURE.md)

## Project structure

```text
app/
  approvals/          Approvals route
  customers/          Customers route
  inbox/              Inbox route
  globals.css         Tailwind theme and global styles
  layout.tsx          Root metadata and application shell
  page.tsx            Dashboard route
components/
  ui/                 Reusable UI primitives
  app-shell.tsx       Sidebar, header, and mobile navigation
docs/
  ARCHITECTURE.md
  PRODUCT_SPEC.md
lib/
  mock-data.ts        Typed portfolio demo data
  utils.ts            Shared class-name helper
```

## Core portfolio story

The flagship demo begins with a customer email: “We are thinking about canceling.” RetainAI will eventually gather product usage, subscription, and support context; generate a risk assessment and retention plan; draft a response; then place every side-effecting action in the approvals queue.

The UI shell already presents that workflow. The next milestone will add a controlled server-side analysis service with structured outputs—only after the user experience is stable.

## Roadmap

1. Controlled AI analysis workflow with schema-validated output.
2. Supabase repositories and seed data.
3. Tool calling for customer, usage, subscription, and support context.
4. Knowledge-base retrieval with source citations.
5. Persistent agent runs and approval audit log.
6. One carefully selected real-world integration.

## Portfolio deployment strategy

The project is designed to stay inexpensive. A public demo can render mock data and saved agent runs, while real AI calls are enabled only for local demos or rate-limited sessions.

## License

Created as a personal portfolio project.
