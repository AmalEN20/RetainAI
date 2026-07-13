import { runEvalSuite } from "../lib/evals/suite";

const report = runEvalSuite();

console.log("\nRetainAI deterministic evaluation suite\n");
for (const evalCase of report.cases) {
  console.log(`${evalCase.passed ? "PASS" : "FAIL"}  ${evalCase.name}`);
  for (const check of evalCase.checks) {
    console.log(`  ${check.passed ? "✓" : "✗"} ${check.label} — ${check.evidence}`);
  }
}

console.log(`\n${report.summary.passedChecks}/${report.summary.totalChecks} checks passed (${report.summary.passRate}%)\n`);
if (report.summary.passedChecks !== report.summary.totalChecks) process.exitCode = 1;
