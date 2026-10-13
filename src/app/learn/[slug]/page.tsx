"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getCourseBySlug } from "@/lib/mocks";
import { useAuth } from "@/lib/auth";
import { Badge, Card, Progress } from "@/components/ui/primitives";

export default function LearnPage(){
  const { slug } = useParams<{ slug:string }>();
  const course = getCourseBySlug(slug);
  const { user, isEnrolled } = useAuth();
  const router = useRouter();
  if(!course) return <div className="p-10 text-center font-black">الكورس غير موجود</div>;
  if(!user) { if(typeof window!=="undefined") router.push("/login"); return null; }
  if(!isEnrolled(course.id)) return <div className="mx-auto max-w-3xl px-4 py-10"><div className="card p-8 text-center"><h2 className="font-black">غير ملتحق بهذا الكورس</h2><p className="text-sm text-[var(--text-3)]">التحق أولًا من صفحة الكورس.</p><Link href={`/courses/${course.slug}`} className="btn-primary mt-4 inline-flex">الذهاب للكورس</Link></div></div>;

  const enroll = (typeof window!=="undefined" ? (JSON.parse(localStorage.getItem("elmomtaz.enrollments")||"[]") as {courseId:string;completedLessonIds:string[]}[]).find((e)=>e.courseId===course.id) : null);
  const completed: string[] = enroll?.completedLessonIds || [];
  const totalLessons = course.modules.flatMap(m=>m.lessons).length;
  const pct = totalLessons? Math.round((completed.length/totalLessons)*100) : 0;

  return <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><h1 className="text-2xl font-black">{course.title}</h1><p className="text-sm text-[var(--text-3)]">بيئة التعلم — تابع دروسك بالترتيب</p></div>
      <div className="min-w-48"><Progress value={pct} /><div className="mt-1 text-xs font-bold text-[var(--text-3)]">التقدم {pct}% • {completed.length}/{totalLessons} دروس</div></div>
    </div>

    <div className="mt-6 grid gap-6 lg:grid-cols-[300px_1fr]">
      <div className="grid gap-4 content-start">
        {course.modules.map(m=> <Card key={m.id} className="overflow-hidden p-0">
          <div className="bg-[var(--surface-3)] px-4 py-3 font-black">{m.title}</div>
          <div className="grid">
            {m.lessons.map(l=>{
              const done = completed.includes(l.id);
              return <Link key={l.id} href={`/learn/${course.slug}/${l.id}`} className={`flex items-center justify-between px-4 py-3 text-sm hover:bg-[var(--surface-3)] ${done? "bg-emerald-50":""}`}>
                <span className={`font-bold ${done? "text-emerald-800":""}`}>{done? "✓ ":""} {l.title}</span>
                <span className="text-xs text-[var(--text-3)]">{l.duration}</span>
              </Link>;
            })}
          </div>
        </Card>)}
      </div>
      <Card className="p-6">
        <h2 className="font-black">ابدأ من أول درس</h2>
        <p className="mt-1 text-sm text-[var(--text-3)]">اختر درسًا من القائمة الجانبية. بعد مشاهدة الفيديو اضغط "إكمال الدرس" ليُحتسب تقدمك.</p>
        <div className="mt-4 flex flex-wrap gap-2">{course.modules[0]?.lessons.slice(0,3).map(l=> <Link key={l.id} href={`/learn/${course.slug}/${l.id}`} className="btn-ghost">{l.title}</Link>)}</div>
        <div className="mt-6 rounded-xl bg-[var(--surface-3)] p-4 text-sm">
          <div className="font-black">ماذا بعد الدروس؟</div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link href="/student/assignments" className="badge">الواجبات</Link>
            <Link href="/student/exams" className="badge">الاختبارات</Link>
            <Link href="/live" className="badge">الحصص المباشرة</Link>
          </div>
        </div>
      </Card>
    </div>
  </div>;
}
