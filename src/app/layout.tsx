import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { AppStoreProvider } from "@/lib/store";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

const cairo = Cairo({ subsets: ["arabic","latin"], variable: "--font-cairo", display: "swap" });

export const metadata: Metadata = {
  title: "منصة الممتاز — مستر أشرف | اللغة العربية",
  description: "منصة الممتاز مع مستر أشرف — شرح مبسط للغة العربية، متابعة حقيقية، واجبات واختبارات وتقدم مدروس.",
  openGraph: { title: "منصة الممتاز — مستر أشرف", description: "العربي أسهل مما تتخيل", type: "website", locale: "ar_EG" },
};

export default function RootLayout({ children }: { children: React.ReactNode }){
  return <html lang="ar" dir="rtl" className={cairo.variable}>
    <body className="min-h-screen">
      <AuthProvider>
        <AppStoreProvider>
          <SiteHeader />
          <main className="min-h-[60vh]">{children}</main>
          <SiteFooter />
        </AppStoreProvider>
      </AuthProvider>
    </body>
  </html>;
}
