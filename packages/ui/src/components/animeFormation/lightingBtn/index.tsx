import React from 'react';
import './style.scss';

const LightingButton = (_test: { config?: { lang: string } }): React.JSX.Element => {
  return (
    <button className="lightingBtn" type="button">
      {'HELLO WORLD'}
    </button>
  );
};

export default LightingButton;
