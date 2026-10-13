"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { brand } from "@/lib/config";
import { useState } from "react";

const nav = [
  { href: "/", label: "الرئيسية" },
  { href: "/packages", label: "الباقات الأسبوعية" },
  { href: "/courses", label: "الكورسات" },
  { href: "/about", label: "عن الممتاز" },
  { href: "/announcements", label: "الإعلانات" },
  { href: "/contact", label: "تواصل" },
  { href: "/faq", label: "الأسئلة الشائعة" },
];

export default function SiteHeader(){
  const path = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--surface)]/90 backdrop-blur">
    <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
      <Link href="/" className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--brand-900)] font-black text-white">م</span>
        <span className="grid leading-tight">
          <span className="text-sm font-black">{brand.nameAr}</span>
          <span className="text-xs font-bold text-[var(--text-3)]">{brand.teacherName} — {brand.nickname}</span>
        </span>
      </Link>

      <nav className="hidden items-center gap-1 lg:flex">
        {nav.map(n=>{
          const active = path===n.href || (n.href!=="/" && path.startsWith(n.href));
          return <Link key={n.href} href={n.href} className={`rounded-full px-3 py-2 text-sm font-bold ${active? "bg-[var(--brand-50)] text-[var(--brand-800)]":"text-[var(--text-2)] hover:bg-[var(--surface-3)]"}`}>{n.label}</Link>;
        })}
      </nav>

      <div className="hidden items-center gap-2 lg:flex">
        {!user ? <>
          <Link href="/login" className="btn-ghost">تسجيل الدخول</Link>
          <Link href="/register" className="btn-primary">إنشاء حساب</Link>
        </> : <>
          <Link href={user.role==="teacher"? "/teacher" : user.role==="admin"? "/admin" : "/student"} className="btn-ghost">لوحتي</Link>
          <Link href="/student/notifications" className="grid h-10 w-10 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)]">🔔</Link>
          <button onClick={logout} className="btn-primary">خروج</button>
        </>}
      </div>

      <button onClick={()=>setOpen(v=>!v)} className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--line)] lg:hidden" aria-label="القائمة">☰</button>
    </div>
    {open && <div className="border-t border-[var(--line)] bg-[var(--surface)] p-4 lg:hidden">
      <div className="grid gap-2">
        {nav.map(n=> <Link key={n.href} href={n.href} onClick={()=>setOpen(false)} className="rounded-xl px-3 py-3 font-bold hover:bg-[var(--surface-3)]">{n.label}</Link>)}
        <div className="mt-2 flex gap-2">
          {!user ? <>
            <Link href="/login" className="btn-ghost flex-1 text-center">دخول</Link>
            <Link href="/register" className="btn-primary flex-1 text-center">حساب جديد</Link>
          </> : <>
            <Link href="/student" className="btn-ghost flex-1 text-center">لوحتي</Link>
            <button onClick={logout} className="btn-primary flex-1">خروج</button>
          </>}
        </div>
      </div>
    </div>}
  </header>;
}
