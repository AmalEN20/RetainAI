"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Activity, BookOpenCheck, Building2, Check, CheckSquare2, ChevronDown, Database, LayoutDashboard, LoaderCircle, RefreshCw, Sparkles, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DemoDocumentationPack, DemoSnapshot } from "@/lib/demo/types";

const docPacks: { id: Exclude<DemoDocumentationPack, "">; name: string; description: string }[] = [
  { id: "github", name: "GitHub Docs", description: "Developer support and API workflows" },
  { id: "stripe", name: "Stripe Docs", description: "Billing, subscriptions, and payments" },
  { id: "google-workspace", name: "Google Workspace", description: "Admin, collaboration, and productivity" },
];

type GuidedStage = "customers" | "inbox" | "approvals";
type TransitionStage = GuidedStage | "analysis" | null;

const guidedStagePaths: Record<GuidedStage, string> = {
  customers: "/customers",
  inbox: "/inbox",
  approvals: "/approvals",
};

export function DemoGuide() {
  const router = useRouter();
  const pathname = usePathname();
  const [snapshot, setSnapshot] = useState<DemoSnapshot | null>(null);
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(true);
  const mobileStateInitialized = useRef(false);
  const [busy, setBusy] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);
  const [approvalReviewed, setApprovalReviewed] = useState(false);
  const [transitionStage, setTransitionStage] = useState<TransitionStage>(null);
  const [pendingIntro, setPendingIntro] = useState<GuidedStage | null>(null);
  const [explanationPage, setExplanationPage] = useState<0 | 1>(0);
  const [companyName, setCompanyName] = useState("RetainAI Labs");
  const [productName, setProductName] = useState("Customer Success Cloud");
  const [companyDescription, setCompanyDescription] = useState("A B2B SaaS platform that helps customer success teams reduce churn and improve adoption.");

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    let active = true;
    void fetch("/api/demo?reset=1", { cache: "no-store" })
      .then((response) => response.json() as Promise<DemoSnapshot>)
      .then((data) => {
        if (!active) return;
        setSnapshot(data);
        if (data.workspace.companyName) setCompanyName(data.workspace.companyName);
        if (data.workspace.productName) setProductName(data.workspace.productName);
        if (data.workspace.companyDescription) setCompanyDescription(data.workspace.companyDescription);
        router.refresh();
      });
    return () => { active = false; };
  }, [router]);

  async function update(body: Record<string, unknown>) {
    setBusy(true);
    try {
      const response = await fetch("/api/demo", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      setSnapshot((await response.json()) as DemoSnapshot);
      router.refresh();
    } finally { setBusy(false); }
  }

  async function generate() {
    setBusy(true);
    try {
      const response = await fetch("/api/demo/generate", { method: "POST" });
      const data = (await response.json()) as DemoSnapshot;
      setSnapshot(data);
      router.push("/customers");
      router.refresh();
    } finally { setBusy(false); }
  }

  async function openCustomerPortfolio() {
    await update({ guideStep: 5 });
    setMobileExpanded(false);
    setPendingIntro("customers");
    router.push("/customers");
  }

  function openCustomerInbox() {
    setMobileExpanded(false);
    setPendingIntro("inbox");
    router.push("/inbox");
  }

  function openApprovals() {
    setMobileExpanded(false);
    setPendingIntro("approvals");
    router.push("/approvals");
  }

  function dismissAssistant() {
    if (isMobile) setMobileExpanded(false);
    else setOpen(false);
  }

  async function reset() {
    setBusy(true);
    try {
      const response = await fetch("/api/demo/reset", { method: "POST" });
      setSnapshot((await response.json()) as DemoSnapshot);
      setTransitionStage(null);
      setPendingIntro(null);
      setAnalysisDone(false);
      setApprovalReviewed(false);
      setExplanationPage(0);
      setOpen(true);
      setMobileExpanded(!isMobile);
      router.replace("/case-study");
    } finally { setBusy(false); }
  }

  function viewAnalysis() {
    setTransitionStage(null);
    setMobileExpanded(false);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.getElementById("message-analysis-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  useEffect(() => {
    const analyzed = () => {
      setAnalysisDone(true);
      setExplanationPage(0);
      setOpen(true);
      setMobileExpanded(false);
      setTransitionStage("analysis");
    };
    const approved = () => {
      setOpen(true);
      setMobileExpanded(true);
      void update({ guideStep: 6 });
    };
    const approvalReviewed = () => {
      setApprovalReviewed(true);
      setMobileExpanded(true);
    };
    const approvalReopened = () => setApprovalReviewed(false);
    window.addEventListener("retainai:analysis-complete", analyzed);
    window.addEventListener("retainai:approval-created", approved);
    window.addEventListener("retainai:approval-reviewed", approvalReviewed);
    window.addEventListener("retainai:approval-reopened", approvalReopened);
    return () => {
      window.removeEventListener("retainai:analysis-complete", analyzed);
      window.removeEventListener("retainai:approval-created", approved);
      window.removeEventListener("retainai:approval-reviewed", approvalReviewed);
      window.removeEventListener("retainai:approval-reopened", approvalReopened);
    };
  });

  const step = snapshot?.workspace.guideStep ?? 0;

  useEffect(() => {
    if (!isMobile) {
      mobileStateInitialized.current = false;
      return;
    }
    if (snapshot && !mobileStateInitialized.current) {
      setMobileExpanded(false);
      mobileStateInitialized.current = true;
    }
  }, [isMobile, snapshot, step]);

  useEffect(() => {
    if (!pendingIntro || pathname !== guidedStagePaths[pendingIntro]) return;
    const timer = window.setTimeout(() => {
      setTransitionStage(pendingIntro);
      setPendingIntro(null);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [pendingIntro, pathname]);

  useEffect(() => {
    if (step !== 6 || approvalReviewed) return;
    let active = true;
    void fetch("/api/approvals", { cache: "no-store" })
      .then((response) => response.json() as Promise<{ approvals?: { runId?: string | null; status: string }[] }>)
      .then((payload) => {
        if (active && payload.approvals?.some((approval) => approval.runId && approval.status !== "pending")) setApprovalReviewed(true);
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, [approvalReviewed, pathname, step]);

  useEffect(() => {
    if (!transitionStage) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setTransitionStage(null);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [transitionStage]);

  if (!snapshot) return <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl border bg-white px-4 py-3 text-xs font-semibold shadow-xl"><LoaderCircle className="h-4 w-4 animate-spin text-[#177553]" /> Preparing your demo…</div>;

  if (!open) {
    return <button onClick={() => setOpen(true)} className="demo-guide-launcher fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#177553] px-4 py-3 text-xs font-bold text-white shadow-xl"><Sparkles className="h-4 w-4" /> Demo assistant <ChevronDown className="h-4 w-4 rotate-180" /></button>;
  }

  const mobileHint = step === 0
    ? "Try the interactive demo"
    : step < 5
      ? "Continue demo setup"
    : step === 5
      ? pathname === "/customers"
        ? "Next · Open the Inbox"
        : analysisDone
          ? "Next · Add draft to approvals"
          : "Next · Analyze the message"
      : step === 6
        ? approvalReviewed
          ? "Finish the demo"
          : "Next · Review the approval"
        : "Demo complete · Reset anytime";

  return (
    <>
      {isMobile && mobileExpanded && !transitionStage && <button className="demo-assistant-scrim fixed inset-0 z-[45] bg-[#0d1812]/28 backdrop-blur-[2px]" onClick={() => setMobileExpanded(false)} aria-label="Close demo assistant" />}
      {isMobile && !mobileExpanded && !transitionStage && (
        <button className="demo-mobile-dock fixed z-50 flex min-h-14 items-center gap-3 rounded-2xl border border-[#c9d9d0] bg-white px-3 py-2 text-left shadow-[0_14px_36px_rgba(16,42,28,0.18)]" onClick={() => setMobileExpanded(true)} aria-label={`Open demo assistant. ${mobileHint}`}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#177553] text-white"><Sparkles className="h-4 w-4" /></span>
          <span className="min-w-0 flex-1"><span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-[#708078]">Demo · {Math.min(step + 1, 8)}/8</span><span className="mt-0.5 block truncate text-xs font-bold text-[#213128]">{mobileHint}</span></span>
          <ChevronDown className="h-4 w-4 shrink-0 rotate-180 text-[#708078]" />
        </button>
      )}
      {transitionStage && (
        <div className="demo-step-overlay fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="demo-step-title">
          <button className="absolute inset-0 bg-[#0d1812]/28 backdrop-blur-[3px]" onClick={() => setTransitionStage(null)} aria-label="Continue demo" />
          <section className="demo-step-modal relative max-h-[calc(100vh-2rem)] w-full max-w-[580px] overflow-y-auto rounded-3xl border border-white/60 bg-white shadow-[0_32px_100px_rgba(9,31,19,0.28)]">
            <div className="demo-step-glow" aria-hidden="true" />
            <div className="relative p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <span className="demo-step-check flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dff3e8] text-[#177553]"><Check className="h-5 w-5" strokeWidth={2.5} /></span>
                <span className="rounded-full border bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#648072]">{transitionStage === "analysis" ? `${explanationPage + 1} of 2` : `${transitionStage} overview`}</span>
              </div>
              <div key={`${transitionStage}-${explanationPage}`} className="demo-step-page">
                {transitionStage === "customers" ? (
                  <>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#298160]">Your customer portfolio</p>
                    <h2 id="demo-step-title" className="mt-2 text-2xl font-bold tracking-[-0.035em] text-[#17251d]">This page turns customer data into a prioritized workspace</h2>
                    <p className="mt-3 text-sm leading-6 text-[#617068]">Each customer has a health score, usage trend, renewal date, and risk level. Together, these signals help the team understand who needs attention before a customer asks for help.</p>
                    <div className="mt-5 grid gap-2 sm:grid-cols-3">
                      <div className="rounded-xl border bg-white/80 p-3"><Activity className="h-4 w-4 text-[#177553]" /><p className="mt-2 text-[11px] font-bold text-[#2f4137]">Health & usage</p><p className="mt-1 text-[9px] leading-4 text-[#78867e]">Shows adoption changes and account momentum.</p></div>
                      <div className="rounded-xl border bg-white/80 p-3"><Users className="h-4 w-4 text-[#177553]" /><p className="mt-2 text-[11px] font-bold text-[#2f4137]">Risk & renewal</p><p className="mt-1 text-[9px] leading-4 text-[#78867e]">Prioritizes accounts where timing matters most.</p></div>
                      <div className="rounded-xl border bg-white/80 p-3"><Database className="h-4 w-4 text-[#177553]" /><p className="mt-2 text-[11px] font-bold text-[#2f4137]">Agent context</p><p className="mt-1 text-[9px] leading-4 text-[#78867e]">Becomes evidence when AI analyzes a message.</p></div>
                    </div>
                    <div className="mt-6 rounded-2xl border border-[#dce9e1] bg-[#f4f9f6] p-4"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6f8277]">Why this matters</p><p className="mt-2 text-xs font-semibold leading-5 text-[#30463a]">A Customer Success Manager can quickly focus on the right accounts, while RetainAI uses the same signals to produce grounded risk assessments and recommended actions.</p></div>
                  </>
                ) : transitionStage === "inbox" ? (
                  <>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#298160]">Unified customer inbox</p>
                    <h2 id="demo-step-title" className="mt-2 text-2xl font-bold tracking-[-0.035em] text-[#17251d]">This is where customer signals become an actionable conversation</h2>
                    <p className="mt-3 text-sm leading-6 text-[#617068]">Inbox brings customer messages, intent, and account risk together. High-priority conversations surface first so the team knows what needs attention now.</p>
                    <div className="mt-5 grid gap-2 sm:grid-cols-3">
                      <div className="rounded-xl border bg-white/80 p-3"><Activity className="h-4 w-4 text-[#177553]" /><p className="mt-2 text-[11px] font-bold text-[#2f4137]">Intent & priority</p><p className="mt-1 text-[9px] leading-4 text-[#78867e]">Cancellation, escalation, or expansion signals.</p></div>
                      <div className="rounded-xl border bg-white/80 p-3"><Users className="h-4 w-4 text-[#177553]" /><p className="mt-2 text-[11px] font-bold text-[#2f4137]">Account context</p><p className="mt-1 text-[9px] leading-4 text-[#78867e]">The message stays connected to the customer.</p></div>
                      <div className="rounded-xl border bg-white/80 p-3"><Sparkles className="h-4 w-4 text-[#177553]" /><p className="mt-2 text-[11px] font-bold text-[#2f4137]">AI analysis</p><p className="mt-1 text-[9px] leading-4 text-[#78867e]">Retrieves evidence before recommending action.</p></div>
                    </div>
                    <div className="mt-6 rounded-2xl border border-[#dce9e1] bg-[#f4f9f6] p-4"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6f8277]">Next step</p><p className="mt-2 text-xs font-semibold leading-5 text-[#30463a]">Analyze the cancellation message to see how RetainAI combines the email with usage, support, subscription, and knowledge-base evidence.</p></div>
                  </>
                ) : transitionStage === "approvals" ? (
                  <>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#298160]">Human-in-the-loop control</p>
                    <h2 id="demo-step-title" className="mt-2 text-2xl font-bold tracking-[-0.035em] text-[#17251d]">AI proposes the action, but a human makes the final decision</h2>
                    <p className="mt-3 text-sm leading-6 text-[#617068]">Approvals is the safety boundary for customer-facing work. A manager can review the evidence and draft, edit it, approve it, or reject it.</p>
                    <div className="mt-5 grid gap-2 sm:grid-cols-3">
                      <div className="rounded-xl border bg-white/80 p-3"><CheckSquare2 className="h-4 w-4 text-[#177553]" /><p className="mt-2 text-[11px] font-bold text-[#2f4137]">Review</p><p className="mt-1 text-[9px] leading-4 text-[#78867e]">Inspect the proposed action and its source run.</p></div>
                      <div className="rounded-xl border bg-white/80 p-3"><Check className="h-4 w-4 text-[#177553]" /><p className="mt-2 text-[11px] font-bold text-[#2f4137]">Decide</p><p className="mt-1 text-[9px] leading-4 text-[#78867e]">Approve, edit, or reject before execution.</p></div>
                      <div className="rounded-xl border bg-white/80 p-3"><Database className="h-4 w-4 text-[#177553]" /><p className="mt-2 text-[11px] font-bold text-[#2f4137]">Audit trail</p><p className="mt-1 text-[9px] leading-4 text-[#78867e]">Keep the final status connected to the run.</p></div>
                    </div>
                    <div className="mt-6 rounded-2xl border border-[#dce9e1] bg-[#f4f9f6] p-4"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6f8277]">Why this matters</p><p className="mt-2 text-xs font-semibold leading-5 text-[#30463a]">The agent never sends customer communication by itself. The demo finishes only after you approve or reject the pending action.</p></div>
                  </>
                ) : explanationPage === 0 ? (
                  <>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#298160]">What happened behind the scenes</p>
                    <h2 id="demo-step-title" className="mt-2 text-2xl font-bold tracking-[-0.035em] text-[#17251d]">This is where RetainAI becomes more than a dashboard</h2>
                    <p className="mt-3 text-sm leading-6 text-[#617068]">The agent did not guess from one email. It retrieved the customer profile, usage trend, support history, subscription context, and approved knowledge before producing a decision.</p>
                    <div className="mt-5 grid gap-2 sm:grid-cols-3">
                      <div className="rounded-xl border bg-white/80 p-3"><Database className="h-4 w-4 text-[#177553]" /><p className="mt-2 text-[11px] font-bold text-[#2f4137]">5 read-only tools</p><p className="mt-1 text-[9px] leading-4 text-[#78867e]">Evidence gathered safely</p></div>
                      <div className="rounded-xl border bg-white/80 p-3"><Sparkles className="h-4 w-4 text-[#177553]" /><p className="mt-2 text-[11px] font-bold text-[#2f4137]">Decision, not summary</p><p className="mt-1 text-[9px] leading-4 text-[#78867e]">Risk and next action</p></div>
                      <div className="rounded-xl border bg-white/80 p-3"><Check className="h-4 w-4 text-[#177553]" /><p className="mt-2 text-[11px] font-bold text-[#2f4137]">Human control</p><p className="mt-1 text-[9px] leading-4 text-[#78867e]">Nothing sent automatically</p></div>
                    </div>
                    <div className="mt-6 rounded-2xl border border-[#dce9e1] bg-[#f4f9f6] p-4"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6f8277]">Why this matters</p><p className="mt-2 text-xs font-semibold leading-5 text-[#30463a]">One customer-success manager can understand account risk faster, respond with grounded context, and still approve every customer-facing action.</p></div>
                  </>
                ) : (
                  <>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#298160]">The complete product system</p>
                    <h2 id="demo-step-title" className="mt-2 text-2xl font-bold tracking-[-0.035em] text-[#17251d]">Every screen supports the same customer decision</h2>
                    <p className="mt-3 text-sm leading-6 text-[#617068]">RetainAI connects customer data, trusted knowledge, agent observability, and human review instead of hiding everything behind a chat box.</p>
                    <div className="mt-5 grid gap-2 sm:grid-cols-2">
                      <div className="rounded-xl border bg-white/80 p-3"><Users className="h-4 w-4 text-[#177553]" /><p className="mt-2 text-[11px] font-bold">Customers</p><p className="mt-1 text-[9px] leading-4 text-[#78867e]">Health, usage, renewal timing, and risk across the portfolio.</p></div>
                      <div className="rounded-xl border bg-white/80 p-3"><BookOpenCheck className="h-4 w-4 text-[#177553]" /><p className="mt-2 text-[11px] font-bold">Knowledge Base</p><p className="mt-1 text-[9px] leading-4 text-[#78867e]">Approved policies and citation-ready guidance ground the agent.</p></div>
                      <div className="rounded-xl border bg-white/80 p-3"><Activity className="h-4 w-4 text-[#177553]" /><p className="mt-2 text-[11px] font-bold">Agent Runs & Evals</p><p className="mt-1 text-[9px] leading-4 text-[#78867e]">Tool calls, latency, model turns, safety traces, and repeatable tests.</p></div>
                      <div className="rounded-xl border bg-white/80 p-3"><CheckSquare2 className="h-4 w-4 text-[#177553]" /><p className="mt-2 text-[11px] font-bold">Approvals</p><p className="mt-1 text-[9px] leading-4 text-[#78867e]">A human reviews every proposed customer-facing action.</p></div>
                      <div className="rounded-xl border bg-[#f4f9f6] p-3 sm:col-span-2"><LayoutDashboard className="h-4 w-4 text-[#177553]" /><p className="mt-2 text-[11px] font-bold">Dashboard</p><p className="mt-1 text-[9px] leading-4 text-[#78867e]">Turns all signals into a prioritized view of what needs attention now.</p></div>
                    </div>
                  </>
                )}
              </div>
              {transitionStage !== "analysis" ? (
                <Button className="mt-6 w-full" onClick={() => setTransitionStage(null)}>{transitionStage === "customers" ? "Explore customer portfolio" : transitionStage === "inbox" ? "Explore customer inbox" : "Review pending action"}</Button>
              ) : (
                <>
                  <div className="mt-6 flex gap-2">
                    {explanationPage === 1 && <Button variant="outline" className="flex-1" onClick={() => setExplanationPage(0)}>Back</Button>}
                    <Button className="flex-1" onClick={() => explanationPage === 0 ? setExplanationPage(1) : viewAnalysis()}>{explanationPage === 0 ? "Next: Product system" : "View the analysis"}</Button>
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-1.5" aria-label={`Page ${explanationPage + 1} of 2`}><span className={`h-1.5 rounded-full transition-all ${explanationPage === 0 ? "w-5 bg-[#177553]" : "w-1.5 bg-[#ccd8d1]"}`} /><span className={`h-1.5 rounded-full transition-all ${explanationPage === 1 ? "w-5 bg-[#177553]" : "w-1.5 bg-[#ccd8d1]"}`} /></div>
                </>
              )}
            </div>
          </section>
        </div>
      )}
      <aside className={`demo-guide-card fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-[380px] overflow-hidden rounded-2xl border border-[#cddbd3] bg-white shadow-[0_18px_48px_rgba(20,42,30,0.16)] ${isMobile && (!mobileExpanded || transitionStage) ? "hidden" : ""}`}>
      <header className="demo-guide-header flex items-center gap-3 bg-[#132019] px-4 py-3.5 text-white">
        <span className="demo-guide-spark flex h-8 w-8 items-center justify-center rounded-lg bg-[#48b889] text-[#102018]"><Sparkles className="h-4 w-4" /></span>
        <div className="flex-1"><p className="text-xs font-bold">RetainAI demo assistant</p><p className="mt-0.5 text-[10px] text-[#aebeb5]">Step {Math.min(step + 1, 8)} of 8 · Anonymous sandbox</p></div>
        <button onClick={dismissAssistant} aria-label="Minimize demo assistant" className="-mr-2 flex h-11 w-11 items-center justify-center rounded-lg text-[#aebeb5] hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button>
      </header>
      <div className="h-1 bg-[#e7ebe7]"><div className="demo-guide-progress h-full bg-[#48b889]" style={{ width: `${((step + 1) / 8) * 100}%` }} /></div>
      <div key={`${step}-${analysisDone ? "done" : "active"}`} className="demo-guide-content p-4">
        {step === 0 && <div><p className="text-sm font-bold">Try the product—no account needed</p><p className="mt-2 text-xs leading-5 text-[#69756e]">I’ll help you create a sample company, choose a real documentation pack, generate 12 customer cases, and run a complete churn-risk workflow.</p><Button className="demo-guide-primary mt-4 w-full" onClick={() => void update({ guideStep: 1 })}>Start interactive demo</Button></div>}

        {step === 1 && (
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#177553]" />
              <p className="text-sm font-bold">Set up a sample company</p>
            </div>
            <p className="mt-2 text-[11px] leading-[1.55] text-[#69756e]">
              This creates the temporary company profile RetainAI works for. The agent uses it to understand the product, generate relevant customer scenarios, and write responses in the right business context.
            </p>
            <div className="mt-3 space-y-2.5">
              <label className="block">
                <span className="mb-1 block text-[10px] font-bold text-[#53645b]">Company name</span>
                <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="h-11 w-full rounded-lg border px-3 text-xs outline-none focus:ring-2 focus:ring-[#177553]/20" placeholder="e.g. RetainAI Labs" />
              </label>
              <label className="block">
                <span className="mb-1 block text-[10px] font-bold text-[#53645b]">Product the customers use</span>
                <input value={productName} onChange={(e) => setProductName(e.target.value)} className="h-11 w-full rounded-lg border px-3 text-xs outline-none focus:ring-2 focus:ring-[#177553]/20" placeholder="e.g. Customer Success Cloud" />
              </label>
              <label className="block">
                <span className="mb-1 block text-[10px] font-bold text-[#53645b]">Business context</span>
                <textarea value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} className="min-h-16 w-full resize-none rounded-lg border p-3 text-xs leading-4 outline-none focus:ring-2 focus:ring-[#177553]/20" placeholder="What does the company do and who does it help?" />
              </label>
            </div>
            <div className="mt-3 rounded-xl border border-[#dce9e1] bg-[#f4f9f6] p-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#668074]">Used throughout the demo</p>
              <p className="mt-1.5 text-[10px] leading-4 text-[#53665c]">Customer cases · risk analysis · recommendations · email drafts</p>
            </div>
            <p className="mt-2 text-[9px] leading-4 text-[#8a958f]">Everything stays inside this anonymous demo and is removed when you reset it.</p>
            <Button className="demo-guide-primary mt-3 w-full" disabled={busy || !companyName || !productName} onClick={() => void update({ companyName, productName, companyDescription, guideStep: 2 })}>{busy && <LoaderCircle className="h-4 w-4 animate-spin" />} Save company profile</Button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex items-center gap-2">
              <BookOpenCheck className="h-4 w-4 text-[#177553]" />
              <p className="text-sm font-bold">Choose a documentation pack</p>
            </div>
            <p className="mt-2 text-[11px] leading-[1.55] text-[#69756e]">
              A documentation pack is the trusted knowledge the agent is allowed to use—product guides, policies, billing rules, and support instructions.
            </p>
            <div className="my-3 rounded-xl border border-[#dce9e1] bg-[#f4f9f6] p-3">
              <div className="flex items-start gap-2.5">
                <Database className="mt-0.5 h-4 w-4 shrink-0 text-[#177553]" />
                <div>
                  <p className="text-[10px] font-bold text-[#32483c]">Why the AI needs it</p>
                  <p className="mt-1 text-[10px] leading-4 text-[#617168]">RetainAI searches this knowledge before answering, so recommendations are grounded in approved information and can show their sources instead of guessing.</p>
                </div>
              </div>
            </div>
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.1em] text-[#758078]">Choose what to load into Knowledge Base</p>
            <div className="space-y-2">
              {docPacks.map((pack) => (
                <button key={pack.id} disabled={busy} onClick={() => void update({ documentationPack: pack.id, guideStep: 3 })} className="flex min-h-14 w-full items-center gap-3 rounded-lg border p-3 text-left hover:border-[#7fb59a] hover:bg-[#f3f9f6]">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eef5f1]"><BookOpenCheck className="h-4 w-4 text-[#177553]" /></span>
                  <span>
                    <span className="block text-xs font-bold">{pack.name}</span>
                    <span className="mt-0.5 block text-[10px] leading-4 text-[#7e8982]">{pack.description}</span>
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-[9px] leading-4 text-[#8a958f]">For the public demo, these curated packs replace uploading private company files.</p>
          </div>
        )}

        {step === 3 && <div><div className="mb-3 flex items-center gap-2"><Database className="h-4 w-4 text-[#177553]" /><p className="text-sm font-bold">Create the customer portfolio</p></div><p className="text-xs leading-5 text-[#69756e]">Generate 12 fictional B2B customers with churn risks, expansion signals, billing problems, onboarding needs, and product questions.</p><Button className="demo-guide-primary mt-4 w-full" disabled={busy} onClick={() => void generate()}>{busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} {busy ? "Generating customer cases…" : "Generate 12 customers"}</Button></div>}

        {step === 4 && <div><p className="text-sm font-bold">Customer portfolio created</p><p className="mt-2 text-xs leading-5 text-[#69756e]">You now have {snapshot.workspace.customerCount} customers and {snapshot.workspace.conversationCount} messages. Next, see how RetainAI organizes their health scores, risks, renewals, and usage changes.</p><Button className="mt-4 w-full" disabled={busy} onClick={() => void openCustomerPortfolio()}>{busy && <LoaderCircle className="h-4 w-4 animate-spin" />} Explore customer portfolio</Button></div>}

        {step === 5 && <div><p className="text-sm font-bold">{analysisDone ? "Send the draft for approval" : pathname === "/customers" ? "Explore the customer portfolio" : "Analyze the first customer message"}</p><p className="mt-2 text-xs leading-5 text-[#69756e]">{analysisDone ? <>Review the evidence and email draft, then click <strong>Add to approvals</strong>. The agent cannot send it by itself.</> : pathname === "/customers" ? <>Review the customer signals on this page. When you are ready, continue to the Inbox to see how RetainAI handles a real cancellation message.</> : <>Open the cancellation message and click <strong>Analyze message</strong>. RetainAI will inspect customer signals, policy guidance, and prepare a retention response.</>}</p>{pathname !== "/inbox" ? <Button className="mt-4 w-full" onClick={() => analysisDone ? router.push("/inbox") : openCustomerInbox()}>{analysisDone ? "Return to Inbox" : "Continue to customer inbox"}</Button> : <Button variant="outline" className="mt-4 w-full" onClick={dismissAssistant}>{analysisDone ? "Show analysis and draft" : "Show message to analyze"}</Button>}</div>}

        {step === 6 && (
          <div>
            <p className="text-sm font-bold">{approvalReviewed ? "Approval decision recorded" : "Review the human approval step"}</p>
            <p className="mt-2 text-xs leading-5 text-[#69756e]">
              {approvalReviewed
                ? "The proposed customer action has been reviewed by a human. RetainAI can now close the workflow with a complete audit trail."
                : pathname === "/approvals"
                  ? "Review the generated action below, then approve or reject it. The demo cannot finish until a human makes the decision."
                  : "Open the approval queue and review the AI-proposed action. Nothing can be sent—and the demo cannot finish—until you approve or reject it."}
            </p>
            {approvalReviewed
              ? <Button className="mt-4 w-full" disabled={busy} onClick={() => void update({ completed: true })}>{busy && <LoaderCircle className="h-4 w-4 animate-spin" />} Finish demo</Button>
              : pathname !== "/approvals" ? <Button className="demo-guide-primary mt-4 w-full" onClick={openApprovals}><CheckSquare2 className="h-4 w-4" /> Open approvals</Button> : <Button variant="outline" className="mt-4 w-full" onClick={dismissAssistant}>Show approval queue</Button>}
          </div>
        )}

        {step >= 7 && <div><span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#e9f6ef] text-[#177553]"><Check className="h-5 w-5" /></span><p className="text-sm font-bold">Demo complete</p><p className="mt-2 text-xs leading-5 text-[#69756e]">You completed the RetainAI workflow. Resetting removes this anonymous workspace and restores the original demo state.</p><Button variant="outline" className="mt-4 w-full" disabled={busy} onClick={() => void reset()}>{busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Reset demo</Button></div>}
      </div>
      </aside>
    </>
  );
}
