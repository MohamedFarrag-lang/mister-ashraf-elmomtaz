import { NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { name, phone, password, guardianPhone } = body;
  if (!name || !phone || !password || String(password).length < 4 || !guardianPhone) {
    return NextResponse.json({ ok: false, error: "أكمل البيانات المطلوبة بشكل صحيح" }, { status: 400 });
  }
  const deviceId = req.headers.get("x-device-id") || `srv-${Date.now()}`;
  const id = `u-${Date.now()}`;
  const token = await signToken({ sub: id, role: "student", deviceId, phone }, "7d");
  const refresh = await signToken({ sub: id, role: "student", deviceId, phone }, "30d");
  const res = NextResponse.json({ ok: true, user: { id, role: "student", name } });
  res.cookies.set("elmomtaz_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
  res.cookies.set("elmomtaz_refresh", refresh, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return res;
}
