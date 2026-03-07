import { About } from './_components/About';
import { Clients } from './_components/Clients';
import { Contact } from './_components/Contact';
import { Education } from './_components/Education';
import { ExperienceList } from './_components/ExperienceList';
import { Hero } from './_components/Hero';
import { Projects } from './_components/Projects';
import { Skills } from './_components/Skills';

const containerClass = 'mx-auto max-w-5xl px-6 sm:px-8';

export default function Home() {
  return (
    <>
      {/* Skip link — visually hidden until focused by keyboard users (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to main content
      </a>

      {/* banner landmark */}
      <header className={containerClass}>
        <Hero />
      </header>

      {/* main landmark */}
      <main id="main-content" className={containerClass}>
        <Clients />
        <About />
        <Skills />
        <ExperienceList />
        <Projects />
        <Education />
        <Contact />
      </main>
    </>
  );
}
