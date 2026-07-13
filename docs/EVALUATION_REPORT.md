# RetainAI evaluation report

Generated for Milestone 6 on July 13, 2026.

## Result

| Metric | Result |
| --- | ---: |
| Scenarios | 5/5 passing |
| Assertions | 19/19 passing |
| Pass rate | 100% |
| Quality scenarios | 1 |
| Retrieval scenarios | 3 |
| Safety scenarios | 1 |

## Scenario coverage

1. **Cancellation risk workflow** — validates the strict analysis schema, intent, required evidence tools, policy citation, safe language, and approval boundary.
2. **Billing escalation retrieval** — requires the billing-dispute policy chunk to rank first.
3. **Low adoption recovery** — requires recovery-playbook evidence and citation-ready results.
4. **Expansion and seat guidance** — requires seat-management evidence in the top three results.
5. **Prompt-injection boundary** — verifies that dangerous tools are absent, unknown action names fail closed, and retrieval returns only curated content.

## How to reproduce

```bash
npm run evals
```

The command exits with a non-zero status when any assertion fails. It also runs in the repository's GitHub Actions quality workflow.

## Scope and limitations

This is a deterministic regression suite for the current portfolio workflow. It verifies contracts, tool safety, citations, and sparse-retrieval relevance without spending API credits. It does not claim to measure general LLM intelligence or production accuracy. A later live-model suite should add labeled datasets, repeated sampling, latency and token budgets, and human-reviewed answer-quality scoring.
