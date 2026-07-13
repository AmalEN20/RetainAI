import assert from "node:assert/strict";
import test from "node:test";
import {
  executeReadOnlyTool,
  isAgentToolName,
  readOnlyAgentTools,
} from "../lib/analysis/agent-tools";
import { MAX_AGENT_ITERATIONS } from "../lib/analysis/openai";

test("exposes only the four approved read-only tools", () => {
  assert.equal(readOnlyAgentTools.length, 4);

  const names = readOnlyAgentTools.map((tool) => tool.name);
  assert.deepEqual(names.sort(), [
    "get_customer_profile",
    "get_subscription",
    "get_support_tickets",
    "get_usage_metrics",
  ]);
  assert.ok(readOnlyAgentTools.every((tool) => tool.type === "function" && tool.strict === true));
  assert.ok(names.every((name) => !/send|write|delete|update/i.test(name)));
});

test("recognizes registered tools and rejects side-effecting names", () => {
  assert.equal(isAgentToolName("get_customer_profile"), true);
  assert.equal(isAgentToolName("send_email"), false);
  assert.throws(
    () => executeReadOnlyTool("send_email", { customerId: "cus_acme_001" }),
    /not registered as read-only/,
  );
});

test("validates tool arguments before execution", () => {
  const profile = executeReadOnlyTool("get_customer_profile", {
    customerId: "cus_acme_001",
  });

  assert.ok("company" in profile);
  assert.equal(profile.company, "Acme Inc.");
  assert.throws(
    () => executeReadOnlyTool("get_customer_profile", { customerId: "cus_unknown" }),
    /Invalid input/,
  );
});

test("caps the agent loop", () => {
  assert.equal(MAX_AGENT_ITERATIONS, 6);
});
