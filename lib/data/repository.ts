import { approvals as demoApprovals, conversations as demoConversations, customers as demoCustomers } from "@/lib/mock-data";
import type { AnalysisResponse } from "@/lib/analysis/schema";
import type { AgentRunRecord, ApprovalRecord, ApprovalStatus, ConversationRecord, CustomerRecord } from "./types";
import { getSupabaseAdmin } from "./supabase";
import { demoAgentRuns } from "./demo-runs";
import { readDemoSessionId } from "@/lib/demo/session";
import { getDemoSnapshot } from "@/lib/demo/store";
import { createDemoApproval, listDemoApprovals, updateDemoApproval } from "@/lib/demo/store";

const demoState = globalThis as typeof globalThis & { retainAiApprovals?: ApprovalRecord[]; retainAiAgentRuns?: AgentRunRecord[] };

function getDemoApprovals() {
  demoState.retainAiApprovals ??= demoApprovals.map((approval) => ({ ...approval }));
  return demoState.retainAiApprovals;
}

function getDemoAgentRuns() {
  demoState.retainAiAgentRuns ??= demoAgentRuns.map((run) => ({ ...run, trace: [...run.trace] }));
  return demoState.retainAiAgentRuns;
}

function formatRelativeTime(value: string) {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60_000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  return `${hours} hr${hours === 1 ? "" : "s"} ago`;
}

export async function listCustomers(): Promise<CustomerRecord[]> {
  const demoSessionId = await readDemoSessionId();
  if (demoSessionId) return (await getDemoSnapshot(demoSessionId)).customers;
  const supabase = getSupabaseAdmin();
  if (!supabase) return demoCustomers;

  const { data, error } = await supabase.from("customers").select("*").order("health_score");
  if (error || !data) return demoCustomers;
  return data.map((row) => ({
    id: row.id,
    name: row.name,
    contact: row.contact_name,
    email: row.contact_email,
    initials: row.initials,
    plan: row.plan,
    health: row.health_score,
    risk: row.risk_level,
    renewal: `${row.renewal_days} days`,
    renewalDays: row.renewal_days,
    activity: row.last_activity_label,
    change: row.usage_change_percent,
  }));
}

export async function listConversations(): Promise<ConversationRecord[]> {
  const demoSessionId = await readDemoSessionId();
  if (demoSessionId) return (await getDemoSnapshot(demoSessionId)).conversations;
  const supabase = getSupabaseAdmin();
  if (!supabase) return demoConversations;

  const { data, error } = await supabase
    .from("conversations")
    .select("*, customers(name, initials, contact_name, risk_level)")
    .order("received_at", { ascending: false });
  if (error || !data) return demoConversations;
  return data.map((row) => ({
    id: row.id,
    customerId: row.customer_id,
    customer: row.customers.name,
    initials: row.customers.initials,
    contact: row.customers.contact_name,
    subject: row.subject,
    preview: row.preview,
    body: row.body,
    time: row.display_time,
    unread: row.unread,
    risk: row.customers.risk_level,
    intent: row.intent,
  }));
}

export async function getConversationById(id: number) {
  const conversations = await listConversations();
  return conversations.find((conversation) => conversation.id === id) ?? null;
}

export async function listApprovals(): Promise<ApprovalRecord[]> {
  const demoSessionId = await readDemoSessionId();
  if (demoSessionId) return listDemoApprovals(demoSessionId);
  const supabase = getSupabaseAdmin();
  if (!supabase) return getDemoApprovals();

  const { data, error } = await supabase.from("approvals").select("*").order("created_at", { ascending: false });
  if (error || !data) return getDemoApprovals();
  return data.map((row) => ({
    id: row.id,
    customerId: row.customer_id,
    customer: row.customer_name,
    initials: row.customer_initials,
    action: row.action,
    description: row.description,
    created: formatRelativeTime(row.created_at),
    risk: row.risk_level,
    owner: row.owner_name,
    status: row.status,
    ...(row.subject ? { subject: row.subject } : {}),
    ...(row.body ? { body: row.body } : {}),
    ...(row.agent_run_id ? { runId: row.agent_run_id } : {}),
  }));
}

type NewApproval = Pick<ApprovalRecord, "customerId" | "customer" | "initials" | "action" | "description" | "risk" | "owner"> & {
  subject?: string;
  body?: string;
  runId?: string;
};

