"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Clock3, Mail, MoreHorizontal, Pencil, X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { approvals as seededApprovals } from "@/lib/mock-data";

type ApprovalItem = {
  id: number | string;
  customer: string;
  initials: string;
  action: string;
  description: string;
  created: string;
  risk: "High" | "Medium" | "Low";
  owner: string;
  subject?: string;
  body?: string;
  runId?: string;
};

type Decision = "pending" | "approved" | "rejected";

export function ApprovalBoard() {
  const [generated, setGenerated] = useState<ApprovalItem | null>(null);
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedBody, setEditedBody] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = sessionStorage.getItem("retainai-generated-approval");
      if (!saved) return;
      try {
        setGenerated(JSON.parse(saved) as ApprovalItem);
      } catch {
        sessionStorage.removeItem("retainai-generated-approval");
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const items = useMemo<ApprovalItem[]>(
    () => (generated ? [generated, ...seededApprovals] : seededApprovals),
    [generated],
  );

  const pendingCount = items.filter((item) => (decisions[String(item.id)] ?? "pending") === "pending").length;
  const approvedCount = 8 + Object.values(decisions).filter((decision) => decision === "approved").length;
  const rejectedCount = 1 + Object.values(decisions).filter((decision) => decision === "rejected").length;

  function decide(item: ApprovalItem, decision: Decision) {
    setDecisions((current) => ({ ...current, [String(item.id)]: decision }));
    setEditingId(null);
    if (String(item.id) === "generated-acme-retention" && decision !== "pending") {
      sessionStorage.removeItem("retainai-generated-approval");
    }
  }

  function startEditing(item: ApprovalItem) {
    setEditingId(String(item.id));
    setEditedBody(item.body ?? item.description);
  }

  function saveEdit(item: ApprovalItem) {
    if (generated && String(item.id) === String(generated.id)) {
      const updated = { ...generated, body: editedBody };
      setGenerated(updated);
      sessionStorage.setItem("retainai-generated-approval", JSON.stringify(updated));
    }
    setEditingId(null);
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4"><p className="text-[11px] font-semibold text-[#7c8780]">Pending review</p><p className="mt-2 text-2xl font-bold">{pendingCount}</p><p className="mt-1 text-[10px] text-[#929b95]">{generated ? "New AI draft added" : "1 high-priority email"}</p></Card>
        <Card className="p-4"><p className="text-[11px] font-semibold text-[#7c8780]">Approved today</p><p className="mt-2 text-2xl font-bold">{approvedCount}</p><p className="mt-1 text-[10px] text-[#24805d]">Average review: 4 min</p></Card>
        <Card className="p-4"><p className="text-[11px] font-semibold text-[#7c8780]">Rejected today</p><p className="mt-2 text-2xl font-bold">{rejectedCount}</p><p className="mt-1 text-[10px] text-[#929b95]">Drafts returned for editing</p></Card>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const decision = decisions[String(item.id)] ?? "pending";
          const isGenerated = String(item.id) === "generated-acme-retention";
          return (
            <Card key={item.id} className={`overflow-hidden transition-opacity ${decision !== "pending" ? "opacity-70" : ""}`}>
              {isGenerated && <div className="flex items-center gap-2 border-b border-[#cfe6da] bg-[#f1f9f5] px-5 py-2 text-[10px] font-semibold text-[#3d6b56]"><Mail className="h-3.5 w-3.5" /> Generated from the Acme cancellation analysis <span className="ml-auto font-normal text-[#799084]">Run {item.runId?.slice(0, 8)}</span></div>}
              <div className="flex flex-col gap-4 p-5 xl:flex-row xl:items-center">
                <div className="flex min-w-0 flex-1 items-start gap-3"><Avatar initials={item.initials} className="h-10 w-10" /><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-bold">{item.action}</h2><Badge tone={item.risk === "High" ? "high" : item.risk === "Medium" ? "medium" : "low"}>{item.risk} risk</Badge>{decision !== "pending" && <Badge tone={decision === "approved" ? "low" : "neutral"}>{decision === "approved" ? "Approved" : "Rejected"}</Badge>}</div><p className="mt-1.5 text-xs leading-5 text-[#68746c]">{item.description}</p>{isGenerated && item.subject && <p className="mt-2 text-[10px] font-semibold text-[#58665e]">Subject: {item.subject}</p>}<div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[#909992]"><span className="font-semibold text-[#637068]">{item.customer}</span><span>Contact: {item.owner}</span><span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" /> {item.created}</span></div></div></div>
                {decision === "pending" ? <div className="flex shrink-0 items-center gap-2 border-t pt-4 xl:border-0 xl:pt-0"><Button variant="danger" size="sm" onClick={() => decide(item, "rejected")}><X className="h-3.5 w-3.5" /> Reject</Button><Button variant="outline" size="sm" onClick={() => startEditing(item)}><Pencil className="h-3.5 w-3.5" /> Edit draft</Button><Button size="sm" onClick={() => decide(item, "approved")}><Check className="h-3.5 w-3.5" /> Approve</Button><Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`More actions for ${item.customer}`}><MoreHorizontal className="h-4 w-4" /></Button></div> : <Button variant="outline" size="sm" onClick={() => decide(item, "pending")}>Undo decision</Button>}
              </div>
              {editingId === String(item.id) && <div className="border-t bg-[#fafbf8] p-5"><label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.06em] text-[#87918b]">Review and edit draft</label><textarea className="min-h-[180px] w-full resize-y rounded-lg border bg-white p-3 text-xs leading-5 outline-none focus:ring-2 focus:ring-[#177553]/20" value={editedBody} onChange={(event) => setEditedBody(event.target.value)} /><div className="mt-3 flex justify-end gap-2"><Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>Cancel</Button><Button size="sm" onClick={() => saveEdit(item)}><Check className="h-3.5 w-3.5" /> Save changes</Button></div></div>}
            </Card>
          );
        })}
      </div>
    </>
  );
}
