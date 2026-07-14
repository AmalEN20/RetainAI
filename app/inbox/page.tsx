import type { Metadata } from "next";
import { Clock3, Inbox, Search, SlidersHorizontal } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { listConversations } from "@/lib/data/repository";
import { ConversationAnalysis } from "@/components/inbox/conversation-analysis";

export const metadata: Metadata = { title: "Inbox" };

export default async function InboxPage() {
  const conversations = await listConversations();
  const selected = conversations[0];
  if (!selected) {
    return (
      <div className="page-enter space-y-6">
        <section><p className="mb-1 flex items-center gap-1.5 text-sm font-medium text-[#728078]"><Inbox className="h-4 w-4" /> Unified inbox</p><h1 className="text-2xl font-bold tracking-[-0.03em] md:text-[28px]">Inbox</h1><p className="mt-1.5 text-sm text-[#748078]">Review customer messages and prepare the next best action.</p></section>
        <Card className="flex min-h-[480px] items-center justify-center p-8 text-center"><div><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#e9f6ef] text-[#177553]"><Inbox className="h-5 w-5" /></span><h2 className="mt-4 text-sm font-bold">Your demo inbox is empty</h2><p className="mt-2 max-w-sm text-xs leading-5 text-[#748078]">Use the demo assistant to create a company and generate customer cases.</p></div></Card>
      </div>
    );
  }
  return (
    <div className="page-enter space-y-6">
      <section><p className="mb-1 flex items-center gap-1.5 text-sm font-medium text-[#728078]"><Inbox className="h-4 w-4" /> Unified inbox</p><h1 className="text-2xl font-bold tracking-[-0.03em] md:text-[28px]">Inbox</h1><p className="mt-1.5 text-sm text-[#748078]">Review customer messages and prepare the next best action.</p></section>

      <Card className="grid min-h-[650px] overflow-hidden lg:grid-cols-[390px_1fr]">
        <section className="border-r">
          <div className="flex h-16 items-center gap-2 border-b px-4"><div className="flex h-9 flex-1 items-center gap-2 rounded-lg border bg-[#fafbf8] px-3"><Search className="h-4 w-4 text-[#8b958e]" /><input className="w-full bg-transparent text-xs outline-none" placeholder="Search conversations…" /></div><Button variant="outline" size="icon" className="h-9 w-9"><SlidersHorizontal className="h-4 w-4" /></Button></div>
          <div>
            {conversations.map((item) => (
              <article key={item.id} className={`relative flex gap-3 border-b p-4 ${item.id === selected.id ? "bg-[#edf6f1]" : "bg-white hover:bg-[#fafbf8]"}`}>
                {item.id === selected.id && <span className="absolute inset-y-0 left-0 w-0.5 bg-[#177553]" />}
                <Avatar initials={item.initials} />
                <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h2 className={`truncate text-xs ${item.unread ? "font-bold" : "font-semibold"}`}>{item.customer}</h2><span className="ml-auto shrink-0 text-[9px] text-[#929b95]">{item.time}</span></div><p className={`mt-1 truncate text-[11px] ${item.unread ? "font-semibold text-[#3d4942]" : "text-[#657068]"}`}>{item.subject}</p><p className="mt-1.5 line-clamp-2 text-[10px] leading-4 text-[#8a948e]">{item.preview}</p><div className="mt-2 flex items-center gap-1.5"><Badge tone={item.risk === "High" ? "high" : item.risk === "Medium" ? "medium" : "low"}>{item.risk}</Badge><Badge>{item.intent}</Badge></div></div>
              </article>
            ))}
          </div>
        </section>

        <section className="flex min-w-0 flex-col bg-[#fbfcf9]">
          <div className="flex flex-wrap items-center gap-3 border-b bg-white px-5 py-4"><Avatar initials={selected.initials} /><div><h2 className="text-sm font-bold">{selected.subject}</h2><p className="mt-0.5 text-[10px] text-[#87918b]">{selected.contact} at {selected.customer} · 9:42 AM</p></div><div className="ml-auto flex gap-2"><Badge tone="high">High risk</Badge><Button variant="outline" size="sm"><Clock3 className="h-3.5 w-3.5" /> Snooze</Button></div></div>
          <div className="flex-1 p-5 md:p-7">
            <div className="mx-auto max-w-3xl space-y-5">
              <div className="rounded-xl border bg-white p-5 shadow-sm"><div className="mb-4 flex items-center gap-3"><Avatar initials={selected.initials} /><div><p className="text-xs font-bold">{selected.contact}</p><p className="text-[10px] text-[#89938d]">Customer contact · to Customer Success</p></div></div><p className="whitespace-pre-line text-sm leading-6 text-[#465149]">Hi team,{"\n\n"}{selected.body}{"\n\n"}{selected.contact.split(" ")[0]}</p></div>
              <ConversationAnalysis conversationId={selected.id} customerId={selected.customerId} customer={selected.customer} initials={selected.initials} contact={selected.contact} />
            </div>
          </div>
        </section>
      </Card>
    </div>
  );
}
