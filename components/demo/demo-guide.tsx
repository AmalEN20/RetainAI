"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BookOpenCheck, Building2, Check, ChevronDown, Database, LoaderCircle, RefreshCw, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DemoDocumentationPack, DemoSnapshot } from "@/lib/demo/types";

const docPacks: { id: Exclude<DemoDocumentationPack, "">; name: string; description: string }[] = [
  { id: "github", name: "GitHub Docs", description: "Developer support and API workflows" },
  { id: "stripe", name: "Stripe Docs", description: "Billing, subscriptions, and payments" },
  { id: "google-workspace", name: "Google Workspace", description: "Admin, collaboration, and productivity" },
];

type TransitionStage = 1 | 2 | 3 | 4 | 5 | 6 | 7 | "analysis" | null;

const transitionMessages: Record<Exclude<TransitionStage, null>, { title: string; happened: string; next: string }> = {
  1: { title: "Interactive demo started", happened: "A private, anonymous workspace is ready for this session.", next: "Next, create a sample company profile so RetainAI understands the business." },
  2: { title: "Company profile created", happened: "RetainAI now has the product name and business context for this demo.", next: "Next, connect a public documentation pack to ground future answers." },
  3: { title: "Documentation connected", happened: "A curated knowledge source is now available to the customer-success workflow.", next: "Next, generate a realistic portfolio with different customer situations." },
  4: { title: "Customer data generated", happened: "RetainAI created 12 customers and 12 messages with churn, billing, adoption, and expansion cases.", next: "Next, review the portfolio and open the customer inbox." },
  5: { title: "Customer inbox opened", happened: "The cancellation-risk conversation is ready for investigation.", next: "Next, run the AI analysis and inspect the evidence it retrieves." },
  analysis: { title: "AI analysis completed", happened: "RetainAI reviewed account signals, support history, subscription data, and approved knowledge.", next: "Next, review the generated response and add it to the human approval queue." },
  6: { title: "Approval request created", happened: "The proposed customer response was saved safely without being sent automatically.", next: "Next, open Approvals, review the action, and finish the demo." },
  7: { title: "Demo completed", happened: "You finished the complete RetainAI customer-success workflow.", next: "You can explore the product or reset the workspace and run the demo again." },
};

