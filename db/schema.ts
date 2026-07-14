// The deployed demo uses this D1 schema. The SQL migration in /drizzle is
// packaged with the Sites build and applied by the hosting platform.
export const demoTables = ["demo_workspaces", "demo_customers", "demo_conversations", "demo_approvals"] as const;
