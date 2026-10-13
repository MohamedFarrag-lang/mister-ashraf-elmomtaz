import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: Request) {
  const cookie = (req.headers.get("cookie") || "");
  const token = cookie.match(/elmomtaz_token=([^;]+)/)?.[1];
  const payload = token ? await verifyToken(token) : null;
  if (!payload) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ user: payload });
}
