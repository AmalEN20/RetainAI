import assert from "node:assert/strict";
import test from "node:test";

async function requestApp(pathname = "/", init = {}) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { ...init, headers: { accept: "text/html", ...init.headers } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

const render = (pathname = "/") => requestApp(pathname);

test("server-renders the RetainAI dashboard", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Dashboard · RetainAI<\/title>/i);
  assert.match(html, /Customers needing attention/);
  assert.match(html, /Copilot activity/);
  assert.match(html, /AI workflow · Demo ready/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

for (const [pathname, title, content] of [
  ["/customers", "Customers", "Monitor health, product usage"],
  ["/inbox", "Inbox", "Ready for AI analysis"],
  ["/approvals", "Approvals", "No action executes automatically"],
]) {
  test(`server-renders ${pathname}`, async () => {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, new RegExp(`<title>${title} · RetainAI<\\/title>`, "i"));
    assert.match(html, new RegExp(content));
  });
}

test("returns a validated mock customer-success analysis", async () => {
  const response = await requestApp("/api/analyze", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ conversationId: 1 }),
  });

  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.meta.mode, "mock");
  assert.equal(payload.result.intent, "cancellation_risk");
  assert.equal(payload.result.riskLevel, "high");
  assert.equal(payload.result.healthScore, 34);
  assert.equal(payload.result.sources.length, 4);
  assert.match(payload.result.emailDraft.subject, /Acme/i);
  assert.equal(payload.meta.toolCallCount, 4);
  assert.equal(payload.meta.modelTurns, 2);
  assert.equal(payload.meta.maxIterations, 6);
  assert.equal(payload.meta.trace.length, 5);
  assert.ok(payload.meta.trace.every((step) => step.readOnly === true));
  assert.ok(
    payload.meta.trace
      .filter((step) => step.tool)
      .every((step) => !/send|write|delete|update/i.test(step.tool)),
  );
});

test("rejects an unknown conversation", async () => {
  const response = await requestApp("/api/analyze", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ conversationId: 999 }),
  });

  assert.equal(response.status, 404);
});
