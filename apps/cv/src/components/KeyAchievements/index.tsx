'use client';

import { useCv } from '@/providers/CvProvider';
import { Section } from '@/components/Section';
import { SectionHeading } from '@/components/SectionHeading';
import styles from './style.module.scss';

export function KeyAchievements() {
  const { cv, labels } = useCv();

  return (
    <Section id="key-achievements">
      <SectionHeading id="key-achievements-heading">
        {labels.sections.keyAchievements}
      </SectionHeading>
      <ul className={styles['myui-cv-key-achievements']}>
        {cv.keyAchievements.map((achievement, i) => (
          <li key={i} className={styles.item}>
            {achievement}
          </li>
        ))}
      </ul>
    </Section>
  );
}
