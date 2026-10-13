// البنية المنهجية — قابلة للتوسع بدون تعديل الواجهات
export type AcademicYear = { id: string; label: string; startYear: number; isCurrent: boolean };
export type GradeId = "grade1" | "grade2" | "grade3";
export type Grade = { id: GradeId; label: string; shortLabel: string };
export type TermId = "term1" | "term2";
export type Term = { id: TermId; label: string };
export type WeekDef = { number: number; label: string };

// القيم الافتراضية — قابلة للإدارة من لوحة المعلم
export const academicYears: AcademicYear[] = [
  { id: "2026-2027", label: "2026/2027", startYear: 2026, isCurrent: true },
  { id: "2027-2028", label: "2027/2028", startYear: 2027, isCurrent: false },
];

export const grades: Grade[] = [
  { id: "grade1", label: "الصف الأول الثانوي", shortLabel: "أولى ثانوي" },
  { id: "grade2", label: "الصف الثاني الثانوي", shortLabel: "ثانية ثانوي" },
  { id: "grade3", label: "الصف الثالث الثانوي", shortLabel: "ثالثة ثانوي" },
];

export const terms: Term[] = [
  { id: "term1", label: "الترم الأول" },
  { id: "term2", label: "الترم الثاني" },
];

export function weeksForTerm(): WeekDef[] {
  return Array.from({ length: 16 }, (_, i) => ({ number: i + 1, label: `الأسبوع ${i + 1}` }));
}

export function gradeLabel(id: GradeId): string {
  return grades.find(g => g.id === id)?.label ?? id;
}
export function termLabel(id: TermId): string {
  return terms.find(t => t.id === id)?.label ?? id;
}
