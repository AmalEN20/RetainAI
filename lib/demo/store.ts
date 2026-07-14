import { getDemoDatabase } from "@/lib/platform-env";
import type { ConversationRecord, CustomerRecord } from "@/lib/data/types";
import type { ApprovalRecord, ApprovalStatus } from "@/lib/data/types";
import { generateDemoPortfolio } from "./seed";
import type { DemoDocumentationPack, DemoSnapshot, DemoWorkspace } from "./types";

type WorkspaceRow = {
  id: string;
  company_name: string;
  company_description: string;
  product_name: string;
  documentation_pack: DemoDocumentationPack;
  guide_step: number;
  completed_at: string | null;
};

const memory = globalThis as typeof globalThis & { __retainDemoSnapshots?: Map<string, DemoSnapshot>; __retainDemoApprovals?: Map<string, ApprovalRecord[]> };
memory.__retainDemoSnapshots ??= new Map();
memory.__retainDemoApprovals ??= new Map();
let schemaReady: Promise<void> | null = null;

async function ensureDatabaseSchema() {
  const db = getDemoDatabase();
  if (!db) return;
  schemaReady ??= (async () => {
    const statements = [
      "CREATE TABLE IF NOT EXISTS demo_workspaces (id TEXT PRIMARY KEY, company_name TEXT NOT NULL DEFAULT '', company_description TEXT NOT NULL DEFAULT '', product_name TEXT NOT NULL DEFAULT '', documentation_pack TEXT NOT NULL DEFAULT '', guide_step INTEGER NOT NULL DEFAULT 0, completed_at TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL)",
      "CREATE TABLE IF NOT EXISTS demo_customers (id TEXT PRIMARY KEY, workspace_id TEXT NOT NULL, name TEXT NOT NULL, contact_name TEXT NOT NULL, contact_email TEXT NOT NULL, initials TEXT NOT NULL, plan TEXT NOT NULL, health_score INTEGER NOT NULL, risk_level TEXT NOT NULL, renewal_days INTEGER NOT NULL, last_activity_label TEXT NOT NULL, usage_change_percent INTEGER NOT NULL, created_at TEXT NOT NULL, FOREIGN KEY (workspace_id) REFERENCES demo_workspaces(id) ON DELETE CASCADE)",
      "CREATE INDEX IF NOT EXISTS idx_demo_customers_workspace ON demo_customers(workspace_id)",
      "CREATE TABLE IF NOT EXISTS demo_conversations (id INTEGER PRIMARY KEY AUTOINCREMENT, workspace_id TEXT NOT NULL, customer_id TEXT NOT NULL, subject TEXT NOT NULL, preview TEXT NOT NULL, body TEXT NOT NULL, display_time TEXT NOT NULL, unread INTEGER NOT NULL DEFAULT 1, intent TEXT NOT NULL, created_at TEXT NOT NULL, FOREIGN KEY (workspace_id) REFERENCES demo_workspaces(id) ON DELETE CASCADE, FOREIGN KEY (customer_id) REFERENCES demo_customers(id) ON DELETE CASCADE)",
      "CREATE INDEX IF NOT EXISTS idx_demo_conversations_workspace ON demo_conversations(workspace_id)",
      "CREATE TABLE IF NOT EXISTS demo_approvals (id TEXT PRIMARY KEY, workspace_id TEXT NOT NULL, customer_id TEXT NOT NULL, customer_name TEXT NOT NULL, customer_initials TEXT NOT NULL, action TEXT NOT NULL, description TEXT NOT NULL, risk_level TEXT NOT NULL, owner_name TEXT NOT NULL, subject TEXT, body TEXT, agent_run_id TEXT, status TEXT NOT NULL DEFAULT 'pending', created_at TEXT NOT NULL, updated_at TEXT NOT NULL, FOREIGN KEY (workspace_id) REFERENCES demo_workspaces(id) ON DELETE CASCADE)",
      "CREATE INDEX IF NOT EXISTS idx_demo_approvals_workspace ON demo_approvals(workspace_id)",
    ];
    for (const sql of statements) await db.prepare(sql).run();
  })().catch((error) => { schemaReady = null; throw error; });
  await schemaReady;
}

function emptyWorkspace(id: string): DemoWorkspace {
  return { id, companyName: "", companyDescription: "", productName: "", documentationPack: "", guideStep: 0, completedAt: null, customerCount: 0, conversationCount: 0 };
}

