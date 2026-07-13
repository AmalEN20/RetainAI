import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the RetainAI dashboard", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Dashboard · RetainAI<\/title>/i);
  assert.match(html, /Customers needing attention/);
  assert.match(html, /Copilot activity/);
  assert.match(html, /UI demo · Mock data/);
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
