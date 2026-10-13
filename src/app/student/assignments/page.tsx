"use client";
import { useState } from "react";
import { mockAssignments, getCourseById } from "@/lib/mocks";
import { DashShell } from "@/components/layout/DashShell";
import { Badge, Card, Field, Input, Textarea } from "@/components/ui/primitives";

const nav = [
  { href:"/student", label:"نظرة عامة" },
  { href:"/student/courses", label:"كورساتي" },
  { href:"/student/assignments", label:"الواجبات" },
  { href:"/student/exams", label:"الاختبارات" },
  { href:"/student/results", label:"النتائج" },
  { href:"/student/progress", label:"التقدم" },
  { href:"/student/notifications", label:"الإشعارات" },
  { href:"/student/profile", label:"الملف الشخصي" },
];

export default function Assignments(){
  const [submitted, setSubmitted] = useState<Record<string,boolean>>({});
  return <DashShell role="student" title="الواجبات" desc="سلّم واجباتك وتابع التصحيح وملاحظات المعلم." nav={nav}>
    <div className="grid gap-4">
      {mockAssignments.map(a=>{
        const course = getCourseById(a.courseId);
        const done = submitted[a.id];
        return <Card key={a.id} className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><h3 className="font-black">{a.title}</h3><p className="text-sm text-[var(--text-3)]">{course?.title} — حتى {a.deadline? new Date(a.deadline).toLocaleDateString("ar-EG"):"بدون موعد"}</p><p className="mt-2 text-sm leading-7 text-[var(--text-2)]">{a.description}</p></div>
            {done? <Badge tone="success">تم التسليم</Badge> : <Badge tone="warning">مطلوب</Badge>}
          </div>
          {!done ? <form className="mt-4 grid gap-3" onSubmit={e=>{e.preventDefault(); setSubmitted(s=>({...s,[a.id]:true}));}}>
            <Field label="إجابتك (نص)"><Textarea placeholder="اكتب إجابتك أو ضع رابط الملف..." /></Field>
            <Field label="رابط الملف (اختياري)"><Input placeholder="https://..." /></Field>
            <button className="btn-primary w-fit">إرسال الواجب</button>
            <span className="text-xs text-[var(--text-3)]">التسليم تجريبي محلي — يُربط بتخزين آمن وتصحيح المعلم لاحقًا.</span>
          </form> : <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm font-bold text-emerald-800">تم التسليم بنجاح — سيظهر التصحيح هنا عند تقييم المعلم.</div>}
        </Card>;
      })}
    </div>
  </DashShell>;
}
