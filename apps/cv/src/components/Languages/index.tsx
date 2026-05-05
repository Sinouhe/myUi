'use client';

import { useCv } from '@/providers/CvProvider';
import { Section } from '@/components/Section';
import { SectionHeading } from '@/components/SectionHeading';
import styles from './style.module.scss';

export function Languages() {
  const { cv, labels } = useCv();

  return (
    <Section id="languages">
      <SectionHeading id="languages-heading">{labels.sections.languages}</SectionHeading>
      <ul className={styles['myui-cv-languages']}>
        {cv.languages.map((lang) => (
          <li key={lang.name} className={styles.item}>
            <p className={styles.name}>{lang.name}</p>
            <p className={styles.level}>{lang.level}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
