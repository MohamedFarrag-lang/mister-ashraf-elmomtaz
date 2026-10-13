"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { usePackages } from "@/lib/usePackages";
import { mockExams } from "@/lib/mocks";
import { gradeLabel, termLabel } from "@/lib/curriculum";
import { getDefaultPricing, formatEgp, resolvePackagePrice } from "@/lib/pricing";
import { useAuth } from "@/lib/auth";
import { isPackagePurchased, redeemCode } from "@/lib/commerce";
import VideoPlayer from "@/components/ui/VideoPlayer";
import { Badge, Card } from "@/components/ui/primitives";
import { useState, useEffect } from "react";

const WHATSAPP_NUMBER = "201120681584";

export default function PackageDetail(){
  const { slug } = useParams<{slug:string}>();
  const { packages } = usePackages();
  const pkg = packages.find(p=>p.slug===slug);
  const { user } = useAuth();
  const [code,setCode]=useState("");
  const [msg,setMsg]=useState("");
  const [msgTone,setMsgTone]=useState<"ok"|"err">("ok");
  const [purchased, setPurchased] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activating, setActivating] = useState(false);

  useEffect(()=>{
    if(pkg) setPurchased(isPackagePurchased(pkg.id));
  },[pkg?.id]);

  const fallback = getDefaultPricing().defaultWeeklyPriceEgp;
  const price = pkg? resolvePackagePrice(pkg, fallback): fallback;
  const exam = pkg?.examId? mockExams.find(e=>e.id===pkg.examId): null;
  const canAccess = purchased;

  if(!pkg) return <div className="mx-auto max-w-3xl p-10 text-center">الباقة غير موجودة</div>;

  const statusBadge = pkg.status==="published"? "منشورة": pkg.status==="scheduled"?"مجدولة": pkg.status==="draft"?"مسودة":"مؤرشفة";

  const whatsappText = encodeURIComponent(
    `السلام عليكم مستر أشرف، أريد كود الاشتراك للباقة: "${pkg.title}" — ${gradeLabel(pkg.grade)} — ${pkg.academicYearId} — ${termLabel(pkg.term)} — الأسبوع ${pkg.weekNumber}. السعر: ${formatEgp(price)}.`
  );
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`;

  function handleRedeem(){
    if(!user){ setMsg("سجّل الدخول أولًا"); setMsgTone("err"); return; }
    if(!code.trim()){ setMsg("أدخل الكود أولًا"); setMsgTone("err"); return; }
    setActivating(true);
    const r = redeemCode(code, user.id, user.name, user.phone);
    setActivating(false);
    if(!r.ok){ setMsg(r.error??"خطأ"); setMsgTone("err"); }
    else {
      setPurchased(true);
      setMsg("تم تفعيل الكود وفتح الباقة بنجاح ✓");
      setMsgTone("ok");
      setCode("");
      setTimeout(()=> setShowModal(false), 800);
    }
  }

  return <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
    <div className="flex flex-wrap gap-2">
      <Badge tone="brand">{gradeLabel(pkg.grade)}</Badge>
      <Badge>{pkg.academicYearId}</Badge>
      <Badge>{termLabel(pkg.term)} • الأسبوع {pkg.weekNumber}</Badge>
      <Badge tone={pkg.status==="published"?"success":"warning"}>{statusBadge}</Badge>
      <Badge tone="accent">{formatEgp(price)}</Badge>
    </div>
    <h1 className="mt-4 text-3xl font-black">{pkg.title}</h1>
    <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--text-2)]">{pkg.description}</p>

    <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_.8fr]">
      <div className="grid gap-6">
        <Card className="p-5">
          <h3 className="font-black">ما تتضمنه الباقة</h3>
          <ul className="mt-3 grid gap-2 text-sm">
            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[var(--brand-700)]" /> فيديو شرح {pkg.explanationVideo? "✓":"— (قريبًا)"}</li>
            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[var(--brand-700)]" /> فيديو حل {pkg.solutionVideo? "✓":"— (اختياري)"}</li>
            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[var(--brand-700)]" /> امتحان إلكتروني {exam? `✓ ${exam.title} (${exam.durationMin} د)`: "— (بدون امتحان)"}</li>
            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[var(--brand-700)]" /> مرفقات PDF إن وجدت</li>
          </ul>
        </Card>

        <div className="grid gap-4">
          <h3 className="font-black">فيديو الشرح</h3>
          <VideoPlayer video={pkg.explanationVideo ?? null} title={`${pkg.title} — شرح`} locked={!canAccess} onNeedAccess={()=>document.getElementById("purchase")?.scrollIntoView({behavior:"smooth"})} />
          <h3 className="font-black">فيديو الحل</h3>
          <VideoPlayer video={pkg.solutionVideo ?? null} title={`${pkg.title} — حل`} locked={!canAccess} />
          {!canAccess && <p className="text-xs text-[var(--text-3)]">الفيديوهات محمية — لا تُعرض بياناتها لغير المشتري (يُطبق أيضًا على الـ API الحقيقي).</p>}
          {canAccess && exam && <Link href={`/student/exams/${exam.id}`} className="btn-primary w-fit">دخول الامتحان</Link>}
        </div>
      </div>

      <div id="purchase" className="grid gap-4 content-start">
        <Card className="p-6">
          <div className="text-sm text-[var(--text-3)]">سعر الباقة</div>
          <div className="text-2xl font-black">{formatEgp(price)}</div>
          <div className="text-xs text-[var(--text-3)]">السعر الافتراضي قابل للتعديل من لوحة المعلم — هذه الباقة {pkg.priceOverride!=null? "بسعر مخصص":"تستخدم السعر الافتراضي"}.</div>

          {purchased ? (
            <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center font-black text-emerald-800">تم فتح الباقة ✓ — يمكنك الآن مشاهدة الفيديوهات</div>
          ) : !user ? (
            <Link href="/login" className="btn-primary mt-4 w-full text-center">سجّل الدخول للشراء</Link>
          ) : (
            <div className="mt-4 grid gap-3">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-primary w-full text-center">
                اطلب كود الاشتراك عبر واتساب
              </a>
              <button onClick={()=>{ setMsg(""); setShowModal(true); }} className="w-full rounded-full border-2 border-[var(--brand-900)] bg-white px-6 py-3 text-sm font-black text-[var(--brand-900)] hover:bg-[var(--brand-50)] transition">
                أدخل كود التفعيل
              </button>
              <p className="text-center text-xs text-[var(--text-3)]">بعد الدفع يرسل لك المعلم كودًا مثل <span dir="ltr" className="font-mono font-bold">ASHRAF-2026-X9Z8</span> — أدخله هنا لفتح الباقة فورًا.</p>
            </div>
          )}

          {msg && <div className={`mt-3 rounded-xl p-3 text-sm font-bold ${msgTone==="ok" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>{msg}</div>}
        </Card>
        <Card className="p-5">
          <h4 className="font-black">حالة الوصول</h4>
          <div className="mt-2 text-sm">{!user? "سجّل الدخول لمعرفة حالة الشراء": purchased? "لديك وصول لهذه الباقة — الفيديوهات متاحة الآن":"لم تشترِ هذه الباقة بعد — المحتوى مقفل"}</div>
          {pkg.status!=="published" && <div className="mt-2 text-xs font-bold text-amber-700">الباقة {statusBadge} — لا تظهر للطلاب حتى النشر {pkg.status==="scheduled" && pkg.scheduledAt? `(${new Date(pkg.scheduledAt).toLocaleDateString("ar-EG")})`:""}</div>}
        </Card>
      </div>
    </div>

    {showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={()=> setShowModal(false)}>
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={e=> e.stopPropagation()}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black">أدخل كود التفعيل</h3>
            <button onClick={()=> setShowModal(false)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100">✕</button>
          </div>
          <p className="mt-2 text-sm text-[var(--text-3)]">الباقة: <span className="font-bold text-[var(--text)]">{pkg.title}</span></p>
          <input
            value={code}
            onChange={e=> setCode(e.target.value.toUpperCase())}
            placeholder="ASHRAF-2026-XXXX"
            dir="ltr"
            className="mt-4 h-12 w-full rounded-xl border-2 border-[var(--line)] bg-[var(--surface)] px-4 text-center font-mono text-sm font-bold tracking-widest focus:border-[var(--brand-500)] outline-none"
            autoFocus
          />
          {msg && <div className={`mt-3 rounded-xl p-3 text-sm font-bold ${msgTone==="ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{msg}</div>}
          <div className="mt-4 flex gap-3">
            <button onClick={()=> setShowModal(false)} className="btn-ghost flex-1">إلغاء</button>
            <button onClick={handleRedeem} disabled={activating} className="btn-primary flex-1 disabled:opacity-60">{activating ? "جاري التفعيل..." : "تفعيل الكود"}</button>
          </div>
          <p className="mt-3 text-center text-xs text-[var(--text-3)]">رقم واتساب الدعم: <span dir="ltr" className="font-mono">+201120681584</span></p>
        </div>
      </div>
    )}
  </div>;
}
