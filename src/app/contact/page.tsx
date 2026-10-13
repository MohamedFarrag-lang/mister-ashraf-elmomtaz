"use client";
import { useState } from "react";
import { brand } from "@/lib/config";
import { Card } from "@/components/ui/primitives";

export default function Contact(){
  return <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-2 md:px-6">
    <div className="grid gap-4 content-start">
      <h1 className="text-3xl font-black">تواصل معنا</h1>
      <p className="text-sm leading-7 text-[var(--text-3)]">للاستفسار عن الباقات أو الدعم الفني — نرد خلال ساعات العمل.</p>
      <Card className="p-6 grid gap-3 text-sm">
        <div className="flex justify-between"><span className="text-[var(--text-3)]">الهاتف / واتساب</span><a href={`https://wa.me/${brand.contact.whatsapp.replace("+","")}`} target="_blank" rel="noopener noreferrer" className="font-bold text-[var(--brand-700)]" dir="ltr">{brand.contact.whatsapp}</a></div>
        <div className="flex justify-between"><span className="text-[var(--text-3)]">البريد</span><span className="font-bold">{brand.contact.email}</span></div>
        <div className="flex justify-between"><span className="text-[var(--text-3)]">العنوان</span><span className="font-bold">{brand.contact.address}</span></div>
      </Card>
    </div>
    <Card className="p-6">
      <a href={`https://wa.me/${brand.contact.whatsapp.replace("+","")}?text=${encodeURIComponent("السلام عليكم مستر أشرف، أريد الاستفسار عن الباقات الأسبوعية")}`} target="_blank" rel="noopener noreferrer" className="btn-primary w-full text-center">تواصل عبر واتساب</a>
      <p className="mt-3 text-center text-sm text-[var(--text-3)]">نرد عليك على نفس الرقم في أقرب وقت.</p>
    </Card>
  </div>;
}