export async function createApproval(input: NewApproval): Promise<ApprovalRecord> {
  const record: ApprovalRecord = {
    id: crypto.randomUUID(),
    ...input,
    created: "Just now",
    status: "pending",
  };
  const demoSessionId = await readDemoSessionId();
  if (demoSessionId) return createDemoApproval(demoSessionId, record);
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    getDemoApprovals().unshift(record);
    return record;
  }

  const payload = {
    id: record.id,
    agent_run_id: input.runId ?? null,
    customer_id: input.customerId,
    customer_name: input.customer,
    customer_initials: input.initials,
    action: input.action,
    description: input.description,
    risk_level: input.risk,
    owner_name: input.owner,
    subject: input.subject ?? null,
    body: input.body ?? null,
    status: "pending",
  };
  let { error } = await supabase.from("approvals").insert(payload);
  if (error && input.runId) {
    ({ error } = await supabase.from("approvals").insert({ ...payload, agent_run_id: null }));
  }
  if (error) throw new Error("Approval could not be persisted.");
  return record;
}

export async function updateApproval(id: string, patch: { status?: ApprovalStatus; body?: string }) {
  const demoSessionId = await readDemoSessionId();
  if (demoSessionId) return updateDemoApproval(demoSessionId, id, patch);
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const approval = getDemoApprovals().find((item) => item.id === id);
    if (!approval) return null;
    Object.assign(approval, patch);
    return approval;
  }

  const update = {
    ...(patch.status ? { status: patch.status, decided_at: patch.status === "pending" ? null : new Date().toISOString() } : {}),
    ...(patch.body !== undefined ? { body: patch.body } : {}),
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase.from("approvals").update(update).eq("id", id);
  if (error) throw new Error("Approval decision could not be persisted.");
  return (await listApprovals()).find((item) => item.id === id) ?? null;
}

export async function saveAgentRun(response: AnalysisResponse, conversation: ConversationRecord) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    getDemoAgentRuns().unshift({
      id: response.meta.runId,
      customer: conversation.customer,
      initials: conversation.initials,
      conversation: conversation.subject,
      created: "Just now",
      mode: response.meta.mode,
      model: response.meta.model,
      status: "completed",
      riskLevel: response.result.riskLevel,
      summary: response.result.summary,
      durationMs: response.meta.durationMs,
      toolCallCount: response.meta.toolCallCount,
      modelTurns: response.meta.modelTurns,
      citationCount: response.result.sources.filter((source) => source.citation).length,
      safety: response.meta.trace.every((step) => step.readOnly) ? "passed" : "blocked",
      trace: response.meta.trace,
    });
    return false;
  }
  const { error } = await supabase.from("agent_runs").insert({
    id: response.meta.runId,
    conversation_id: conversation.id,
    customer_id: conversation.customerId,
    mode: response.meta.mode,
    model: response.meta.model,
    status: "completed",
    result: response.result,
    trace: response.meta.trace,
    tool_call_count: response.meta.toolCallCount,
    model_turns: response.meta.modelTurns,
    duration_ms: response.meta.durationMs,
  });
  return !error;
}

export async function listAgentRuns(): Promise<AgentRunRecord[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return getDemoAgentRuns();

  const { data, error } = await supabase
    .from("agent_runs")
    .select("*, customers(name, initials), conversations(subject)")
    .order("created_at", { ascending: false })
    .limit(20);
  if (error || !data) return getDemoAgentRuns();
  return data.map((row) => {
    const result = row.result as AnalysisResponse["result"];
    const trace = row.trace as AnalysisResponse["meta"]["trace"];
    return {
      id: row.id,
      customer: row.customers.name,
      initials: row.customers.initials,
      conversation: row.conversations.subject,
      created: formatRelativeTime(row.created_at),
      mode: row.mode,
      model: row.model,
      status: row.status === "blocked" ? "blocked" : "completed",
      riskLevel: result.riskLevel,
      summary: result.summary,
      durationMs: row.duration_ms,
      toolCallCount: row.tool_call_count,
      modelTurns: row.model_turns,
      citationCount: result.sources.filter((source) => source.citation).length,
      safety: trace.every((step) => step.readOnly && step.status !== "blocked") ? "passed" : "blocked",
      trace,
    };
  });
}
