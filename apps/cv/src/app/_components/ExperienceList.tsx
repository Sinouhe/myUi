import type { ExperienceEntry } from './content';
import { experiences } from './content';
import { Section } from './Section';
import { SectionHeading } from './SectionHeading';

type ExperienceItemProps = {
  entry: ExperienceEntry;
};

function ExperienceItem({ entry }: ExperienceItemProps) {
  return (
    <article>
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-zinc-900">{entry.company}</h3>
          <p className="text-sm text-zinc-500">{entry.role}</p>
        </div>
        <span className="shrink-0 text-sm tabular-nums text-zinc-500">
          <time dateTime={entry.period.start}>{entry.period.start}</time>
          {' — '}
          {entry.period.end === 'Present' ? (
            'Present'
          ) : (
            <time dateTime={entry.period.end}>{entry.period.end}</time>
          )}
        </span>
      </div>
      <p className="mb-4 mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600">
        {entry.description}
      </p>
      <ul className="flex flex-wrap gap-2" role="list">
        {entry.tech.map((tag) => (
          <li
            key={tag}
            className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600"
          >
            {tag}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function ExperienceList() {
  return (
    <Section id="experience">
      <SectionHeading id="experience-heading">Experience</SectionHeading>
      <ul className="divide-y divide-zinc-100" role="list">
        {experiences.map((entry) => (
          <li key={`${entry.company}-${entry.period.start}`} className="py-8 first:pt-0">
            <ExperienceItem entry={entry} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
