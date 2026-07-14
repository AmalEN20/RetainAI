"use client";

import { useEffect, useState } from "react";
import { Check, Clock3, LoaderCircle, Mail, MoreHorizontal, Pencil, X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ApprovalRecord, ApprovalStatus } from "@/lib/data/types";

export function ApprovalBoard({ initialItems }: { initialItems: ApprovalRecord[] }) {
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedBody, setEditedBody] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/approvals", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload: { approvals?: ApprovalRecord[] }) => {
        if (active && payload.approvals) setItems(payload.approvals);
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  const pendingCount = items.filter((item) => item.status === "pending").length;
  const approvedCount = 8 + items.filter((item) => item.status === "approved").length;
  const rejectedCount = 1 + items.filter((item) => item.status === "rejected").length;

  async function persist(item: ApprovalRecord, patch: { status?: ApprovalStatus; body?: string }) {
    setSavingId(item.id);
    setError("");
    const previous = items;
    setItems((current) => current.map((candidate) => candidate.id === item.id ? { ...candidate, ...patch } : candidate));
    try {
      const response = await fetch("/api/approvals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, ...patch }),
      });
      if (!response.ok) throw new Error("Decision could not be saved.");
      const payload = (await response.json()) as { approval: ApprovalRecord };
      setItems((current) => current.map((candidate) => candidate.id === item.id ? payload.approval : candidate));
      return true;
    } catch (caught) {
      setItems(previous);
      setError(caught instanceof Error ? caught.message : "Decision could not be saved.");
      return false;
    } finally {
      setSavingId(null);
    }
  }

  async function decide(item: ApprovalRecord, status: ApprovalStatus) {
    setEditingId(null);
    const saved = await persist(item, { status });
    if (saved) window.dispatchEvent(new Event(status === "pending" ? "retainai:approval-reopened" : "retainai:approval-reviewed"));
  }

  function startEditing(item: ApprovalRecord) {
    setEditingId(item.id);
    setEditedBody(item.body ?? item.description);
  }

  async function saveEdit(item: ApprovalRecord) {
    await persist(item, { body: editedBody });
    setEditingId(null);
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Card className="p-4"><p className="text-[11px] font-semibold text-[#7c8780]">Pending review</p><p className="mt-2 text-2xl font-bold">{pendingCount}</p><p className="mt-1 text-[10px] text-[#929b95]">Persisted approval queue</p></Card>
        <Card className="p-4"><p className="text-[11px] font-semibold text-[#7c8780]">Approved today</p><p className="mt-2 text-2xl font-bold">{approvedCount}</p><p className="mt-1 text-[10px] text-[#24805d]">Average review: 4 min</p></Card>
        <Card className="p-4"><p className="text-[11px] font-semibold text-[#7c8780]">Rejected today</p><p className="mt-2 text-2xl font-bold">{rejectedCount}</p><p className="mt-1 text-[10px] text-[#929b95]">Drafts returned for editing</p></Card>
      </div>

      {error && <div className="rounded-lg border border-[#efc9c2] bg-[#fff5f2] px-4 py-3 text-xs font-medium text-[#a74739]">{error}</div>}

      <div className="space-y-3">
        {items.map((item) => {
          const isGenerated = Boolean(item.runId);
          const isSaving = savingId === item.id;
          return (
            <Card key={item.id} className={`overflow-hidden transition-opacity ${item.status !== "pending" ? "opacity-70" : ""}`}>
              {isGenerated && <div className="flex flex-wrap items-center gap-2 border-b border-[#cfe6da] bg-[#f1f9f5] px-4 py-2 text-[10px] font-semibold text-[#3d6b56] sm:px-5"><Mail className="h-3.5 w-3.5" /> Generated from an AI cancellation analysis <span className="sm:ml-auto font-normal text-[#799084]">Run {item.runId?.slice(0, 8)}</span></div>}
              <div className="flex flex-col gap-4 p-4 sm:p-5 xl:flex-row xl:items-center">
                <div className="flex min-w-0 flex-1 items-start gap-3"><Avatar initials={item.initials} className="h-10 w-10" /><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-bold">{item.action}</h2><Badge tone={item.risk === "High" ? "high" : item.risk === "Medium" ? "medium" : "low"}>{item.risk} risk</Badge>{item.status !== "pending" && <Badge tone={item.status === "approved" ? "low" : "neutral"}>{item.status === "approved" ? "Approved" : "Rejected"}</Badge>}</div><p className="mt-1.5 text-xs leading-5 text-[#68746c]">{item.description}</p>{isGenerated && item.subject && <p className="mt-2 text-[10px] font-semibold text-[#58665e]">Subject: {item.subject}</p>}<div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[#909992]"><span className="font-semibold text-[#637068]">{item.customer}</span><span>Contact: {item.owner}</span><span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" /> {item.created}</span></div></div></div>
                {item.status === "pending" ? <div className="grid shrink-0 grid-cols-2 gap-2 border-t pt-4 sm:flex sm:items-center xl:border-0 xl:pt-0">{isSaving ? <span className="col-span-2 flex min-h-11 items-center justify-center gap-2 px-3 text-[10px] font-medium text-[#738078]"><LoaderCircle className="h-3.5 w-3.5 animate-spin" /> Saving</span> : <><Button variant="danger" size="sm" onClick={() => decide(item, "rejected")}><X className="h-3.5 w-3.5" /> Reject</Button><Button variant="outline" size="sm" onClick={() => startEditing(item)}><Pencil className="h-3.5 w-3.5" /> Edit draft</Button><Button className="col-span-2 sm:order-3" size="sm" onClick={() => decide(item, "approved")}><Check className="h-3.5 w-3.5" /> Approve</Button><Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label={`More actions for ${item.customer}`}><MoreHorizontal className="h-4 w-4" /></Button></>}</div> : <Button className="w-full sm:w-auto" variant="outline" size="sm" disabled={isSaving} onClick={() => decide(item, "pending")}>{isSaving ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : null} Undo decision</Button>}
              </div>
              {editingId === item.id && <div className="border-t bg-[#fafbf8] p-4 sm:p-5"><label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.06em] text-[#87918b]">Review and edit draft</label><textarea className="min-h-[180px] w-full resize-y rounded-lg border bg-white p-3 text-xs leading-5 outline-none focus:ring-2 focus:ring-[#177553]/20" value={editedBody} onChange={(event) => setEditedBody(event.target.value)} /><div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:justify-end"><Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>Cancel</Button><Button size="sm" disabled={isSaving} onClick={() => saveEdit(item)}><Check className="h-3.5 w-3.5" /> Save changes</Button></div></div>}
            </Card>
          );
        })}
      </div>
    </>
  );
}
