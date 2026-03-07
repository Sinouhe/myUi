import { clients } from './content';
import { Section } from './Section';
import { SectionHeading } from './SectionHeading';

export function Clients() {
  return (
    <Section id="clients">
      <SectionHeading id="clients-heading">Companies &amp; Clients</SectionHeading>
      <ul className="flex flex-wrap gap-6 sm:gap-10" role="list">
        {clients.map((client) => (
          <li key={client} className="text-base font-medium text-zinc-700">
            {client}
          </li>
        ))}
      </ul>
    </Section>
  );
}
