import type { SkillGroupData } from './content';
import { skillGroups } from './content';
import { Section } from './Section';
import { SectionHeading } from './SectionHeading';

type SkillGroupProps = {
  group: SkillGroupData;
};

function SkillGroup({ group }: SkillGroupProps) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-600">
        {group.label}
      </h3>
      <ul className="space-y-1.5" role="list">
        {group.items.map((item) => (
          <li key={item} className="text-sm text-zinc-700">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Skills() {
  return (
    <Section id="skills">
      <SectionHeading id="skills-heading">Core Skills</SectionHeading>
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
        {skillGroups.map((group) => (
          <SkillGroup key={group.label} group={group} />
        ))}
      </div>
    </Section>
  );
}
