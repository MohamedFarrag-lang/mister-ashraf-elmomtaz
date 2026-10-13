"use client";
import { useState, useEffect } from "react";
import { DashShell } from "@/components/layout/DashShell";
import { Card, Field, Input, Select, Badge } from "@/components/ui/primitives";
import { usePackages } from "@/lib/usePackages";
import { loadCodes, createActivationCode, saveCodes } from "@/lib/commerce";
import type { ActivationCode } from "@/lib/types";

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
  { href:"/teacher/codes", label:"أكواد التفعيل" },
];

export default function Codes(){
  const { packages } = usePackages();
  const [pkgId,setPkgId]=useState<string>("");
  const [count,setCount]=useState(5);
  const [mode,setMode]=useState<"single"|"bulk">("single");
  const [list,setList]=useState<ActivationCode[]>([]);
  const [copied,setCopied]=useState<string|null>(null);
  const [filterStatus,setFilterStatus]=useState<"all"|"new"|"used">("all");

  useEffect(()=>{ setList(loadCodes()); },[]);
  useEffect(()=>{ if(packages.length && !pkgId) setPkgId(packages[0].id); },[packages, pkgId]);

  function generate(){
    if(!pkgId){ alert("اختر الباقة أولًا"); return; }
    const n = mode==="single" ? 1 : Math.min(50, Math.max(1, count));
    for(let i=0;i<n;i++) createActivationCode(pkgId, 1);
    setList(loadCodes());
  }

  function copyCode(code: string){
    navigator.clipboard.writeText(code).then(()=>{
      setCopied(code);
      setTimeout(()=> setCopied(null), 1500);
    });
  }

  const filtered = list.filter(c=>{
    if(filterStatus==="new") return c.usedCount===0;
    if(filterStatus==="used") return c.usedCount>0;
    return true;
  });

  return <DashShell role="teacher" title="أكواد التفعيل" nav={nav}>
    <Card className="p-6 grid gap-4">
      <div className="flex gap-2">
        <button onClick={()=>setMode("single")} className={`rounded-full px-5 py-2 text-sm font-black border ${mode==="single" ? "bg-[var(--brand-900)] text-white border-[var(--brand-900)]" : "bg-white border-[var(--line)]"}`}>كود واحد</button>
        <button onClick={()=>setMode("bulk")} className={`rounded-full px-5 py-2 text-sm font-black border ${mode==="bulk" ? "bg-[var(--brand-900)] text-white border-[var(--brand-900)]" : "bg-white border-[var(--line)]"}`}>دفعة أكواد</button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Field label="الباقة المخصصة"><Select value={pkgId} onChange={e=>setPkgId(e.target.value)}>{packages.length===0 ? <option value="">لا توجد باقات</option> : packages.map(p=><option key={p.id} value={p.id}>{p.title} — الأسبوع {p.weekNumber} ({p.academicYearId})</option>)}</Select></Field>
        {mode==="bulk" && <Field label="عدد الأكواد (1–50)"><Input type="number" min={1} max={50} value={count} onChange={e=>setCount(Number(e.target.value))} /></Field>}
        <div className="flex items-end"><button onClick={generate} className="btn-primary w-full">{mode==="single" ? "توليد كود واحد" : `توليد ${count} أكواد`}</button></div>
      </div>
      <p className="text-xs text-[var(--text-3)]">الكود لمرة واحدة — يُستهلك عند أول استخدام.</p>
    </Card>

    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex gap-2">
        <button onClick={()=>setFilterStatus("all")} className={`rounded-full px-4 py-1.5 text-xs font-bold border ${filterStatus==="all" ? "bg-[var(--brand-900)] text-white" : "bg-white"}`}>الكل ({list.length})</button>
        <button onClick={()=>setFilterStatus("new")} className={`rounded-full px-4 py-1.5 text-xs font-bold border ${filterStatus==="new" ? "bg-emerald-600 text-white" : "bg-white"}`}>جديد ({list.filter(c=>c.usedCount===0).length})</button>
        <button onClick={()=>setFilterStatus("used")} className={`rounded-full px-4 py-1.5 text-xs font-bold border ${filterStatus==="used" ? "bg-amber-600 text-white" : "bg-white"}`}>مُستخدَم ({list.filter(c=>c.usedCount>0).length})</button>
      </div>
      <Badge>{filtered.length} كود</Badge>
    </div>

    {filtered.length===0? <Card className="p-8 text-center text-sm text-[var(--text-3)]">لم يتم توليد أكواد بعد — اختر باقة واضغط توليد</Card> :
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--surface-3)]"><tr><th className="p-3 text-right">الكود</th><th className="p-3 text-right">المحاضرة / الباقة</th><th className="p-3">الحالة</th><th className="p-3 text-right">الطالب الذي استخدمه</th><th className="p-3">تاريخ التفعيل</th><th className="p-3">إجراء</th></tr></thead>
            <tbody>
              {filtered.map(c=>{
                const pkg = packages.find(p=>p.id===c.packageId);
                const isUsed = c.usedCount>0;
                return <tr key={c.code} className="border-t border-[var(--line)] hover:bg-[var(--surface-3)]/50">
                  <td className="p-3 font-mono font-bold whitespace-nowrap" dir="ltr">{c.code}</td>
                  <td className="p-3 max-w-[220px] truncate">{pkg?.title??"—"}</td>
                  <td className="p-3"><Badge tone={isUsed?"warning":"success"}>{isUsed?"مُستخدَم":"جديد"}</Badge></td>
                  <td className="p-3">{isUsed ? <span className="font-bold">{c.usedByStudentName ?? c.usedByStudentId ?? "—"}</span> : <span className="text-[var(--text-3)]">—</span>}</td>
                  <td className="p-3 text-xs whitespace-nowrap">{c.usedAt ? new Date(c.usedAt).toLocaleString("ar-EG") : "—"}</td>
                  <td className="p-3"><button onClick={()=>copyCode(c.code)} className="rounded-full border border-[var(--line)] bg-white px-3 py-1 text-xs font-bold hover:bg-[var(--surface-3)]">{copied===c.code ? "تم النسخ ✓" : "نسخ الكود"}</button></td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
      </div>
    }
  </DashShell>;
}
