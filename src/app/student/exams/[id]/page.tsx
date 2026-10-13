"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { mockExams } from "@/lib/mocks";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";
import { Badge, Card } from "@/components/ui/primitives";

export default function ExamAttemptPage(){
  const { id } = useParams<{ id:string }>();
  const exam = mockExams.find(e=>e.id===id);
  const { user } = useAuth();
  const { addAttempt } = useStore();
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string,any>>({});
  const [sec, setSec] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{score:number; total:number; percent:number; passed:boolean} | null>(null);

  const q = exam?.questions[idx];

  useEffect(()=>{
    if(!exam) return;
    setSec(exam.durationMin*60);
    const t = setInterval(()=> setSec(s=> s>0? s-1:0), 1000);
    return ()=> clearInterval(t);
  },[exam?.id]);

  const timeLabel = useMemo(()=>{
    const m = Math.floor(sec/60); const s = sec%60;
    return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  },[sec]);

  if(!exam) return <div className="p-10 text-center">الاختبار غير موجود</div>;
  if(!user) return <div className="p-10 text-center">سجّل الدخول أولًا</div>;

  function grade(){
    let score=0; let total=0;
    exam!.questions.forEach(qu=>{
      total+=qu.points;
      const a = answers[qu.id];
      if(qu.kind==="mcq" && a===qu.correctIndex) score+=qu.points;
      else if(qu.kind==="true_false" && a===qu.correctBoolean) score+=qu.points;
      else if(qu.kind==="multi_select" && Array.isArray(a) && JSON.stringify([...a].sort())===JSON.stringify([...(qu.correctIndexes||[])].sort())) score+=qu.points;
      else if(qu.kind==="short" && typeof a==="string" && a.trim().length>0) score+= Math.round(qu.points*0.5); // نصف درجة للسؤال المقالي القصير تجريبي
      else if(qu.kind==="essay" && typeof a==="string" && a.trim().length>20) score+=0; // يحتاج تصحيح يدوي
    });
    const percent = total? Math.round((score/total)*100):0;
    return { score, total, percent, passed: percent>=exam!.passingScore };
  }

  function submit(){
    const r = grade();
    setResult(r);
    setSubmitted(true);
    addAttempt({ id:"att-"+Date.now(), examId:exam!.id, studentId:user!.id, answers, score:r.score, total:r.total, percent:r.percent, passed:r.passed, submittedAt:new Date().toISOString(), timeUsedSec: exam!.durationMin*60 - sec });
  }

  if(submitted && result){
    return <div className="mx-auto max-w-3xl px-4 py-8">
      <Card className="p-8 text-center">
        <div className={`mx-auto grid h-16 w-16 place-items-center rounded-full text-2xl font-black ${result.passed? "bg-emerald-100 text-emerald-800":"bg-amber-100 text-amber-800"}`}>{result.percent}%</div>
        <h1 className="mt-4 text-2xl font-black">{result.passed? "أحسنت — ناجح":"حاول مرة أخرى"}</h1>
        <p className="text-sm text-[var(--text-3)]">الدرجة {result.score} / {result.total} — حد النجاح {exam.passingScore}%</p>
        {exam.showAnswersAfter? <div className="mt-6 grid gap-3 text-right">
          {exam.questions.map(qu=> <div key={qu.id} className="rounded-xl border border-[var(--line)] p-4 text-sm">
            <div className="font-bold">{qu.prompt}</div>
            {qu.explanation && <div className="mt-1 text-xs text-[var(--text-3)]">توضيح: {qu.explanation}</div>}
          </div>)}
        </div> : <p className="mt-4 text-sm text-[var(--text-3)]">الإجابات النموذجية مخفية حسب إعداد المعلم لهذا الاختبار.</p>}
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={()=>router.push("/student/results")} className="btn-primary">عرض النتائج</button>
          <button onClick={()=>router.push("/student/exams")} className="btn-ghost">العودة</button>
        </div>
      </Card>
    </div>;
  }

  return <div className="mx-auto max-w-5xl px-4 py-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h1 className="text-xl font-black">{exam.title}</h1><p className="text-sm text-[var(--text-3)]">سؤال {idx+1} / {exam.questions.length}</p></div>
      <div className="flex items-center gap-3"><Badge tone={sec<60? "warning":"brand"}>الوقت {timeLabel}</Badge><Badge>{exam.durationMin} د</Badge></div>
    </div>

    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]">
      <Card className="p-6">
        {!q? <div>لا يوجد سؤال</div> : <div className="grid gap-4">
          <div className="flex gap-2"><Badge tone="accent">{q.category}</Badge><Badge>{q.difficulty}</Badge><Badge>{q.points} درجات</Badge></div>
          <h2 className="text-lg font-black leading-8">{q.prompt}</h2>

          {q.kind==="mcq" && <div className="grid gap-2">
            {q.options!.map((op,i)=> <label key={i} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 ${answers[q.id]===i? "border-[var(--brand-700)] bg-[var(--brand-50)]":"border-[var(--line)]"}`}>
              <input type="radio" name={q.id} checked={answers[q.id]===i} onChange={()=>setAnswers(a=>({...a,[q.id]:i}))} /> <span className="text-sm font-bold">{op}</span>
            </label>)}
          </div>}

          {q.kind==="true_false" && <div className="flex gap-3">
            {[true,false].map(v=> <label key={String(v)} className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border p-4 font-bold ${answers[q.id]===v? "bg-[var(--brand-50)] border-[var(--brand-700)]":"border-[var(--line)]"}`}>
              <input type="radio" name={q.id} checked={answers[q.id]===v} onChange={()=>setAnswers(a=>({...a,[q.id]:v}))} /> {v? "صح":"خطأ"}
            </label>)}
          </div>}

          {q.kind==="multi_select" && <div className="grid gap-2">
            {q.options!.map((op,i)=>{
              const arr: number[] = answers[q.id]||[];
              const checked = arr.includes(i);
              return <label key={i} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 ${checked? "bg-[var(--brand-50)] border-[var(--brand-700)]":"border-[var(--line)]"}`}>
                <input type="checkbox" checked={checked} onChange={e=>{
                  setAnswers(a=>{
                    const cur: number[] = a[q.id]||[];
                    const next = e.target.checked? [...cur,i] : cur.filter(x=>x!==i);
                    return {...a,[q.id]:next};
                  });
                }} /> <span className="text-sm font-bold">{op}</span>
              </label>;
            })}
          </div>}

          {(q.kind==="short" || q.kind==="essay") && <textarea value={answers[q.id]||""} onChange={e=>setAnswers(a=>({...a,[q.id]:e.target.value}))} placeholder={q.kind==="essay"? "اكتب إجابتك (80-120 كلمة)":"أجب باختصار"} className="min-h-32 w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 text-sm" />}

          <div className="flex justify-between pt-2">
            <button disabled={idx===0} onClick={()=>setIdx(i=>i-1)} className="btn-ghost disabled:opacity-40">السابق</button>
            {idx<exam.questions.length-1? <button onClick={()=>setIdx(i=>i+1)} className="btn-primary">التالي</button> :
            <button onClick={()=>{ if(confirm("هل تريد تسليم الاختبار نهائيًا؟")) submit(); }} className="btn-primary">تسليم الاختبار</button>}
          </div>
        </div>}
      </Card>

      <div className="grid gap-4 content-start">
        <Card className="p-4">
          <h3 className="font-black">التنقل</h3>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {exam.questions.map((_,i)=> <button key={i} onClick={()=>setIdx(i)} className={`grid h-9 place-items-center rounded-xl border text-sm font-black ${i===idx? "bg-[var(--brand-900)] text-white": answers[exam.questions[i].id]!=null? "bg-emerald-50 border-emerald-200 text-emerald-800":"bg-[var(--surface)]"}`}>{i+1}</button>)}
          </div>
          <div className="mt-3 text-xs text-[var(--text-3)]">المظلل أخضر = تمت الإجابة</div>
        </Card>
        <Card className="p-4 text-sm leading-6 text-[var(--text-3)]">
          لا تعتمد على مؤقت الواجهة وحده في الاختبارات الحساسة — عند ربط خلفية حقيقية يُحتسب الوقت والصلاحيات من الخادم.
        </Card>
      </div>
    </div>
  </div>;
}
