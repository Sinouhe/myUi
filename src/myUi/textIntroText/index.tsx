import React, { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import classNames from 'classnames';
import './style.scss';

// Type
import { type TextIntroType } from './type';

// Components
import SwipeBtn from '../swipebtn';

const TextIntro = ({ setShowIntro }: TextIntroType): React.JSX.Element => {
  const [text, setText] = useState('JAVASCRIPT'),
    [animationEnd, setAnimationEnd] = useState(false),
    inanimateWords = useRef(false),
    gsapAnim = useCallback((): void => {
      const tl = gsap.timeline();
      tl.to('.text_intro__up', { top: '-60%', duration: 0.5, ease: 'expo.out' }, 0.75);
      tl.to('.text_intro__down', { top: '100%', duration: 0.5, ease: 'expo.out' }, 0.75);
      tl.eventCallback('onComplete', () => {
        if (setShowIntro) setShowIntro(false);
      });
    }, [setShowIntro]),
    finishAnimation = (): void => {
      inanimateWords.current = true;
      setAnimationEnd(true);
      setTimeout(gsapAnim, 1000);
    };

  useEffect(() => {
    let idx = 0,
      timeOut = 1000;
    const texts = [
        'EXPRESS',
        'TYPESCRIPT',
        'REACT',
        'NODE JS',
        'NEXT JS',
        'JEST',
        'ATOMIC DESIGN',
        'TRANSACT SQL',
        'ESLINT',
        'SASS',
        'SQL',
        'DOCKER',
        'PRETTIER',
        'CYPRESS',
        'EXPRESS',
        'TYPESCRIPT',
        'REACT',
        'NODE JS',
        'NEXT JS',
        'JEST',
        'FULLSTACK',
      ],
      update = (): void => {
        if (inanimateWords.current) return;
        if (timeOut > 200) timeOut = timeOut - 75;
        if (texts[idx]) {
          setText(texts[idx]);
          idx = idx + 1;
          setTimeout(update, timeOut);
        } else {
          setAnimationEnd(true);
          setTimeout(gsapAnim, 1000);
        }
      };
    setTimeout(update, 3600);
  }, [gsapAnim]);

  return (
    <div className="text_intro">
      <div className="text_intro__up">
        <div className="text_intro__up__close_btn">
          <SwipeBtn text={'skip intro'} onClickCallback={finishAnimation} />
        </div>
        <div
          className={classNames('text_intro__up__text', {
            text_intro__up__text__slice: animationEnd,
          })}
        >
          {text}
        </div>
      </div>
      <div className="text_intro__down">
        <div
          className={classNames('text_intro__down__text', {
            text_intro__down__text__slice: animationEnd,
          })}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

export default TextIntro;
