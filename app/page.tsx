import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, Inbox, Sparkles, TrendingDown, Users } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { listApprovals, listConversations, listCustomers } from "@/lib/data/repository";

export const metadata: Metadata = { title: "Dashboard" };

const toneClasses = {
  green: "bg-[#e9f6ef] text-[#177553]",
  red: "bg-[#fff0ed] text-[#b74b3a]",
  blue: "bg-[#edf3ff] text-[#4670aa]",
  amber: "bg-[#fff6df] text-[#9a711a]",
};

export default async function DashboardPage() {
  const [customers, conversations, approvals] = await Promise.all([listCustomers(), listConversations(), listApprovals()]);
  const atRisk = customers.filter((customer) => customer.risk !== "Low").slice(0, 4);
  const activity = customers.slice(0, 4).map((customer) => ({
    title: customer.risk === "High" ? "Risk signal detected" : customer.change > 0 ? "Positive usage signal" : "Health score calculated",
    customer: customer.name,
    time: customer.activity,
    tone: customer.risk === "High" ? "red" : customer.risk === "Medium" ? "amber" : "green",
  }));
  const stats = [
    { label: "Customers", value: String(customers.length), detail: "Connected portfolio", icon: Users, tone: "green" },
    { label: "At risk", value: String(customers.filter((customer) => customer.risk !== "Low").length), detail: `${customers.filter((customer) => customer.risk === "High").length} need attention`, icon: TrendingDown, tone: "red" },
    { label: "Open conversations", value: String(conversations.length), detail: `${conversations.filter((conversation) => conversation.unread).length} unread`, icon: Inbox, tone: "blue" },
    { label: "Pending approvals", value: String(approvals.filter((approval) => approval.status === "pending").length), detail: "Human review required", icon: Clock3, tone: "amber" },
  ];

  return (
    <div className="page-enter space-y-6">
      <section data-demo-target="dashboard-overview" className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-sm font-medium text-[#728078]">Monday, July 13</p>
          <h1 className="text-2xl font-bold tracking-[-0.03em] text-[#17221c] md:text-[28px]">Welcome to RetainAI</h1>
          <p className="mt-1.5 text-sm text-[#748078]">{customers.length ? "Here is what needs your attention today." : "Follow the demo assistant to build your temporary workspace."}</p>
        </div>
        <Button className="w-full sm:w-auto" asChild><Link href="/inbox"><Sparkles className="h-4 w-4" /> Review AI insights</Link></Button>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#748078]">{stat.label}</span>
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${toneClasses[stat.tone as keyof typeof toneClasses]}`}><Icon className="h-4 w-4" /></span>
              </div>
              <div className="text-[28px] font-bold leading-none tracking-[-0.04em]">{stat.value}</div>
              <div className="mt-2 text-[11px] font-medium text-[#8a948d]">{stat.detail}</div>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.55fr_0.85fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <div><h2 className="text-sm font-bold">Customers needing attention</h2><p className="mt-1 text-xs text-[#7c8780]">Prioritized by health score and renewal date</p></div>
            <Button variant="ghost" size="sm" asChild><Link href="/customers">View all <ArrowRight className="h-3.5 w-3.5" /></Link></Button>
          </CardHeader>
          <div className="divide-y sm:hidden">
            {atRisk.map((customer) => (
              <article key={customer.name} className="p-4">
                <div className="flex items-center gap-3"><Avatar initials={customer.initials} className="h-11 w-11" /><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><h3 className="truncate text-sm font-bold">{customer.name}</h3><Badge tone={customer.risk === "High" ? "high" : "medium"}>{customer.risk}</Badge></div><p className="mt-1 truncate text-[10px] text-[#8b958e]">{customer.contact}</p></div></div>
                <div className="mt-3 grid grid-cols-3 rounded-xl bg-[#f7f8f5] p-3 text-center"><div><p className="text-[9px] uppercase text-[#929b95]">Health</p><p className="mt-1 text-sm font-bold">{customer.health}</p></div><div><p className="text-[9px] uppercase text-[#929b95]">Renewal</p><p className="mt-1 text-[11px] font-bold">{customer.renewal}</p></div><div><p className="text-[9px] uppercase text-[#929b95]">Usage</p><p className="mt-1 text-sm font-bold text-[#b74b3a]">{customer.change}%</p></div></div>
              </article>
            ))}
          </div>
          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[640px] text-left">
              <thead><tr className="border-b bg-[#fafbf8] text-[10px] font-bold uppercase tracking-[0.08em] text-[#929b95]"><th className="px-5 py-3">Customer</th><th className="px-3 py-3">Health</th><th className="px-3 py-3">Risk</th><th className="px-3 py-3">Renewal</th><th className="px-5 py-3 text-right">Usage</th></tr></thead>
              <tbody>
                {atRisk.map((customer) => (
                  <tr key={customer.name} className="border-b last:border-0 hover:bg-[#fafbf8]">
                    <td className="px-5 py-3.5"><div className="flex items-center gap-3"><Avatar initials={customer.initials} /><div><div className="text-xs font-bold text-[#253029]">{customer.name}</div><div className="mt-0.5 text-[10px] text-[#8b958e]">{customer.contact}</div></div></div></td>
                    <td className="px-3 py-3.5"><div className="flex items-center gap-2"><div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#e8ebe6]"><div className={`h-full rounded-full ${customer.health < 45 ? "bg-[#d65c4a]" : "bg-[#d6a437]"}`} style={{ width: `${customer.health}%` }} /></div><span className="text-xs font-bold">{customer.health}</span></div></td>
                    <td className="px-3 py-3.5"><Badge tone={customer.risk === "High" ? "high" : "medium"}>{customer.risk}</Badge></td>
                    <td className="px-3 py-3.5 text-xs text-[#5d6961]">{customer.renewal}</td>
                    <td className="px-5 py-3.5 text-right text-xs font-bold text-[#b74b3a]">{customer.change}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader><div><h2 className="text-sm font-bold">Copilot activity</h2><p className="mt-1 text-xs text-[#7c8780]">Latest signals and actions</p></div><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8f6ef] text-[#177553]"><Sparkles className="h-4 w-4" /></span></CardHeader>
          <CardContent className="space-y-1 py-3">
            {activity.map((item, index) => (
              <div key={`${item.title}-${item.customer}`} className="relative flex gap-3 py-3">
                {index < activity.length - 1 && <span className="absolute left-[7px] top-8 h-[28px] w-px bg-[#e3e7e2]" />}
                <span className={`mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-[3px] border-white ring-1 ${item.tone === "red" ? "bg-[#d65c4a] ring-[#edc7c0]" : item.tone === "green" ? "bg-[#42a978] ring-[#bee2d0]" : item.tone === "amber" ? "bg-[#d8a33a] ring-[#eddcaf]" : "bg-[#5d82b7] ring-[#cbd8ea]"}`} />
                <div className="min-w-0"><p className="text-xs font-semibold text-[#2d3832]">{item.title}</p><p className="mt-1 text-[10px] text-[#8a948e]">{item.customer} · {item.time}</p></div>
              </div>
            ))}
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-[#eef7f2] px-3 py-2.5 text-[11px] font-medium text-[#32654f]"><CheckCircle2 className="h-4 w-4 text-[#20865d]" /> {customers.length ? "Anonymous demo data saved" : "Ready to create your demo portfolio"}</div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
