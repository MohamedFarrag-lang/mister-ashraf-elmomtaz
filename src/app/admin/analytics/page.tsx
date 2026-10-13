"use client";
import { DashShell } from "@/components/layout/DashShell";
import { Card } from "@/components/ui/primitives";
const nav = [
  { href:"/admin", label:"نظرة عامة" },
  { href:"/admin/users", label:"المستخدمون" },
  { href:"/admin/courses", label:"الكورسات" },
  { href:"/admin/analytics", label:"التحليلات" },
];
export default function Analytics(){
  return <DashShell role="admin" title="التحليلات" desc="مقاييس تعليمية — تُعرض فقط عند توفر بيانات حقيقية." nav={nav}>
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-6"><h3 className="font-black">التسجيلات</h3><p className="text-sm text-[var(--text-3)]">يُحسب من جدول الاشتراكات الحقيقي — لا أرقام وهمية.</p><div className="mt-4 h-24 rounded-xl bg-[var(--surface-3)] grid place-items-center text-xs text-[var(--text-3)]">رسم بياني يظهر عند توفر البيانات</div></Card>
      <Card className="p-6"><h3 className="font-black">معدلات الإكمال</h3><p className="text-sm text-[var(--text-3)]">نسبة إكمال الدروس والواجبات والاختبارات.</p><div className="mt-4 h-24 rounded-xl bg-[var(--surface-3)] grid place-items-center text-xs text-[var(--text-3)]">رسم بياني يظهر عند توفر البيانات</div></Card>
    </div>
  </DashShell>;
}
