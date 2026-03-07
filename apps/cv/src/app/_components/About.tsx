import { Section } from './Section';
import { SectionHeading } from './SectionHeading';

export function About() {
  return (
    <Section id="about">
      <SectionHeading id="about-heading">About</SectionHeading>
      <div className="max-w-2xl space-y-4 text-base leading-relaxed text-zinc-600">
        <p>
          I am a full-stack developer with over 10 years of professional experience delivering web
          applications for large French corporations and international groups. My work spans
          front-end architecture, component libraries, and back-end API design.
        </p>
        <p>
          I have partnered with engineering and product teams at scale, helping them ship faster
          while maintaining code quality. I care deeply about clean interfaces, strong typing, and
          collaborative development practices that reduce long-term maintenance costs.
        </p>
        <p>
          Outside of client work, I contribute to open source and invest in internal tooling that
          improves team productivity across projects.
        </p>
      </div>
    </Section>
  );
}
