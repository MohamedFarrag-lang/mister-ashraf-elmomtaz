import type { VideoProvider, VideoProviderName } from "./provider";
import { youtubeProvider } from "./youtube";

// نقطة التكوين المركزية — تغيير مزود الفيديو من مكان واحد فقط
export const ACTIVE_VIDEO_PROVIDER: VideoProviderName = "youtube";

const providers: Record<VideoProviderName, VideoProvider> = {
  youtube: youtubeProvider,
  // bunny: bunnyProvider — يضاف لاحقًا بدون لمس الواجهات
  bunny: null as unknown as VideoProvider,
};

export function getVideoProvider(name: VideoProviderName = ACTIVE_VIDEO_PROVIDER): VideoProvider {
  const p = providers[name];
  if (!p) throw new Error(`VideoProvider "${name}" غير مُهيأ بعد — أضف BunnyStreamProvider لاحقًا`);
  return p;
}

export function getActiveProvider(): VideoProvider {
  return getVideoProvider(ACTIVE_VIDEO_PROVIDER);
}

export * from "./provider";
export { youtubeProvider } from "./youtube";
