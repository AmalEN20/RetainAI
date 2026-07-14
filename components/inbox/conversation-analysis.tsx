"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BookOpenCheck,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  FileText,
  Gauge,
  LoaderCircle,
  Mail,
  Pencil,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TicketCheck,
  Users,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AnalysisResponse } from "@/lib/analysis/schema";

const executionSteps = [
  { label: "Customer profile retrieved", detail: "Acme Inc. · Pro", icon: Users },
  { label: "Usage metrics analyzed", detail: "30-day trend", icon: Gauge },
  { label: "Support history reviewed", detail: "3 open tickets", icon: TicketCheck },
  { label: "Subscription checked", detail: "Renewal in 14 days", icon: FileText },
  { label: "Knowledge base searched", detail: "Policies and playbooks", icon: BookOpenCheck },
  { label: "Retention plan prepared", detail: "Human review required", icon: ShieldCheck },
];

const delay = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function traceIcon(tool: string | null) {
  if (tool === "get_customer_profile") return Users;
  if (tool === "get_usage_metrics") return Gauge;
  if (tool === "get_support_tickets") return TicketCheck;
  if (tool === "get_subscription") return FileText;
  if (tool === "search_knowledge_base") return BookOpenCheck;
  return ShieldCheck;
}

function traceLabel(tool: string | null, fallback: string) {
  if (tool === "get_customer_profile") return "Customer profile retrieved";
  if (tool === "get_usage_metrics") return "Usage metrics analyzed";
  if (tool === "get_support_tickets") return "Support history reviewed";
  if (tool === "get_subscription") return "Subscription checked";
  if (tool === "search_knowledge_base") return "Knowledge base searched";
  return fallback;
}