export function DemoGuide() {
  const router = useRouter();
  const pathname = usePathname();
  const [snapshot, setSnapshot] = useState<DemoSnapshot | null>(null);
  const [open, setOpen] = useState(true);
  const [busy, setBusy] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);
  const [transitionStage, setTransitionStage] = useState<TransitionStage>(null);
  const [companyName, setCompanyName] = useState("RetainAI Labs");
  const [productName, setProductName] = useState("Customer Success Cloud");
  const [companyDescription, setCompanyDescription] = useState("A B2B SaaS platform that helps customer success teams reduce churn and improve adoption.");

  useEffect(() => {
    let active = true;
    void fetch("/api/demo", { cache: "no-store" })
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

  async function update(body: Record<string, unknown>, completedStage: TransitionStage = null) {
    setBusy(true);
    try {
      const response = await fetch("/api/demo", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      setSnapshot((await response.json()) as DemoSnapshot);
      if (completedStage) setTransitionStage(completedStage);
      router.refresh();
    } finally { setBusy(false); }
  }

  async function generate() {
    setBusy(true);
    try {
      const response = await fetch("/api/demo/generate", { method: "POST" });
      const data = (await response.json()) as DemoSnapshot;
      setSnapshot(data);
      setTransitionStage(4);
      router.push("/customers");
      router.refresh();
    } finally { setBusy(false); }
  }

  async function reset() {
    setBusy(true);
    try {
      const response = await fetch("/api/demo/reset", { method: "POST" });
      setSnapshot((await response.json()) as DemoSnapshot);
      setTransitionStage(null);
      setAnalysisDone(false);
      setOpen(true);
      router.push("/");
      router.refresh();
    } finally { setBusy(false); }
  }

  useEffect(() => {
    const analyzed = () => {
      setAnalysisDone(true);
      setTransitionStage("analysis");
    };
    const approved = () => void update({ guideStep: 6 }, 6);
    window.addEventListener("retainai:analysis-complete", analyzed);
    window.addEventListener("retainai:approval-created", approved);
    return () => {
      window.removeEventListener("retainai:analysis-complete", analyzed);
      window.removeEventListener("retainai:approval-created", approved);
    };
  });

  const step = snapshot?.workspace.guideStep ?? 0;

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

  return (
    <>
      {transitionStage && (
        <div className="demo-step-overlay fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="demo-step-title">
          <button className="absolute inset-0 bg-[#0d1812]/28 backdrop-blur-[3px]" onClick={() => setTransitionStage(null)} aria-label="Continue demo" />
          <section className="demo-step-modal relative w-full max-w-[500px] overflow-hidden rounded-3xl border border-white/60 bg-white shadow-[0_32px_100px_rgba(9,31,19,0.28)]">
            <div className="demo-step-glow" aria-hidden="true" />
            <div className="relative p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <span className="demo-step-check flex h-12 w-12 items-center justify-center rounded-2xl bg-[#dff3e8] text-[#177553]"><Check className="h-5 w-5" strokeWidth={2.5} /></span>
                <span className="rounded-full border bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#648072]">{transitionStage === "analysis" ? "AI workflow" : `Step ${transitionStage} complete`}</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#298160]">What just happened</p>
              <h2 id="demo-step-title" className="mt-2 text-2xl font-bold tracking-[-0.035em] text-[#17251d]">{transitionMessages[transitionStage].title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#617068]">{transitionMessages[transitionStage].happened}</p>
              <div className="mt-6 rounded-2xl border border-[#dce9e1] bg-[#f4f9f6] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6f8277]">What happens next</p>
                <p className="mt-2 text-xs font-semibold leading-5 text-[#30463a]">{transitionMessages[transitionStage].next}</p>
              </div>
              <Button className="mt-6 w-full" onClick={() => setTransitionStage(null)}>Continue demo</Button>
              <p className="mt-3 text-center text-[9px] text-[#96a199]">Press Esc to continue</p>
            </div>
          </section>
        </div>
      )}
      <aside className="demo-guide-card fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-[380px] overflow-hidden rounded-2xl border border-[#cddbd3] bg-white shadow-[0_18px_48px_rgba(20,42,30,0.16)]">
      <header className="flex items-center gap-3 bg-[#132019] px-4 py-3.5 text-white">
        <span className="demo-guide-spark flex h-8 w-8 items-center justify-center rounded-lg bg-[#48b889] text-[#102018]"><Sparkles className="h-4 w-4" /></span>
        <div className="flex-1"><p className="text-xs font-bold">RetainAI demo assistant</p><p className="mt-0.5 text-[10px] text-[#aebeb5]">Step {Math.min(step + 1, 8)} of 8 · Anonymous sandbox</p></div>
        <button onClick={() => setOpen(false)} aria-label="Minimize demo assistant" className="rounded-md p-1 text-[#aebeb5] hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button>
      </header>
      <div className="h-1 bg-[#e7ebe7]"><div className="demo-guide-progress h-full bg-[#48b889]" style={{ width: `${((step + 1) / 8) * 100}%` }} /></div>
      <div key={`${step}-${analysisDone ? "done" : "active"}`} className="demo-guide-content p-4">
        {step === 0 && <div><p className="text-sm font-bold">Try the product—no account needed</p><p className="mt-2 text-xs leading-5 text-[#69756e]">I’ll help you create a sample company, choose a real documentation pack, generate 12 customer cases, and run a complete churn-risk workflow.</p><Button className="demo-guide-primary mt-4 w-full" onClick={() => void update({ guideStep: 1 }, 1)}>Start interactive demo</Button></div>}

        {step === 1 && <div><div className="mb-3 flex items-center gap-2"><Building2 className="h-4 w-4 text-[#177553]" /><p className="text-sm font-bold">Set up a sample company</p></div><div className="space-y-2"><input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="h-9 w-full rounded-lg border px-3 text-xs outline-none focus:ring-2 focus:ring-[#177553]/20" placeholder="Company name" /><input value={productName} onChange={(e) => setProductName(e.target.value)} className="h-9 w-full rounded-lg border px-3 text-xs outline-none focus:ring-2 focus:ring-[#177553]/20" placeholder="Product name" /><textarea value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} className="min-h-20 w-full resize-none rounded-lg border p-3 text-xs leading-4 outline-none focus:ring-2 focus:ring-[#177553]/20" placeholder="What does the company do?" /></div><Button className="demo-guide-primary mt-3 w-full" disabled={busy || !companyName || !productName} onClick={() => void update({ companyName, productName, companyDescription, guideStep: 2 }, 2)}>{busy && <LoaderCircle className="h-4 w-4 animate-spin" />} Continue</Button></div>}

        {step === 2 && <div><div className="mb-2 flex items-center gap-2"><BookOpenCheck className="h-4 w-4 text-[#177553]" /><p className="text-sm font-bold">Choose a documentation pack</p></div><p className="mb-3 text-[11px] leading-4 text-[#758078]">For this demo, use a curated public documentation source instead of uploading company files.</p><div className="space-y-2">{docPacks.map((pack) => <button key={pack.id} disabled={busy} onClick={() => void update({ documentationPack: pack.id, guideStep: 3 }, 3)} className="flex w-full items-center gap-3 rounded-lg border p-3 text-left hover:border-[#7fb59a] hover:bg-[#f3f9f6]"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eef5f1]"><BookOpenCheck className="h-4 w-4 text-[#177553]" /></span><span><span className="block text-xs font-bold">{pack.name}</span><span className="mt-0.5 block text-[10px] text-[#7e8982]">{pack.description}</span></span></button>)}</div></div>}

        {step === 3 && <div><div className="mb-3 flex items-center gap-2"><Database className="h-4 w-4 text-[#177553]" /><p className="text-sm font-bold">Create the customer portfolio</p></div><p className="text-xs leading-5 text-[#69756e]">Generate 12 fictional B2B customers with churn risks, expansion signals, billing problems, onboarding needs, and product questions.</p><Button className="demo-guide-primary mt-4 w-full" disabled={busy} onClick={() => void generate()}>{busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} {busy ? "Generating customer cases…" : "Generate 12 customers"}</Button></div>}

        {step === 4 && <div><p className="text-sm font-bold">Customer portfolio created</p><p className="mt-2 text-xs leading-5 text-[#69756e]">You now have {snapshot.workspace.customerCount} customers and {snapshot.workspace.conversationCount} messages. Review their health scores, risks, renewals, and usage changes.</p><Button className="mt-4 w-full" onClick={() => { void update({ guideStep: 5 }, 5); router.push("/inbox"); }}>Open customer inbox</Button></div>}

        {step === 5 && <div><p className="text-sm font-bold">{analysisDone ? "Send the draft for approval" : "Analyze the first customer message"}</p><p className="mt-2 text-xs leading-5 text-[#69756e]">{analysisDone ? <>Review the evidence and email draft, then click <strong>Add to approvals</strong>. The agent cannot send it by itself.</> : <>Open the cancellation message and click <strong>Analyze message</strong>. RetainAI will inspect customer signals, policy guidance, and prepare a retention response.</>}</p>{pathname !== "/inbox" && <Button className="mt-4 w-full" onClick={() => router.push("/inbox")}>Go to Inbox</Button>}</div>}

        {step === 6 && <div><p className="text-sm font-bold">Review the human approval step</p><p className="mt-2 text-xs leading-5 text-[#69756e]">The AI may draft an action, but it cannot send customer communication without human approval.</p><div className="mt-4 flex gap-2"><Button variant="outline" className="flex-1" onClick={() => router.push("/approvals")}>Open approvals</Button><Button className="flex-1" disabled={busy} onClick={() => void update({ completed: true }, 7)}>Finish demo</Button></div></div>}

        {step >= 7 && <div><span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#e9f6ef] text-[#177553]"><Check className="h-5 w-5" /></span><p className="text-sm font-bold">Demo complete</p><p className="mt-2 text-xs leading-5 text-[#69756e]">You completed the RetainAI workflow. Resetting removes this anonymous workspace and restores the original demo state.</p><Button variant="outline" className="mt-4 w-full" disabled={busy} onClick={() => void reset()}>{busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Reset demo</Button></div>}
      </div>
      </aside>
    </>
  );
}
