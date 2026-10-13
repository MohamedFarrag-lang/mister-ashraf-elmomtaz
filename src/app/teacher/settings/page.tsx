"use client";
import { useState, useEffect } from "react";
import { DashShell } from "@/components/layout/DashShell";
import { Card, Field, Input, Badge } from "@/components/ui/primitives";
import { getDefaultPricing, saveDefaultPricing } from "@/lib/pricing";

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

export default function Settings(){
  const [price,setPrice]=useState(20);
  const [saved,setSaved]=useState(false);
  useEffect(()=>{ setPrice(getDefaultPricing().defaultWeeklyPriceEgp); },[]);
  return <DashShell role="teacher" title="الإعدادات" nav={nav}>
    <Card className="p-6 grid gap-4">
      <h3 className="font-black">التسعير</h3>
      <Field label="السعر الافتراضي للباقة الأسبوعية (جنيه)"><Input type="number" value={price} onChange={e=>setPrice(Number(e.target.value))} /></Field>
      <div className="flex gap-3">
        <button onClick={()=>{ saveDefaultPricing({ defaultWeeklyPriceEgp: price, currency:"EGP" }); setSaved(true); setTimeout(()=>setSaved(false),2000); }} className="btn-primary">حفظ التسعير</button>
        {saved && <Badge tone="success">تم الحفظ</Badge>}
      </div>
    </Card>
  </DashShell>;
}
