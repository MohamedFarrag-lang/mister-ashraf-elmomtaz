import { NextResponse } from "next/server";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  const { identifier, password, roleHint } = await req.json().catch(() => ({}));
  if (!identifier || !password || String(password).length < 4) {
    return NextResponse.json({ ok: false, error: "بيانات الدخول غير صحيحة" }, { status: 400 });
  }
  const isPhone = /^[0-9]{10,11}$/.test(String(identifier).replace(/\s/g, ""));
  // Demo users — في الإنتاج يُستبدل بـ DB + bcrypt
  const demo: Record<string, { id: string; role: "student" | "teacher" | "admin"; name: string; phone?: string }> = {
    "student@test.com": { id: "u-s1", role: "student", name: "أحمد محمد", phone: "01000000001" },
    "teacher@test.com": { id: "u-teacher", role: "teacher", name: "مستر أشرف" },
    "admin@test.com": { id: "u-admin", role: "admin", name: "إدارة المنصة" },
    "01000000001": { id: "u-s1", role: "student", name: "أحمد محمد", phone: "01000000001" },
  };
  const key = String(identifier).toLowerCase();
  let user = demo[key] ?? (isPhone ? { id: `u-${Date.now()}`, role: "student" as const, name: key, phone: key } : null);
  // roleHint allows admin/teacher login via same endpoint
  if (roleHint && user && (roleHint === "teacher" || roleHint === "admin")) {
    user = { ...user, role: roleHint };
  }
  if (!user) return NextResponse.json({ ok: false, error: "الحساب غير موجود" }, { status: 401 });

  const deviceId = req.headers.get("x-device-id") || `srv-${Date.now()}`;
  const token = await signToken({ sub: user.id, role: user.role, deviceId, phone: user.phone }, "7d");
  const refresh = await signToken({ sub: user.id, role: user.role, deviceId, phone: user.phone }, "30d");

  const res = NextResponse.json({ ok: true, user: { id: user.id, role: user.role, name: user.name } });
  res.cookies.set("elmomtaz_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
  res.cookies.set("elmomtaz_refresh", refresh, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return res;
}