function rowToWorkspace(row: WorkspaceRow, customerCount: number, conversationCount: number): DemoWorkspace {
  return { id: row.id, companyName: row.company_name, companyDescription: row.company_description, productName: row.product_name, documentationPack: row.documentation_pack, guideStep: row.guide_step, completedAt: row.completed_at, customerCount, conversationCount };
}

export async function ensureDemoWorkspace(id: string): Promise<DemoSnapshot> {
  const db = getDemoDatabase();
  if (!db) {
    const current = memory.__retainDemoSnapshots!.get(id);
    if (current) return current;
    const snapshot = { workspace: emptyWorkspace(id), customers: [], conversations: [], storage: "memory" as const };
    memory.__retainDemoSnapshots!.set(id, snapshot);
    return snapshot;
  }

  await ensureDatabaseSchema();
  const now = new Date().toISOString();
  await db.prepare("INSERT OR IGNORE INTO demo_workspaces (id, created_at, updated_at) VALUES (?, ?, ?)").bind(id, now, now).run();
  return getDemoSnapshot(id);
}

export async function getDemoSnapshot(id: string): Promise<DemoSnapshot> {
  const db = getDemoDatabase();
  if (!db) return memory.__retainDemoSnapshots!.get(id) ?? ensureDemoWorkspace(id);

  await ensureDatabaseSchema();
  const row = await db.prepare("SELECT * FROM demo_workspaces WHERE id = ?").bind(id).first<WorkspaceRow>();
  if (!row) return ensureDemoWorkspace(id);
  const customerRows = (await db.prepare("SELECT * FROM demo_customers WHERE workspace_id = ? ORDER BY health_score ASC").bind(id).all<Record<string, unknown>>()).results ?? [];
  const conversationRows = (await db.prepare("SELECT c.*, d.name, d.contact_name, d.initials, d.risk_level FROM demo_conversations c JOIN demo_customers d ON d.id = c.customer_id WHERE c.workspace_id = ? ORDER BY c.id ASC").bind(id).all<Record<string, unknown>>()).results ?? [];
  const customers = customerRows.map((item) => ({ id: String(item.id), name: String(item.name), contact: String(item.contact_name), email: String(item.contact_email), initials: String(item.initials), plan: String(item.plan), health: Number(item.health_score), risk: String(item.risk_level) as CustomerRecord["risk"], renewal: `${Number(item.renewal_days)} days`, renewalDays: Number(item.renewal_days), activity: String(item.last_activity_label), change: Number(item.usage_change_percent) }));
  const conversations = conversationRows.map((item) => ({ id: Number(item.id), customerId: String(item.customer_id), customer: String(item.name), initials: String(item.initials), contact: String(item.contact_name), subject: String(item.subject), preview: String(item.preview), body: String(item.body), time: String(item.display_time), unread: Boolean(item.unread), risk: String(item.risk_level) as ConversationRecord["risk"], intent: String(item.intent) }));
  return { workspace: rowToWorkspace(row, customers.length, conversations.length), customers, conversations, storage: "d1" };
}

export async function updateDemoWorkspace(id: string, patch: Partial<Pick<DemoWorkspace, "companyName" | "companyDescription" | "productName" | "documentationPack" | "guideStep" | "completedAt">>) {
  const snapshot = await ensureDemoWorkspace(id);
  const workspace = { ...snapshot.workspace, ...patch };
  const db = getDemoDatabase();
  if (!db) {
    memory.__retainDemoSnapshots!.set(id, { ...snapshot, workspace });
    return { ...snapshot, workspace };
  }
  await db.prepare("UPDATE demo_workspaces SET company_name = ?, company_description = ?, product_name = ?, documentation_pack = ?, guide_step = ?, completed_at = ?, updated_at = ? WHERE id = ?")
    .bind(workspace.companyName, workspace.companyDescription, workspace.productName, workspace.documentationPack, workspace.guideStep, workspace.completedAt, new Date().toISOString(), id).run();
  return getDemoSnapshot(id);
}

