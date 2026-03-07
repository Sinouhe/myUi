import type { ReactNode } from 'react';

type SectionHeadingProps = {
  id: string;
  children: ReactNode;
};

export function SectionHeading({ id, children }: SectionHeadingProps) {
  return (
    <h2 id={id} className="mb-10 text-xs font-semibold uppercase tracking-widest text-zinc-600">
      {children}
    </h2>
  );
}
