import React from 'react';
import './style.scss';

const LightingButton = (test: { config?: { lang: string } }): React.JSX.Element => {
  const { config: { lang } = {} } = test;

  console.log({ lang });
  return (
    <button className="lightingBtn" type="button">
      {'HELLO WORLD'}
    </button>
  );
};

export default LightingButton;
