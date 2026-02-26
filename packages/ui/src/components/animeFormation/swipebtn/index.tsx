import React from 'react';
import './style.scss';

// types
import type { SwipeBtnType } from './type';

const SwipeBtn = ({ text, onClickCallback }: SwipeBtnType): React.JSX.Element => {
  return (
    <button className="swipe_btn" onClick={onClickCallback} type="button">
      {text}
    </button>
  );
};

export default SwipeBtn;
