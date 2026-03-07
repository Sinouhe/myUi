export function Hero() {
  return (
    <div className="py-20 sm:py-28">
      <p className="mb-4 text-sm font-medium text-zinc-500">Paris, France</p>
      <hgroup className="mb-5">
        <h1 className="mb-1 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          John Doe
        </h1>
        <p className="text-xl font-medium text-zinc-500">Full-Stack Developer</p>
      </hgroup>
      <p className="mb-8 max-w-xl text-base leading-relaxed text-zinc-600">
        10+ years building scalable web applications and design systems for large enterprises.
        Focused on performance, maintainability, and long-term developer experience.
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href="#contact"
          className="inline-flex items-center rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          Contact me
        </a>
        <a
          href="/cv.pdf"
          className="inline-flex items-center rounded-md border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          Download CV <span className="ml-1 text-zinc-500">(PDF)</span>
        </a>
      </div>
    </div>
  );
}
