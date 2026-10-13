"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
import { DashShell } from "@/components/layout/DashShell";
import { Badge, Card, Input, Select } from "@/components/ui/primitives";
import { usePackages } from "@/lib/usePackages";
import { gradeLabel, termLabel } from "@/lib/curriculum";
import { getDefaultPricing, formatEgp, resolvePackagePrice } from "@/lib/pricing";

const nav = [
  { href:"/teacher", label:"نظرة عامة" },
  { href:"/teacher/packages", label:"الباقات الأسبوعية" },
  { href:"/teacher/builder", label:"منشئ الكورسات" },
  { href:"/teacher/questions", label:"بنك الأسئلة" },
  { href:"/teacher/exams", label:"الاختبارات" },
  { href:"/teacher/grading", label:"التصحيح" },
  { href:"/teacher/students", label:"الطلاب" },
  { href:"/teacher/live", label:"الحصص المباشرة" },
  { href:"/teacher/announcements", label:"الإعلانات" },
  { href:"/teacher/settings", label:"الإعدادات" },
];

export default function TeacherPackages(){
  const { packages } = usePackages();
  const [q,setQ]=useState("");
  const [status,setStatus]=useState("الكل");
  const [grade,setGrade]=useState("الكل");
  const fallback = getDefaultPricing().defaultWeeklyPriceEgp;

  const filtered = useMemo(()=> packages.filter(p=>{
    const mq = !q || p.title.includes(q);
    const ms = status==="الكل" || p.status===status;
    const mg = grade==="الكل" || p.grade===grade;
    return mq && ms && mg;
  }),[packages,q,status,grade]);

  return <DashShell role="teacher" title="الباقات الأسبوعية" desc="أنشئ باقة أسبوعية: فيديو شرح + فيديو حل + امتحان — بدون كتابة كود." nav={nav}>
    <div className="flex flex-wrap gap-3">
      <div className="flex-1 min-w-52"><Input placeholder="ابحث باسم الباقة" value={q} onChange={e=>setQ(e.target.value)} /></div>
      <Select value={status} onChange={e=>setStatus(e.target.value)} className="w-36">
        <option value="الكل">كل الحالات</option><option value="draft">مسودة</option><option value="scheduled">مجدولة</option><option value="published">منشورة</option><option value="archived">مؤرشفة</option>
      </Select>
      <Select value={grade} onChange={e=>setGrade(e.target.value)} className="w-40">
        <option value="الكل">كل الصفوف</option><option value="grade1">أولى ثانوي</option><option value="grade2">ثانية ثانوي</option><option value="grade3">ثالثة ثانوي</option>
      </Select>
      <Link href="/teacher/packages/new" className="btn-primary">+ باقة جديدة</Link>
    </div>

    <div className="grid gap-4">
      {filtered.length===0? <Card className="p-8 text-center text-sm text-[var(--text-3)]">لا توجد باقات بهذه الفلاتر</Card> :
      filtered.map(p=> <Card key={p.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="brand">{gradeLabel(p.grade)}</Badge>
            <Badge>{termLabel(p.term)} • الأسبوع {p.weekNumber}</Badge>
            <Badge tone={p.status==="published"?"success":p.status==="scheduled"?"warning":"neutral"}>{p.status==="published"?"منشورة":p.status==="scheduled"?"مجدولة":p.status==="draft"?"مسودة":"مؤرشفة"}</Badge>
          </div>
          <div className="mt-2 font-black">{p.title}</div>
          <div className="text-sm text-[var(--text-3)]">{formatEgp(resolvePackagePrice(p, fallback))} • {p.explanationVideo?"شرح ✓":"شرح —"} • {p.solutionVideo?"حل ✓":"حل —"} • {p.examId?"امتحان ✓":"بدون امتحان"}</div>
        </div>
        <div className="flex gap-2">
          <Link href={`/packages/${p.slug}`} className="btn-ghost">معاينة</Link>
          <Link href={`/teacher/packages/${p.id}/edit`} className="btn-ghost">تعديل</Link>
        </div>
      </Card>)}
    </div>
  </DashShell>;
}
