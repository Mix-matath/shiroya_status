// app/LanguageContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { dictionary, Language } from "@/lib/dictionary";

type LanguageContextType = {
  lang: Language;
  toggleLanguage: () => void;
  t: typeof dictionary.th; // Type ของคำแปล
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("th");

  // (Optional) จำภาษาล่าสุดไว้ใน LocalStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("app-lang") as Language;
    if (savedLang) setLang(savedLang);
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === "th" ? "en" : "th";
    setLang(newLang);
    localStorage.setItem("app-lang", newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t: dictionary[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}