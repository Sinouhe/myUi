import type { ReactNode } from 'react';

type SectionProps = {
  id: string;
  children: ReactNode;
};

export function Section({ id, children }: SectionProps) {
  // aria-labelledby links this section to its SectionHeading, making it a
  // named region landmark that screen reader users can navigate to directly.
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="border-t border-zinc-100 py-16 sm:py-20"
    >
      {children}
    </section>
  );
}
