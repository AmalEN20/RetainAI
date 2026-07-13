import type { Metadata } from "next";
import { ArrowDown, ArrowUp, Filter, MoreHorizontal, Plus, Search, Users } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { customers } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Customers" };

export default function CustomersPage() {
  return (
    <div className="page-enter space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="mb-1 flex items-center gap-1.5 text-sm font-medium text-[#728078]"><Users className="h-4 w-4" /> Customer portfolio</p><h1 className="text-2xl font-bold tracking-[-0.03em] md:text-[28px]">Customers</h1><p className="mt-1.5 text-sm text-[#748078]">Monitor health, product usage, and renewal risk.</p></div>
        <Button><Plus className="h-4 w-4" /> Add customer</Button>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[{label:"Total customers",value:"128",sub:"+6 this month"},{label:"Healthy",value:"96",sub:"75% of portfolio"},{label:"At risk",value:"12",sub:"4 high priority"},{label:"Renewing soon",value:"18",sub:"Next 30 days"}].map((item) => <Card key={item.label} className="px-4 py-3.5"><p className="text-[11px] font-semibold text-[#7b867f]">{item.label}</p><p className="mt-2 text-2xl font-bold tracking-[-0.04em]">{item.value}</p><p className="mt-1 text-[10px] text-[#929b95]">{item.sub}</p></Card>)}
      </section>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
          <div className="flex h-9 flex-1 items-center gap-2 rounded-lg border bg-[#fafbf8] px-3 sm:max-w-sm"><Search className="h-4 w-4 text-[#8b958e]" /><input className="w-full bg-transparent text-xs outline-none placeholder:text-[#a0a8a2]" placeholder="Search by company or contact…" /></div>
          <div className="ml-auto flex gap-2"><Button variant="outline" size="sm"><Filter className="h-3.5 w-3.5" /> Filter</Button><Button variant="outline" size="sm">All segments</Button></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead><tr className="border-b bg-[#fafbf8] text-[10px] font-bold uppercase tracking-[0.08em] text-[#929b95]"><th className="px-5 py-3">Customer</th><th className="px-3 py-3">Plan</th><th className="px-3 py-3">Health score</th><th className="px-3 py-3">Risk</th><th className="px-3 py-3">Usage change</th><th className="px-3 py-3">Renewal</th><th className="px-3 py-3">Last activity</th><th className="w-12 px-3 py-3" /></tr></thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.name} className="border-b last:border-0 hover:bg-[#fafbf8]">
                  <td className="px-5 py-4"><div className="flex items-center gap-3"><Avatar initials={customer.initials} /><div><p className="text-xs font-bold">{customer.name}</p><p className="mt-0.5 text-[10px] text-[#8b958e]">{customer.contact} · {customer.email}</p></div></div></td>
                  <td className="px-3 py-4"><Badge tone={customer.plan === "Enterprise" ? "blue" : "neutral"}>{customer.plan}</Badge></td>
                  <td className="px-3 py-4"><div className="flex items-center gap-2"><div className="h-1.5 w-14 rounded-full bg-[#e8ebe6]"><div className={`h-full rounded-full ${customer.health < 45 ? "bg-[#d65c4a]" : customer.health < 70 ? "bg-[#d6a437]" : "bg-[#3ba273]"}`} style={{width:`${customer.health}%`}} /></div><span className="text-xs font-bold">{customer.health}</span></div></td>
                  <td className="px-3 py-4"><Badge tone={customer.risk === "High" ? "high" : customer.risk === "Medium" ? "medium" : "low"}>{customer.risk}</Badge></td>
                  <td className={`px-3 py-4 text-xs font-bold ${customer.change < 0 ? "text-[#b74b3a]" : "text-[#24805d]"}`}><span className="inline-flex items-center gap-1">{customer.change < 0 ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />}{Math.abs(customer.change)}%</span></td>
                  <td className="px-3 py-4 text-xs text-[#5d6961]">{customer.renewal}</td><td className="px-3 py-4 text-xs text-[#7d8780]">{customer.activity}</td><td className="px-3 py-4"><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t px-5 py-3 text-[11px] text-[#87918a]"><span>Showing 6 of 128 customers</span><div className="flex gap-2"><Button variant="outline" size="sm" disabled>Previous</Button><Button variant="outline" size="sm">Next</Button></div></div>
      </Card>
    </div>
  );
}
