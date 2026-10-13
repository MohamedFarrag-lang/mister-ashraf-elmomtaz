"use client";
import { DashShell } from "@/components/layout/DashShell";
import { Card, Badge } from "@/components/ui/primitives";
const nav = [
  { href:"/admin", label:"نظرة عامة" },
  { href:"/admin/users", label:"المستخدمون" },
  { href:"/admin/courses", label:"الكورسات" },
  { href:"/admin/analytics", label:"التحليلات" },
];
const users = [
  { name:"أحمد محمد", email:"ahmed@example.com", role:"student" },
  { name:"مستر أشرف", email:"ashraf@elmomtaz.example", role:"teacher" },
  { name:"إدارة", email:"admin@elmomtaz.example", role:"admin" },
];
export default function Users(){
  return <DashShell role="admin" title="المستخدمون" desc="عرض وإدارة الحسابات — البيانات تجريبية." nav={nav}>
    <div className="grid gap-3">
      {users.map(u=> <Card key={u.email} className="flex items-center justify-between p-4"><div><div className="font-black">{u.name}</div><div className="text-xs text-[var(--text-3)]">{u.email}</div></div><Badge tone={u.role==="teacher"?"brand":u.role==="admin"?"accent":"neutral"}>{u.role}</Badge></Card>)}
    </div>
  </DashShell>;
}
