"use client";
import { useAuth } from "@/lib/auth";
import { DashShell } from "@/components/layout/DashShell";
import { Card, Field, Input } from "@/components/ui/primitives";
import { useState } from "react";

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
export default function Profile(){
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  if(!user) return <div className="p-10 text-center">سجّل الدخول</div>;
  return <DashShell role="student" title="الملف الشخصي" desc="بياناتك وإعدادات حسابك." nav={nav}>
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-[var(--brand-900)] text-lg font-black text-white">{user.name.slice(0,1)}</span>
        <div><div className="font-black">{user.name}</div><div className="text-sm text-[var(--text-3)]">{user.email}</div></div>
      </div>
      <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={e=>{e.preventDefault(); setSaved(true); setTimeout(()=>setSaved(false),2000);}}>
        <Field label="الاسم"><Input defaultValue={user.name} /></Field>
        <Field label="البريد"><Input defaultValue={user.email} /></Field>
        <Field label="الهاتف"><Input placeholder="01xxxxxxxxx" /></Field>
        <Field label="المرحلة"><Input placeholder="الصف الثالث الثانوي" /></Field>
        <button className="btn-primary md:col-span-2 w-fit">حفظ التعديلات</button>
        {saved && <span className="text-sm font-bold text-emerald-700">تم الحفظ محليًا (تجريبي)</span>}
      </form>
    </Card>
  </DashShell>;
}
