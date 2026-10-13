"use client";
import { mockCourses } from "@/lib/mocks";
import { DashShell } from "@/components/layout/DashShell";
import { Card, Badge } from "@/components/ui/primitives";
const nav = [
  { href:"/admin", label:"نظرة عامة" },
  { href:"/admin/users", label:"المستخدمون" },
  { href:"/admin/courses", label:"الكورسات" },
  { href:"/admin/analytics", label:"التحليلات" },
];
export default function AdminCourses(){
  return <DashShell role="admin" title="إدارة الكورسات" nav={nav}>
    <div className="grid gap-3">
      {mockCourses.map(c=> <Card key={c.id} className="flex justify-between p-4"><span className="font-bold">{c.title}</span><Badge>{c.status}</Badge></Card>)}
    </div>
  </DashShell>;
}
