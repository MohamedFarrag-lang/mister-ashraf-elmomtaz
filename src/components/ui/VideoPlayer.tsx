"use client";
import { useMemo } from "react";
import type { VideoRef } from "@/lib/video/provider";
import { getActiveProvider } from "@/lib/video";
import { useAuth } from "@/lib/auth";

type Props = {
  video: VideoRef | null | undefined;
  title?: string;
  locked?: boolean;
  onNeedAccess?: () => void;
};

export default function VideoPlayer({ video, title, locked, onNeedAccess }: Props) {
  const provider = getActiveProvider();
  const { user } = useAuth();

  const state = useMemo(() => {
    if (locked) return { kind: "locked" as const };
    if (!video) return { kind: "unavailable" as const, msg: "الفيديو غير متاح بعد — سيتم رفعه قريبًا" };
    const v = provider.validateSource(video.originalUrl ?? video.providerVideoId);
    if (!v.valid) return { kind: "invalid" as const, msg: v.error ?? "رابط الفيديو غير صالح" };
    const cfg = provider.getPlayerConfig(video);
    if (!cfg) return { kind: "error" as const, msg: "تعذر تهيئة المشغل" };
    return { kind: "ready" as const, cfg };
  }, [video, locked, provider]);

  const watermarkText = useMemo(() => {
    if (!user || user.role !== "student") return "";
    const name = user.name?.trim() ?? "";
    const phone = user.phone?.trim() ?? "";
    if (name && phone) return `${name} — ${phone}`;
    return name || phone;
  }, [user]);

  if (state.kind === "locked") {
    return (
      <div className="grid place-items-center rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 p-8 text-center">
        <div className="text-3xl">🔒</div>
        <div className="mt-2 font-black">اشترِ الباقة للوصول إلى فيديو الشرح وفيديو الحل</div>
        <p className="mt-1 text-sm text-[var(--text-3)]">المحتوى محمي — يظهر فقط بعد الشراء أو تفعيل الكود</p>
        {onNeedAccess && <button onClick={onNeedAccess} className="btn-primary mt-4">شراء الباقة</button>}
      </div>
    );
  }
  if (state.kind === "unavailable" || state.kind === "invalid" || state.kind === "error") {
    return (
      <div className="grid place-items-center rounded-xl bg-[var(--surface-3)] p-8 text-center">
        <div className="font-bold text-[var(--text-3)]">{state.msg}</div>
      </div>
    );
  }
  return (
    <div
      className="relative overflow-hidden rounded-xl bg-black select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="relative aspect-video">
        <iframe
          src={state.cfg.embedUrl}
          title={title ?? "فيديو تعليمي"}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
        {/* Dynamic watermark overlay — pointer-events none so controls remain usable */}
        {watermarkText && (
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
          >
            <div className="watermark-float">
              {watermarkText}
            </div>
            {/* second faint static watermark for screen-record deterrence */}
            <div className="watermark-static">
              {watermarkText}
            </div>
          </div>
        )}
      </div>
      {/* subtle notice */}
      {watermarkText && (
        <div className="pointer-events-none absolute bottom-1 left-1 rounded bg-black/40 px-2 py-0.5 text-[10px] font-bold text-white/70">
          محمي — {watermarkText}
        </div>
      )}
    </div>
  );
}
