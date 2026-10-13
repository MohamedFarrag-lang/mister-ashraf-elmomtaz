"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getCourseBySlug } from "@/lib/mocks";
import { useAuth } from "@/lib/auth";
import { Badge, Card } from "@/components/ui/primitives";
import VideoPlayer from "@/components/ui/VideoPlayer";
import type { VideoRef } from "@/lib/video/provider";
import { getActiveProvider } from "@/lib/video";

function toVideoRef(url: string | undefined): VideoRef | null {
  if (!url) return null;
  try { return getActiveProvider().parse(url); } catch { return null; }
}

export default function LessonViewer(){
  const { slug, lessonId } = useParams<{ slug:string; lessonId:string }>();
  const course = getCourseBySlug(slug);
  const { user, isEnrolled, completeLesson } = useAuth();
  const router = useRouter();
  if(!course) return <div className="p-10 text-center">غير موجود</div>;
  const allLessons = course.modules.flatMap(m=>m.lessons);
  const idx = allLessons.findIndex(l=>l.id===lessonId);
  const lesson = allLessons[idx];
  if(!lesson) return <div className="p-10 text-center">الدرس غير موجود</div>;
  if(!user) { if(typeof window!=="undefined") router.push("/login"); return null; }
  if(!isEnrolled(course.id)) return <div className="p-10 text-center"><Link href={`/courses/${course.slug}`} className="btn-primary">التحق بالكورس أولًا</Link></div>;

  const prev = idx>0? allLessons[idx-1]:null;
  const next = idx<allLessons.length-1? allLessons[idx+1]:null;
  const videoRef = lesson.type==="video" ? toVideoRef(lesson.videoUrl) : null;

  return <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><div className="text-xs font-bold text-[var(--text-3)]">{course.title}</div><h1 className="text-xl font-black">{lesson.title}</h1></div>
      <Link href={`/learn/${course.slug}`} className="btn-ghost">العودة للكورس</Link>
    </div>

    <div className="mt-6 grid gap-6 lg:grid-cols-[1.7fr_.7fr]">
      <div className="grid gap-4">
        <Card className="overflow-hidden p-0">
          {lesson.type==="video" ? <VideoPlayer video={videoRef} title={lesson.title} /> : <div className="p-6"><h3 className="font-black">مادة قرائية</h3><p className="text-sm leading-7 text-[var(--text-2)]">{lesson.description || "اقرأ الملخص وحمّل الموارد المرفقة."}</p></div>}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="flex gap-2"><Badge>{lesson.duration}</Badge><Badge tone="brand">{lesson.type==="video"?"فيديو":"قراءة"}</Badge></div>
            <button onClick={()=>completeLesson(course.id, lesson.id)} className="btn-primary">وضع إكمال للدرس ✓</button>
          </div>
        </Card>
        <div className="flex flex-wrap gap-3">
          {prev? <Link href={`/learn/${course.slug}/${prev.id}`} className="btn-ghost">← السابق: {prev.title}</Link> : <span className="btn-ghost opacity-50">لا يوجد سابق</span>}
          {next? <Link href={`/learn/${course.slug}/${next.id}`} className="btn-primary">التالي: {next.title} →</Link> : <span className="badge">أكملت كل الدروس</span>}
        </div>
      </div>

      <div className="grid gap-4 content-start">
        <Card className="p-5">
          <h3 className="font-black">موارد الدرس</h3>
          {lesson.resources?.length? <ul className="mt-3 grid gap-2 text-sm">
            {lesson.resources.map(r=> <li key={r.id} className="flex items-center justify-between rounded-xl bg-[var(--surface-3)] px-3 py-2"><span className="font-bold">{r.title}</span><a href={r.url} className="text-[var(--brand-700)] font-bold">تحميل</a></li>)}
          </ul> : <p className="mt-2 text-sm text-[var(--text-3)]">لا توجد موارد لهذا الدرس.</p>}
        </Card>
        <Card className="p-5">
          <h3 className="font-black">ملاحظاتك</h3>
          <textarea placeholder="اكتب ملاحظاتك هنا — محفوظة محليًا للتجربة" className="mt-3 min-h-24 w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3 text-sm" />
          <span className="text-xs text-[var(--text-3)]">تُحفظ في المتصفح مؤقتًا — يمكن ربطها بحسابك لاحقًا.</span>
        </Card>
      </div>
    </div>
  </div>;
}
