import { education } from './content';
import { Section } from './Section';
import { SectionHeading } from './SectionHeading';

export function Education() {
  return (
    <Section id="education">
      <SectionHeading id="education-heading">Education</SectionHeading>
      <ul className="space-y-6" role="list">
        {education.map((entry) => (
          <li
            key={`${entry.institution}-${entry.period.start}`}
            className="flex flex-wrap items-baseline justify-between gap-4"
          >
            <div>
              <h3 className="text-sm font-semibold text-zinc-900">{entry.institution}</h3>
              <p className="text-sm text-zinc-500">{entry.degree}</p>
            </div>
            <span className="shrink-0 text-sm tabular-nums text-zinc-500">
              <time dateTime={entry.period.start}>{entry.period.start}</time>
              {' — '}
              <time dateTime={entry.period.end}>{entry.period.end}</time>
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
