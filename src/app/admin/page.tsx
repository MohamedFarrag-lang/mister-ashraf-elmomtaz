"use client";
import Link from "next/link";
import { mockCourses } from "@/lib/mocks";
import { useAuth } from "@/lib/auth";
import { DashShell } from "@/components/layout/DashShell";
import { Card } from "@/components/ui/primitives";

const nav = [
  { href:"/admin", label:"نظرة عامة" },
  { href:"/admin/users", label:"المستخدمون" },
  { href:"/admin/courses", label:"الكورسات" },
  { href:"/admin/analytics", label:"التحليلات" },
];

export default function Admin(){
  const { user } = useAuth();
  if(!user || user.role!=="admin") return <div className="mx-auto max-w-3xl px-4 py-16"><div className="card p-8 text-center">سجّل الدخول كإدارة — <Link href="/login" className="font-bold text-[var(--brand-700)]">دخول</Link><div className="text-xs text-[var(--text-3)]">admin@test.com</div></div></div>;
  return <DashShell role="admin" title="لوحة الإدارة" desc="إدارة المنصة والمستخدمين والمحتوى." nav={nav}>
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-6"><div className="text-xs text-[var(--text-3)]">إجمالي المستخدمين</div><div className="text-2xl font-black">—</div><div className="text-xs text-[var(--text-3)]">يُعرض فقط عند توفر بيانات حقيقية</div></Card>
      <Card className="p-6"><div className="text-xs text-[var(--text-3)]">الكورسات</div><div className="text-2xl font-black">{mockCourses.length}</div></Card>
      <Card className="p-6"><div className="text-xs text-[var(--text-3)]">الاشتراكات</div><div className="text-2xl font-black">—</div><div className="text-xs text-[var(--text-3)]">يُربط بنظام الدفع لاحقًا</div></Card>
    </div>
    <Card className="p-6">
      <h3 className="font-black">روابط سريعة</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link href="/admin/users" className="btn-ghost">المستخدمون</Link>
        <Link href="/admin/courses" className="btn-ghost">الكورسات</Link>
        <Link href="/admin/analytics" className="btn-ghost">التحليلات</Link>
      </div>
    </Card>
  </DashShell>;
}
