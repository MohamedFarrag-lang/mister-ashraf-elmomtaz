import { mockLive } from "@/lib/mocks";
import { Card, Badge } from "@/components/ui/primitives";
export default function LivePublic(){
  return <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
    <h1 className="text-3xl font-black">الحصص المباشرة</h1>
    <p className="text-sm text-[var(--text-3)]">جدول الحصص — الروابط تظهر للملتحقين فقط.</p>
    <div className="mt-6 grid gap-3">
      {mockLive.map(l=> <Card key={l.id} className="p-5 flex justify-between gap-4">
        <div><div className="font-black">{l.title}</div><div className="text-sm text-[var(--text-3)]">{new Date(l.date).toLocaleString("ar-EG")} • {l.durationMin} د</div>
        {l.meetingUrl && <a href={l.meetingUrl} className="mt-2 inline-flex text-sm font-bold text-[var(--brand-700)]">رابط الحصة</a>}</div>
        <Badge tone={l.status==="upcoming"?"brand":"neutral"}>{l.status==="upcoming"?"قادمة":"مكتملة"}</Badge>
      </Card>)}
    </div>
  </div>;
}
