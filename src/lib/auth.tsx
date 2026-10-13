"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Role, User, Enrollment } from "./types";
import { getDeviceId } from "./commerce";

// JWT + httpOnly cookie هو مصدر الحقيقة للـ proxy (src/proxy.ts)
// localStorage يبقى كـ cache للواجهة + سجل الأجهزة للـ single-device lock

type AuthState = {
  user: User | null;
  enrollments: Enrollment[];
  deviceAlert: string | null;
  dismissDeviceAlert: () => void;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: { name: string; phone: string; password: string; guardianPhone: string; governorate: string; district: string; village?: string }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  isEnrolled: (courseId: string) => boolean;
  enroll: (courseId: string) => void;
  completeLesson: (courseId: string, lessonId: string) => void;
  role: Role | null;
};

const Ctx = createContext<AuthState | null>(null);

const LS_USER = "elmomtaz.user";
const LS_ENROLL = "elmomtaz.enrollments";
const LS_REGISTRY = "elmomtaz.deviceRegistry";

function getRegistry(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(LS_REGISTRY) || "{}"); } catch { return {}; }
}
function setRegistryEntry(userId: string, deviceId: string) {
  const r = getRegistry();
  r[userId] = deviceId;
  localStorage.setItem(LS_REGISTRY, JSON.stringify(r));
}

