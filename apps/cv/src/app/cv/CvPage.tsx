'use client';

import { CvProvider, useCv } from '@/providers/CvProvider';
import { Hero } from '@/components/Hero';
import { KeyAchievements } from '@/components/KeyAchievements';
import { Skills } from '@/components/Skills';
import { Experience } from '@/components/Experience';
import { Projects } from '@/components/Projects';
import { Education } from '@/components/Education';
import { Languages } from '@/components/Languages';
import { Contact } from '@/components/Contact';

const containerClass = 'mx-auto max-w-5xl px-6 sm:px-8';

function SkipLink() {
  const { labels } = useCv();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
    >
      {labels.skipToMain}
    </a>
  );
}

function CvLayout() {
  return (
    <>
      <SkipLink />
      <header className={containerClass}>
        <Hero />
      </header>
      <main id="main-content" className={containerClass}>
        <KeyAchievements />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Languages />
        <Contact />
      </main>
    </>
  );
}

export function CvPage() {
  return (
    <CvProvider>
      <CvLayout />
    </CvProvider>
  );
}
