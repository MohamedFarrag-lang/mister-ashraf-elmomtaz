import * as React from "react";

export function Badge({ children, tone="neutral", className="" }: { children: React.ReactNode; tone?: "neutral"|"success"|"warning"|"brand"|"accent"; className?:string }){
  const tones: Record<string,string> = {
    neutral: "bg-[var(--surface)] border-[var(--line)] text-[var(--text-2)]",
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    brand: "bg-[var(--brand-50)] border-[var(--brand-100)] text-[var(--brand-800)]",
    accent: "bg-[var(--accent-50)] border-amber-200 text-amber-900",
  };
  return <span className={`badge ${tones[tone]} ${className}`}>{children}</span>;
}

export function Progress({ value }: { value:number }){
  const v = Math.max(0, Math.min(100, value));
  return <div className="progress-track" aria-label={`التقدم ${v}%`}><div className="progress-fill" style={{width:`${v}%`}}/></div>;
}

export function EmptyState({ title, desc, action }: { title:string; desc?:string; action?: React.ReactNode }){
  return <div className="card p-10 text-center">
    <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-[var(--surface-3)] text-[var(--text-3)]">∅</div>
    <h3 className="font-extrabold text-[var(--text)]">{title}</h3>
    {desc && <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[var(--text-3)]">{desc}</p>}
    {action && <div className="mt-5 flex justify-center">{action}</div>}
  </div>;
}

export function Skeleton({ className="" }: { className?:string }){
  return <div className={`skeleton rounded-xl ${className}`} />;
}

export function Field({ label, children, hint, error }: { label: string; children: React.ReactNode; hint?: string; error?: string }){
  return <label className="grid gap-2 text-sm">
    <span className="font-bold text-[var(--text)]">{label}</span>
    {children}
    {hint && !error && <span className="text-xs text-[var(--text-3)]">{hint}</span>}
    {error && <span className="text-xs font-bold text-[var(--danger)]">{error}</span>}
  </label>;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>){
  return <input {...props} className={`h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 text-sm outline-none focus:border-[var(--brand-400)] ${props.className||""}`} />;
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>){
  return <textarea {...props} className={`min-h-28 w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 text-sm outline-none focus:border-[var(--brand-400)] ${props.className||""}`} />;
}
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>){
  return <select {...props} className={`h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 text-sm outline-none focus:border-[var(--brand-400)] ${props.className||""}`} />;
}

export function Card({ children, className="" }: { children: React.ReactNode; className?:string }){
  return <div className={`card ${className}`}>{children}</div>;
}
export function SectionTitle({ kicker, title, desc }: { kicker?: string; title: string; desc?: string }){
  return <div className="grid gap-2">
    {kicker && <span className="text-xs font-extrabold tracking-widest text-[var(--brand-700)]">{kicker}</span>}
    <h2 className="text-2xl font-black leading-8 text-[var(--text)] md:text-3xl">{title}</h2>
    {desc && <p className="max-w-2xl text-sm leading-7 text-[var(--text-3)]">{desc}</p>}
  </div>;
}
