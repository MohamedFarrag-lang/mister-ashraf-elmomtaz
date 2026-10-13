"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { ExamAttempt, NotificationItem } from "./types";
import { mockNotifications } from "./mocks";

type Store = {
  attempts: ExamAttempt[];
  addAttempt: (a: ExamAttempt) => void;
  notifications: NotificationItem[];
  markRead: (id: string) => void;
  markAllRead: () => void;
};
const Ctx = createContext<Store | null>(null);
const LS_ATT = "elmomtaz.attempts";
const LS_NOTIF = "elmomtaz.notifications";

export function AppStoreProvider({ children }: { children: React.ReactNode }){
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  useEffect(()=>{
    try{
      const a = localStorage.getItem(LS_ATT);
      const n = localStorage.getItem(LS_NOTIF);
      if(a) setAttempts(JSON.parse(a));
      if(n) setNotifications(JSON.parse(n));
    }catch{}
  },[]);
  useEffect(()=>{ localStorage.setItem(LS_ATT, JSON.stringify(attempts)); },[attempts]);
  useEffect(()=>{ localStorage.setItem(LS_NOTIF, JSON.stringify(notifications)); },[notifications]);

  return <Ctx.Provider value={{
    attempts,
    addAttempt: (a)=> setAttempts(prev=>[a, ...prev]),
    notifications,
    markRead: (id)=> setNotifications(prev=> prev.map(p=> p.id===id? {...p, read:true}:p)),
    markAllRead: ()=> setNotifications(prev=> prev.map(p=> ({...p, read:true}))),
  }}>{children}</Ctx.Provider>;
}
export function useStore(){
  const c = useContext(Ctx);
  if(!c) throw new Error("useStore outside provider");
  return c;
}
