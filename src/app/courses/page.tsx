"use client";
import { useMemo, useState } from "react";
import { mockCourses } from "@/lib/mocks";
import { CourseCard } from "@/components/ui/course-card";
import { Badge, EmptyState, Input, Select } from "@/components/ui/primitives";

export default function CoursesPage(){
  const [q, setQ] = useState("");
  const [level, setLevel] = useState("الكل");
  const [cat, setCat] = useState("الكل");

  const filtered = useMemo(()=>{
    return mockCourses.filter(c=>{
      const matchQ = !q || (c.title + c.shortDesc + c.category).includes(q);
      const matchL = level==="الكل" || c.level===level;
      const matchC = cat==="الكل" || c.category===cat;
      return matchQ && matchL && matchC;
    });
  },[q, level, cat]);

  return <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><h1 className="text-2xl font-black">الكورسات</h1><p className="text-sm text-[var(--text-3)]">ابحث وفلتر حسب المستوى والتصنيف — كل الكورسات منظمة بوحدات ودروس.</p></div>
      <div className="flex gap-2"><Badge>{filtered.length} كورس</Badge><Badge tone="brand">بيانات تجريبية معزولة</Badge></div>
    </div>

    <div className="card mt-6 grid gap-3 p-4 md:grid-cols-[1.2fr_.6fr_.6fr]">
      <Input placeholder="ابحث: نحو، بلاغة، تأسيس..." value={q} onChange={e=>setQ(e.target.value)} />
      <Select value={level} onChange={e=>setLevel(e.target.value)}>
        <option>الكل</option><option>تأسيس</option><option>الصف الأول الثانوي</option><option>الصف الثاني الثانوي</option><option>الصف الثالث الثانوي</option>
      </Select>
      <Select value={cat} onChange={e=>setCat(e.target.value)}>
        <option>الكل</option><option>نحو</option><option>بلاغة</option><option>أدب</option><option>مراجعة نهائية</option><option>تعبير</option>
      </Select>
    </div>

    {filtered.length===0 ? <div className="mt-6"><EmptyState title="لا توجد نتائج" desc="جرّب كلمة بحث أخرى أو غيّر الفلاتر." /></div>
    : <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {filtered.map(c=> <CourseCard key={c.id} course={c} />)}
    </div>}
  </div>;
}
