// طبقة البيانات التجريبية — فارغة للتسليم. المستر يضيف المحتوى من لوحة التحكم.
// لا توجد باقات/فيديوهات/امتحانات افتراضية — المنصة خالية ونظيفة.
import type { Announcement, Assignment, Course, Exam, LiveClass, NotificationItem, Question, User, WeeklyPackage } from "./types";

export const mockUsers: User[] = [
  { id: "u-teacher", name: "مستر أشرف", email: "ashraf@elmomtaz.example", role: "teacher" },
  { id: "u-admin", name: "إدارة المنصة", email: "admin@elmomtaz.example", role: "admin" },
  { id: "u-s1", name: "أحمد محمد", email: "ahmed@example.com", role: "student" },
];

export const mockQuestions: Question[] = [];
export const mockExams: Exam[] = [];
export const mockWeeklyPackages: WeeklyPackage[] = [];

// إبقاء كورسات فارغة — المستر يبنيها عبر الباقات الأسبوعية
export const mockCourses: Course[] = [];

export const mockAssignments: Assignment[] = [];

export const mockNotifications: NotificationItem[] = [];

export const mockAnnouncements: Announcement[] = [];

export const mockLive: LiveClass[] = [];

export function getCourseBySlug(_slug: string): Course | undefined { return undefined; }
export function getCourseById(_id: string): Course | undefined { return undefined; }
export function getPackageBySlug(_slug: string): WeeklyPackage | undefined { return undefined; }
export function getPackageById(_id: string): WeeklyPackage | undefined { return undefined; }
