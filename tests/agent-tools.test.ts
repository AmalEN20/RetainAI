import assert from "node:assert/strict";
import test from "node:test";
import {
  executeReadOnlyTool,
  isAgentToolName,
  readOnlyAgentTools,
} from "../lib/analysis/agent-tools";
import { MAX_AGENT_ITERATIONS } from "../lib/analysis/openai";

test("exposes only the five approved read-only tools", () => {
  assert.equal(readOnlyAgentTools.length, 5);

  const names = readOnlyAgentTools.map((tool) => tool.name);
  assert.deepEqual(names.sort(), [
    "get_customer_profile",
    "get_subscription",
    "get_support_tickets",
    "get_usage_metrics",
    "search_knowledge_base",
  ]);
  assert.ok(readOnlyAgentTools.every((tool) => tool.type === "function" && tool.strict === true));
  assert.ok(names.every((name) => !/send|write|delete|update/i.test(name)));
});

test("recognizes registered tools and rejects side-effecting names", async () => {
  assert.equal(isAgentToolName("get_customer_profile"), true);
  assert.equal(isAgentToolName("send_email"), false);
  await assert.rejects(
    executeReadOnlyTool("send_email", { customerId: "cus_acme_001" }),
    /not registered as read-only/,
  );
});

test("validates tool arguments before execution", async () => {
  const profile = await executeReadOnlyTool("get_customer_profile", {
    customerId: "cus_acme_001",
  });

  assert.ok(profile && typeof profile === "object" && "company" in profile);
  assert.equal((profile as { company: string }).company, "Acme Inc.");
  await assert.rejects(
    executeReadOnlyTool("get_customer_profile", { customerId: "cus_unknown" }),
    /Invalid input/,
  );
});

test("retrieves citation-ready policy chunks", async () => {
  const output = await executeReadOnlyTool("search_knowledge_base", {
    query: "cancellation billing credit",
    limit: 3,
  });

  assert.ok(Array.isArray(output));
  assert.equal(output.length, 3);
  assert.equal(output[0].documentId, "cancellation-policy");
  assert.match(output[0].citation, /Cancellation & Billing Policy/);
});

test("caps the agent loop", () => {
  assert.equal(MAX_AGENT_ITERATIONS, 6);
});
