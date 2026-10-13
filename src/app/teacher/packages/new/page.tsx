"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashShell } from "@/components/layout/DashShell";
import { Card, Field, Input, Textarea, Select, Badge } from "@/components/ui/primitives";
import { academicYears, grades, terms } from "@/lib/curriculum";
import { mockExams } from "@/lib/mocks";
import { getDefaultPricing, formatEgp } from "@/lib/pricing";
import { getVideoProvider } from "@/lib/video";
import { usePackages } from "@/lib/usePackages";
import type { WeeklyPackage } from "@/lib/types";
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

export default function NewPackage(){
  const router = useRouter();
  const { upsert } = usePackages();
  const [grade,setGrade]=useState<GradeId>("grade1");
  const [year,setYear]=useState(academicYears[0].id);
  const [term,setTerm]=useState<TermId>("term1");
  const [week,setWeek]=useState(1);
  const [title,setTitle]=useState("");
  const [desc,setDesc]=useState("");
  const [expUrl,setExpUrl]=useState("");
  const [solUrl,setSolUrl]=useState("");
  const [examId,setExamId]=useState<string>("");
  const [priceCustom,setPriceCustom]=useState("");
  const [status,setStatus]=useState<WeeklyPackage["status"]>("draft");
  const [err,setErr]=useState("");

  const pricing = getDefaultPricing();
  const provider = getVideoProvider();

  function validateAndSave(publish: boolean){
    if(!title.trim() || !desc.trim()){ setErr("العنوان والوصف مطلوبان"); return; }
    const expRef = expUrl.trim()? provider.parse(expUrl): null;
    const solRef = solUrl.trim()? provider.parse(solUrl): null;
    if(expUrl.trim() && !expRef){ setErr("رابط فيديو الشرح غير صالح — الصق رابط youtube.com/watch أو youtu.be"); return; }
    if(solUrl.trim() && !solRef){ setErr("رابط فيديو الحل غير صالح"); return; }
    if(publish && !expRef){ setErr("لا يمكن النشر بدون فيديو شرح"); return; }
    let priceOverride: number | null = null;
    if(priceCustom.trim()!==""){ const n=Number(priceCustom); if(!Number.isFinite(n)||n<0){ setErr("السعر غير صالح"); return; } priceOverride=n; }
    const slug = `grade-${grade}-${year}-${term}-w${week}-${title.trim().slice(0,20).replace(/\s+/g,"-") || Date.now()}`.toLowerCase().replace(/[^a-z0-9-]/g,"-").slice(0,60);
    const pkg: WeeklyPackage = {
      id: `wp-${Date.now()}`, slug, title: title.trim(), description: desc.trim(),
      grade, academicYearId: year, term, weekNumber: week,
      explanationVideo: expRef, solutionVideo: solRef, examId: examId||null,
      priceOverride, status: publish? "published": status, publishedAt: publish? new Date().toISOString(): null,
      productType: "weekly", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    upsert(pkg);
    router.push("/teacher/packages");
  }

  return <DashShell role="teacher" title="باقة أسبوعية جديدة" desc="املأ البيانات — فيديو الشرح/الحل برابط يوتيوب Unlisted فقط، مع امتحان وسعر." nav={nav}>
    <Card className="p-6 grid gap-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Field label="الصف"><Select value={grade} onChange={e=>setGrade(e.target.value as GradeId)}>{grades.map(g=><option key={g.id} value={g.id}>{g.label}</option>)}</Select></Field>
        <Field label="العام الدراسي"><Select value={year} onChange={e=>setYear(e.target.value)}>{academicYears.map(y=><option key={y.id} value={y.id}>{y.label}</option>)}</Select></Field>
        <Field label="الترم"><Select value={term} onChange={e=>setTerm(e.target.value as TermId)}>{terms.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}</Select></Field>
        <Field label="رقم الأسبوع"><Input type="number" min={1} max={16} value={week} onChange={e=>setWeek(Number(e.target.value))} /></Field>
      </div>
      <Field label="عنوان الباقة"><Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="مثال: الأسبوع الأول — مدخل النحو" /></Field>
      <Field label="الوصف"><Textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="ما سيتعلمه الطالب هذا الأسبوع..." /></Field>
      <Field label="فيديو الشرح — رابط يوتيوب Unlisted" hint="الصق رابط youtube.com/watch أو youtu.be — النظام يستخرج الـ ID تلقائيًا"><Input value={expUrl} onChange={e=>setExpUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." /></Field>
      <Field label="فيديو الحل — رابط يوتيوب Unlisted (اختياري)"><Input value={solUrl} onChange={e=>setSolUrl(e.target.value)} placeholder="https://youtu.be/..." /></Field>
      <Field label="الامتحان المرتبط (اختياري)"><Select value={examId} onChange={e=>setExamId(e.target.value)}><option value="">بدون امتحان</option>{mockExams.map(ex=><option key={ex.id} value={ex.id}>{ex.title}</option>)}</Select></Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={`السعر (افتراضي ${formatEgp(pricing.defaultWeeklyPriceEgp)}) — اتركه فارغًا لاستخدام الافتراضي`}><Input value={priceCustom} onChange={e=>setPriceCustom(e.target.value)} placeholder="20" type="number" /></Field>
        <Field label="الحالة"><Select value={status} onChange={e=>setStatus(e.target.value as WeeklyPackage["status"])}><option value="draft">مسودة</option><option value="scheduled">مجدولة</option><option value="published">منشورة</option></Select></Field>
      </div>
      {err && <div className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{err}</div>}
      <div className="flex gap-3">
        <button onClick={()=>validateAndSave(false)} className="btn-ghost">حفظ كمسودة</button>
        <button onClick={()=>validateAndSave(true)} className="btn-primary">نشر الباقة</button>
        <Badge>المزود النشط: youtube (قابل للتبديل لـ Bunny من lib/video)</Badge>
      </div>
    </Card>
  </DashShell>;
}
