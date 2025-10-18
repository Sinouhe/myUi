import gsap from 'gsap';
import { useEffect, useState } from 'react';
import './style.scss';

const AnimatedMenu = () => {
  const [test, setTest] = useState(1);
  useEffect(() => {
    const items = document.querySelectorAll('.item');
    gsap.defaults({ duration: 0.3 });
    const testbis = test;

    items.forEach(function (item) {
      const tl = gsap
        .timeline({ paused: true })
        .to(item.querySelector('.text'), {
          color: 'white',
          x: 10,
          scale: 1.2,
          transformOrigin: 'left center',
        })
        .to(item.querySelector('.dot'), { backgroundColor: '#F93', scale: 1.5 }, 0);

      item.addEventListener('mouseenter', () => tl.play());
      item.addEventListener('mouseleave', () => tl.reverse());
    });

    /*  */
  });
  return (
    <>
      <div className="item home">
        <div className="dot" />
        <div className="text">home</div>
      </div>
      <div className="item">
        <div className="dot" />
        <div className="text">about</div>
      </div>
      <div className="item">
        <div className="dot" />
        <div className="text">portfolio</div>
      </div>
      <div className="item">
        <div className="dot" />
        <div className="text">contact us</div>
      </div>
    </>
  );
};

export default AnimatedMenu;
