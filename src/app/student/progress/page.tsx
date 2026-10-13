"use client";
import { mockCourses } from "@/lib/mocks";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { DashShell } from "@/components/layout/DashShell";
import { Card, Progress } from "@/components/ui/primitives";

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
export default function ProgressPage(){
  const { enrollments } = useAuth();
  const { attempts } = useStore();
  const avg = attempts.length? Math.round(attempts.reduce((s,a)=>s+(a.percent||0),0)/attempts.length):0;
  return <DashShell role="student" title="التقدم" desc="مؤشرات مبنية على بياناتك الفعلية." nav={nav}>
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-6"><div className="text-xs font-bold text-[var(--text-3)]">الكورسات الملتحق بها</div><div className="text-2xl font-black">{enrollments.length}</div></Card>
      <Card className="p-6"><div className="text-xs font-bold text-[var(--text-3)]">الاختبارات المحاولة</div><div className="text-2xl font-black">{attempts.length}</div></Card>
      <Card className="p-6"><div className="text-xs font-bold text-[var(--text-3)]">متوسط الدرجات</div><div className="text-2xl font-black">{avg}%</div></Card>
    </div>
    <div className="grid gap-4">
      {mockCourses.filter(c=> enrollments.some(e=>e.courseId===c.id)).map(c=>{
        const e = enrollments.find(x=>x.courseId===c.id);
        const pct = e? Math.round((e.completedLessonIds.length / c.modules.flatMap(m=>m.lessons).length)*100) : 0;
        return <Card key={c.id} className="p-5">
          <div className="flex justify-between"><span className="font-black">{c.title}</span><span className="text-sm font-bold">{pct}%</span></div>
          <div className="mt-3"><Progress value={pct} /></div>
          <div className="mt-2 text-xs text-[var(--text-3)]">{e?.completedLessonIds.length||0} / {c.modules.flatMap(m=>m.lessons).length} دروس مكتملة</div>
        </Card>;
      })}
      {enrollments.length===0 && <Card className="p-6 text-sm text-[var(--text-3)]">التحق بكورس وابدأ إكمال الدروس ليظهر تقدمك هنا.</Card>}
    </div>
  </DashShell>;
}
