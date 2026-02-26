export type DevicesType = {
  DESKTOP: 'desktop';
  TABLET: 'tablet';
  MOBILE: 'mobile';
};

export type ConnectionMapType = {
  [key: string]: [number, [number, number] | ['auto', number]];
};
