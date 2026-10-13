"use client";
import { mockExams } from "@/lib/mocks";
import { useStore } from "@/lib/store";
import { DashShell } from "@/components/layout/DashShell";
import { Badge, Card, EmptyState } from "@/components/ui/primitives";

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
export default function Results(){
  const { attempts } = useStore();
  return <DashShell role="student" title="النتائج" desc="درجاتك ونسبك وحالة النجاح." nav={nav}>
    {attempts.length===0? <EmptyState title="لا توجد نتائج بعد" desc="ادخل اختبارًا من صفحة الاختبارات لتظهر نتيجتك هنا." /> :
    <div className="grid gap-4">
      {attempts.map(a=>{
        const ex = mockExams.find(e=>e.id===a.examId);
        return <Card key={a.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div><div className="font-black">{ex?.title || a.examId}</div><div className="text-xs text-[var(--text-3)]">{a.submittedAt? new Date(a.submittedAt).toLocaleString("ar-EG"):""}</div></div>
          <div className="flex items-center gap-3"><span className="text-lg font-black">{a.score}/{a.total}</span><Badge tone={a.passed? "success":"warning"}>{a.percent}% • {a.passed? "ناجح":"راسب"}</Badge></div>
        </Card>;
      })}
    </div>}
  </DashShell>;
}
