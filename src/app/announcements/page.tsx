import { mockAnnouncements } from "@/lib/mocks";
export default function Announcements(){
  return <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
    <h1 className="text-3xl font-black">الإعلانات</h1>
    <p className="text-sm text-[var(--text-3)]">إعلانات من المعلم والإدارة — تظهر أيضًا كإشعارات للطلاب.</p>
    <div className="mt-6 grid gap-4">
      {mockAnnouncements.map(a=> <div key={a.id} className="card p-6">
        <div className="text-xs font-bold text-[var(--brand-700)]">{new Date(a.publishedAt).toLocaleDateString("ar-EG")} • {a.audience==="all"?"للجميع":"خاص بكورس"}</div>
        <h3 className="mt-1 font-black">{a.title}</h3>
        <p className="mt-2 text-sm leading-7 text-[var(--text-2)]">{a.body}</p>
      </div>)}
    </div>
  </div>;
}
