// VideoProvider — تجريد مزود الفيديو (YouTube الآن، Bunny لاحقًا)
export type VideoProviderName = "youtube" | "bunny";

export type VideoRef = {
  provider: VideoProviderName;
  providerVideoId: string;
  originalUrl?: string;
  title?: string;
};

export type PlayerConfig = {
  embedUrl: string;
  provider: VideoProviderName;
  videoId: string;
};

export type ValidationResult = { valid: boolean; error?: string; videoId?: string };

export interface VideoProvider {
  readonly name: VideoProviderName;
  validateSource(input: string): ValidationResult;
  parse(input: string): VideoRef | null;
  getPlayerConfig(ref: VideoRef): PlayerConfig | null;
}
