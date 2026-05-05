'use client';

import { useCv } from '@/providers/CvProvider';
import type { Lang } from '@/types/cv';
import { Section } from '@/components/Section';
import { SectionHeading } from '@/components/SectionHeading';
import type { RoleItemProps } from './type';
import styles from './style.module.scss';

function formatDate(date: string | null, lang: Lang, present: string): string {
  if (date === null) return present;
  if (date.length === 4) return date;
  const [yearStr, monthStr] = date.split('-');
  const d = new Date(parseInt(yearStr, 10), parseInt(monthStr, 10) - 1);
  return d.toLocaleDateString(lang === 'en' ? 'en-US' : 'fr-FR', {
    month: 'short',
    year: 'numeric',
  });
}

function RoleItem({ role, startFormatted, endFormatted }: RoleItemProps) {
  return (
    <article className={styles.role}>
      <div className={styles['role-header']}>
        <div>
          <h4 className={styles['role-title']}>{role.title}</h4>
          {role.client !== undefined && <p className={styles['role-meta']}>{role.client}</p>}
        </div>
        <time className={styles['role-period']} dateTime={role.startDate}>
          {startFormatted} – {endFormatted}
        </time>
      </div>
      <p className={styles.summary}>{role.summary}</p>
      <ul className={styles.highlights}>
        {role.highlights.map((h, i) => (
          <li key={i} className={styles.highlight}>
            {h}
          </li>
        ))}
      </ul>
      <ul className={styles['tech-list']} aria-label="Technologies">
        {role.tech.map((tag) => (
          <li key={tag} className={styles.tag}>
            {tag}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function Experience() {
  const { cv, labels, lang } = useCv();

  return (
    <Section id="experience">
      <SectionHeading id="experience-heading">{labels.sections.experience}</SectionHeading>
      <ol className={styles['myui-cv-experience']}>
        {cv.experience.map((entry) => (
          <li
            key={`${entry.company}-${entry.roles[0]?.startDate ?? ''}`}
            className={styles.company}
          >
            <header className={styles['company-header']}>
              <h3 className={styles['company-name']}>{entry.company}</h3>
              <p className={styles['company-meta']}>
                {[entry.sector, entry.location].filter(Boolean).join(' · ')}
              </p>
            </header>
            <ol className={styles['role-list']}>
              {entry.roles.map((role) => (
                <li key={`${role.title}-${role.startDate}`}>
                  <RoleItem
                    role={role}
                    startFormatted={formatDate(role.startDate, lang, labels.present)}
                    endFormatted={formatDate(role.endDate, lang, labels.present)}
                  />
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>
    </Section>
  );
}
