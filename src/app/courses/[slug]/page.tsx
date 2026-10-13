"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getCourseBySlug, mockExams, mockAssignments } from "@/lib/mocks";
import { Badge, Card, Progress } from "@/components/ui/primitives";
import { useAuth } from "@/lib/auth";

export default function CourseDetails(){
  const { slug } = useParams<{ slug: string }>();
  const course = getCourseBySlug(slug);
  const { user, isEnrolled, enroll } = useAuth();
  if(!course) return <div className="mx-auto max-w-3xl px-4 py-16"><div className="card p-10 text-center font-black">الكورس غير موجود</div></div>;

  const enrolled = isEnrolled(course.id);
  const exams = mockExams.filter(e=>e.courseId===course.id);
  const assigns = mockAssignments.filter(a=>a.courseId===course.id);

  let cta: { label: string; href: string; action?: ()=>void } = { label:"سجّل الدخول للالتحاق", href:"/login" };
  if(!user) cta = { label:"سجّل الدخول للالتحاق", href:"/login" };
  else if(!enrolled) cta = { label: course.price? `التحق الآن — ${course.price} جنيه` : "التحق مجانًا", href:"#", action: ()=>enroll(course.id) };
  else cta = { label:"متابعة التعلم", href:`/learn/${course.slug}` };

  return <div>
    <div className="border-b border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[1.4fr_.8fr] md:px-6">
        <div className="grid gap-4">
          <div className="flex flex-wrap gap-2"><Badge tone="brand">{course.category}</Badge><Badge tone="accent">{course.level}</Badge><Badge>{course.durationLabel}</Badge></div>
          <h1 className="text-3xl font-black leading-tight">{course.title}</h1>
          <p className="max-w-2xl text-sm leading-7 text-[var(--text-2)]">{course.description}</p>
          <div className="flex flex-wrap gap-2 text-sm">
            {course.modules.map(m=> <span key={m.id} className="rounded-full bg-[var(--surface-3)] px-3 py-1 text-xs font-bold">{m.title} • {m.lessons.length} دروس</span>)}
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            {cta.action ? <button onClick={cta.action} className="btn-primary">{cta.label}</button> : <Link href={cta.href} className="btn-primary">{cta.label}</Link>}
            <Link href="/courses" className="btn-ghost">العودة للكورسات</Link>
          </div>
          {enrolled && <div className="max-w-md"><Progress value={12} /><div className="mt-1 text-xs text-[var(--text-3)]">تقدّمك سيظهر هنا بعد إكمال الدروس داخل صفحة التعلم.</div></div>}
        </div>
        <Card className="grid gap-4 p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--brand-900)] font-black text-white">أ</span>
            <div><div className="font-black">مستر أشرف — الممتاز</div><div className="text-xs text-[var(--text-3)]">مادة اللغة العربية</div></div>
          </div>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between"><span className="text-[var(--text-3)]">الدروس</span><span className="font-bold">{course.lessonsCount}</span></div>
            <div className="flex justify-between"><span className="text-[var(--text-3)]">الوحدات</span><span className="font-bold">{course.modules.length}</span></div>
            <div className="flex justify-between"><span className="text-[var(--text-3)]">المدة</span><span className="font-bold">{course.durationLabel}</span></div>
            <div className="flex justify-between"><span className="text-[var(--text-3)]">السعر</span><span className="font-bold">{course.price? `${course.price} جنيه` : "مجاني"}</span></div>
          </div>
          <div className="rounded-xl bg-amber-50 p-3 text-xs leading-6 text-amber-900">المحتوى المحمي لا يُعرض إلا للطلاب الملتحقين — الصفحة تحترم حالة الالتحاق ولا تكشف الفيديوهات المحمية.</div>
        </Card>
      </div>
    </div>

    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-[1.6fr_.7fr] md:px-6">
      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="font-black">محتوى الكورس</h2>
          <div className="mt-4 grid gap-4">
            {course.modules.map(m=> <div key={m.id} className="rounded-xl border border-[var(--line)]">
              <div className="flex items-center justify-between bg-[var(--surface-3)] px-4 py-3">
                <span className="font-bold">{m.title}</span><span className="text-xs text-[var(--text-3)]">{m.lessons.length} دروس</span>
              </div>
              <div className="grid">
                {m.lessons.map(l=> <div key={l.id} className="flex items-center justify-between border-t border-[var(--line)] px-4 py-3 text-sm">
                  <span className="font-bold">{l.title}</span>
                  <span className="flex items-center gap-2 text-xs text-[var(--text-3)]"><span>{l.duration}</span>{l.isPreview && <Badge tone="success">معاينة</Badge>}</span>
                </div>)}
              </div>
            </div>)}
          </div>
        </Card>

        {(course.resources?.length ?? 0)>0 && <Card className="p-6">
          <h3 className="font-black">الموارد</h3>
          <ul className="mt-3 grid gap-2 text-sm">
            {course.resources!.map(r=> <li key={r.id} className="flex items-center justify-between rounded-xl bg-[var(--surface-3)] px-4 py-3"><span className="font-bold">{r.title}</span><span className="text-xs text-[var(--text-3)]">{r.kind.toUpperCase()}</span></li>)}
          </ul>
        </Card>}
      </div>

      <div className="grid gap-6 content-start">
        <Card className="p-6">
          <h3 className="font-black">الاختبارات</h3>
          {exams.length===0? <p className="mt-2 text-sm text-[var(--text-3)]">لا توجد اختبارات منشورة لهذا الكورس حاليًا.</p> :
          <div className="mt-3 grid gap-3">
            {exams.map(e=> <Link key={e.id} href={`/student/exams/${e.id}`} className="rounded-xl border border-[var(--line)] p-4 hover:bg-[var(--surface-3)]">
              <div className="font-bold">{e.title}</div><div className="text-xs text-[var(--text-3)]">{e.durationMin} دقيقة • نجاح {e.passingScore}%</div>
            </Link>)}
          </div>}
        </Card>
        <Card className="p-6">
          <h3 className="font-black">الواجبات</h3>
          {assigns.length===0? <p className="mt-2 text-sm text-[var(--text-3)]">لا توجد واجبات حاليًا.</p> :
          <div className="mt-3 grid gap-3">
            {assigns.map(a=> <Link key={a.id} href="/student/assignments" className="rounded-xl border border-[var(--line)] p-4 hover:bg-[var(--surface-3)]">
              <div className="font-bold">{a.title}</div><div className="text-xs text-[var(--text-3)]">حتى {new Date(a.deadline!).toLocaleDateString("ar-EG")}</div>
            </Link>)}
          </div>}
        </Card>
      </div>
    </div>
  </div>;
}