const demoUsers: User[] = [
  { id: "u-s1", name: "أحمد محمد", email: "student@test.com", role: "student", phone: "01000000001", guardianPhone: "01100000001", governorate: "القاهرة", district: "مدينة نصر", deviceId: "" },
  { id: "u-teacher", name: "مستر أشرف", email: "teacher@test.com", role: "teacher" },
  { id: "u-admin", name: "إدارة المنصة", email: "admin@test.com", role: "admin" },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [deviceAlert, setDeviceAlert] = useState<string | null>(null);

  useEffect(() => {
    try {
      const u = localStorage.getItem(LS_USER);
      const e = localStorage.getItem(LS_ENROLL);
      if (u) {
        const parsed: User = JSON.parse(u);
        if (parsed.role === "student") {
          const current = getDeviceId();
          const registry = getRegistry();
          const latest = registry[parsed.id];
          // Old device detection: registry has newer device than current browser
          if (latest && latest !== current && latest !== parsed.deviceId) {
            setDeviceAlert("تم الكشف عن دخول من جهاز جديد، سيتم إلغاء الجلسة السابقة");
            // Single-device lock: clear old session and keep latest
            localStorage.removeItem(LS_USER);
            // Do not restore old session; user must re-login (device binding enforced)
            setTimeout(() => setDeviceAlert(null), 6000);
            // Skip setting user — force logout on old device
            if (e) { try { setEnrollments(JSON.parse(e)); } catch {} }
            return;
          }
          if (parsed.deviceId && parsed.deviceId !== current) {
            setDeviceAlert("تم الكشف عن دخول من جهاز جديد، سيتم إلغاء الجلسة السابقة");
            setTimeout(() => setDeviceAlert(null), 5000);
            parsed.deviceId = current;
            setRegistryEntry(parsed.id, current);
            localStorage.setItem(LS_USER, JSON.stringify(parsed));
          } else if (!parsed.deviceId) {
            parsed.deviceId = current;
            setRegistryEntry(parsed.id, current);
            localStorage.setItem(LS_USER, JSON.stringify(parsed));
          } else {
            setRegistryEntry(parsed.id, parsed.deviceId);
          }
        }
        setUser(parsed);
      }
      if (e) setEnrollments(JSON.parse(e));
    } catch {}
  }, []);

  // Cross-tab single-device enforcement via storage events
  useEffect(() => {
    function onStorage(ev: StorageEvent) {
      if (ev.key === LS_REGISTRY && user?.role === "student" && user.id) {
        const reg = getRegistry();
        const latest = reg[user.id];
        const current = getDeviceId();
        if (latest && latest !== current) {
          setDeviceAlert("تم الكشف عن دخول من جهاز جديد، سيتم إلغاء الجلسة السابقة");
          setTimeout(() => {
            localStorage.removeItem(LS_USER);
            setUser(null);
            setDeviceAlert(null);
          }, 2500);
        }
      }
      if (ev.key === LS_USER && ev.newValue === null && user) {
        setUser(null);
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [user]);

  useEffect(() => {
    if (user) localStorage.setItem(LS_USER, JSON.stringify(user));
    else localStorage.removeItem(LS_USER);
  }, [user]);
  useEffect(() => {
    localStorage.setItem(LS_ENROLL, JSON.stringify(enrollments));
  }, [enrollments]);

  const value = useMemo<AuthState>(() => ({
    user,
    enrollments,
    deviceAlert,
    dismissDeviceAlert: () => setDeviceAlert(null),
    role: user?.role ?? null,
    isEnrolled: (courseId) => enrollments.some(e => e.courseId === courseId),
    enroll: (courseId) => {
      if (!user) return;
      setEnrollments(prev => {
        if (prev.some(p => p.courseId === courseId)) return prev;
        return [...prev, { courseId, progress: 5, completedLessonIds: [] }];
      });
    },
    completeLesson: (courseId, lessonId) => {
      setEnrollments(prev => prev.map(e => {
        if (e.courseId !== courseId) return e;
        if (e.completedLessonIds.includes(lessonId)) return e;
        const next = [...e.completedLessonIds, lessonId];
        const total = 6;
        const progress = Math.min(100, Math.round((next.length / total) * 100));
        return { ...e, completedLessonIds: next, progress };
      }));
    },
    login: async (email, password) => {
      if (!email || !password || password.length < 4) return { ok: false, error: "بيانات الدخول غير صحيحة" };
      const currentDevice = getDeviceId();
      const registry = getRegistry();
      const isPhone = /^[0-9]{10,11}$/.test(email.replace(/\s/g, ""));
      const found = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase() || u.phone === email);
      // إنشاء/تحديث الكوكيز الخادمية أولاً — الـ proxy يتحقق منها
      try {
        await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-device-id": currentDevice },
          body: JSON.stringify({ identifier: email, password }),
        });
      } catch {}
      if (found) {
        const prevDevice = registry[found.id];
        if (prevDevice && prevDevice !== currentDevice) {
          setDeviceAlert("تم الكشف عن دخول من جهاز جديد، سيتم إلغاء الجلسة السابقة");
          setTimeout(() => setDeviceAlert(null), 5000);
        }
        const withDevice = { ...found, deviceId: currentDevice } as User;
        setRegistryEntry(withDevice.id, currentDevice);
        setUser(withDevice);
        return { ok: true };
      }
      if (isPhone) {
        const newUser: User = { id: "u-" + Date.now(), name: email, email: `${email}@phone.local`, phone: email, role: "student", deviceId: currentDevice };
        setRegistryEntry(newUser.id, currentDevice);
        setUser(newUser);
        return { ok: true };
      }
      return { ok: false, error: "الحساب غير موجود — أنشئ حسابًا جديدًا برقم الهاتف" };
    },
    register: async (data) => {
      if (!data.name || !data.phone || data.password.length < 4 || !data.guardianPhone) return { ok: false, error: "أكمل البيانات المطلوبة بشكل صحيح" };
      const currentDevice = getDeviceId();
      try {
        await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-device-id": currentDevice },
          body: JSON.stringify({ name: data.name, phone: data.phone, password: data.password, guardianPhone: data.guardianPhone, governorate: data.governorate, district: data.district, village: data.village }),
        });
      } catch {}
      const u: User = { id: "u-" + Date.now(), name: data.name, email: `${data.phone}@phone.local`, phone: data.phone, guardianPhone: data.guardianPhone, governorate: data.governorate, district: data.district, village: data.village, role: "student", deviceId: currentDevice };
      setRegistryEntry(u.id, currentDevice);
      setUser(u);
      return { ok: true };
    },
    logout: () => {
      try { fetch("/api/auth/logout", { method: "POST" }); } catch {}
      if (user?.id) {
        const r = getRegistry();
        delete r[user.id];
        localStorage.setItem(LS_REGISTRY, JSON.stringify(r));
      }
      setUser(null);
    },
  }), [user, enrollments, deviceAlert]);

  return (
    <Ctx.Provider value={value}>
      {deviceAlert && (
        <div className="fixed top-4 left-1/2 z-[100] -translate-x-1/2 rounded-xl border border-amber-300 bg-amber-50 px-5 py-3 text-sm font-black text-amber-900 shadow-lg flex items-center gap-3 max-w-[92vw]">
          <span>⚠️ {deviceAlert}</span>
          <button onClick={() => setDeviceAlert(null)} className="rounded-full bg-amber-900 px-3 py-1 text-xs font-bold text-white">حسنًا</button>
        </div>
      )}
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth outside provider");
  return c;
}
