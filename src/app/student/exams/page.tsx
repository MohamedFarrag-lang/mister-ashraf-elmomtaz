"use client";
import Link from "next/link";
import { mockExams, getCourseById } from "@/lib/mocks";
import { DashShell } from "@/components/layout/DashShell";
import { Badge, Card } from "@/components/ui/primitives";

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

export default function ExamsList(){
  return <DashShell role="student" title="الاختبارات" desc="اختبارات بوقت — اقرأ التعليمات ثم ابدأ." nav={nav}>
    <div className="grid gap-4">
      {mockExams.map(e=>{
        const c = getCourseById(e.courseId);
        return <Card key={e.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div><div className="font-black">{e.title}</div><div className="text-sm text-[var(--text-3)]">{c?.title} • {e.durationMin} د • نجاح {e.passingScore}% • {e.questions.length} أسئلة</div></div>
          <div className="flex items-center gap-2"><Badge tone="brand">{e.status==="published"?"منشور":"مسودة"}</Badge><Link href={`/student/exams/${e.id}`} className="btn-primary">ابدأ الاختبار</Link></div>
        </Card>;
      })}
    </div>
  </DashShell>;
}
