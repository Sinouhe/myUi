import { useEffect } from 'react';

const useScript = ({
  tag = 'script',
  src,
  elt,
  exec = true,
}: {
  tag?: 'script' | 'link';
  src: string;
  elt?: HTMLElement;
  exec?: boolean;
  defer?: boolean;
}): void => {
  useEffect(() => {
    let script: HTMLScriptElement | HTMLLinkElement | undefined;

    if (tag === 'script') {
      script = document.createElement('script');
      script.src = src;
      script.async = true;
    }

    if (tag === 'link') {
      script = document.createElement('link');
      script.href = src;
      script.type = 'text/css';
      script.rel = 'stylesheet';
    }

    if (exec && script) {
      (elt || document.head).appendChild(script);
    }

    return (): void => {
      if (exec && script) (elt || document.head).removeChild(script);
    };
  }, [src, elt, exec, tag]);
};

export default useScript;
