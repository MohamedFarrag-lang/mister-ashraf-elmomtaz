import type { VideoProvider, VideoRef, PlayerConfig, ValidationResult } from "./provider";

const YT_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/,
  /^([A-Za-z0-9_-]{11})$/,
];

function extractId(input: string): string | null {
  const s = input.trim();
  for (const re of YT_PATTERNS) {
    const m = s.match(re);
    if (m) return m[1].slice(0, 11); // YouTube IDs are 11 chars
    // For short ID pattern already 11
  }
  return null;
}

export const youtubeProvider: VideoProvider = {
  name: "youtube",
  validateSource(input: string): ValidationResult {
    if (!input || !input.trim()) return { valid: false, error: "رابط الفيديو مطلوب" };
    const id = extractId(input);
    if (!id) return { valid: false, error: "رابط يوتيوب غير صالح — الصق رابط youtube.com/watch أو youtu.be" };
    if (id.length !== 11) return { valid: false, error: "معرّف الفيديو غير مكتمل (يجب أن يكون 11 حرفًا)" };
    return { valid: true, videoId: id };
  },
  parse(input: string): VideoRef | null {
    const v = this.validateSource(input);
    if (!v.valid || !v.videoId) return null;
    return { provider: "youtube", providerVideoId: v.videoId, originalUrl: input.trim() };
  },
  getPlayerConfig(ref: VideoRef): PlayerConfig | null {
    if (ref.provider !== "youtube" || !ref.providerVideoId) return null;
    // Educational embed: minimal distractions, no autoplay, modest branding
    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
      enablejsapi: "0",
      origin: typeof window !== "undefined" ? window.location.origin : "",
    });
    // Remove empty origin on server
    if (!params.get("origin")) params.delete("origin");
    return {
      provider: "youtube",
      videoId: ref.providerVideoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${ref.providerVideoId}?${params.toString()}`,
    };
  },
};
