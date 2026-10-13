"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Card, Field, Input, Select } from "@/components/ui/primitives";

const GOVS = ["القاهرة","الجيزة","الإسكندرية","الدقهلية","الشرقية","المنوفية","القليوبية","البحيرة","الغربية","كفر الشيخ","دمياط","بورسعيد","الإسماعيلية","السويس","الفيوم","بني سويف","المنيا","أسيوط","سوهاج","قنا","الأقصر","أسوان","مطروح","شمال سيناء","جنوب سيناء","البحر الأحمر","الوادي الجديد"];

export default function Register(){
  const { register } = useAuth();
  const r = useRouter();
  const [err, setErr] = useState("");
  return <div className="mx-auto max-w-md px-4 py-10">
    <Card className="p-6 md:p-8">
      <h1 className="text-2xl font-black">إنشاء حساب طالب</h1>
      <p className="text-sm text-[var(--text-3)]">التسجيل برقم الهاتف (فودافون/أورنج/اتصالات/WE) + رقم ولي الأمر + المحافظة/المركز/القرية.</p>
      <form className="mt-6 grid gap-4" onSubmit={async e=>{
        e.preventDefault();
        const fd = new FormData(e.currentTarget as HTMLFormElement);
        const res = await register({
          name: String(fd.get("name")||""),
          phone: String(fd.get("phone")||""),
          password: String(fd.get("password")||""),
          guardianPhone: String(fd.get("guardianPhone")||""),
          governorate: String(fd.get("governorate")||""),
          district: String(fd.get("district")||""),
          village: String(fd.get("village")||""),
        });
        if(!res.ok) setErr(res.error||"خطأ");
        else r.push("/student");
      }}>
        <Field label="الاسم الكامل"><Input name="name" required placeholder="أحمد محمد" /></Field>
        <Field label="رقم هاتف الطالب" hint="01xxxxxxxxx"><Input name="phone" required placeholder="010xxxxxxxx" pattern="01[0-9]{9}" /></Field>
        <Field label="كلمة المرور" hint="4 أحرف على الأقل"><Input name="password" type="password" required /></Field>
        <Field label="رقم هاتف ولي الأمر"><Input name="guardianPhone" required placeholder="011xxxxxxxx" pattern="01[0-9]{9}" /></Field>
        <Field label="المحافظة"><Select name="governorate" required defaultValue=""><option value="" disabled>اختر المحافظة</option>{GOVS.map(g=><option key={g} value={g}>{g}</option>)}</Select></Field>
        <Field label="المركز / الحي"><Input name="district" required placeholder="مثلاً: مدينة نصر" /></Field>
        <Field label="القرية (إن وجدت)" hint="اختياري"><Input name="village" placeholder="—" /></Field>
        {err && <div className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{err}</div>}
        <button className="btn-primary">إنشاء الحساب</button>
        <Link href="/login" className="text-center text-sm font-bold text-[var(--brand-700)]">لديك حساب؟ سجّل الدخول</Link>
        <p className="text-center text-xs text-[var(--text-3)]">حساب تجريبي محلي — يُربط بمصادقة JWT حقيقية + ربط جهاز لاحقًا.</p>
      </form>
    </Card>
  </div>;
}
