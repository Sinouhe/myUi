import { useId } from 'react';

const SvgClose = () => {
  const maskId = useId();

  return (
    <svg viewBox="0 0 100 100" width="80" height="80" aria-hidden="true">
      <defs>
        {/* Mask: white = visible, black = transparent */}
        <mask id={maskId}>
          <rect width="100" height="100" fill="#fff" />
          {/* Punch the center hole => transparent */}
          <circle cx="50" cy="50" r="22" fill="#000" />
        </mask>
      </defs>

      {/* White background everywhere EXCEPT the center hole */}
      <rect width="100" height="100" fill="#fff" mask={`url(#${maskId})`} />

      {/* Black ring (outer circle - inner hole) */}
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="
          M 50 5
          A 45 45 0 1 0 50 95
          A 45 45 0 1 0 50 5
          Z

          M 50 28
          A 22 22 0 1 0 50 72
          A 22 22 0 1 0 50 28
          Z
        "
      />
    </svg>
  );
};

export default SvgClose;
