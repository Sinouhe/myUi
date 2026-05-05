'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import type { CvData, Lang } from '@/types/cv';
import { uiLabels } from '@/i18n/labels';
import cvEn from '@data/cv/cv.en.json';
import cvFr from '@data/cv/cv.fr.json';
import type { CvContextValue, CvProviderProps } from './type';

const cvData: Record<Lang, CvData> = {
  en: cvEn as CvData,
  fr: cvFr as CvData,
};

const CvContext = createContext<CvContextValue | null>(null);

export function CvProvider({ children }: CvProviderProps) {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <CvContext.Provider value={{ lang, setLang, cv: cvData[lang], labels: uiLabels[lang] }}>
      {children}
    </CvContext.Provider>
  );
}

export function useCv(): CvContextValue {
  const ctx = useContext(CvContext);
  if (ctx === null) throw new Error('useCv must be used within CvProvider');
  return ctx;
}
