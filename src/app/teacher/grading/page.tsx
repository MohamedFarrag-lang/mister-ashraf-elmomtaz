"use client";
import { useState } from "react";
import { DashShell } from "@/components/layout/DashShell";
import { Badge, Card, Field, Input, Textarea } from "@/components/ui/primitives";

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

const mockSubs = [
  { id:"s1", student:"أحمد محمد", course:"تأسيس — من الصفر", title:"واجب الوحدة الأولى", state:"submitted", text:"إجابات الطالب هنا..." },
  { id:"s2", student:"سارة علي", course:"النحو المتقن", title:"سؤال مقالي — أهمية القراءة", state:"submitted", text:"القراءة مهمة لأنها..." },
];

export default function Grading(){
  const [grades,setGrades]=useState<Record<string,{score:string; feedback:string; done:boolean}>>({});
  return <DashShell role="teacher" title="التصحيح والمراجعة" desc="راجع التسليمات — صحح المقالي يدويًا وأرسل الملاحظات." nav={nav}>
    <div className="grid gap-4">
      {mockSubs.map(s=>{
        const g = grades[s.id] || { score:"", feedback:"", done:false };
        return <Card key={s.id} className="p-6 grid gap-4">
          <div className="flex flex-wrap justify-between gap-3">
            <div><div className="font-black">{s.title} — {s.student}</div><div className="text-sm text-[var(--text-3)]">{s.course}</div></div>
            <Badge tone={g.done? "success":"warning"}>{g.done? "تم التصحيح":"بانتظار التصحيح"}</Badge>
          </div>
          <div className="rounded-xl bg-[var(--surface-3)] p-4 text-sm leading-7">{s.text}</div>
          <div className="grid gap-3 md:grid-cols-[140px_1fr]">
            <Field label="الدرجة"><Input value={g.score} onChange={e=>setGrades(p=>({...p,[s.id]:{...g, score:e.target.value}}))} placeholder="8/10" /></Field>
            <Field label="ملاحظات المعلم"><Input value={g.feedback} onChange={e=>setGrades(p=>({...p,[s.id]:{...g, feedback:e.target.value}}))} placeholder="أحسنت، انتبه لـ..." /></Field>
          </div>
          <button onClick={()=>setGrades(p=>({...p,[s.id]:{...g, done:true}}))} className="btn-primary w-fit">حفظ التصحيح</button>
        </Card>;
      })}
    </div>
  </DashShell>;
}
