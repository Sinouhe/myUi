import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import './style.scss';
import { useEffect } from 'react';

gsap.registerPlugin(SplitText);

let split;
let animation = gsap.timeline({ repeat: 10, yoyo: true, repeatDelay: 0.3 });

const SplitTextComponent = () => {
  useEffect(() => {
    gsap.set('.wrapper', { autoAlpha: 1 });
    split = new SplitText('h1', { type: 'chars' });
    animation.from(split.chars, { opacity: 0, y: 50, ease: 'back(4)', stagger: 0.05 });
  });
  return (
    <div className="wrapper">
      <h1>Letter by letter animation with GSAP</h1>
    </div>
  );
};

export default SplitTextComponent;
