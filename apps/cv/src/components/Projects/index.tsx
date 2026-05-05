'use client';

import { useCv } from '@/providers/CvProvider';
import { Section } from '@/components/Section';
import { SectionHeading } from '@/components/SectionHeading';
import styles from './style.module.scss';

export function Projects() {
  const { cv, labels } = useCv();

  return (
    <Section id="projects">
      <SectionHeading id="projects-heading">{labels.sections.projects}</SectionHeading>
      <div className={styles['myui-cv-projects']}>
        {cv.projects.map((project) => {
          const sourceLink = project.links?.find((l) => l.type === 'source');
          return (
            <article key={project.name} className={styles.card}>
              <h3 className={styles['project-name']}>{project.name}</h3>
              <p className={styles['project-role']}>{project.role}</p>
              <p className={styles.summary}>{project.summary}</p>
              <ul className={styles.highlights}>
                {project.highlights.map((h, i) => (
                  <li key={i} className={styles.highlight}>
                    {h}
                  </li>
                ))}
              </ul>
              <ul className={styles['tech-list']} aria-label="Technologies">
                {project.tech.map((tag) => (
                  <li key={tag} className={styles.tag}>
                    {tag}
                  </li>
                ))}
              </ul>
              {sourceLink !== undefined && (
                <a
                  href={sourceLink.url}
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${labels.viewProject}: ${project.name} ${labels.openInNewTab}`}
                >
                  {labels.viewProject} <span aria-hidden="true">↗</span>
                </a>
              )}
            </article>
          );
        })}
      </div>
    </Section>
  );
}
