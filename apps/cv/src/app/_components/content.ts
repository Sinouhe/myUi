// All CV content is defined here as typed constants.
// To migrate to a JSON/CMS source: move the constants to data/cv-data.json,
// keep the types in data/cv-data.types.ts, and import from there.

// A period with a start year and an end year (or "Present").
// Using a structured type rather than a plain string enables semantic <time> rendering
// and makes the data easy to validate or consume programmatically.
export type Period = {
  start: string; // four-digit year, e.g. "2021"
  end: string;   // four-digit year or "Present"
};

export type ExperienceEntry = {
  company: string;
  role: string;
  period: Period;
  description: string;
  tech: string[];
};

export type Project = {
  title: string;
  description: string;
  tech: string[];
  href?: string;
};

export type EducationEntry = {
  institution: string;
  degree: string;
  period: Period;
};

export type SkillGroupData = {
  label: string;
  items: string[];
};

export type ContactLink = {
  label: string;
  href: string;
  display: string;
};

export const clients: string[] = [
  'Air Liquide',
  'Société Générale',
  'Intermarché',
  'Mazarine',
  'Chanel',
];

export const skillGroups: SkillGroupData[] = [
  {
    label: 'Frontend',
    items: ['React', 'Next.js', 'TypeScript', 'SCSS', 'Tailwind CSS', 'Storybook'],
  },
  {
    label: 'Backend',
    items: ['Node.js', 'Express', 'PostgreSQL', 'REST APIs', 'GraphQL'],
  },
  {
    label: 'Testing',
    items: ['Jest', 'Vitest', 'Cypress', 'Testing Library', 'Playwright'],
  },
  {
    label: 'Tooling',
    items: ['Git', 'pnpm', 'Vite', 'Webpack', 'Docker', 'CI/CD'],
  },
  {
    label: 'Architecture',
    items: ['Monorepo', 'Design Systems', 'SSR / SSG', 'Micro-frontends'],
  },
];

export const experiences: ExperienceEntry[] = [
  {
    company: 'Société Générale',
    role: 'Senior Front-End Developer',
    period: { start: '2021', end: 'Present' },
    description:
      'Led the front-end architecture of a customer-facing banking portal serving 2M+ users. Built and maintained a shared design system consumed by five product teams across two business units.',
    tech: ['React', 'TypeScript', 'SCSS', 'Jest', 'Storybook', 'Webpack'],
  },
  {
    company: 'Intermarché',
    role: 'Full-Stack Developer',
    period: { start: '2018', end: '2021' },
    description:
      'Developed e-commerce features and back-office tools for the Intermarché digital platform. Introduced end-to-end testing practices and reduced regression rates by 60% over two release cycles.',
    tech: ['Next.js', 'Node.js', 'PostgreSQL', 'Cypress', 'GraphQL'],
  },
  {
    company: 'Mazarine',
    role: 'Front-End Developer',
    period: { start: '2015', end: '2018' },
    description:
      'Delivered interactive web experiences for luxury brand clients including premium campaign microsites and editorial platforms for international audiences.',
    tech: ['React', 'SCSS', 'GSAP', 'Webpack', 'Storybook'],
  },
  {
    company: 'Air Liquide',
    role: 'Junior Developer',
    period: { start: '2013', end: '2015' },
    description:
      'Built internal web tools for the digital transformation programme. Contributed to the migration of legacy intranet applications to modern React-based interfaces.',
    tech: ['JavaScript', 'jQuery', 'CSS', 'Java', 'REST APIs'],
  },
];

export const projects: Project[] = [
  {
    title: 'MyUI — Component Library',
    description:
      'A reusable React component library built with GSAP animations and SCSS. Distributed as an internal workspace package and consumed across multiple product applications.',
    tech: ['React', 'TypeScript', 'SCSS', 'Storybook', 'Vite'],
  },
  {
    title: 'Portal — Customer Dashboard',
    description:
      'Next.js application providing self-service capabilities for enterprise customers. Server-side rendered, fully accessible, and internationalised for six markets.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Playwright'],
  },
  {
    title: 'Folio — Experimental 3D Frontend',
    description:
      'A creative frontend experiment exploring WebGL and Three.js for immersive brand storytelling, built for a luxury client campaign and deployed as a standalone microsite.',
    tech: ['Three.js', 'GSAP', 'SCSS', 'Vite'],
  },
];

export const education: EducationEntry[] = [
  {
    institution: 'École Centrale Paris',
    degree: 'Master of Engineering — Computer Science & Distributed Systems',
    period: { start: '2010', end: '2013' },
  },
  {
    institution: 'IUT Paris Rives de Seine',
    degree: 'DUT Informatique — Software Development',
    period: { start: '2008', end: '2010' },
  },
];

export const contactLinks: ContactLink[] = [
  {
    label: 'Email',
    href: 'mailto:john.doe@example.com',
    display: 'john.doe@example.com',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/johndoe',
    display: 'linkedin.com/in/johndoe',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/johndoe',
    display: 'github.com/johndoe',
  },
];
