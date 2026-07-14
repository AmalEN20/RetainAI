CREATE TABLE IF NOT EXISTS demo_workspaces (
  id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL DEFAULT '',
  company_description TEXT NOT NULL DEFAULT '',
  product_name TEXT NOT NULL DEFAULT '',
  documentation_pack TEXT NOT NULL DEFAULT '',
  guide_step INTEGER NOT NULL DEFAULT 0,
  completed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS demo_customers (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  initials TEXT NOT NULL,
  plan TEXT NOT NULL,
  health_score INTEGER NOT NULL,
  risk_level TEXT NOT NULL,
  renewal_days INTEGER NOT NULL,
  last_activity_label TEXT NOT NULL,
  usage_change_percent INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (workspace_id) REFERENCES demo_workspaces(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_demo_customers_workspace ON demo_customers(workspace_id);

CREATE TABLE IF NOT EXISTS demo_conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workspace_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  preview TEXT NOT NULL,
  body TEXT NOT NULL,
  display_time TEXT NOT NULL,
  unread INTEGER NOT NULL DEFAULT 1,
  intent TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (workspace_id) REFERENCES demo_workspaces(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES demo_customers(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_demo_conversations_workspace ON demo_conversations(workspace_id);

CREATE TABLE IF NOT EXISTS demo_approvals (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_initials TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  risk_level TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  subject TEXT,
  body TEXT,
  agent_run_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (workspace_id) REFERENCES demo_workspaces(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_demo_approvals_workspace ON demo_approvals(workspace_id);
