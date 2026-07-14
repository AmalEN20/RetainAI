import type { Metadata } from "next";
import { CheckSquare2, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ApprovalBoard } from "@/components/approvals/approval-board";
import { listApprovals } from "@/lib/data/repository";

export const metadata: Metadata = { title: "Approvals" };

export default async function ApprovalsPage() {
  const approvals = await listApprovals();
  return (
    <div className="page-enter space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="mb-1 flex items-center gap-1.5 text-sm font-medium text-[#728078]"><CheckSquare2 className="h-4 w-4" /> Human-in-the-loop</p><h1 className="text-2xl font-bold tracking-[-0.03em] md:text-[28px]">Approvals</h1><p className="mt-1.5 text-sm text-[#748078]">Review AI-proposed actions before anything reaches a customer.</p></div>
        <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-[11px] font-semibold text-[#536259]"><ShieldCheck className="h-4 w-4 text-[#177553]" /> No action executes automatically</div>
      </section>

      <div data-demo-target="approvals-workspace"><ApprovalBoard initialItems={approvals} /></div>

      <Card className="border-dashed bg-transparent p-5 text-center"><ShieldCheck className="mx-auto h-6 w-6 text-[#8da098]" /><h2 className="mt-2 text-xs font-bold">Designed for safe automation</h2><p className="mx-auto mt-1 max-w-xl text-[11px] leading-5 text-[#7f8983]">RetainAI prepares customer-facing actions but always requires a human decision. Each run keeps safe summaries of its context, sources, edits, and final approval state.</p></Card>
    </div>
  );
}
