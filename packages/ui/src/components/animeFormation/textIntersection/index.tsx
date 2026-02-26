import React, { useEffect, useRef } from 'react';
import './style.scss';

const TextIntersection = (): React.JSX.Element => {
  const circle1 = useRef<HTMLDivElement>(null),
    circle2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = (): void => {
      const scrollValue = window.scrollY;
      if (circle1.current)
        circle1.current.style.clipPath = `circle(${150 + scrollValue * 0.75}px at 0 0)`;
      if (circle2.current)
        circle2.current.style.clipPath = `circle(${150 + scrollValue * 0.75}px at 100% 100%)`;
    };

    window.addEventListener('scroll', onScroll);
    return (): void => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="storieHeight">
      <section>
        <h2>scroll</h2>
        <div className="circle1" ref={circle1}>
          <h2>scroll</h2>
        </div>
        <div className="circle2" ref={circle2}>
          <h2>scroll</h2>
        </div>
      </section>
    </div>
  );
};

export default TextIntersection;
