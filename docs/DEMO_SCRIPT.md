# RetainAI — three-minute demo script

## 0:00–0:20 — Frame the problem

“Customer Success teams often discover churn risk too late because customer messages, usage, billing, support, and internal policy live in different systems. RetainAI is a copilot that investigates those signals and prepares the next action without executing anything autonomously.”

Show the Dashboard and point to at-risk customers, conversations, and pending approvals.

## 0:20–1:25 — Run the flagship workflow

1. Open **Inbox**.
2. Select Acme’s “Considering cancellation” message.
3. Click **Analyze message**.
4. Explain the execution trace:
   - customer profile;
   - usage metrics;
   - support tickets;
   - subscription;
   - knowledge-base retrieval.
5. Point out the risk factors, ordered retention plan, editable email draft, and policy citation.

Say: “The model receives identifiers and the message, then chooses validated read-only tools. It cannot send an email or grant a credit.”

## 1:25–1:55 — Demonstrate human approval

1. Click **Add to approvals**.
2. Open **Approvals**.
3. Edit the draft, then approve or reject it.

Say: “Every side effect becomes an approval record. Human review is an architectural boundary, not just a prompt instruction.”

## 1:55–2:25 — Show grounded retrieval

1. Open **Knowledge**.
2. Search for `cancellation billing credit`.
3. Show ranked chunks, stable IDs, and exact citations.

Say: “The free demo uses deterministic sparse retrieval. The tool contract is ready to move to pgvector and embeddings later.”

## 2:25–2:50 — Show reliability engineering

1. Open **Runs & Evals**.
2. Point to the safe trace, latency, tool count, and citations.
3. Show the 19/19 checks and prompt-injection scenario.

Say: “These checks run in CI on every push. They validate schemas, tool safety, citation coverage, and retrieval relevance without API cost.”

## 2:50–3:00 — Close

“RetainAI demonstrates the parts of agent engineering that matter in production: controlled tool use, grounded context, human approval, observability, deterministic replay, and measurable evaluation.”
