import React from 'react';
import './style.scss';

const ContinueScrolling = (): React.JSX.Element => {
  return (
    <div className="continue_scrolling" role="button">
      <div className="continue_scrolling__text">{'EXPLORE.'}</div>
      <svg
        className="continue_scrolling__arrow"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5v14" />
        <path d="M19 12l-7 7-7-7" />
      </svg>
    </div>
  );
};

export default ContinueScrolling;
