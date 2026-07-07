import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import en from "@/locales/en.json";
import uz from "@/locales/uz.json";
import enApp from "@/locales/_patches/app.en.json";
import uzApp from "@/locales/_patches/app.uz.json";
import enModules from "@/locales/_patches/modules.en.json";
import uzModules from "@/locales/_patches/modules.uz.json";
import enIR from "@/locales/_patches/interview-resume.en.json";
import uzIR from "@/locales/_patches/interview-resume.uz.json";
import enRT from "@/locales/_patches/results-test.en.json";
import uzRT from "@/locales/_patches/results-test.uz.json";

export type Lang = "en" | "uz";

function deepMerge(target: any, source: any): any {
  const out = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      out[key] = deepMerge(out[key] ?? {}, source[key]);
    } else {
      out[key] = source[key];
    }
  }
  return out;
}

const enMerged = [enApp, enModules, enIR, enRT].reduce((acc, p) => deepMerge(acc, p), en as any);
const uzMerged = [uzApp, uzModules, uzIR, uzRT].reduce((acc, p) => deepMerge(acc, p), uz as any);
const dictionaries: Record<Lang, any> = { en: enMerged, uz: uzMerged };

const STORAGE_KEY = "careerai_lang";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, fallback?: string) => string;
};

const I18nContext = createContext<Ctx | null>(null);

function resolve(dict: any, key: string): string | undefined {
  const parts = key.split(".");
  let cur: any = dict;
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in cur) cur = cur[p];
    else return undefined;
  }
  return typeof cur === "string" ? cur : undefined;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored === "en" || stored === "uz") setLangState(stored);
    } catch {}
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
    if (typeof document !== "undefined") document.documentElement.setAttribute("lang", l);
  }, []);

  const t = useCallback(
    (key: string, fallback?: string) => {
      return resolve(dictionaries[lang], key) ?? resolve(dictionaries.en, key) ?? fallback ?? key;
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Safe fallback for SSR/pre-mount
    return {
      lang: "en" as Lang,
      setLang: () => {},
      t: (k: string, f?: string) => resolve(dictionaries.en, k) ?? f ?? k,
    };
  }
  return ctx;
}
