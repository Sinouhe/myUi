'use client';

import { useCv } from '@/providers/CvProvider';
import { Section } from '@/components/Section';
import { SectionHeading } from '@/components/SectionHeading';
import styles from './style.module.scss';

export function Education() {
  const { cv, labels } = useCv();

  return (
    <Section id="education">
      <SectionHeading id="education-heading">{labels.sections.education}</SectionHeading>
      <ul className={styles['myui-cv-education']}>
        {cv.education.map((entry) => (
          <li key={`${entry.institution}-${entry.endDate}`} className={styles.entry}>
            <div>
              <h3 className={styles.institution}>{entry.institution}</h3>
              <p className={styles.degree}>{entry.degree}</p>
              <p className={styles.field}>{entry.field}</p>
              {entry.note !== undefined && <p className={styles.note}>{entry.note}</p>}
            </div>
            <time className={styles.year} dateTime={entry.endDate}>
              {entry.endDate}
            </time>
          </li>
        ))}
      </ul>
    </Section>
  );
}
