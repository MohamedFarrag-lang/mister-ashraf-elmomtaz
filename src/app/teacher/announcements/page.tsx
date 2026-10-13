"use client";
import { useState } from "react";
import { mockAnnouncements } from "@/lib/mocks";
import { DashShell } from "@/components/layout/DashShell";
import { Card, Field, Input, Textarea } from "@/components/ui/primitives";

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

export default function Ann(){
  const [list,setList]=useState(mockAnnouncements);
  const [title,setTitle]=useState("");
  const [body,setBody]=useState("");
  return <DashShell role="teacher" title="الإعلانات" desc="انشر إعلانًا يظهر للطلاب كإشعار." nav={nav}>
    <Card className="p-6 grid gap-4">
      <Field label="العنوان"><Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="عنوان الإعلان" /></Field>
      <Field label="المحتوى"><Textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="نص الإعلان..." /></Field>
      <button onClick={()=>{
        if(!title.trim()||!body.trim()) return;
        setList(prev=>[{ id:"an-"+Date.now(), title:title.trim(), body:body.trim(), audience:"all", publishedAt:new Date().toISOString()}, ...prev]);
        setTitle(""); setBody("");
      }} className="btn-primary w-fit">نشر الإعلان</button>
    </Card>
    <div className="grid gap-3">
      {list.map(a=> <Card key={a.id} className="p-4"><div className="font-black">{a.title}</div><div className="text-sm leading-7 text-[var(--text-2)]">{a.body}</div><div className="text-xs text-[var(--text-3)]">{new Date(a.publishedAt).toLocaleString("ar-EG")}</div></Card>)}
    </div>
  </DashShell>;
}
