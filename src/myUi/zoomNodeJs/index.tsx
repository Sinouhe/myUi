// Components
import { useEffect, useRef } from 'react';
import SvgClose from './components/svgO';

// Style
import './style.scss';

const BASE_CLASSNAME = 'mui-zoom-node-js';

export function ZoomNodeJs() {
  const stickyRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const { height } = containerRef.current.getBoundingClientRect();
    const onScroll = () => {
      if (!stickyRef.current) return;

      const { scrollY } = window;
      const percent = scrollY / (height - window.innerHeight);

      const scale = Math.max(1, percent * 230);
      // const top = `${40 + 10 * percent}%`;
      //const left = `${10 + 40 * percent}%`;
      //const translate = `${50 * percent}`;
      //stickyRef.current.style.top = top;
      //stickyRef.current.style.left = left;
      //stickyRef.current.style.transform = `translate(-${translate}%, -${translate}%) scale(${scale})`;
      //stickyRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;

      // stickyRef.current.style.transform = `scale(${scale})`;
      console.log(`translateZ(0) scale(${scale})`);
      stickyRef.current.style.transform = `translateZ(0) scale(${scale})`;
    };

    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  });

  return (
    <div className={BASE_CLASSNAME} ref={containerRef}>
      <div className={`${BASE_CLASSNAME}__sticky`}>
        <div className={`${BASE_CLASSNAME}__container`} ref={stickyRef}>
          <div className={`${BASE_CLASSNAME}__background--top`} />
          <div className={`${BASE_CLASSNAME}__text`}>
            <div className={`${BASE_CLASSNAME}__text--left`}>N</div>
            <SvgClose />
            <div className={`${BASE_CLASSNAME}__text--right`}>DE JS</div>
          </div>
          <div className={`${BASE_CLASSNAME}__background--bottom`} />
        </div>
        <video
          src={'/video_demo.mp4'}
          autoPlay
          muted
          loop
          playsInline
          className={`${BASE_CLASSNAME}__video`}
        />
      </div>
    </div>
  );
}

export default ZoomNodeJs;
