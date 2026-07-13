import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, Braces, CheckCircle2, Code2, ExternalLink, FlaskConical, Layers3, LockKeyhole, Sparkles, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Case Study",
  description: "How RetainAI combines tool calling, grounded retrieval, human approval, and deterministic evals in a portfolio-grade Customer Success Copilot.",
};

const decisions = [
  { icon: Wrench, title: "Validated tool calling", copy: "Five allowlisted read-only tools retrieve customer evidence and policy context. Unknown actions fail closed." },
  { icon: BookOpenCheck, title: "Grounded RAG", copy: "Every policy claim can carry a stable chunk ID and human-readable citation instead of relying on model memory." },
  { icon: LockKeyhole, title: "Human approval", copy: "Email drafts and business actions become review records. The agent never receives a send-email tool." },
  { icon: FlaskConical, title: "Measurable reliability", copy: "Nineteen deterministic checks cover schemas, retrieval relevance, citations, safe language, and prompt injection." },
];

const stack = ["Next.js", "TypeScript", "Responses API", "Zod", "Supabase-ready", "Tailwind", "GitHub Actions"];

export default function CaseStudyPage() {
  return (
    <div className="page-enter space-y-8 pb-8">
      <section className="relative overflow-hidden rounded-2xl bg-[#132019] px-6 py-8 text-white md:px-10 md:py-12">
        <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[#48b889]/15 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-[#5a7fb4]/10 blur-3xl" />
        <div className="relative max-w-4xl">
          <div className="flex flex-wrap items-center gap-2"><Badge tone="low">Portfolio case study</Badge><span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8fa298]">AI Engineering · 2026</span></div>
          <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-[1.08] tracking-[-0.045em] md:text-5xl">One CSM. More customer context. Zero unreviewed actions.</h1>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-[#b5c5bc] md:text-base">RetainAI is a production-minded Customer Success Copilot that investigates churn risk, retrieves approved policy, prepares a grounded recovery plan, and keeps every side effect behind human approval.</p>
          <div className="mt-7 flex flex-wrap gap-3"><Button asChild><Link href="/inbox"><Sparkles className="h-4 w-4" /> Run flagship demo <ArrowRight className="h-3.5 w-3.5" /></Link></Button><Button variant="outline" className="border-[#3d5347] bg-transparent text-white hover:bg-[#203329] hover:text-white" asChild><Link href="/runs"><FlaskConical className="h-4 w-4" /> Inspect evals</Link></Button><Button variant="ghost" className="text-[#bdd0c5] hover:bg-white/5 hover:text-white" asChild><a href="https://github.com/AmalEN20/RetainAI" target="_blank" rel="noreferrer"><Code2 className="h-4 w-4" /> Source code <ExternalLink className="h-3 w-3" /></a></Button></div>
        </div>
        <div className="relative mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 lg:grid-cols-4">{[{ value: "5", label: "validated tools" }, { value: "19/19", label: "eval checks" }, { value: "6", label: "max model turns" }, { value: "$0", label: "replay demo cost" }].map((item) => <div key={item.label} className="bg-[#18271f]/95 px-5 py-4"><p className="text-2xl font-bold tracking-[-0.04em] text-[#6dd2a6]">{item.value}</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#82968b]">{item.label}</p></div>)}</div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2"><Card className="p-6"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#b74b3a]">The problem</p><h2 className="mt-3 text-xl font-bold tracking-[-0.025em]">Churn signals are fragmented across five systems.</h2><p className="mt-3 text-sm leading-6 text-[#69756d]">Customer Success Managers manually combine emails, product adoption, subscription timing, support issues, and internal policies. Important risks arrive late, while generic AI replies can invent discounts or execute the wrong action.</p></Card><Card className="border-[#cfe6da] bg-[#f5fbf8] p-6"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#177553]">The outcome</p><h2 className="mt-3 text-xl font-bold tracking-[-0.025em]">A transparent investigation, not another chatbot.</h2><p className="mt-3 text-sm leading-6 text-[#5d7166]">The agent chooses evidence tools, retrieves approved guidance, exposes a safe execution trace, and produces an editable plan. A human remains responsible for every customer-facing action.</p></Card></section>

      <section><div className="mb-4"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#177553]">Flagship workflow</p><h2 className="mt-2 text-xl font-bold tracking-[-0.025em]">From cancellation email to approval-safe recovery plan</h2></div><Card className="overflow-hidden"><div className="grid gap-px bg-[#e1e5df] md:grid-cols-4">{[{ step: "01", title: "Message arrives", copy: "Customer explicitly considers cancellation." }, { step: "02", title: "Agent investigates", copy: "Profile, usage, billing, tickets, and policy." }, { step: "03", title: "Plan is grounded", copy: "Risks, actions, draft, citations, and trace." }, { step: "04", title: "Human decides", copy: "Approve, edit, reject, or undo the action." }].map((item) => <div key={item.step} className="relative bg-white p-5"><span className="text-[10px] font-bold text-[#46a77e]">{item.step}</span><h3 className="mt-3 text-sm font-bold">{item.title}</h3><p className="mt-2 text-[11px] leading-5 text-[#7a857e]">{item.copy}</p></div>)}</div></Card></section>

      <section><div className="mb-4"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#177553]">Engineering decisions</p><h2 className="mt-2 text-xl font-bold tracking-[-0.025em]">Built to create useful interview conversations</h2></div><div className="grid gap-3 md:grid-cols-2">{decisions.map((decision) => { const Icon = decision.icon; return <Card key={decision.title} className="flex gap-4 p-5"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf6ef] text-[#177553]"><Icon className="h-5 w-5" /></span><div><h3 className="text-sm font-bold">{decision.title}</h3><p className="mt-2 text-[11px] leading-5 text-[#738078]">{decision.copy}</p></div></Card>; })}</div></section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]"><Card className="overflow-hidden"><div className="border-b bg-[#fafbf8] p-5"><div className="flex items-center gap-2"><Layers3 className="h-4 w-4 text-[#177553]" /><h2 className="text-sm font-bold">Architecture at a glance</h2></div></div><div className="p-5"><div className="flex flex-col items-stretch gap-3 text-center text-[11px] font-semibold sm:flex-row sm:items-center"><span className="rounded-lg border bg-[#fafbf8] px-3 py-3">Customer message</span><ArrowRight className="mx-auto h-4 w-4 rotate-90 text-[#8c9890] sm:rotate-0" /><span className="rounded-lg border border-[#bcdccc] bg-[#edf8f2] px-3 py-3 text-[#28694e]">Responses API loop</span><ArrowRight className="mx-auto h-4 w-4 rotate-90 text-[#8c9890] sm:rotate-0" /><span className="rounded-lg border bg-[#fafbf8] px-3 py-3">5 read-only tools</span><ArrowRight className="mx-auto h-4 w-4 rotate-90 text-[#8c9890] sm:rotate-0" /><span className="rounded-lg border border-[#d9d1b5] bg-[#fffaf0] px-3 py-3 text-[#7d641d]">Approval queue</span></div><div className="mt-5 grid gap-2 sm:grid-cols-3">{["Shared Zod response contract", "Replay and live adapters", "Safe summaries, no chain-of-thought"].map((item) => <div key={item} className="flex items-center gap-2 rounded-lg bg-[#f7f8f5] px-3 py-2 text-[10px] text-[#647069]"><CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#299064]" /> {item}</div>)}</div></div></Card><Card className="p-5"><div className="flex items-center gap-2"><Braces className="h-4 w-4 text-[#4f75a7]" /><h2 className="text-sm font-bold">Core stack</h2></div><div className="mt-4 flex flex-wrap gap-2">{stack.map((item) => <Badge key={item} tone="neutral">{item}</Badge>)}</div><div className="mt-5 border-t pt-4"><p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#929b95]">Designed for</p><p className="mt-2 text-xs leading-5 text-[#66736b]">AI Engineer and Software Engineer interviews focused on agents, RAG, evaluation, system boundaries, and production safety.</p></div></Card></section>

      <section className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-[#cfe6da] bg-[#edf8f2] p-6 sm:flex-row sm:items-center"><div><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#177553]">Try the product</p><h2 className="mt-2 text-lg font-bold">See the complete workflow in under two minutes.</h2><p className="mt-1 text-xs text-[#68796f]">No account, API key, or paid service required.</p></div><Button asChild><Link href="/inbox"><Sparkles className="h-4 w-4" /> Start with the cancellation email <ArrowRight className="h-3.5 w-3.5" /></Link></Button></section>
    </div>
  );
}
