import { brand } from "@/lib/config";
export default function About(){
  return <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
    <h1 className="text-3xl font-black">عن {brand.teacherName} — {brand.nickname}</h1>
    <p className="mt-3 max-w-3xl text-sm leading-8 text-[var(--text-2)]">
      منصة <strong>الممتاز</strong> هي بيئة تعلم هادئة ومركّزة لمادة اللغة العربية، صُممت لتخدم المحتوى أولًا.
      لا نعرض أرقامًا وهمية ولا شهادات مختلقة — كل معلومة هنا قابلة للتحديث من لوحة المعلم، وكل إحصاء يظهر فقط عندما يكون مدعومًا ببيانات حقيقية.
    </p>
    <div className="card mt-8 grid gap-6 p-6 md:grid-cols-3">
      <div><h3 className="font-black">الرسالة</h3><p className="mt-2 text-sm leading-7 text-[var(--text-3)]">تبسيط العربي حتى يشعر الطالب أن المادة مفهومة وقابلة للتحصيل، مع انضباط في المذاكرة ومتابعة.</p></div>
      <div><h3 className="font-black">الأسلوب</h3><p className="mt-2 text-sm leading-7 text-[var(--text-3)]">شرح مباشر بأمثلة امتحانية، تلخيص بعد كل درس، وواجب يثبّت المعلومة.</p></div>
      <div><h3 className="font-black">المتابعة</h3><p className="mt-2 text-sm leading-7 text-[var(--text-3)]">تقدّم محسوب من الدروس والواجبات والاختبارات، مع تنبيهات للواجبات والحصص المباشرة.</p></div>
    </div>
    <div className="card mt-6 p-6">
      <h2 className="font-black">ماذا ستجد داخل كل كورس؟</h2>
      <ul className="mt-3 list-disc space-y-2 pr-6 text-sm leading-7 text-[var(--text-2)]">
        <li>وحدات منظمة ودروس فيديو + قراءة + موارد PDF</li>
        <li>واجبات بمواعيد تسليم وتصحيح وملاحظات</li>
        <li>اختبارات بوقت وبنك أسئلة متدرج</li>
        <li>حصص مباشرة مجدولة مع روابط وتسجيلات</li>
      </ul>
    </div>
  </div>;
}
