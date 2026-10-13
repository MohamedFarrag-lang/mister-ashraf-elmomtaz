"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { usePackages } from "@/lib/usePackages";
import { grades, terms, academicYears } from "@/lib/curriculum";
import { gradeLabel, termLabel } from "@/lib/curriculum";
import { getDefaultPricing, formatEgp, resolvePackagePrice } from "@/lib/pricing";
import { isPackagePurchased } from "@/lib/commerce";
import { Badge, Card, Select } from "@/components/ui/primitives";

export default function PackagesBrowse(){
  const { packages } = usePackages();
  const [grade,setGrade]=useState("الكل");
  const [term,setTerm]=useState("الكل");
  const [year,setYear]=useState("الكل");
  const [status,setStatus]=useState("published");
  const fallback = getDefaultPricing().defaultWeeklyPriceEgp;

  const filtered = useMemo(()=> packages.filter(p=>{
    const mg = grade==="الكل" || p.grade===grade;
    const mt = term==="الكل" || p.term===term;
    const my = year==="الكل" || p.academicYearId===year;
    const ms = status==="الكل" || p.status===status;
    return mg && mt && my && ms;
  }).sort((a,b)=> a.weekNumber - b.weekNumber),[packages,grade,term,year,status]);

  // تجميع حسب الصف/الترم/الأسبوع
  const grouped = useMemo(()=>{
    const g: Record<string, typeof filtered> = {};
    for(const p of filtered){ const k = `${p.grade}-${p.term}`; (g[k]??=[]).push(p); g[k]=g[k]; }
    return g;
  },[filtered]);

  return <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><h1 className="text-3xl font-black">الباقات الأسبوعية</h1><p className="text-sm text-[var(--text-3)]">كل باقة = فيديو شرح + فيديو حل + امتحان — تصفح حسب الصف والترم والأسبوع</p></div>
      <Badge>{filtered.length} باقة</Badge>
    </div>

    <div className="card mt-6 grid gap-3 p-4 md:grid-cols-4">
      <Select value={grade} onChange={e=>setGrade(e.target.value)}><option value="الكل">كل الصفوف</option>{grades.map(g=><option key={g.id} value={g.id}>{g.label}</option>)}</Select>
      <Select value={year} onChange={e=>setYear(e.target.value)}><option value="الكل">كل الأعوام</option>{academicYears.map(y=><option key={y.id} value={y.id}>{y.label}</option>)}</Select>
      <Select value={term} onChange={e=>setTerm(e.target.value)}><option value="الكل">كل الترمات</option>{terms.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}</Select>
      <Select value={status} onChange={e=>setStatus(e.target.value)}><option value="published">المنشورة فقط</option><option value="الكل">الكل</option><option value="draft">مسودة</option><option value="scheduled">مجدولة</option></Select>
    </div>

    {filtered.length===0? <Card className="mt-6 p-8 text-center text-sm text-[var(--text-3)]">لا توجد باقات بهذه الفلاتر</Card> :
    <div className="mt-8 grid gap-8">
      {Object.entries(grouped).map(([key, list])=>{
        const [gid,tid]=key.split("-");
        return <div key={key} className="grid gap-3">
          <h2 className="text-lg font-black">{gradeLabel(gid as never)} — {termLabel(tid as never)}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {list.map(p=>{
              const purchased = isPackagePurchased(p.id);
              const price = resolvePackagePrice(p, fallback);
              const locked = p.status!=="published";
              return <Link key={p.id} href={`/packages/${p.slug}`} className={`card overflow-hidden p-0 transition hover:-translate-y-1 ${locked? "opacity-70":""}`}>
                <div className="bg-gradient-to-br from-[var(--brand-900)] to-[var(--brand-700)] p-4 text-white">
                  <div className="flex items-center justify-between text-xs"><span>الأسبوع {p.weekNumber}</span><span>{p.academicYearId}</span></div>
                  <div className="mt-2 font-black">{p.title}</div>
                  <div className="mt-1 text-xs opacity-80">{p.description.slice(0,60)}...</div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 p-4">
                  <span className="font-black text-sm">{formatEgp(price)}</span>
                  <span className="flex gap-1">
                    {purchased? <Badge tone="success">تم الشراء</Badge> : <Badge>{locked? "قريبًا":"متاحة"}</Badge>}
                    {p.examId && <Badge tone="brand">امتحان</Badge>}
                  </span>
                </div>
              </Link>;
            })}
          </div>
        </div>;
      })}
    </div>}
  </div>;
}
