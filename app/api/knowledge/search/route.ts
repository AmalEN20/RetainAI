import { NextResponse } from "next/server";
import { z } from "zod";
import { searchKnowledgeBase } from "@/lib/knowledge/search";

const requestSchema = z.object({
  query: z.string().trim().min(3).max(300),
  limit: z.number().int().min(1).max(5).optional(),
});

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a search query of at least three characters." }, { status: 400 });

  return NextResponse.json({
    query: parsed.data.query,
    matches: searchKnowledgeBase(parsed.data.query, parsed.data.limit),
  }, { headers: { "Cache-Control": "no-store" } });
}
