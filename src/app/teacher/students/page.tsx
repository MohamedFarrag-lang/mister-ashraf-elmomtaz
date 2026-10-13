"use client";
import { useState } from "react";
import { DashShell } from "@/components/layout/DashShell";
import { Badge, Card, Input } from "@/components/ui/primitives";
import Link from "next/link";

const nav = [
  { href:"/teacher", label:"نظرة عامة" },
  { href:"/teacher/courses", label:"الكورسات" },
  { href:"/teacher/builder", label:"منشئ الكورسات" },
  { href:"/teacher/questions", label:"بنك الأسئلة" },
  { href:"/teacher/exams", label:"الاختبارات" },
  { href:"/teacher/grading", label:"التصحيح" },
  { href:"/teacher/students", label:"الطلاب" },
  { href:"/teacher/live", label:"الحصص المباشرة" },
  { href:"/teacher/announcements", label:"الإعلانات" },
];

const students = [
  { id:"u-s1", name:"أحمد محمد", email:"ahmed@example.com", course:"النحو المتقن", progress:62, last:"منذ يوم" },
  { id:"u-s2", name:"سارة علي", email:"sara@example.com", course:"تأسيس", progress:24, last:"منذ 3 أيام" },
  { id:"u-s3", name:"محمد حسام", email:"moh@example.com", course:"المراجعة النهائية", progress:88, last:"اليوم" },
];

export default function Students(){
  const [q,setQ]=useState("");
  const filtered = students.filter(s=> !q || s.name.includes(q) || s.email.includes(q));
  return <DashShell role="teacher" title="الطلاب" desc="بحث وتصفية — عرض التقدم والنتائج." nav={nav}>
    <div className="flex gap-3"><Input placeholder="ابحث بالاسم أو البريد" value={q} onChange={e=>setQ(e.target.value)} className="max-w-md" /><Badge>{filtered.length} طالب</Badge></div>
    <div className="grid gap-3">
      {filtered.map(s=> <Card key={s.id} className="flex flex-wrap items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--surface-3)] font-black">{s.name.slice(0,1)}</span>
          <div><div className="font-black">{s.name}</div><div className="text-xs text-[var(--text-3)]">{s.email} • {s.course}</div></div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold">{s.progress}%</span>
          <span className="text-xs text-[var(--text-3)]">{s.last}</span>
          <Link href="/teacher/grading" className="btn-ghost">عرض</Link>
        </div>
      </Card>)}
    </div>
  </DashShell>;
}
