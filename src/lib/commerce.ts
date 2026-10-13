"use client";
import type { ActivationCode, Order, Purchase, WeeklyPackage } from "./types";
import { resolvePackagePrice, getDefaultPricing } from "./pricing";

const LS_PACKAGES = "elmomtaz.packages";
const LS_ORDERS = "elmomtaz.orders";
const LS_PURCHASES = "elmomtaz.purchases";
const LS_CODES = "elmomtaz.activationCodes";
const LS_DEVICE = "elmomtaz.deviceId";

// ---- Helpers ----
function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function generateCode(): string {
  const a = Math.random().toString(36).slice(2, 6).toUpperCase();
  const b = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ASHRAF-2026-${a}${b}`;
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function write(key: string, v: unknown): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(v));
}

// ---- Packages ----
export function loadPackages(): WeeklyPackage[] {
  return read<WeeklyPackage[]>(LS_PACKAGES, []);
}
export function savePackages(list: WeeklyPackage[]): void { write(LS_PACKAGES, list); }

// ---- Orders / Purchases ----
export function loadOrders(): Order[] { return read<Order[]>(LS_ORDERS, []); }
export function loadPurchases(): Purchase[] { return read<Purchase[]>(LS_PURCHASES, []); }
export function saveOrders(list: Order[]): void { write(LS_ORDERS, list); }
export function savePurchases(list: Purchase[]): void { write(LS_PURCHASES, list); }

export function isPackagePurchased(packageId: string): boolean {
  return loadPurchases().some(p => p.packageId === packageId);
}

export function createPaidOrder(packageId: string, studentId: string, amountEgp: number): Order {
  const order: Order = { id: uid("ord"), studentId, packageId, amountEgp, status: "paid", createdAt: new Date().toISOString(), paidAt: new Date().toISOString() };
  const orders = loadOrders();
  orders.unshift(order);
  saveOrders(orders);
  const purchases = loadPurchases();
  if (!purchases.some(p => p.packageId === packageId)) {
    purchases.push({ packageId, orderId: order.id, unlockedAt: new Date().toISOString() });
    savePurchases(purchases);
  }
  return order;
}

export function mockPurchase(packageId: string, studentId: string, pkg?: WeeklyPackage): Order {
  const fallback = getDefaultPricing().defaultWeeklyPriceEgp;
  const amount = pkg ? resolvePackagePrice(pkg, fallback) : fallback;
  return createPaidOrder(packageId, studentId, amount);
}

// ---- Activation Codes ----
export function loadCodes(): ActivationCode[] { return read<ActivationCode[]>(LS_CODES, []); }
export function saveCodes(list: ActivationCode[]): void { write(LS_CODES, list); }

export function createActivationCode(packageId: string | null, maxUses = 1): ActivationCode {
  const c: ActivationCode = { code: generateCode(), packageId, maxUses, usedCount: 0, createdAt: new Date().toISOString() };
  const list = loadCodes();
  list.unshift(c);
  saveCodes(list);
  return c;
}

export function redeemCode(
  code: string,
  studentId: string,
  studentName?: string,
  studentPhone?: string,
): { ok: boolean; error?: string; order?: Order } {
  const list = loadCodes();
  const idx = list.findIndex(c => c.code === code.trim().toUpperCase());
  if (idx === -1) return { ok: false, error: "الكود غير صحيح" };
  const c = list[idx];
  if (c.usedCount >= c.maxUses) return { ok: false, error: "الكود مستهلك بالفعل" };
  if (c.expiresAt && new Date(c.expiresAt).getTime() < Date.now()) return { ok: false, error: "الكود منتهي الصلاحية" };
  if (!c.packageId) return { ok: false, error: "الكود غير مرتبط بباقة — تواصل مع الإدارة" };
  c.usedCount += 1;
  c.usedByStudentId = studentId;
  c.usedByStudentName = studentName;
  c.usedByPhone = studentPhone;
  c.usedAt = new Date().toISOString();
  saveCodes(list);
  const order: Order = {
    id: uid("ord"),
    studentId,
    packageId: c.packageId,
    amountEgp: 0,
    status: "paid",
    activationCode: c.code,
    createdAt: new Date().toISOString(),
    paidAt: new Date().toISOString(),
  };
  const orders = loadOrders();
  orders.unshift(order);
  saveOrders(orders);
  const purchases = loadPurchases();
  if (!purchases.some(p => p.packageId === c.packageId)) {
    purchases.push({ packageId: c.packageId, orderId: order.id, unlockedAt: new Date().toISOString() });
    savePurchases(purchases);
  }
  return { ok: true, order };
}

// ---- Device Binding ----
export function getDeviceId(): string {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem(LS_DEVICE);
  if (!id) { id = uid("dev"); localStorage.setItem(LS_DEVICE, id); }
  return id;
}

export function checkDeviceBinding(userDeviceId?: string): { ok: boolean; currentDevice: string } {
  const current = getDeviceId();
  if (!userDeviceId) return { ok: true, currentDevice: current };
  return { ok: current === userDeviceId, currentDevice: current };
}
