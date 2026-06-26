import { NextResponse } from "next/server";

// Stub webhook endpoint. Replace with real webhook handling logic.
export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  return NextResponse.json({ received: true, payload });
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
