'use client';

import { useCv } from '@/providers/CvProvider';
import { Section } from '@/components/Section';
import { SectionHeading } from '@/components/SectionHeading';
import styles from './style.module.scss';

export function Skills() {
  const { cv, labels } = useCv();

  return (
    <Section id="skills">
      <SectionHeading id="skills-heading">{labels.sections.skills}</SectionHeading>
      <div className={styles['myui-cv-skills']}>
        {cv.skills.map((group) => (
          <div key={group.category}>
            <h3 className={styles['group-label']}>{group.category}</h3>
            <ul className={styles['item-list']}>
              {group.items.map((item) => {
                const name = typeof item === 'string' ? item : item.name;
                return (
                  <li key={name} className={styles.tag}>
                    {name}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
