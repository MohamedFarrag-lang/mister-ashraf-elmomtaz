"use client";
import { useState } from "react";
import { mockLive, mockCourses } from "@/lib/mocks";
import { DashShell } from "@/components/layout/DashShell";
import { Badge, Card, Field, Input } from "@/components/ui/primitives";

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

export default function Live(){
  const [list,setList]=useState(mockLive);
  const [title,setTitle]=useState("");
  return <DashShell role="teacher" title="الحصص المباشرة" desc="جدولة حصة بعنوان وتاريخ ورابط اجتماع — جاهز للربط بأي مزود." nav={nav}>
    <Card className="p-6 grid gap-4">
      <h3 className="font-black">إضافة حصة</h3>
      <div className="grid gap-3 md:grid-cols-3">
        <Field label="العنوان"><Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="مراجعة المنصوبات" /></Field>
        <Field label="التاريخ"><Input type="datetime-local" /></Field>
        <Field label="رابط الاجتماع"><Input placeholder="https://meet..." /></Field>
      </div>
      <button onClick={()=>{
        if(!title.trim()) return;
        setList(prev=>[{ id:"lv-"+Date.now(), courseId: mockCourses[0].id, title: title.trim(), date:new Date(Date.now()+86400000).toISOString(), durationMin:60, status:"upcoming", meetingUrl:"#"}, ...prev]);
        setTitle("");
      }} className="btn-primary w-fit">إضافة</button>
    </Card>
    <div className="grid gap-3">
      {list.map(l=> <Card key={l.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div><div className="font-black">{l.title}</div><div className="text-xs text-[var(--text-3)]">{new Date(l.date).toLocaleString("ar-EG")} • {l.durationMin} د</div></div>
        <Badge tone={l.status==="upcoming"? "brand": l.status==="live"? "success":"neutral"}>{l.status==="upcoming"?"قادمة":l.status==="live"?"مباشر الآن":l.status==="completed"?"مكتملة":"ملغاة"}</Badge>
      </Card>)}
    </div>
  </DashShell>;
}
