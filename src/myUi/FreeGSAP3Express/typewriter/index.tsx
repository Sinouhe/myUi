import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import './style.scss';
import { useEffect } from 'react';

gsap.registerPlugin(TextPlugin);

const TypeWriter = () => {
  useEffect(() => {
    gsap.to('p', {
      text: 'typewriter effect with GSAP 3',
      ease: 'power1.in',
      duration: 2,
      repeat: 10,
      yoyo: true,
      repeatDelay: 0.4,
    });
  });
  return (
    <div className="wrapper">
      <p />
    </div>
  );
};

export default TypeWriter;
