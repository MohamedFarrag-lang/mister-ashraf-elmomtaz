import Link from "next/link";
import { brand } from "@/lib/config";
import { Badge, SectionTitle } from "@/components/ui/primitives";
import { DEFAULT_WEEKLY_PRICE_EGP, formatEgp } from "@/lib/pricing";

export default function Home(){
  return <div>
    <section className="relative overflow-hidden border-b border-[var(--line)] bg-[var(--surface)]">
      <div className="absolute inset-0 bg-gradient-to-l from-[var(--brand-50)] via-transparent to-transparent" />
      <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[var(--brand-100)] opacity-60 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-2 md:px-6 md:py-20">
        <div className="grid gap-6 content-start">
          <Badge tone="brand">باقات أسبوعية • {brand.subject} • من {formatEgp(DEFAULT_WEEKLY_PRICE_EGP)}</Badge>
          <h1 className="text-4xl font-black leading-tight md:text-5xl">
            {brand.tagline}
          </h1>
          <p className="max-w-xl text-[15px] leading-8 text-[var(--text-2)]">
            كل أسبوع باقة متكاملة: <strong>فيديو شرح</strong> + <strong>فيديو حل</strong> + <strong>امتحان إلكتروني</strong>. تبدأ من <strong>{formatEgp(DEFAULT_WEEKLY_PRICE_EGP)}</strong> للباقة.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/packages" className="btn-primary">استكشف الباقات الأسبوعية</Link>
            <Link href="/about" className="hidden md:inline-flex btn-ghost">تعرّف على الممتاز</Link>
          </div>
        </div>
        <div className="relative grid gap-4">
          <div className="card overflow-hidden p-0">
            <div className="grid gap-0 md:grid-cols-[1.2fr_.8fr]">
              <div className="bg-[var(--brand-900)] p-6 text-white">
                <div className="text-xs font-bold opacity-80">نموذج الباقة الأسبوعية</div>
                <div className="mt-2 text-lg font-black">الأسبوع الأول — مدخل النحو</div>
                <div className="mt-1 text-xs opacity-70">أولى ثانوي • 2026/2027 • الترم الأول</div>
                <div className="mt-4 grid gap-2 text-sm">
                  <span className="rounded-xl bg-white/10 px-3 py-2">▶ فيديو شرح</span>
                  <span className="rounded-xl bg-white/10 px-3 py-2">▶ فيديو حل</span>
                  <span className="rounded-xl bg-white/10 px-3 py-2">📝 امتحان إلكتروني</span>
                  <span className="rounded-xl bg-amber-400 px-3 py-2 font-black text-black">{formatEgp(DEFAULT_WEEKLY_PRICE_EGP)} / باقة</span>
                </div>
              </div>
              <div className="grid gap-3 bg-[var(--surface-3)] p-5">
                <div className="rounded-xl bg-white p-4 shadow">
                  <div className="text-xs font-bold text-[var(--text-3)]">الوصول</div>
                  <div className="font-black">مقفلة حتى الشراء</div>
                  <div className="mt-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">اشترِ للفتح</div>
                </div>
                <div className="rounded-xl bg-white p-4 shadow">
                  <div className="text-xs font-bold text-emerald-700">بعد الشراء</div>
                  <div className="text-sm font-bold">فيديوهات + امتحان</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle kicker="الباقات" title="اختر صفك وابدأ بالأسبوع الأول" desc="تصفح الباقات حسب الصف والعام والترم والأسبوع." />
        <Link href="/packages" className="btn-ghost">عرض كل الباقات</Link>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <Link href="/packages" className="card p-6 text-center hover:bg-[var(--surface-3)]"><div className="text-lg font-black">أولى ثانوي</div><div className="text-sm text-[var(--text-3)]">2026/2027 • الترم الأول</div></Link>
        <Link href="/packages" className="card p-6 text-center hover:bg-[var(--surface-3)]"><div className="text-lg font-black">ثانية ثانوي — بكالوريا</div><div className="text-sm text-[var(--text-3)]">2026/2027 • الترم الأول</div></Link>
        <Link href="/packages" className="card p-6 text-center hover:bg-[var(--surface-3)]"><div className="text-lg font-black">ثالثة ثانوي</div><div className="text-sm text-[var(--text-3)]">2026/2027 • الترم الأول</div></Link>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 pb-10 md:px-6">
      <div className="card grid gap-6 p-6 md:grid-cols-3 md:p-8">
        <div className="grid gap-2"><span className="text-xs font-black text-[var(--brand-700)]">01</span><h3 className="font-black">شرح مبسّط</h3><p className="text-sm leading-7 text-[var(--text-3)]">كل قاعدة بمثال امتحاني، مع تلخيص سريع.</p></div>
        <div className="grid gap-2"><span className="text-xs font-black text-[var(--brand-700)]">02</span><h3 className="font-black">حل وامتحان</h3><p className="text-sm leading-7 text-[var(--text-3)]">فيديو حل + امتحان بوقت وتصحيح تلقائي.</p></div>
        <div className="grid gap-2"><span className="text-xs font-black text-[var(--brand-700)]">03</span><h3 className="font-black">كود وقفل جهاز</h3><p className="text-sm leading-7 text-[var(--text-3)]">كود لمرة واحدة لجهاز واحد.</p></div>
      </div>
    </section>
  </div>;
}
