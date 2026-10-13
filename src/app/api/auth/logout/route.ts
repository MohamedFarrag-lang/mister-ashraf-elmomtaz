import { NextResponse } from "next/server";
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("elmomtaz_token", "", { httpOnly: true, path: "/", maxAge: 0 });
  res.cookies.set("elmomtaz_refresh", "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
