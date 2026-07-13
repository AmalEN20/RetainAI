import assert from "node:assert/strict";
import test from "node:test";
import { runEvalSuite } from "../lib/evals/suite";

test("passes the deterministic agent evaluation suite", () => {
  const report = runEvalSuite();
  assert.equal(report.summary.totalCases, 5);
  assert.equal(report.summary.totalChecks, 19);
  assert.equal(report.summary.passedChecks, 19);
  assert.equal(report.summary.passRate, 100);
  assert.ok(report.cases.every((evalCase) => evalCase.passed));
});

test("covers quality, retrieval, and safety categories", () => {
  const categories = new Set(runEvalSuite().cases.map((evalCase) => evalCase.category));
  assert.deepEqual([...categories].sort(), ["Quality", "Retrieval", "Safety"]);
});
