import { NextResponse } from "next/server";
import { z } from "zod";
import { createApproval, listApprovals, updateApproval } from "@/lib/data/repository";

const createApprovalSchema = z.object({
  customerId: z.string().min(1),
  customer: z.string().min(1).max(120),
  initials: z.string().min(1).max(4),
  action: z.string().min(1).max(160),
  description: z.string().min(1).max(1_000),
  risk: z.enum(["High", "Medium", "Low"]),
  owner: z.string().min(1).max(120),
  subject: z.string().max(300).optional(),
  body: z.string().max(10_000).optional(),
  runId: z.string().uuid().optional(),
});

const updateApprovalSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  body: z.string().max(10_000).optional(),
}).refine((value) => value.status !== undefined || value.body !== undefined, "An update is required.");

export async function GET() {
  return NextResponse.json({ approvals: await listApprovals() }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const parsed = createApprovalSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid approval proposal." }, { status: 400 });

  try {
    const approval = await createApproval(parsed.data);
    return NextResponse.json({ approval }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Approval could not be saved." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  const parsed = updateApprovalSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid approval update." }, { status: 400 });

  try {
    const approval = await updateApproval(parsed.data.id, { status: parsed.data.status, body: parsed.data.body });
    if (!approval) return NextResponse.json({ error: "Approval not found." }, { status: 404 });
    return NextResponse.json({ approval });
  } catch {
    return NextResponse.json({ error: "Approval could not be updated." }, { status: 503 });
  }
}
