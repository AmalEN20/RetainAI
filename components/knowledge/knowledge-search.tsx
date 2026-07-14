"use client";

import { FormEvent, useState } from "react";
import { BookOpenCheck, CheckCircle2, LoaderCircle, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { KnowledgeSearchMatch } from "@/lib/knowledge/search";

export function KnowledgeSearch({ initialQuery, initialMatches }: { initialQuery: string; initialMatches: KnowledgeSearchMatch[] }) {
  const [query, setQuery] = useState(initialQuery);
  const [matches, setMatches] = useState(initialMatches);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  async function runSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearching(true);
    setError("");
    try {
      const response = await fetch("/api/knowledge/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, limit: 3 }),
      });
      if (!response.ok) throw new Error("Search could not be completed.");
      const payload = (await response.json()) as { matches: KnowledgeSearchMatch[] };
      setMatches(payload.matches);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Search could not be completed.");
    } finally {
      setSearching(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-xl border bg-white">
      <div className="border-b bg-[#fafbf8] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex-1"><div className="flex items-center gap-2"><BookOpenCheck className="h-4 w-4 text-[#177553]" /><h2 className="text-sm font-bold">Retrieval playground</h2><Badge tone="low">Read-only</Badge></div><p className="mt-1.5 text-xs text-[#77827b]">Search the same approved chunks available to the Customer Success agent.</p></div>
          <form onSubmit={runSearch} className="flex w-full flex-col gap-2 sm:flex-row lg:max-w-xl">
            <div className="flex h-11 flex-1 items-center gap-2 rounded-lg border bg-white px-3"><Search className="h-4 w-4 text-[#8b958e]" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 w-full bg-transparent text-xs outline-none" placeholder="Search policies and playbooks…" aria-label="Knowledge base query" /></div>
            <Button className="w-full sm:w-auto" type="submit" disabled={searching || query.trim().length < 3}>{searching ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Search</Button>
          </form>
        </div>
        {error && <p className="mt-3 text-xs font-medium text-[#a74739]">{error}</p>}
      </div>

      <div className="divide-y">
        {matches.map((match, index) => (
          <article key={match.id} className="grid grid-cols-[36px_1fr] gap-3 p-4 sm:gap-4 sm:p-5 md:grid-cols-[44px_1fr_auto] md:items-start">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e9f6ef] text-xs font-bold text-[#177553]">{index + 1}</span>
            <div><div className="flex flex-wrap items-center gap-2"><h3 className="text-xs font-bold">{match.title}</h3><Badge>{match.section}</Badge><span className="font-mono text-[9px] text-[#8d9790]">{match.id}</span></div><p className="mt-2 max-w-4xl text-[11px] leading-5 text-[#68746c]">{match.content}</p><p className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-[#347057]"><CheckCircle2 className="h-3.5 w-3.5" /> {match.citation}</p></div>
            <div className="col-span-2 rounded-lg border bg-[#fafbf8] px-3 py-2 text-center md:col-span-1"><p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#939c96]">Score</p><p className="mt-1 text-sm font-bold text-[#177553]">{Math.round(match.score * 100)}%</p></div>
          </article>
        ))}
        {matches.length === 0 && <div className="p-8 text-center text-xs text-[#7c8780]">No approved chunks matched this query.</div>}
      </div>
    </section>
  );
}
