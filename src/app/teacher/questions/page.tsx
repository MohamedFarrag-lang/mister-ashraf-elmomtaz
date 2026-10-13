"use client";
import { useState } from "react";
import { mockQuestions } from "@/lib/mocks";
import { DashShell } from "@/components/layout/DashShell";
import { Badge, Card, Input, Select, Textarea } from "@/components/ui/primitives";
import type { Question, QuestionKind } from "@/lib/types";

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

export default function Questions(){
  const [list,setList]=useState<Question[]>(mockQuestions);
  const [kind,setKind]=useState<QuestionKind>("mcq");
  const [prompt,setPrompt]=useState("");
  const [opts,setOpts]=useState(["","","",""]);
  const [correct,setCorrect]=useState(0);
  const [filter,setFilter]=useState("الكل");

  const filtered = list.filter(q=> filter==="الكل" || q.category===filter);

  function add(){
    if(!prompt.trim()) return;
    const q: Question = {
      id:"q-"+Date.now(), kind, difficulty:"متوسط", category:"نحو", points:2, prompt: prompt.trim(),
      options: kind==="mcq"||kind==="multi_select"? opts.filter(Boolean): undefined,
      correctIndex: kind==="mcq"? correct: undefined,
      tags:["جديد"]
    };
    setList(prev=>[q, ...prev]); setPrompt("");
  }

  return <DashShell role="teacher" title="بنك الأسئلة" desc="أنشئ أسئلة قابلة لإعادة الاستخدام في الاختبارات — مع أنواع متعددة ودرجات." nav={nav}>
    <Card className="p-6 grid gap-4">
      <h3 className="font-black">إضافة سؤال جديد</h3>
      <div className="grid gap-3 md:grid-cols-[200px_1fr]">
        <Select value={kind} onChange={e=>setKind(e.target.value as QuestionKind)}>
          <option value="mcq">اختيار من متعدد</option>
          <option value="true_false">صح/خطأ</option>
          <option value="multi_select">متعدد</option>
          <option value="short">قصير</option>
          <option value="essay">مقالي</option>
        </Select>
        <Input placeholder="نص السؤال" value={prompt} onChange={e=>setPrompt(e.target.value)} />
      </div>
      {(kind==="mcq" || kind==="multi_select") && <div className="grid gap-2 md:grid-cols-2">
        {opts.map((o,i)=> <div key={i} className="flex gap-2"><Input value={o} onChange={e=>setOpts(p=>p.map((x,j)=>j===i? e.target.value:x))} placeholder={`اختيار ${i+1}`} /><label className="flex items-center gap-1 text-xs"><input type="radio" name="correct" checked={correct===i} onChange={()=>setCorrect(i)} /> صحيح</label></div>)}
      </div>}
      <button onClick={add} className="btn-primary w-fit">إضافة للبنك</button>
    </Card>

    <div className="flex gap-3">
      <Select value={filter} onChange={e=>setFilter(e.target.value)} className="w-40"><option>الكل</option><option>نحو</option><option>بلاغة</option><option>أدب</option></Select>
      <Badge>{filtered.length} سؤال</Badge>
    </div>

    <div className="grid gap-3">
      {filtered.map(q=> <Card key={q.id} className="p-4">
        <div className="flex flex-wrap gap-2"><Badge tone="brand">{q.kind}</Badge><Badge>{q.category}</Badge><Badge>{q.difficulty}</Badge><Badge>{q.points} د</Badge></div>
        <div className="mt-2 font-bold">{q.prompt}</div>
        {q.options && <ul className="mt-2 grid gap-1 text-sm text-[var(--text-2)]">{q.options.map((o,i)=> <li key={i} className={i===q.correctIndex? "font-black text-emerald-700":""}>— {o} {i===q.correctIndex? "✓":""}</li>)}</ul>}
        {q.explanation && <div className="mt-2 text-xs text-[var(--text-3)]">توضيح: {q.explanation}</div>}
      </Card>)}
    </div>
  </DashShell>;
}
