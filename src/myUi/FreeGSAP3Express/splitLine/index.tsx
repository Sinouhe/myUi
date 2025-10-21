import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import './style.scss';
import { useEffect } from 'react';

let split;
let animation = gsap.timeline({ id: 'animation', repeat: 10, repeatDelay: 1 });

const SplitLineComponent = () => {
  useEffect(() => {
    split = new SplitText('p', { type: 'lines' });
    gsap.set('.wrapper', { autoAlpha: 1 });
    animation.from(split.lines, {
      opacity: 0,
      rotationX: -90,
      rotationY: -80,
      stagger: 0.1,
      transformOrigin: '50% 50% -200',
    });
  });
  return (
    <div className="wrapper">
      <p>
        The Only Way To Do Great Work Is To Love What You Do. If You Haven’t Found It Yet, Keep
        Looking. Don’t Settle.
      </p>
    </div>
  );
};

export default SplitLineComponent;
