"use client";
import Link from "next/link";
import { useState } from "react";
import { mockCourses } from "@/lib/mocks";
import { DashShell } from "@/components/layout/DashShell";
import { Badge, Card, Input, Select } from "@/components/ui/primitives";

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

export default function TeacherCourses(){
  const [q,setQ]=useState("");
  const [status,setStatus]=useState("الكل");
  const filtered = mockCourses.filter(c=>{
    const mQ = !q || c.title.includes(q);
    const mS = status==="الكل" || (status==="منشور" && c.status==="published") || (status==="مسودة" && c.status==="draft");
    return mQ && mS;
  });
  return <DashShell role="teacher" title="إدارة الكورسات" desc="أنشئ وعدّل وانشر كورساتك — كل كورس بوحدات ودروس وموارد." nav={nav}>
    <div className="flex flex-wrap gap-3">
      <div className="flex-1 min-w-52"><Input placeholder="ابحث باسم الكورس" value={q} onChange={e=>setQ(e.target.value)} /></div>
      <Select value={status} onChange={e=>setStatus(e.target.value)} className="w-40">
        <option>الكل</option><option>منشور</option><option>مسودة</option>
      </Select>
      <Link href="/teacher/builder" className="btn-primary">+ كورس جديد</Link>
    </div>
    <div className="grid gap-4">
      {filtered.map(c=> <Card key={c.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div><div className="font-black">{c.title}</div><div className="text-sm text-[var(--text-3)]">{c.level} • {c.category} • {c.modules.length} وحدات • {c.lessonsCount} دروس</div></div>
        <div className="flex items-center gap-2">
          <Badge tone={c.status==="published"?"success":"warning"}>{c.status==="published"?"منشور":"مسودة"}</Badge>
          <Link href={`/courses/${c.slug}`} className="btn-ghost">معاينة</Link>
          <Link href="/teacher/builder" className="btn-ghost">تعديل</Link>
        </div>
      </Card>)}
    </div>
  </DashShell>;
}
