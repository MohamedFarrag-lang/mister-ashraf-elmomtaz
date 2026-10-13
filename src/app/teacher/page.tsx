"use client";
import Link from "next/link";
import { mockAssignments, mockCourses, mockExams, mockWeeklyPackages } from "@/lib/mocks";
import { useAuth } from "@/lib/auth";
import { DashShell } from "@/components/layout/DashShell";
import { Badge, Card } from "@/components/ui/primitives";
import { usePackages } from "@/lib/usePackages";

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

export default function TeacherDash(){
  const { user } = useAuth();
  const { packages } = usePackages();
  const list = packages.length? packages: mockWeeklyPackages;
  if(!user || user.role!=="teacher") return <div className="mx-auto max-w-3xl px-4 py-16"><div className="card p-8 text-center">سجّل الدخول كمعلم — <Link href="/login" className="font-bold text-[var(--brand-700)]">دخول</Link><div className="text-xs text-[var(--text-3)]">teacher@test.com</div></div></div>;
  const published = list.filter(p=>p.status==="published").length;
  const draft = list.filter(p=>p.status==="draft").length;
  return <DashShell role="teacher" title="لوحة المعلم" desc="الباقات الأسبوعية هي المنتج الأساسي — مع إدارة كاملة للمنهج والأسعار." nav={nav}>
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="p-6"><div className="text-xs font-bold text-[var(--text-3)]">الباقات المنشورة</div><div className="text-2xl font-black">{published}</div></Card>
      <Card className="p-6"><div className="text-xs font-bold text-[var(--text-3)]">المسودات</div><div className="text-2xl font-black">{draft}</div></Card>
      <Card className="p-6"><div className="text-xs font-bold text-[var(--text-3)]">الاختبارات</div><div className="text-2xl font-black">{mockExams.length}</div></Card>
      <Card className="p-6"><div className="text-xs font-bold text-[var(--text-3)]">يجب تصحيحه</div><div className="text-2xl font-black">2</div><span className="text-xs text-amber-700">تجريبي</span></Card>
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-6">
        <h3 className="font-black">إجراءات سريعة</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/teacher/packages/new" className="btn-primary">+ باقة أسبوعية</Link>
          <Link href="/teacher/questions" className="btn-ghost">إضافة سؤال</Link>
          <Link href="/teacher/exams" className="btn-ghost">إنشاء اختبار</Link>
          <Link href="/teacher/codes" className="btn-ghost">توليد أكواد</Link>
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="font-black">آخر الباقات</h3>
        <div className="mt-3 grid gap-2">
          {list.slice(0,3).map(p=> <div key={p.id} className="flex items-center justify-between rounded-xl border border-[var(--line)] p-3 text-sm"><span className="font-bold">{p.title}</span><Badge tone={p.status==="published"?"success":"warning"}>{p.status}</Badge></div>)}
        </div>
        <Link href="/teacher/packages" className="mt-3 inline-flex text-sm font-bold text-[var(--brand-700)]">إدارة الباقات ←</Link>
      </Card>
    </div>
  </DashShell>;
}
