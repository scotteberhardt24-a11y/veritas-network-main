import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address, username } = body;
    if (!address) return NextResponse.json({ error: "address required" }, { status: 400 });

    const backendURL = process.env.NEXT_PUBLIC_API_URL || "";
    const res = await fetch(`${backendURL}/api/passport/mint`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress: address, username }),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: unknown) {
    const e = err as { message?: string };
    return NextResponse.json({ error: e.message || "Mint failed" }, { status: 500 });
  }
}
