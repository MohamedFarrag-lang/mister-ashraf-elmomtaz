export const brand = {
  nameAr: "منصة الممتاز",
  teacherName: "مستر أشرف",
  nickname: "الممتاز",
  tagline: "مع مستر أشرف .. العربي أسهل مما تتخيل",
  description:
    "منصة تعليمية متكاملة لشرح اللغة العربية بأسلوب مبسط واحترافي، مع متابعة حقيقية لمستوى كل طالب.",
  subject: "اللغة العربية",
  // configurable contact — لا تنشر إلا ما هو مسموح
  contact: {
    phone: "+201120681584",
    whatsapp: "+201120681584",
    email: "contact@elmomtaz.example",
    address: "القاهرة، مصر",
  },
  social: {
    facebook: "#",
    youtube: "#",
    telegram: "#",
  },
} as const;

export const siteConfig = {
  localeDefault: "ar",
  dirDefault: "rtl" as const,
  // جميع النصوص العربية في ملفات اللغة/المكونات، والمعرّفات التقنية تبقى إنجليزية
};

export const enrollmentStates = [
  "guest",
  "not_enrolled",
  "enrolled",
  "completed",
  "restricted",
] as const;

export const roles = ["student", "teacher", "admin"] as const;
