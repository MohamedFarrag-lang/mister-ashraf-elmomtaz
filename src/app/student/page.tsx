"use client";
import Link from "next/link";
import { mockAssignments, mockCourses, mockExams } from "@/lib/mocks";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { DashShell } from "@/components/layout/DashShell";
import { Badge, Card, Progress } from "@/components/ui/primitives";
import { CourseCard } from "@/components/ui/course-card";

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

export default function StudentDash(){
  const { user, enrollments } = useAuth();
  const { notifications, attempts } = useStore();
  if(!user) return <div className="mx-auto max-w-3xl px-4 py-16"><div className="card p-8 text-center">سجّل الدخول كطالب أولًا — <Link href="/login" className="font-bold text-[var(--brand-700)]">دخول</Link></div></div>;
  if(user.role!=="student") return <div className="p-10 text-center">هذه لوحة الطالب — حسابك الحالي {user.role}.</div>;

  const myCourses = mockCourses.filter(c=> enrollments.some(e=>e.courseId===c.id));
  const continueCourse = myCourses[0];
  const pendingAssign = mockAssignments.slice(0,2);
  const upcomingExams = mockExams.slice(0,2);

  return <DashShell role="student" title={`أهلاً، ${user.name}`} desc="تابع ما تدرسه الآن وما عليك إنجازه." nav={nav}>
    {myCourses.length===0 ? <Card className="p-6">
      <h3 className="font-black">ابدأ رحلتك</h3>
      <p className="text-sm text-[var(--text-3)]">لم تلتحق بأي كورس بعد — اختر كورسك الأول.</p>
      <Link href="/courses" className="btn-primary mt-4 inline-flex">استكشاف الكورسات</Link>
    </Card> : <>
      {continueCourse && <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><div className="text-xs font-bold text-[var(--brand-700)]">متابعة التعلم</div><h3 className="font-black">{continueCourse.title}</h3></div>
          <Link href={`/learn/${continueCourse.slug}`} className="btn-primary">متابعة</Link>
        </div>
        <div className="mt-4 max-w-md">
          <Progress value={enrollments.find(e=>e.courseId===continueCourse.id)?.progress ?? 12} />
        </div>
      </Card>}

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-black">الواجبات المعلقة</h3>
          <div className="mt-3 grid gap-3">
            {pendingAssign.map(a=> <Link key={a.id} href="/student/assignments" className="flex items-center justify-between rounded-xl border border-[var(--line)] p-3 hover:bg-[var(--surface-3)]">
              <span className="font-bold text-sm">{a.title}</span><Badge tone="warning">حتى {new Date(a.deadline!).toLocaleDateString("ar-EG")}</Badge>
            </Link>)}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-black">اختبارات قادمة</h3>
          <div className="mt-3 grid gap-3">
            {upcomingExams.map(e=> <Link key={e.id} href={`/student/exams/${e.id}`} className="flex items-center justify-between rounded-xl border border-[var(--line)] p-3 hover:bg-[var(--surface-3)]">
              <span className="font-bold text-sm">{e.title}</span><Badge>{e.durationMin} د</Badge>
            </Link>)}
          </div>
        </Card>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between"><h3 className="font-black">كورساتي</h3><Link href="/student/courses" className="text-sm font-bold text-[var(--brand-700)]">عرض الكل</Link></div>
        <div className="grid gap-4 md:grid-cols-2">
          {myCourses.slice(0,2).map(c=> <CourseCard key={c.id} course={c} progress={enrollments.find(e=>e.courseId===c.id)?.progress} />)}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-black">آخر النتائج</h3>
          {attempts.length===0? <p className="mt-2 text-sm text-[var(--text-3)]">لا توجد محاولات بعد — ادخل أول اختبار.</p> :
          <div className="mt-3 grid gap-2 text-sm">
            {attempts.slice(0,3).map(a=> <div key={a.id} className="flex justify-between rounded-xl bg-[var(--surface-3)] px-3 py-2"><span>{a.examId}</span><span className="font-black">{a.percent}%</span></div>)}
          </div>}
        </Card>
        <Card className="p-6">
          <h3 className="font-black">الإشعارات</h3>
          <div className="mt-3 grid gap-2">
            {notifications.slice(0,3).map(n=> <div key={n.id} className="rounded-xl border border-[var(--line)] p-3 text-sm"><div className="font-bold">{n.title}</div><div className="text-xs text-[var(--text-3)]">{n.body}</div></div>)}
          </div>
          <Link href="/student/notifications" className="mt-3 inline-flex text-sm font-bold text-[var(--brand-700)]">عرض كل الإشعارات ←</Link>
        </Card>
      </div>
    </>}
  </DashShell>;
}
