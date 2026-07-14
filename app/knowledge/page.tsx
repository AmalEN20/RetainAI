import type { Metadata } from "next";
import { BookOpenCheck, FileText, Layers3, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { KnowledgeSearch } from "@/components/knowledge/knowledge-search";
import { knowledgeChunks, knowledgeDocuments } from "@/lib/knowledge/documents";
import { searchKnowledgeBase } from "@/lib/knowledge/search";

export const metadata: Metadata = { title: "Knowledge Base" };

const initialQuery = "cancellation billing credit and adoption recovery";

export default function KnowledgePage() {
  const initialMatches = searchKnowledgeBase(initialQuery, 3);

  return (
    <div className="page-enter space-y-6">
      <section><p className="mb-1 flex items-center gap-1.5 text-sm font-medium text-[#728078]"><BookOpenCheck className="h-4 w-4" /> Grounded answers</p><h1 className="text-2xl font-bold tracking-[-0.03em] md:text-[28px]">Knowledge Base</h1><p className="mt-1.5 text-sm text-[#748078]">Approved policies and playbooks used to ground every retention recommendation.</p></section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[{ label: "Documents", value: knowledgeDocuments.length, detail: "Curated sources", icon: FileText }, { label: "Searchable chunks", value: knowledgeChunks.length, detail: "Citation ready", icon: Layers3 }, { label: "Safety", value: "100%", detail: "Read-only retrieval", icon: ShieldCheck }, { label: "Storage", value: "Local", detail: "Supabase-ready adapter", icon: BookOpenCheck }].map((item) => { const Icon = item.icon; return <Card key={item.label} className="p-4"><div className="flex items-center justify-between"><p className="text-[11px] font-semibold text-[#7b867f]">{item.label}</p><Icon className="h-4 w-4 text-[#438268]" /></div><p className="mt-3 text-2xl font-bold tracking-[-0.04em]">{item.value}</p><p className="mt-1 text-[10px] text-[#929b95]">{item.detail}</p></Card>; })}
      </section>

      <KnowledgeSearch initialQuery={initialQuery} initialMatches={initialMatches} />

      <section><div className="mb-3 flex flex-wrap items-end justify-between gap-2"><div><h2 className="text-sm font-bold">Connected documents</h2><p className="mt-1 text-xs text-[#7c8780]">Versioned content available to the agent</p></div><Badge tone="blue">{knowledgeChunks.length} chunks indexed</Badge></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{knowledgeDocuments.map((document) => <Card key={document.id} className="p-4"><div className="flex items-start justify-between gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#edf5f1] text-[#347057]"><FileText className="h-4 w-4" /></span><Badge tone={document.category === "Policy" ? "high" : document.category === "Playbook" ? "medium" : "neutral"}>{document.category}</Badge></div><h3 className="mt-4 text-xs font-bold">{document.title}</h3><p className="mt-2 min-h-10 text-[10px] leading-4 text-[#7a857e]">{document.description}</p><div className="mt-4 flex items-center justify-between border-t pt-3 text-[9px] text-[#929b95]"><span>{document.chunks} chunks</span><span>{document.updatedAt}</span></div><p className="mt-2 text-[9px] font-semibold text-[#5f6c64]">Owner · {document.owner}</p></Card>)}</div></section>
    </div>
  );
}
