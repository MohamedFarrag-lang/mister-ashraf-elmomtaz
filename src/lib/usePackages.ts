"use client";
import { useEffect, useState } from "react";
import type { WeeklyPackage } from "./types";
import { mockWeeklyPackages } from "./mocks";
import { loadPackages, savePackages } from "./commerce";

export function usePackages() {
  const [packages, setPackages] = useState<WeeklyPackage[]>(mockWeeklyPackages);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = loadPackages();
    if (stored.length > 0) setPackages(stored);
    else savePackages(mockWeeklyPackages);
    setLoaded(true);
  }, []);

  function persist(next: WeeklyPackage[]) {
    setPackages(next);
    savePackages(next);
  }

  function upsert(pkg: WeeklyPackage) {
    const next = [pkg, ...packages.filter(p => p.id !== pkg.id)];
    persist(next);
  }

  function remove(id: string) {
    persist(packages.filter(p => p.id !== id));
  }

  return { packages, loaded, upsert, remove, setPackages: persist };
}

export function allPackagesMerged(): WeeklyPackage[] {
  if (typeof window === "undefined") return mockWeeklyPackages;
  const stored = loadPackages();
  return stored.length > 0 ? stored : mockWeeklyPackages;
}
