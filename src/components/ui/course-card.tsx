import Link from "next/link";
import type { Course } from "@/lib/types";
import { Badge, Progress } from "./primitives";

export function CourseCard({ course, progress }: { course: Course; progress?: number }){
  return <Link href={`/courses/${course.slug}`} className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(15,23,42,.12)]">
    <div className="relative h-40 overflow-hidden bg-[var(--surface-3)]">
      {/* cover placeholder without external images — typographic hero */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-900)] via-[var(--brand-700)] to-[var(--brand-500)]" />
      <div className="absolute inset-0 bg-[radial-gradient(600px_200px_at_20%_0%,rgba(255,255,255,.18),transparent)]" />
      <div className="absolute bottom-0 p-4">
        <div className="flex flex-wrap gap-2">
          <Badge tone="accent">{course.level}</Badge>
          <Badge tone="brand">{course.category}</Badge>
          {course.price===null ? <Badge tone="success">مجاني</Badge> : <Badge>{course.price} جنيه</Badge>}
        </div>
      </div>
      <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-[var(--brand-900)] backdrop-blur">
        {course.durationLabel} • {course.lessonsCount} دروس
      </div>
    </div>
    <div className="grid gap-3 p-5">
      <h3 className="line-clamp-2 text-[15px] font-black leading-6 group-hover:text-[var(--brand-700)]">{course.title}</h3>
      <p className="line-clamp-2 text-sm leading-6 text-[var(--text-3)]">{course.shortDesc}</p>
      {typeof progress==="number" && <div className="grid gap-2 pt-1">
        <div className="flex items-center justify-between text-xs font-bold text-[var(--text-3)]"><span>التقدم</span><span>{progress}%</span></div>
        <Progress value={progress} />
      </div>}
      <div className="flex items-center gap-2 pt-1 text-xs font-bold text-[var(--brand-700)]">عرض الكورس <span aria-hidden>←</span></div>
    </div>
  </Link>;
}
