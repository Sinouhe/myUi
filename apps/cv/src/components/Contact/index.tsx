'use client';

import { useCv } from '@/providers/CvProvider';
import { Section } from '@/components/Section';
import { SectionHeading } from '@/components/SectionHeading';
import styles from './style.module.scss';

type ContactEntry = {
  label: string;
  href: string;
  display: string;
};

export function Contact() {
  const { cv, labels } = useCv();
  const { contacts } = cv.basics;

  const entries: ContactEntry[] = [
    contacts.email !== null && {
      label: 'Email',
      href: `mailto:${contacts.email}`,
      display: contacts.email,
    },
    contacts.linkedin !== null && {
      label: 'LinkedIn',
      href: contacts.linkedin,
      display: contacts.linkedin.replace('https://', '').replace('www.', ''),
    },
    contacts.github !== null && {
      label: 'GitHub',
      href: contacts.github,
      display: contacts.github.replace('https://', '').replace('www.', ''),
    },
    contacts.portfolio !== null && {
      label: 'Portfolio',
      href: contacts.portfolio,
      display: contacts.portfolio.replace('https://', '').replace('www.', ''),
    },
  ].filter((e): e is ContactEntry => e !== false);

  return (
    <Section id="contact">
      <SectionHeading id="contact-heading">{labels.sections.contact}</SectionHeading>
      <dl className={styles['myui-cv-contact']}>
        {entries.map((entry) => (
          <div key={entry.label} className={styles.row}>
            <dt className={styles.label}>{entry.label}</dt>
            <dd>
              <a
                href={entry.href}
                className={styles.link}
                target={entry.href.startsWith('mailto:') ? undefined : '_blank'}
                rel={entry.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              >
                {entry.display}
                {!entry.href.startsWith('mailto:') && (
                  <span className="sr-only"> {labels.openInNewTab}</span>
                )}
              </a>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
