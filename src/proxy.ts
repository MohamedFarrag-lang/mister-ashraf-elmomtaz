import { NextResponse, type NextRequest } from "next/server";
import { verifyToken } from "./lib/jwt";

// دومين واحد elmomtaz.com — الحماية على الخادم
const TEACHER_PREFIX = "/teacher";
const ADMIN_PREFIX = "/admin";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const needsTeacher = pathname === TEACHER_PREFIX || pathname.startsWith(TEACHER_PREFIX + "/");
  const needsAdmin = pathname === ADMIN_PREFIX || pathname.startsWith(ADMIN_PREFIX + "/");

  if (!needsTeacher && !needsAdmin) return NextResponse.next();

  const token = req.cookies.get("elmomtaz_token")?.value ?? null;
  const payload = token ? await verifyToken(token) : null;

  if (!payload) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (needsAdmin && payload.role !== "admin") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (needsTeacher && payload.role !== "teacher" && payload.role !== "admin") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Single-device check: if cookie deviceId mismatches stored latest, invalidate
  // (Full check lives in /api/auth/check-device; middleware does fast role gate)

  return NextResponse.next();
}

export const config = {
  matcher: ["/teacher/:path*", "/admin/:path*"],
};