export function ConversationAnalysis({ conversationId = 1, customerId = "cus_acme_001", customer = "Acme Inc.", initials = "AC", contact = "Sarah Chen" }: { conversationId?: number; customerId?: string; customer?: string; initials?: string; contact?: string }) {
  const [status, setStatus] = useState<"idle" | "analyzing" | "complete" | "error">("idle");
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [addedToApprovals, setAddedToApprovals] = useState(false);
  const [addingApproval, setAddingApproval] = useState(false);

  async function runAnalysis() {
    setStatus("analyzing");
    setAnalysis(null);
    setError("");
    setVisibleSteps(0);
    setAddedToApprovals(false);

    try {
      const request = fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId }),
      });

      const animation = (async () => {
        for (let index = 1; index <= executionSteps.length; index += 1) {
          await delay(260);
          setVisibleSteps(index);
        }
      })();

      const [response] = await Promise.all([request, animation]);
      if (!response.ok) throw new Error("The analysis could not be completed.");

      const payload = (await response.json()) as AnalysisResponse;
      setAnalysis(payload);
      setVisibleSteps(payload.meta.trace.length);
      setDraftBody(payload.result.emailDraft.body);
      setStatus("complete");
      window.dispatchEvent(new Event("retainai:analysis-complete"));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unexpected analysis error.");
      setStatus("error");
    }
  }

  async function addToApprovals() {
    if (!analysis) return;
    setAddingApproval(true);
    setError("");
    try {
      const response = await fetch("/api/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          customer,
          initials,
          action: "Send AI-drafted retention email",
          description: `Subject: ${analysis.result.emailDraft.subject}`,
          risk: "High",
          owner: contact,
          subject: analysis.result.emailDraft.subject,
          body: draftBody,
          runId: analysis.meta.runId,
        }),
      });
      if (!response.ok) throw new Error("The approval could not be saved.");
      setAddedToApprovals(true);
      window.dispatchEvent(new Event("retainai:approval-created"));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The approval could not be saved.");
    } finally {
      setAddingApproval(false);
    }
  }

  async function copyDraft() {
    if (!analysis) return;
    await navigator.clipboard.writeText(`${analysis.result.emailDraft.subject}\n\n${draftBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  const displayedSteps = analysis
    ? analysis.meta.trace.map((step) => ({
        label: traceLabel(step.tool, step.label),
        detail: `${step.summary} · ${step.durationMs}ms`,
        icon: traceIcon(step.tool),
      }))
    : executionSteps;

  if (status === "idle") {
    return (
      <div className="rounded-xl border border-[#cfe6da] bg-[#f1f9f5] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#d9f0e4] text-[#177553]"><Sparkles className="h-[18px] w-[18px]" /></span>
          <div className="flex-1"><h3 className="text-sm font-bold text-[#1e4635]">Ready for AI analysis</h3><p className="mt-1 text-xs leading-5 text-[#5e7569]">The copilot will review customer signals and retrieve approved policy guidance before drafting a response.</p></div>
          <Button onClick={runAnalysis}><Sparkles className="h-4 w-4" /> Analyze message</Button>
        </div>
        <div className="mt-4 grid gap-2 border-t border-[#d9eae1] pt-4 text-[10px] text-[#61756a] sm:grid-cols-5"><span>✓ Customer profile</span><span>✓ Usage metrics</span><span>✓ Support tickets</span><span>✓ Subscription</span><span>✓ Knowledge base</span></div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-xl border border-[#f0d1cb] bg-[#fff5f3] p-5">
        <div className="flex items-start gap-3"><XCircle className="mt-0.5 h-5 w-5 text-[#b74b3a]" /><div className="flex-1"><h3 className="text-sm font-bold text-[#7f3025]">Analysis interrupted</h3><p className="mt-1 text-xs text-[#8d5d55]">{error}</p></div><Button variant="outline" size="sm" onClick={runAnalysis}><RefreshCw className="h-3.5 w-3.5" /> Try again</Button></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-xl border bg-white">
        <div className="flex items-center gap-3 border-b bg-[#fafbf8] px-5 py-3.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e3f2ea] text-[#177553]">
            {status === "analyzing" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          </span>
          <div className="flex-1"><h3 className="text-xs font-bold">Agent execution</h3><p className="mt-0.5 text-[10px] text-[#839087]">{status === "analyzing" ? "Model is selecting read-only tools…" : `${analysis?.meta.toolCallCount ?? 0} tool calls · ${analysis?.meta.modelTurns ?? 0} model turns · max ${analysis?.meta.maxIterations ?? 6}`}</p></div>
          <Badge tone={status === "complete" ? "low" : "blue"}>{status === "complete" ? "Complete" : "Running"}</Badge>
        </div>
        <div className="grid gap-px bg-[#e7eae5] sm:grid-cols-2 lg:grid-cols-3">
          {displayedSteps.map((step, index) => {
            const StepIcon = step.icon;
            const visible = index < visibleSteps;
            return (
              <div key={`${step.label}-${index}`} className={`flex min-h-[74px] items-center gap-3 bg-white px-4 py-3 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-35"}`}>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${visible ? "bg-[#e9f6ef] text-[#177553]" : "bg-[#f0f2ee] text-[#9ba39e]"}`}>{visible ? <Check className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}</span>
                <div><p className="text-[11px] font-bold text-[#334039]">{step.label}</p><p className="mt-1 text-[9px] text-[#8b958e]">{visible ? step.detail : "Waiting…"}</p></div>
              </div>
            );
          })}
        </div>
      </section>

      {status === "complete" && analysis && (
        <div className="space-y-4 page-enter">
          <section className="rounded-xl border border-[#efccc5] bg-[#fff8f6] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fbe4df] text-[#b84232]"><AlertTriangle className="h-5 w-5" /></span>
              <div className="flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-bold text-[#642d25]">High churn risk detected</h3><Badge tone="high">{Math.round(analysis.result.confidence * 100)}% confidence</Badge><Badge tone={analysis.meta.mode === "openai" ? "blue" : "neutral"}>{analysis.meta.mode === "openai" ? analysis.meta.model ?? "OpenAI" : analysis.meta.mode === "fallback" ? "Safe fallback" : "Verified demo"}</Badge></div><p className="mt-2 text-xs leading-5 text-[#77554f]">{analysis.result.summary}</p>{analysis.meta.note && <p className="mt-2 text-[10px] font-medium text-[#936f68]">{analysis.meta.note}</p>}</div>
              <div className="rounded-lg border border-[#efd5d0] bg-white px-3 py-2 text-center"><p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#9a7b75]">Health</p><p className="mt-0.5 text-xl font-bold text-[#b84232]">{analysis.result.healthScore}</p></div>
            </div>
          </section>

          <div className="grid gap-4 xl:grid-cols-2">
            <section className="rounded-xl border bg-white p-5"><div className="mb-4 flex items-center justify-between"><div><h3 className="text-xs font-bold">Why this account is at risk</h3><p className="mt-1 text-[10px] text-[#87918b]">Evidence from connected business tools</p></div><AlertTriangle className="h-4 w-4 text-[#c45a49]" /></div><div className="space-y-3">{analysis.result.riskFactors.map((factor) => <div key={factor.label} className="flex gap-3"><span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${factor.severity === "high" ? "bg-[#d65c4a]" : factor.severity === "medium" ? "bg-[#d4a13b]" : "bg-[#55a57c]"}`} /><div><p className="text-[11px] font-bold text-[#37433c]">{factor.label}</p><p className="mt-1 text-[10px] leading-4 text-[#7d8781]">{factor.evidence}</p></div></div>)}</div></section>
            <section className="rounded-xl border bg-white p-5"><div className="mb-4 flex items-center justify-between"><div><h3 className="text-xs font-bold">Recommended retention plan</h3><p className="mt-1 text-[10px] text-[#87918b]">Ordered by urgency and customer impact</p></div><ClipboardCheck className="h-4 w-4 text-[#177553]" /></div><div className="space-y-3">{analysis.result.recommendedActions.map((action, index) => <div key={action.title} className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8f5ee] text-[10px] font-bold text-[#177553]">{index + 1}</span><div><div className="flex flex-wrap items-center gap-2"><p className="text-[11px] font-bold text-[#37433c]">{action.title}</p><Badge tone={action.priority === "now" ? "high" : "medium"}>{action.priority === "now" ? "Do now" : "This week"}</Badge></div><p className="mt-1 text-[10px] leading-4 text-[#7d8781]">{action.description}</p></div></div>)}</div></section>
          </div>

          <section className="overflow-hidden rounded-xl border bg-white">
            <div className="flex flex-wrap items-center gap-3 border-b bg-[#fafbf8] px-5 py-3.5"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e9f2ff] text-[#4b72a9]"><Mail className="h-4 w-4" /></span><div className="flex-1"><h3 className="text-xs font-bold">Email draft</h3><p className="mt-0.5 text-[10px] text-[#87918b]">Prepared for {contact} · requires approval</p></div><Button variant="ghost" size="sm" onClick={() => setEditing(!editing)}><Pencil className="h-3.5 w-3.5" /> {editing ? "Done editing" : "Edit"}</Button><Button variant="ghost" size="sm" onClick={copyDraft}>{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copied" : "Copy"}</Button></div>
            <div className="p-5"><div className="mb-4 border-b pb-3"><span className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#9aa29d]">Subject</span><p className="mt-1 text-xs font-semibold">{analysis.result.emailDraft.subject}</p></div>{editing ? <textarea value={draftBody} onChange={(event) => setDraftBody(event.target.value)} className="min-h-[260px] w-full resize-y rounded-lg border bg-[#fafbf8] p-3 text-xs leading-5 outline-none focus:ring-2 focus:ring-[#177553]/20" aria-label="Edit email draft" /> : <p className="whitespace-pre-line text-xs leading-5 text-[#4e5a53]">{draftBody}</p>}</div>
            <div className="flex flex-col gap-3 border-t bg-[#fafbf8] px-5 py-4 sm:flex-row sm:items-center"><div className="flex flex-1 items-center gap-2 text-[10px] text-[#77847c]"><ShieldCheck className="h-4 w-4 text-[#177553]" /> Sending remains disabled until a human approves this action.</div>{addedToApprovals ? <Button asChild><Link href="/approvals"><CheckCircle2 className="h-4 w-4" /> View in approvals <ArrowRight className="h-3.5 w-3.5" /></Link></Button> : <Button onClick={addToApprovals} disabled={addingApproval}>{addingApproval ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ClipboardCheck className="h-4 w-4" />} {addingApproval ? "Saving…" : "Add to approvals"}</Button>}</div>
            {error && <p className="border-t bg-[#fff5f2] px-5 py-3 text-[10px] font-medium text-[#a74739]">{error}</p>}
          </section>

          <section className="rounded-xl border bg-white p-4"><div className="flex flex-wrap items-center gap-2"><span className="mr-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#929b95]">Sources used</span>{analysis.result.sources.map((source) => <span key={`${source.tool}-${source.chunkId ?? source.label}`} title={source.detail} className="rounded-full border bg-[#fafbf8] px-2.5 py-1 text-[10px] font-medium text-[#647069]">{source.citation ?? source.label}</span>)}<span className="ml-auto text-[9px] text-[#9aa29d]">Run {analysis.meta.runId.slice(0, 8)}</span></div></section>
        </div>
      )}
    </div>
  );
}
