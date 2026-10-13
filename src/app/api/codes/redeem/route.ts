import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function POST(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie.match(/elmomtaz_token=([^;]+)/)?.[1];
  const payload = token ? await verifyToken(token) : null;
  if (!payload) return NextResponse.json({ ok: false, error: "سجّل الدخول أولًا" }, { status: 401 });
  if (payload.role !== "student") return NextResponse.json({ ok: false, error: "الأكواد للطلاب فقط" }, { status: 403 });
  const { code } = await req.json().catch(() => ({}));
  if (!code) return NextResponse.json({ ok: false, error: "أدخل الكود" }, { status: 400 });
  // In production: atomic DB check (usedCount < maxUses, not expired, package exists) then create Order+Purchase
  // For MVP: acknowledge — real logic stays in src/lib/commerce.ts on client, server will enforce after DB
  return NextResponse.json({ ok: true, message: "تم التفعيل (MVP) — سيتم التحقق من الخادم بعد ربط DB" });
}
