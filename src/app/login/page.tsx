"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Card, Field, Input } from "@/components/ui/primitives";

export default function Login(){
  const { login } = useAuth();
  const r = useRouter();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  return <div className="mx-auto max-w-md px-4 py-10">
    <Card className="p-6 md:p-8">
      <h1 className="text-2xl font-black">تسجيل الدخول</h1>
      <p className="mt-1 text-sm text-[var(--text-3)]">ادخل برقم الهاتف أو البريد — جرّب: student@test.com / teacher@test.com / admin@test.com (أي كلمة مرور 4+ أحرف، تجريبي).</p>
      <form className="mt-6 grid gap-4" onSubmit={async e=>{
        e.preventDefault();
        const fd = new FormData(e.currentTarget as HTMLFormElement);
        setLoading(true); setErr("");
        const identifier = String(fd.get("identifier")||"");
        const res = await login(identifier, String(fd.get("password")||""));
        setLoading(false);
        if(!res.ok) setErr(res.error||"خطأ");
        else {
          // انتظر حفظ الكوكيز والـ localStorage ثم انتقل مع احترام ?next=
          const params = new URLSearchParams(window.location.search);
          const next = params.get("next");
          const u = JSON.parse(localStorage.getItem("elmomtaz.user")||"{}");
          await new Promise(r=>setTimeout(r, 250));
          if(next) r.push(next);
          else if(u.role==="teacher") r.push("/teacher");
          else if(u.role==="admin") r.push("/admin");
          else r.push("/student");
        }
      }}>
        <Field label="رقم الهاتف أو البريد الإلكتروني"><Input name="identifier" required placeholder="01xxxxxxxxx أو you@example.com" /></Field>
        <Field label="كلمة المرور"><Input name="password" type="password" required placeholder="••••••••" /></Field>
        {err && <div className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{err}</div>}
        <button disabled={loading} className="btn-primary disabled:opacity-60">{loading? "جاري الدخول..." : "دخول"}</button>
        <div className="flex flex-col gap-2 text-sm">
          <Link href="/register" className="font-bold text-[var(--brand-700)]">إنشاء حساب جديد</Link>
          <span className="text-xs text-[var(--text-3)]">تذكرني (JWT Refresh Token) + قفل جهاز واحد : يُطبق عند ربط خلفية حقيقية — حاليًا محفوظ محليًا مع ربط جهاز بالـ deviceId.</span>
        </div>
      </form>
    </Card>
  </div>;
}
