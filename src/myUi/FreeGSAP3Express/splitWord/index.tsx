import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import './style.scss';
import { useEffect } from 'react';

gsap.registerPlugin(SplitText);

let split;
let animation = gsap.timeline({ repeat: 10, yoyo: true, repeatDelay: 0.3 });

const SplitWordComponent = () => {
  useEffect(() => {
    split = new SplitText('h1', { type: 'words' });
    gsap.set('.wrapper', { autoAlpha: 1 });
    animation.from(split.words, {
      opacity: 0,
      rotation: -40,
      scale: 0.4,
      stagger: 0.1,
      ease: 'back',
    });
  });
  return (
    <div className="wrapper">
      <h1>word by word animation with GSAP</h1>
    </div>
  );
};

export default SplitWordComponent;
