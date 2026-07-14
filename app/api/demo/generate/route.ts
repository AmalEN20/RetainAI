import { NextResponse } from "next/server";
import { DEMO_SESSION_COOKIE } from "@/lib/demo/session";
import { createGeneratedPortfolio } from "@/lib/demo/store";

function readSession(request: Request) {
  const item = request.headers.get("cookie")?.split(";").map((value) => value.trim()).find((value) => value.startsWith(`${DEMO_SESSION_COOKIE}=`));
  return item ? decodeURIComponent(item.slice(DEMO_SESSION_COOKIE.length + 1)) : null;
}

export async function POST(request: Request) {
  const id = readSession(request);
  if (!id) return NextResponse.json({ error: "Start the demo first." }, { status: 409 });
  return NextResponse.json(await createGeneratedPortfolio(id), { headers: { "Cache-Control": "no-store" } });
}
