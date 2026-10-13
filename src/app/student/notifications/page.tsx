"use client";
import { useStore } from "@/lib/store";
import { DashShell } from "@/components/layout/DashShell";
import { Badge, Card } from "@/components/ui/primitives";
import Link from "next/link";

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
export default function Notifs(){
  const { notifications, markRead, markAllRead } = useStore();
  return <DashShell role="student" title="الإشعارات" desc="تنبيهات الواجبات والاختبارات والإعلانات." nav={nav}>
    <div className="flex justify-end"><button onClick={markAllRead} className="btn-ghost">تعليم الكل كمقروء</button></div>
    <div className="grid gap-3">
      {notifications.map(n=> <Card key={n.id} className={`p-4 ${!n.read? "border-[var(--brand-200)] bg-[var(--brand-50)]":""}`}>
        <div className="flex items-start justify-between gap-3">
          <div><div className="font-black">{n.title}</div><div className="text-sm text-[var(--text-2)]">{n.body}</div><div className="text-xs text-[var(--text-3)]">{new Date(n.createdAt).toLocaleString("ar-EG")}</div></div>
          <Badge tone={n.read? "neutral":"brand"}>{n.read? "مقروء":"جديد"}</Badge>
        </div>
        <div className="mt-3 flex gap-2">
          {!n.read && <button onClick={()=>markRead(n.id)} className="btn-ghost">تعليم كمقروء</button>}
          {n.href && <Link href={n.href} className="btn-ghost">فتح</Link>}
        </div>
      </Card>)}
    </div>
  </DashShell>;
}
