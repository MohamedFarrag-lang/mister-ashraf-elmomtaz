export type Role = "student" | "teacher" | "admin";
export type CourseStatus = "draft" | "published" | "archived";
export type Level = "الصف الأول الثانوي" | "الصف الثاني الثانوي" | "الصف الثالث الثانوي" | "تأسيس";
export type Category = "نحو" | "بلاغة" | "أدب" | "نصوص" | "قراءة" | "تعبير" | "مراجعة نهائية";
export type LessonType = "video" | "reading" | "live";
export type QuestionKind = "mcq" | "true_false" | "multi_select" | "short" | "essay";
export type Difficulty = "سهل" | "متوسط" | "متقدم";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
  guardianPhone?: string;
  governorate?: string;
  district?: string;
  village?: string;
  deviceId?: string;
  createdAt?: string;
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  description: string;
  thumbnail: string;
  cover: string;
  level: Level;
  category: Category;
  price: number | null;
  status: CourseStatus;
  durationLabel: string;
  lessonsCount: number;
  studentsCount?: number;
  featured?: boolean;
  modules: Module[];
  resources?: Resource[];
};

export type Module = {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
};

export type Lesson = {
  id: string;
  title: string;
  duration: string;
  type: LessonType;
  videoUrl?: string;
  description?: string;
  order: number;
  isPreview?: boolean;
  resources?: Resource[];
};

export type Resource = {
  id: string;
  title: string;
  kind: "pdf" | "doc" | "image" | "link";
  url: string;
  sizeLabel?: string;
};

export type Assignment = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  deadline?: string;
  status: "draft" | "published" | "closed";
  resources?: Resource[];
};

export type AssignmentSubmission = {
  id: string;
  assignmentId: string;
  studentId: string;
  text?: string;
  fileUrl?: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
  state: "not_started" | "submitted" | "late" | "graded" | "returned";
};

export type Question = {
  id: string;
  kind: QuestionKind;
  difficulty: Difficulty;
  category: Category;
  points: number;
  prompt: string;
  options?: string[];
  correctIndex?: number;
  correctIndexes?: number[];
  correctBoolean?: boolean;
  answerText?: string;
  explanation?: string;
  tags: string[];
};

export type Exam = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  durationMin: number;
  passingScore: number;
  questions: Question[];
  status: "draft" | "published" | "archived";
  attemptLimit?: number;
  showAnswersAfter?: boolean;
};

export type ExamAttempt = {
  id: string;
  examId: string;
  studentId: string;
  answers: Record<string, unknown>;
  score?: number;
  total?: number;
  percent?: number;
  passed?: boolean;
  submittedAt?: string;
  timeUsedSec?: number;
};

export type Enrollment = {
  courseId: string;
  progress: number;
  completedLessonIds: string[];
};

import type { GradeId, TermId } from "./curriculum";
import type { VideoRef } from "./video/provider";
// ============ Weekly Package Model ============

export type PackageStatus = "draft" | "scheduled" | "published" | "archived";
export type PackageProductType = "weekly" | "monthly" | "course" | "revision" | "bundle";

export type WeeklyPackage = {
  id: string;
  slug: string;
  title: string;
  description: string;
  grade: GradeId;
  academicYearId: string;
  term: TermId;
  weekNumber: number;
  coverImage?: string;
  explanationVideo?: VideoRef | null;
  solutionVideo?: VideoRef | null;
  examId?: string | null;
  attachments?: Resource[];
  priceOverride?: number | null;
  status: PackageStatus;
  publishedAt?: string | null;
  scheduledAt?: string | null;
  productType: PackageProductType;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
};

export type OrderStatus = "pending" | "paid" | "failed" | "cancelled" | "refunded";

export type Order = {
  id: string;
  studentId: string;
  packageId: string;
  amountEgp: number;
  status: OrderStatus;
  activationCode?: string;
  createdAt: string;
  paidAt?: string;
};

export type ActivationCode = {
  code: string;
  packageId: string | null;
  maxUses: number;
  usedCount: number;
  expiresAt?: string;
  createdAt: string;
  usedByStudentId?: string;
  usedByStudentName?: string;
  usedByPhone?: string;
  usedAt?: string;
};

export type Purchase = {
  packageId: string;
  orderId: string;
  unlockedAt: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  category: "assignment" | "exam" | "announcement" | "live" | "system" | "package";
  createdAt: string;
  read: boolean;
  href?: string;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  audience: "all" | "course";
  courseId?: string;
  publishedAt: string;
};

export type LiveClass = {
  id: string;
  courseId: string;
  title: string;
  date: string;
  durationMin: number;
  meetingUrl?: string;
  status: "upcoming" | "live" | "completed" | "cancelled";
  recordingUrl?: string;
};

export type GradeRow = {
  studentId: string;
  studentName: string;
  courseTitle: string;
  assignmentTitle?: string;
  examTitle?: string;
  score?: number;
  total?: number;
  state: string;
};
