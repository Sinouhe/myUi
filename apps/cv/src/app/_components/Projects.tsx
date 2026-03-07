import type { Project } from './content';
import { projects } from './content';
import { Section } from './Section';
import { SectionHeading } from './SectionHeading';

type ProjectCardProps = {
  project: Project;
};

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="flex flex-col rounded-md border border-zinc-200 p-6">
      <h3 className="mb-2 text-sm font-semibold text-zinc-900">{project.title}</h3>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-zinc-600">{project.description}</p>
      <ul className="flex flex-wrap gap-2" role="list">
        {project.tech.map((tag) => (
          <li
            key={tag}
            className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600"
          >
            {tag}
          </li>
        ))}
      </ul>
      {project.href !== undefined && (
        <a
          href={project.href}
          aria-label={`View ${project.title} (opens in new tab)`}
          className="mt-4 text-xs font-medium text-zinc-500 underline underline-offset-2 hover:text-zinc-900 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          target="_blank"
          rel="noopener noreferrer"
        >
          View project <span aria-hidden="true">↗</span>
        </a>
      )}
    </article>
  );
}

export function Projects() {
  return (
    <Section id="projects">
      <SectionHeading id="projects-heading">Selected Projects</SectionHeading>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </Section>
  );
}
