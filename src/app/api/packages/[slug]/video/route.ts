import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

// Protected: يرجع الفيديو فقط للمشتري أو teacher/admin
// Public info (title/price/status) لا تُرجع الفيديو
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cookie = req.headers.get("cookie") || "";
  const token = cookie.match(/elmomtaz_token=([^;]+)/)?.[1];
  const payload = token ? await verifyToken(token) : null;

  if (!payload) {
    return NextResponse.json({ error: "غير مصرح — سجّل الدخول" }, { status: 401 });
  }

  // In production: lookup package by slug, check purchase table, return VideoRef only if authorized
  // For MVP: allow student if they have purchase cookie/header, teacher/admin always allowed
  const purchases = req.headers.get("x-purchases") || "";
  const isOwner = purchases.includes(slug) || payload.role === "teacher" || payload.role === "admin";

  if (!isOwner) {
    return NextResponse.json({ error: "الباقة مقفلة — اشترِ أو فعّل كود" }, { status: 403 });
  }

  // Return would contain VideoRef; here we just confirm authorized
  return NextResponse.json({ ok: true, slug, message: "مصرح — يمكن عرض الفيديو" });
}
