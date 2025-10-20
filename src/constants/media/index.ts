import type { DevicesType, ConnectionMapType } from './type';

const DEVICES: DevicesType = {
  DESKTOP: 'desktop',
  TABLET: 'tablet',
  MOBILE: 'mobile',
};

const WIDTH = {
  SMALL: 'small',
  LARGE: 'large',
};

const QUALITY = {
  LD: 'ld',
  MD: 'md',
  HD: 'hd',
  UHD: 'uhd',
};

export const MAX_RENDITION_WIDTH = 3840; // Maximal requested image width from Cloudinary (4K)
export const MAX_360_RENDITION_WIDTH = 10000; // React 360 maximum rendition width for Boutique Connect Gabrielle's appartement
export const MAX_DEVICE_PIXEL_RATIO = 3; // Maximal supported device pixel ratio
export const MAX_NETWORK_CONECTION_TYPE = '4g'; // Max network connection type
export const DEFAULT_NETWORK_CONNECTION_TYPE = MAX_NETWORK_CONECTION_TYPE; // Default network connection type, if not provided

export const NETWORK_CONNECTION_TYPES = {
  'slow-2g': 'slow-2g',
  '2g': '2g',
  '3g': '3g',
  '4g': '4g',
};

// Quality with respect to bandwidth
// [ratio, [images quality, videos quality]]
export const CONNECTIONS_MAP: ConnectionMapType = {
  'slow-2g': [8, [30, 30]],
  '2g': [4, [50, 50]],
  '3g': [2, [65, 65]],
  '4g': [1, ['auto', 90]],
};

const BREAKPOINTS = {
  MOBILE_SMALL: `${DEVICES.MOBILE}-${WIDTH.SMALL}`,
  MOBILE_LARGE: `${DEVICES.MOBILE}-${WIDTH.LARGE}`,
  TABLET_SMALL: `${DEVICES.TABLET}-${WIDTH.SMALL}`,
  TABLET_LARGE: `${DEVICES.TABLET}-${WIDTH.LARGE}`,
  DESKTOP_LD: `${DEVICES.DESKTOP}-${QUALITY.LD}`,
  DESKTOP_MD: `${DEVICES.DESKTOP}-${QUALITY.MD}`,
  DESKTOP_HD: `${DEVICES.DESKTOP}-${QUALITY.HD}`,
  DESKTOP_UHD: `${DEVICES.DESKTOP}-${QUALITY.UHD}`,
};

export const PIXEL_RATIOS_BY_DEVICE = {
  [BREAKPOINTS.MOBILE_SMALL]: MAX_DEVICE_PIXEL_RATIO,
  [BREAKPOINTS.MOBILE_LARGE]: 2,
  [BREAKPOINTS.TABLET_SMALL]: MAX_DEVICE_PIXEL_RATIO,
  [BREAKPOINTS.TABLET_LARGE]: 2,
  [BREAKPOINTS.DESKTOP_LD]: 1,
  [BREAKPOINTS.DESKTOP_MD]: 1,
  [BREAKPOINTS.DESKTOP_HD]: 1,
  [BREAKPOINTS.DESKTOP_UHD]: 1, // 4K
};

// Be sure to report any breakpoint change in $breakpoints (fashion-lib/lib/scss/functions/responsive.scss)
export const BREAKPOINTS_BY_DEVICE = {
  [BREAKPOINTS.MOBILE_SMALL]: 428,
  [BREAKPOINTS.MOBILE_LARGE]: 960,
  [BREAKPOINTS.TABLET_SMALL]: 1024,
  [BREAKPOINTS.TABLET_LARGE]: 1280,
  [BREAKPOINTS.DESKTOP_LD]: 1440,
  [BREAKPOINTS.DESKTOP_MD]: 1600,
  [BREAKPOINTS.DESKTOP_HD]: 1920,
  [BREAKPOINTS.DESKTOP_UHD]: 3840, // 4K
};

const MEDIA_QUERIES = {
  portrait: '(orientation: portrait)',
  landscape: '(orientation: landscape)',
  touch: '(hover: none) and (pointer: coarse)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  [BREAKPOINTS.MOBILE_SMALL]: `(max-width: ${BREAKPOINTS_BY_DEVICE[BREAKPOINTS.MOBILE_SMALL]}px)`,
  [BREAKPOINTS.MOBILE_LARGE]: `(min-width: ${
    BREAKPOINTS_BY_DEVICE[BREAKPOINTS.MOBILE_SMALL] + 1
  }px) and (max-width: ${BREAKPOINTS_BY_DEVICE[BREAKPOINTS.MOBILE_LARGE]}px)`,
  [BREAKPOINTS.TABLET_SMALL]: `(min-width: ${
    BREAKPOINTS_BY_DEVICE[BREAKPOINTS.MOBILE_LARGE] + 1
  }px) and (max-width: ${BREAKPOINTS_BY_DEVICE[BREAKPOINTS.TABLET_SMALL]}px)`,
  [BREAKPOINTS.TABLET_LARGE]: `(min-width: ${
    BREAKPOINTS_BY_DEVICE[BREAKPOINTS.TABLET_SMALL] + 1
  }px) and (max-width: ${BREAKPOINTS_BY_DEVICE[BREAKPOINTS.TABLET_LARGE]}px)`,
  [BREAKPOINTS.DESKTOP_LD]: `(min-width: ${
    BREAKPOINTS_BY_DEVICE[BREAKPOINTS.TABLET_LARGE] + 1
  }px) and (max-width: ${BREAKPOINTS_BY_DEVICE[BREAKPOINTS.DESKTOP_LD]}px)`,
  [BREAKPOINTS.DESKTOP_MD]: `(min-width: ${
    BREAKPOINTS_BY_DEVICE[BREAKPOINTS.DESKTOP_LD] + 1
  }px) and (max-width: ${BREAKPOINTS_BY_DEVICE[BREAKPOINTS.DESKTOP_MD]}px)`,
  [BREAKPOINTS.DESKTOP_HD]: `(min-width: ${
    BREAKPOINTS_BY_DEVICE[BREAKPOINTS.DESKTOP_MD] + 1
  }px) and (max-width: ${BREAKPOINTS_BY_DEVICE[BREAKPOINTS.DESKTOP_HD]}px)`,
  [BREAKPOINTS.DESKTOP_UHD]: `(min-width: ${BREAKPOINTS_BY_DEVICE[BREAKPOINTS.DESKTOP_HD] + 1}px)`,
};

export { DEVICES, BREAKPOINTS, WIDTH, MEDIA_QUERIES };
