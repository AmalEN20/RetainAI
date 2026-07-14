import { NextResponse } from "next/server";
import { z } from "zod";
import { DEMO_SESSION_COOKIE } from "@/lib/demo/session";
import { ensureDemoWorkspace, resetDemoWorkspace, updateDemoWorkspace } from "@/lib/demo/store";

const updateSchema = z.object({
  companyName: z.string().trim().max(80).optional(),
  companyDescription: z.string().trim().max(400).optional(),
  productName: z.string().trim().max(80).optional(),
  documentationPack: z.enum(["", "github", "stripe", "google-workspace"]).optional(),
  guideStep: z.number().int().min(0).max(7).optional(),
  completed: z.boolean().optional(),
});

function sessionId(request: Request) {
  const cookie = request.headers.get("cookie")?.split(";").map((value) => value.trim()).find((value) => value.startsWith(`${DEMO_SESSION_COOKIE}=`));
  return cookie ? decodeURIComponent(cookie.slice(DEMO_SESSION_COOKIE.length + 1)) : crypto.randomUUID();
}

function responseWithSession(payload: unknown, id: string) {
  const response = NextResponse.json(payload, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(DEMO_SESSION_COOKIE, id, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 });
  return response;
}

export async function GET(request: Request) {
  const id = sessionId(request);
  const shouldReset = new URL(request.url).searchParams.get("reset") === "1";
  const snapshot = shouldReset ? await resetDemoWorkspace(id) : await ensureDemoWorkspace(id);
  return responseWithSession(snapshot, id);
}

export async function PATCH(request: Request) {
  const id = sessionId(request);
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid demo update." }, { status: 400 });
  const { completed, ...patch } = parsed.data;
  const snapshot = await updateDemoWorkspace(id, { ...patch, ...(completed ? { guideStep: 7, completedAt: new Date().toISOString() } : {}) });
  return responseWithSession(snapshot, id);
}
