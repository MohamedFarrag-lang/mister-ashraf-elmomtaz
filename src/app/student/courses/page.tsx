"use client";
import Link from "next/link";
import { mockCourses } from "@/lib/mocks";
import { useAuth } from "@/lib/auth";
import { DashShell } from "@/components/layout/DashShell";
import { CourseCard } from "@/components/ui/course-card";
import { EmptyState } from "@/components/ui/primitives";

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

export default function MyCourses(){
  const { enrollments } = useAuth();
  const mine = mockCourses.filter(c=> enrollments.some(e=>e.courseId===c.id));
  return <DashShell role="student" title="كورساتي" desc="كل الكورسات التي التحقت بها." nav={nav}>
    {mine.length===0? <EmptyState title="لم تلتحق بأي كورس بعد" desc="استكشف الكورسات والتحق بما يناسب مستواك." action={<Link href="/courses" className="btn-primary">استكشاف الكورسات</Link>} /> :
    <div className="grid gap-5 md:grid-cols-2">
      {mine.map(c=> <CourseCard key={c.id} course={c} progress={enrollments.find(e=>e.courseId===c.id)?.progress} />)}
    </div>}
  </DashShell>;
}
