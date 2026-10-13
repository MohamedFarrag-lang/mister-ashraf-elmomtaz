"use client";
import { useState } from "react";
import { DashShell } from "@/components/layout/DashShell";
import { Card, Field, Input, Textarea, Select, Badge } from "@/components/ui/primitives";

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

export default function Builder(){
  const [modules,setModules]=useState<{title:string; lessons:{title:string;duration:string;type:string}[]}[]>([
    { title:"الوحدة الأولى — مدخل", lessons:[{title:"الدرس 1 — الجملة", duration:"18 د", type:"video"}] }
  ]);
  const [saved,setSaved]=useState(false);
  return <DashShell role="teacher" title="منشئ الكورسات" desc="بنية حقيقية: كورس ← وحدات ← دروس ← موارد. الحفظ تجريبي محلي." nav={nav}>
    <Card className="p-6 grid gap-4">
      <h3 className="font-black">المعلومات الأساسية</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="عنوان الكورس"><Input placeholder="مثال: النحو المُتقن — 3 ث" /></Field>
        <Field label="المستوى"><Select><option>تأسيس</option><option>الصف الأول الثانوي</option><option>الصف الثاني الثانوي</option><option>الصف الثالث الثانوي</option></Select></Field>
        <Field label="التصنيف"><Select><option>نحو</option><option>بلاغة</option><option>أدب</option><option>مراجعة نهائية</option></Select></Field>
        <Field label="السعر (اتركه فارغًا للمجاني)"><Input placeholder="450" /></Field>
        <Field label="الوصف المختصر" hint="يظهر في بطاقة الكورس"><Input placeholder="شرح مركز بترتيب الامتحان..." /></Field>
        <Field label="حالة النشر"><Select><option>مسودة</option><option>منشور</option></Select></Field>
      </div>
      <Field label="الوصف التفصيلي"><Textarea placeholder="اكتب وصفًا تفصيليًا للكورس..." /></Field>
    </Card>

    <Card className="p-6 grid gap-4">
      <div className="flex items-center justify-between"><h3 className="font-black">الوحدات والدروس</h3><Badge>{modules.length} وحدات</Badge></div>
      {modules.map((m,mi)=> <div key={mi} className="rounded-xl border border-[var(--line)] p-4 grid gap-3">
        <div className="flex gap-3">
          <Input value={m.title} onChange={e=>setModules(prev=>prev.map((x,i)=>i===mi? {...x,title:e.target.value}:x))} className="flex-1" />
          <button onClick={()=>setModules(prev=>prev.filter((_,i)=>i!==mi))} className="btn-ghost">حذف</button>
        </div>
        {m.lessons.map((l,li)=> <div key={li} className="grid gap-2 rounded-xl bg-[var(--surface-3)] p-3 md:grid-cols-[1.2fr_.4fr_.4fr_auto]">
          <Input value={l.title} onChange={e=>setModules(prev=>prev.map((x,i)=>i===mi? {...x, lessons: x.lessons.map((y,j)=>j===li? {...y,title:e.target.value}:y)}:x))} placeholder="عنوان الدرس" />
          <Input value={l.duration} onChange={e=>setModules(prev=>prev.map((x,i)=>i===mi? {...x, lessons: x.lessons.map((y,j)=>j===li? {...y,duration:e.target.value}:y)}:x))} placeholder="المدة" />
          <Select value={l.type} onChange={e=>setModules(prev=>prev.map((x,i)=>i===mi? {...x, lessons: x.lessons.map((y,j)=>j===li? {...y,type:e.target.value}:y)}:x))}><option value="video">فيديو</option><option value="reading">قراءة</option></Select>
          <button onClick={()=>setModules(prev=>prev.map((x,i)=>i===mi? {...x, lessons: x.lessons.filter((_,j)=>j!==li)}:x))} className="btn-ghost">×</button>
        </div>)}
        <button onClick={()=>setModules(prev=>prev.map((x,i)=>i===mi? {...x, lessons:[...x.lessons,{title:"درس جديد",duration:"15 د",type:"video"}]}:x))} className="btn-ghost w-fit">+ إضافة درس</button>
      </div>)}
      <button onClick={()=>setModules(prev=>[...prev,{title:`الوحدة ${prev.length+1}`, lessons:[]}])} className="btn-ghost w-fit">+ إضافة وحدة</button>
    </Card>

    <div className="flex gap-3">
      <button onClick={()=>{setSaved(true); setTimeout(()=>setSaved(false),2000);}} className="btn-primary">حفظ الكورس</button>
      <span className="text-sm text-[var(--text-3)]">الحفظ محلي تجريبي — عند ربط خلفية حقيقية تُرسل البيانات عبر خدمة الكورسات.</span>
      {saved && <Badge tone="success">تم الحفظ</Badge>}
    </div>
  </DashShell>;
}
