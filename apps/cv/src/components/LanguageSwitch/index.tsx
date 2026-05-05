'use client';

import { useCv } from '@/providers/CvProvider';
import type { Lang } from '@/types/cv';
import styles from './style.module.scss';

const LANGS: Lang[] = ['en', 'fr'];

export function LanguageSwitch() {
  const { lang, setLang, labels } = useCv();

  return (
    <nav aria-label={labels.langSwitch} className={styles['myui-cv-language-switch']}>
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={lang === l}
          onClick={() => setLang(l)}
          className={styles.button}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </nav>
  );
}
