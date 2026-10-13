"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { DashShell } from "@/components/layout/DashShell";
import { Card, Field, Input, Textarea, Select } from "@/components/ui/primitives";
import { usePackages } from "@/lib/usePackages";
import { academicYears, grades, terms } from "@/lib/curriculum";
import { mockExams } from "@/lib/mocks";
import { getVideoProvider } from "@/lib/video";
import type { GradeId, TermId } from "@/lib/curriculum";

const nav = [
  { href:"/teacher", label:"نظرة عامة" },
  { href:"/teacher/packages", label:"الباقات الأسبوعية" },
  { href:"/teacher/builder", label:"منشئ الكورسات" },
  { href:"/teacher/questions", label:"بنك الأسئلة" },
  { href:"/teacher/exams", label:"الاختبارات" },
  { href:"/teacher/grading", label:"التصحيح" },
  { href:"/teacher/students", label:"الطلاب" },
  { href:"/teacher/live", label:"الحصص المباشرة" },
  { href:"/teacher/announcements", label:"الإعلانات" },
  { href:"/teacher/settings", label:"الإعدادات" },
];

export default function EditPackage(){
  const { id } = useParams<{id:string}>();
  const { packages, upsert } = usePackages();
  const pkg = packages.find(p=>p.id===id);
  const router = useRouter();
  const provider = getVideoProvider();
  const [err,setErr]=useState("");
  const [title,setTitle]=useState(pkg?.title??"");
  const [desc,setDesc]=useState(pkg?.description??"");
  const [grade,setGrade]=useState<GradeId>(pkg?.grade??"grade1");
  const [year,setYear]=useState(pkg?.academicYearId??academicYears[0].id);
  const [term,setTerm]=useState<TermId>(pkg?.term??"term1");
  const [week,setWeek]=useState(pkg?.weekNumber??1);
  const [expUrl,setExpUrl]=useState(pkg?.explanationVideo?.originalUrl??"");
  const [solUrl,setSolUrl]=useState(pkg?.solutionVideo?.originalUrl??"");
  const [examId,setExamId]=useState(pkg?.examId??"");
  const [priceCustom,setPriceCustom]=useState(pkg?.priceOverride!=null? String(pkg.priceOverride):"");
  const [status,setStatus]=useState(pkg?.status??"draft");

  if(!pkg) return <div className="mx-auto max-w-2xl p-10 text-center">الباقة غير موجودة</div>;

  function save(publish?: boolean){
    if(!pkg) return;
    const currentPkg = pkg;
    if(!title.trim()){ setErr("العنوان مطلوب"); return; }
    const expRef = expUrl.trim()? provider.parse(expUrl): null;
    const solRef = solUrl.trim()? provider.parse(solUrl): null;
    if(expUrl.trim() && !expRef){ setErr("رابط فيديو الشرح غير صالح"); return; }
    if(solUrl.trim() && !solRef){ setErr("رابط فيديو الحل غير صالح"); return; }
    let priceOverride: number | null = null;
    if(priceCustom.trim()!==""){ const n=Number(priceCustom); if(!Number.isFinite(n)||n<0){ setErr("السعر غير صالح"); return; } priceOverride=n; }
    const updated = { ...currentPkg, title: title.trim(), description: desc.trim(), grade, academicYearId: year, term, weekNumber: week, explanationVideo: expRef, solutionVideo: solRef, examId: examId||null, priceOverride, status: (publish? "published": status) as typeof currentPkg.status, updatedAt: new Date().toISOString(), publishedAt: publish? new Date().toISOString(): currentPkg.publishedAt };
    upsert(updated);
    router.push("/teacher/packages");
  }

  return <DashShell role="teacher" title={`تعديل: ${pkg.title}`} nav={nav}>
    <Card className="p-6 grid gap-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Field label="الصف"><Select value={grade} onChange={e=>setGrade(e.target.value as GradeId)}>{grades.map(g=><option key={g.id} value={g.id}>{g.label}</option>)}</Select></Field>
        <Field label="العام"><Select value={year} onChange={e=>setYear(e.target.value)}>{academicYears.map(y=><option key={y.id} value={y.id}>{y.label}</option>)}</Select></Field>
        <Field label="الترم"><Select value={term} onChange={e=>setTerm(e.target.value as TermId)}>{terms.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}</Select></Field>
        <Field label="الأسبوع"><Input type="number" value={week} onChange={e=>setWeek(Number(e.target.value))} /></Field>
      </div>
      <Field label="العنوان"><Input value={title} onChange={e=>setTitle(e.target.value)} /></Field>
      <Field label="الوصف"><Textarea value={desc} onChange={e=>setDesc(e.target.value)} /></Field>
      <Field label="فيديو الشرح — YouTube Unlisted"><Input value={expUrl} onChange={e=>setExpUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." /></Field>
      <Field label="فيديو الحل — YouTube Unlisted"><Input value={solUrl} onChange={e=>setSolUrl(e.target.value)} /></Field>
      <Field label="الامتحان"><Select value={examId??""} onChange={e=>setExamId(e.target.value)}><option value="">بدون امتحان</option>{mockExams.map(ex=><option key={ex.id} value={ex.id}>{ex.title}</option>)}</Select></Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="سعر مخصص (فارغ = الافتراضي)"><Input value={priceCustom} onChange={e=>setPriceCustom(e.target.value)} type="number" /></Field>
        <Field label="الحالة"><Select value={status} onChange={e=>setStatus(e.target.value as never)}><option value="draft">مسودة</option><option value="scheduled">مجدولة</option><option value="published">منشورة</option><option value="archived">مؤرشفة</option></Select></Field>
      </div>
      {err && <div className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{err}</div>}
      <div className="flex gap-3">
        <button onClick={()=>save(false)} className="btn-ghost">حفظ</button>
        <button onClick={()=>save(true)} className="btn-primary">نشر</button>
      </div>
    </Card>
  </DashShell>;
}
