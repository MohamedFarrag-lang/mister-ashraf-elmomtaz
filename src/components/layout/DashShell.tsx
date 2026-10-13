"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@/lib/types";

export function DashShell({ role, title, desc, nav, children }: { role: Role; title: string; desc?: string; nav: { href:string; label:string }[]; children: React.ReactNode }){
  const path = usePathname();
  return <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div><h1 className="text-2xl font-black">{title}</h1>{desc && <p className="text-sm text-[var(--text-3)]">{desc}</p>}</div>
      <span className="badge">{role==="student"?"طالب":role==="teacher"?"معلم":"إدارة"}</span>
    </div>
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="card h-fit p-3">
        <nav className="grid gap-1">
          {nav.map(n=>{
            const active = path===n.href || path.startsWith(n.href+"/");
            return <Link key={n.href} href={n.href} className={`rounded-xl px-3 py-2.5 text-sm font-bold ${active?"bg-[var(--brand-900)] text-white":"hover:bg-[var(--surface-3)] text-[var(--text-2)]"}`}>{n.label}</Link>;
          })}
        </nav>
      </aside>
      <div className="grid gap-6">{children}</div>
    </div>
  </div>;
}
