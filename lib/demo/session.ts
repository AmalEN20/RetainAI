import { cookies } from "next/headers";

export const DEMO_SESSION_COOKIE = "retainai_demo_session";

export async function readDemoSessionId() {
  try {
    return (await cookies()).get(DEMO_SESSION_COOKIE)?.value ?? null;
  } catch {
    return null;
  }
}
