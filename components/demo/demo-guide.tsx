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

export function DemoGuide() {
  const router = useRouter();
  const pathname = usePathname();
  const [snapshot, setSnapshot] = useState<DemoSnapshot | null>(null);
  const [open, setOpen] = useState(true);
  const [busy, setBusy] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);
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

  async function reset() {
    setBusy(true);
    try {
      const response = await fetch("/api/demo/reset", { method: "POST" });
      setSnapshot((await response.json()) as DemoSnapshot);
      setOpen(true);
      router.push("/");
      router.refresh();
    } finally { setBusy(false); }
  }

  useEffect(() => {
    const analyzed = () => setAnalysisDone(true);
    const approved = () => void update({ guideStep: 6 });
    window.addEventListener("retainai:analysis-complete", analyzed);
    window.addEventListener("retainai:approval-created", approved);
    return () => {
      window.removeEventListener("retainai:analysis-complete", analyzed);
      window.removeEventListener("retainai:approval-created", approved);
    };
  });

  if (!snapshot) return <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl border bg-white px-4 py-3 text-xs font-semibold shadow-xl"><LoaderCircle className="h-4 w-4 animate-spin text-[#177553]" /> Preparing your demo…</div>;
  const step = snapshot.workspace.guideStep;

  if (!open) {
    return <button onClick={() => setOpen(true)} className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#177553] px-4 py-3 text-xs font-bold text-white shadow-xl"><Sparkles className="h-4 w-4" /> Demo assistant <ChevronDown className="h-4 w-4 rotate-180" /></button>;
  }

  return (
    <aside className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-[380px] overflow-hidden rounded-2xl border border-[#cddbd3] bg-white shadow-[0_24px_70px_rgba(20,42,30,0.2)]">
      <header className="flex items-center gap-3 bg-[#132019] px-4 py-3.5 text-white">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#48b889] text-[#102018]"><Sparkles className="h-4 w-4" /></span>
        <div className="flex-1"><p className="text-xs font-bold">RetainAI demo assistant</p><p className="mt-0.5 text-[10px] text-[#aebeb5]">Step {Math.min(step + 1, 8)} of 8 · Anonymous sandbox</p></div>
        <button onClick={() => setOpen(false)} aria-label="Minimize demo assistant" className="rounded-md p-1 text-[#aebeb5] hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button>
      </header>
      <div className="h-1 bg-[#e7ebe7]"><div className="h-full bg-[#48b889] transition-all" style={{ width: `${((step + 1) / 8) * 100}%` }} /></div>
      <div className="p-4">
        {step === 0 && <div><p className="text-sm font-bold">Try the product—no account needed</p><p className="mt-2 text-xs leading-5 text-[#69756e]">I’ll help you create a sample company, choose a real documentation pack, generate 12 customer cases, and run a complete churn-risk workflow.</p><Button className="mt-4 w-full" onClick={() => void update({ guideStep: 1 })}>Start interactive demo</Button></div>}

        {step === 1 && <div><div className="mb-3 flex items-center gap-2"><Building2 className="h-4 w-4 text-[#177553]" /><p className="text-sm font-bold">Set up a sample company</p></div><div className="space-y-2"><input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="h-9 w-full rounded-lg border px-3 text-xs outline-none focus:ring-2 focus:ring-[#177553]/20" placeholder="Company name" /><input value={productName} onChange={(e) => setProductName(e.target.value)} className="h-9 w-full rounded-lg border px-3 text-xs outline-none focus:ring-2 focus:ring-[#177553]/20" placeholder="Product name" /><textarea value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} className="min-h-20 w-full resize-none rounded-lg border p-3 text-xs leading-4 outline-none focus:ring-2 focus:ring-[#177553]/20" placeholder="What does the company do?" /></div><Button className="mt-3 w-full" disabled={busy || !companyName || !productName} onClick={() => void update({ companyName, productName, companyDescription, guideStep: 2 })}>{busy && <LoaderCircle className="h-4 w-4 animate-spin" />} Continue</Button></div>}

        {step === 2 && <div><div className="mb-2 flex items-center gap-2"><BookOpenCheck className="h-4 w-4 text-[#177553]" /><p className="text-sm font-bold">Choose a documentation pack</p></div><p className="mb-3 text-[11px] leading-4 text-[#758078]">For this demo, use a curated public documentation source instead of uploading company files.</p><div className="space-y-2">{docPacks.map((pack) => <button key={pack.id} disabled={busy} onClick={() => void update({ documentationPack: pack.id, guideStep: 3 })} className="flex w-full items-center gap-3 rounded-lg border p-3 text-left hover:border-[#7fb59a] hover:bg-[#f3f9f6]"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eef5f1]"><BookOpenCheck className="h-4 w-4 text-[#177553]" /></span><span><span className="block text-xs font-bold">{pack.name}</span><span className="mt-0.5 block text-[10px] text-[#7e8982]">{pack.description}</span></span></button>)}</div></div>}

        {step === 3 && <div><div className="mb-3 flex items-center gap-2"><Database className="h-4 w-4 text-[#177553]" /><p className="text-sm font-bold">Create the customer portfolio</p></div><p className="text-xs leading-5 text-[#69756e]">Generate 12 fictional B2B customers with churn risks, expansion signals, billing problems, onboarding needs, and product questions.</p><Button className="mt-4 w-full" disabled={busy} onClick={() => void generate()}>{busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} {busy ? "Generating customer cases…" : "Generate 12 customers"}</Button></div>}

        {step === 4 && <div><p className="text-sm font-bold">Customer portfolio created</p><p className="mt-2 text-xs leading-5 text-[#69756e]">You now have {snapshot.workspace.customerCount} customers and {snapshot.workspace.conversationCount} messages. Review their health scores, risks, renewals, and usage changes.</p><Button className="mt-4 w-full" onClick={() => { void update({ guideStep: 5 }); router.push("/inbox"); }}>Open customer inbox</Button></div>}

        {step === 5 && <div><p className="text-sm font-bold">{analysisDone ? "Send the draft for approval" : "Analyze the first customer message"}</p><p className="mt-2 text-xs leading-5 text-[#69756e]">{analysisDone ? <>Review the evidence and email draft, then click <strong>Add to approvals</strong>. The agent cannot send it by itself.</> : <>Open the cancellation message and click <strong>Analyze message</strong>. RetainAI will inspect customer signals, policy guidance, and prepare a retention response.</>}</p>{pathname !== "/inbox" && <Button className="mt-4 w-full" onClick={() => router.push("/inbox")}>Go to Inbox</Button>}</div>}

        {step === 6 && <div><p className="text-sm font-bold">Review the human approval step</p><p className="mt-2 text-xs leading-5 text-[#69756e]">The AI may draft an action, but it cannot send customer communication without human approval.</p><div className="mt-4 flex gap-2"><Button variant="outline" className="flex-1" onClick={() => router.push("/approvals")}>Open approvals</Button><Button className="flex-1" disabled={busy} onClick={() => void update({ completed: true })}>Finish demo</Button></div></div>}

        {step >= 7 && <div><span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#e9f6ef] text-[#177553]"><Check className="h-5 w-5" /></span><p className="text-sm font-bold">Demo complete</p><p className="mt-2 text-xs leading-5 text-[#69756e]">You completed the RetainAI workflow. Resetting removes this anonymous workspace and restores the original demo state.</p><Button variant="outline" className="mt-4 w-full" disabled={busy} onClick={() => void reset()}>{busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Reset demo</Button></div>}
      </div>
    </aside>
  );
}
