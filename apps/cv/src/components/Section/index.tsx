'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import type { SectionProps } from './type';

// useLayoutEffect fires synchronously before first paint on the client,
// preventing a flash where the element is visible then abruptly hidden.
// On the server (SSR), window is undefined so we fall back to useEffect
// which never runs server-side — the element renders visible by default.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function Section({ id, children }: SectionProps) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Mark as pending — CSS transitions the element in when data-reveal="in"
    el.dataset['reveal'] = '';

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.dataset['reveal'] = 'in';
            observer.unobserve(el);
          }
        }
      },
      { threshold: 0.04, rootMargin: '0px 0px -40px 0px' },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={`${id}-heading`}
      className="border-t border-zinc-200 py-16 sm:py-20"
    >
      {children}
    </section>
  );
}
