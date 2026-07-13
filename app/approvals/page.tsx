import type { Metadata } from "next";
import { Check, CheckSquare2, Clock3, MoreHorizontal, ShieldCheck, X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { approvals } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Approvals" };

export default function ApprovalsPage() {
  return (
    <div className="page-enter space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="mb-1 flex items-center gap-1.5 text-sm font-medium text-[#728078]"><CheckSquare2 className="h-4 w-4" /> Human-in-the-loop</p><h1 className="text-2xl font-bold tracking-[-0.03em] md:text-[28px]">Approvals</h1><p className="mt-1.5 text-sm text-[#748078]">Review AI-proposed actions before anything reaches a customer.</p></div>
        <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-[11px] font-semibold text-[#536259]"><ShieldCheck className="h-4 w-4 text-[#177553]" /> No action executes automatically</div>
      </section>

      <div className="grid gap-3 sm:grid-cols-3"><Card className="p-4"><p className="text-[11px] font-semibold text-[#7c8780]">Pending review</p><p className="mt-2 text-2xl font-bold">3</p><p className="mt-1 text-[10px] text-[#929b95]">1 high-priority email</p></Card><Card className="p-4"><p className="text-[11px] font-semibold text-[#7c8780]">Approved today</p><p className="mt-2 text-2xl font-bold">8</p><p className="mt-1 text-[10px] text-[#24805d]">Average review: 4 min</p></Card><Card className="p-4"><p className="text-[11px] font-semibold text-[#7c8780]">Rejected today</p><p className="mt-2 text-2xl font-bold">1</p><p className="mt-1 text-[10px] text-[#929b95]">Draft returned for editing</p></Card></div>

      <div className="space-y-3">
        {approvals.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="flex flex-col gap-4 p-5 xl:flex-row xl:items-center">
              <div className="flex min-w-0 flex-1 items-start gap-3"><Avatar initials={item.initials} className="h-10 w-10" /><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-bold">{item.action}</h2><Badge tone={item.risk === "High" ? "high" : "medium"}>{item.risk} risk</Badge></div><p className="mt-1.5 text-xs leading-5 text-[#68746c]">{item.description}</p><div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[#909992]"><span className="font-semibold text-[#637068]">{item.customer}</span><span>Contact: {item.owner}</span><span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" /> {item.created}</span></div></div></div>
              <div className="flex shrink-0 items-center gap-2 border-t pt-4 xl:border-0 xl:pt-0"><Button variant="danger" size="sm"><X className="h-3.5 w-3.5" /> Reject</Button><Button variant="outline" size="sm">Edit draft</Button><Button size="sm"><Check className="h-3.5 w-3.5" /> Approve</Button><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="border-dashed bg-transparent p-5 text-center"><ShieldCheck className="mx-auto h-6 w-6 text-[#8da098]" /><h2 className="mt-2 text-xs font-bold">Designed for safe automation</h2><p className="mx-auto mt-1 max-w-xl text-[11px] leading-5 text-[#7f8983]">RetainAI prepares customer-facing actions but always requires a human decision. The future AI workflow will log context, sources, edits, and the final approval.</p></Card>
    </div>
  );
}
