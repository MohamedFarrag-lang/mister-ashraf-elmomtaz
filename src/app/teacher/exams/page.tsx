"use client";
import { useState } from "react";
import { mockCourses, mockExams, mockQuestions } from "@/lib/mocks";
import { DashShell } from "@/components/layout/DashShell";
import { Badge, Card, Field, Input, Select, Textarea } from "@/components/ui/primitives";

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

export default function Exams(){
  const [exams,setExams]=useState(mockExams);
  const [title,setTitle]=useState("");
  const [courseId,setCourseId]=useState(mockCourses[0]?.id ?? "");
  const [duration,setDuration]=useState(20);
  const [selected,setSelected]=useState<string[]>([]);

  function create(){
    if(!title.trim() || selected.length===0) return;
    const qs = mockQuestions.filter(q=> selected.includes(q.id));
    setExams(prev=>[{ id:"ex-"+Date.now(), courseId, title: title.trim(), description:"اختبار جديد", durationMin:duration, passingScore:60, questions:qs, status:"published" }, ...prev]);
    setTitle(""); setSelected([]);
  }

  return <DashShell role="teacher" title="الاختبارات" desc="أنشئ اختبارات من بنك الأسئلة — حدد المدة ودرجة النجاح وسياسة الإجابات." nav={nav}>
    <Card className="p-6 grid gap-4">
      <h3 className="font-black">إنشاء اختبار</h3>
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="عنوان الاختبار"><Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="اختبار نحو — الوحدة..." /></Field>
        <Field label="الكورس"><Select value={courseId} onChange={e=>setCourseId(e.target.value)}>{mockCourses.map(c=> <option key={c.id} value={c.id}>{c.title}</option>)}</Select></Field>
        <Field label="المدة (دقائق)"><Input type="number" value={duration} onChange={e=>setDuration(Number(e.target.value))} /></Field>
      </div>
      <div>
        <div className="text-sm font-black">اختر أسئلة من البنك</div>
        <div className="mt-2 grid gap-2">
          {mockQuestions.map(q=> <label key={q.id} className="flex items-center gap-3 rounded-xl border border-[var(--line)] p-3 text-sm">
            <input type="checkbox" checked={selected.includes(q.id)} onChange={e=> setSelected(s=> e.target.checked? [...s,q.id] : s.filter(x=>x!==q.id))} />
            <span className="font-bold">{q.prompt}</span><Badge>{q.category}</Badge>
          </label>)}
        </div>
      </div>
      <button onClick={create} className="btn-primary w-fit">إنشاء الاختبار</button>
    </Card>

    <div className="grid gap-3">
      {exams.map(e=> <Card key={e.id} className="p-5 flex flex-wrap items-center justify-between gap-3">
        <div><div className="font-black">{e.title}</div><div className="text-sm text-[var(--text-3)]">{mockCourses.find(c=>c.id===e.courseId)?.title} • {e.durationMin} د • {e.questions.length} أسئلة</div></div>
        <Badge tone="success">منشور</Badge>
      </Card>)}
    </div>
  </DashShell>;
}
