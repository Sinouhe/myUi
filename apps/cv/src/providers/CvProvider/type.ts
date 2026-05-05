import type { ReactNode } from 'react';
import type { CvData, Lang } from '@/types/cv';
import type { UiLabels } from '@/i18n/labels';

export type CvContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  cv: CvData;
  labels: UiLabels;
};

export type CvProviderProps = {
  children: ReactNode;
};