export async function createGeneratedPortfolio(id: string) {
  await ensureDemoWorkspace(id);
  const portfolio = generateDemoPortfolio(id);
  const db = getDemoDatabase();
  if (!db) {
    const current = await getDemoSnapshot(id);
    const next = { ...current, workspace: { ...current.workspace, guideStep: Math.max(4, current.workspace.guideStep), customerCount: portfolio.customers.length, conversationCount: portfolio.conversations.length }, ...portfolio };
    memory.__retainDemoSnapshots!.set(id, next);
    return next;
  }

  await db.batch([
    db.prepare("DELETE FROM demo_approvals WHERE workspace_id = ?").bind(id),
    db.prepare("DELETE FROM demo_conversations WHERE workspace_id = ?").bind(id),
    db.prepare("DELETE FROM demo_customers WHERE workspace_id = ?").bind(id),
  ]);
  const now = new Date().toISOString();
  await db.batch(portfolio.customers.map((c) => db.prepare("INSERT INTO demo_customers (id, workspace_id, name, contact_name, contact_email, initials, plan, health_score, risk_level, renewal_days, last_activity_label, usage_change_percent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(c.id, id, c.name, c.contact, c.email, c.initials, c.plan, c.health, c.risk, c.renewalDays, c.activity, c.change, now)));
  await db.batch(portfolio.conversations.map((c) => db.prepare("INSERT INTO demo_conversations (workspace_id, customer_id, subject, preview, body, display_time, unread, intent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(id, c.customerId, c.subject, c.preview, c.body, c.time, c.unread ? 1 : 0, c.intent, now)));
  await updateDemoWorkspace(id, { guideStep: 4 });
  return getDemoSnapshot(id);
}

export async function resetDemoWorkspace(id: string) {
  const db = getDemoDatabase();
  if (!db) {
    const snapshot = { workspace: emptyWorkspace(id), customers: [], conversations: [], storage: "memory" as const };
    memory.__retainDemoSnapshots!.set(id, snapshot);
    memory.__retainDemoApprovals!.set(id, []);
    return snapshot;
  }
  await db.batch([db.prepare("DELETE FROM demo_approvals WHERE workspace_id = ?").bind(id), db.prepare("DELETE FROM demo_conversations WHERE workspace_id = ?").bind(id), db.prepare("DELETE FROM demo_customers WHERE workspace_id = ?").bind(id)]);
  await db.prepare("UPDATE demo_workspaces SET company_name = '', company_description = '', product_name = '', documentation_pack = '', guide_step = 0, completed_at = NULL, updated_at = ? WHERE id = ?").bind(new Date().toISOString(), id).run();
  return getDemoSnapshot(id);
}

export async function listDemoApprovals(id: string): Promise<ApprovalRecord[]> {
  const db = getDemoDatabase();
  if (!db) return memory.__retainDemoApprovals!.get(id) ?? [];
  await ensureDatabaseSchema();
  const rows = (await db.prepare("SELECT * FROM demo_approvals WHERE workspace_id = ? ORDER BY created_at DESC").bind(id).all<Record<string, unknown>>()).results ?? [];
  return rows.map((row) => ({ id: String(row.id), customerId: String(row.customer_id), customer: String(row.customer_name), initials: String(row.customer_initials), action: String(row.action), description: String(row.description), created: "Just now", risk: String(row.risk_level) as ApprovalRecord["risk"], owner: String(row.owner_name), status: String(row.status) as ApprovalStatus, ...(row.subject ? { subject: String(row.subject) } : {}), ...(row.body ? { body: String(row.body) } : {}), ...(row.agent_run_id ? { runId: String(row.agent_run_id) } : {}) }));
}

export async function createDemoApproval(id: string, record: ApprovalRecord) {
  const db = getDemoDatabase();
  if (!db) {
    const items = memory.__retainDemoApprovals!.get(id) ?? [];
    items.unshift(record);
    memory.__retainDemoApprovals!.set(id, items);
    return record;
  }
  await ensureDatabaseSchema();
  const now = new Date().toISOString();
  await db.prepare("INSERT INTO demo_approvals (id, workspace_id, customer_id, customer_name, customer_initials, action, description, risk_level, owner_name, subject, body, agent_run_id, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
    .bind(record.id, id, record.customerId, record.customer, record.initials, record.action, record.description, record.risk, record.owner, record.subject ?? null, record.body ?? null, record.runId ?? null, record.status, now, now).run();
  return record;
}

export async function updateDemoApproval(id: string, approvalId: string, patch: { status?: ApprovalStatus; body?: string }) {
  const db = getDemoDatabase();
  if (!db) {
    const approval = (memory.__retainDemoApprovals!.get(id) ?? []).find((item) => item.id === approvalId);
    if (!approval) return null;
    Object.assign(approval, patch);
    return approval;
  }
  await ensureDatabaseSchema();
  const current = (await listDemoApprovals(id)).find((item) => item.id === approvalId);
  if (!current) return null;
  await db.prepare("UPDATE demo_approvals SET status = ?, body = ?, updated_at = ? WHERE id = ? AND workspace_id = ?").bind(patch.status ?? current.status, patch.body ?? current.body ?? null, new Date().toISOString(), approvalId, id).run();
  return (await listDemoApprovals(id)).find((item) => item.id === approvalId) ?? null;
}
