import Link from "next/link";
import { brand } from "@/lib/config";

export default function SiteFooter(){
  return <footer className="mt-12 border-t border-[var(--line)] bg-[var(--surface)]">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4 md:px-6">
      <div className="grid gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--brand-900)] font-black text-white">م</span>
          <span className="font-black">{brand.nameAr}</span>
        </div>
        <p className="max-w-sm text-sm leading-7 text-[var(--text-3)]">{brand.description}</p>
      </div>
      <div className="grid gap-2 text-sm">
        <span className="font-black">روابط</span>
        <Link href="/courses" className="text-[var(--text-3)] hover:text-[var(--text)]">الكورسات</Link>
        <Link href="/about" className="text-[var(--text-3)] hover:text-[var(--text)]">عن الممتاز</Link>
        <Link href="/faq" className="text-[var(--text-3)] hover:text-[var(--text)]">الأسئلة الشائعة</Link>
      </div>
      <div className="grid gap-2 text-sm">
        <span className="font-black">الطالب</span>
        <Link href="/login" className="text-[var(--text-3)] hover:text-[var(--text)]">تسجيل الدخول</Link>
        <Link href="/register" className="text-[var(--text-3)] hover:text-[var(--text)]">إنشاء حساب</Link>
        <Link href="/student" className="text-[var(--text-3)] hover:text-[var(--text)]">لوحة الطالب</Link>
      </div>
      <div className="grid gap-2 text-sm">
        <span className="font-black">تواصل</span>
        <span className="text-[var(--text-3)]">{brand.contact.phone} — {brand.contact.email}</span>
        <span className="text-xs text-[var(--text-3)]">جميع المحتويات تعليمية — الأسعار والحجوزات تُدار عبر طبقة الخدمات القابلة للربط بالدفع لاحقًا.</span>
      </div>
    </div>
    <div className="border-t border-[var(--line)] py-4 text-center text-xs text-[var(--text-3)]">© {new Date().getFullYear()} {brand.nameAr} — {brand.teacherName}. جميع الحقوق محفوظة.</div>
  </footer>;
}
