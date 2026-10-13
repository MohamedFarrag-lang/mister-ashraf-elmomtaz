// التسعير — لا يوجد hard-code لـ 20 في الواجهات
export const DEFAULT_WEEKLY_PRICE_EGP = 20;

export type PlatformPricing = {
  defaultWeeklyPriceEgp: number;
  currency: "EGP";
};

const LS_PRICING = "elmomtaz.pricing";

export function getDefaultPricing(): PlatformPricing {
  if (typeof window === "undefined") return { defaultWeeklyPriceEgp: DEFAULT_WEEKLY_PRICE_EGP, currency: "EGP" };
  try {
    const raw = localStorage.getItem(LS_PRICING);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { defaultWeeklyPriceEgp: DEFAULT_WEEKLY_PRICE_EGP, currency: "EGP" };
}

export function saveDefaultPricing(p: PlatformPricing): void {
  localStorage.setItem(LS_PRICING, JSON.stringify(p));
}

export function formatEgp(amount: number): string {
  return `${amount} جنيه`;
}

export function resolvePackagePrice(pkg: { priceOverride?: number | null }, fallback: number): number {
  if (typeof pkg.priceOverride === "number" && pkg.priceOverride !== null) return pkg.priceOverride;
  return fallback;
}
