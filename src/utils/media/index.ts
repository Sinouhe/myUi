/* eslint-disable no-unused-vars */
import UAParser from 'ua-parser-js';
import { BREAKPOINTS, MEDIA_QUERIES } from '../../constants/media';
import { isNode } from '../isomorph';

// Type
import type { GetCustomAspectRatioCssType } from './type';

class MediaSingleton {
  private static singleton: MediaSingleton;

  private _isInit = false;

  private _hasListeners = false;

  /**
   * Set of subscriber callbacks
   *
   */
  private _subscribers: Set<(detail: any) => void> = new Set();

  // MediaQueryList instances (assigned later)
  private _mqlPortrait: MediaQueryList | null = null;

  private _mqlLandscape: MediaQueryList | null = null;

  private _mqlTouch: MediaQueryList | null = null;

  private _mqlReducedMotion: MediaQueryList | null = null;

  private _mqlMobileSmall: MediaQueryList | null = null;

  private _mqlMobileLarge: MediaQueryList | null = null;

  private _mqlTabletSmall: MediaQueryList | null = null;

  private _mqlTabletLarge: MediaQueryList | null = null;

  private _mqlDesktopLD: MediaQueryList | null = null;

  private _mqlDesktopMD: MediaQueryList | null = null;

  private _mqlDesktopHD: MediaQueryList | null = null;

  private _mqlDesktopUHD: MediaQueryList | null = null;

  private _initialDevice: any = {};

  private _device: any;

  private _medium: string | null = null;

  private _isPortrait: boolean = false;

  static getSingleton(): MediaSingleton {
    return MediaSingleton.singleton || (MediaSingleton.singleton = new MediaSingleton());
  }

  get medium(): string | null {
    return this._medium;
  }

  get device(): any {
    return this._device;
  }

  get isPortrait(): boolean {
    return this._isPortrait;
  }

  /**
   *  Allow a component to subscribe to new data
   *
   */
  subscribeHydrate = (callback: (detail: any) => void): void => {
    this._subscribers.add(callback);
  };

  /**
   *  Allow a component to unSubscribe to new data
   *
   */
  unSubscribeHydrate = (callback: (detail: any) => void): void => {
    // Alow to call an unsubscribe function later in cleanup
    this._subscribers.delete(callback);
  };

  /**
   * Getters
   *
   */
  getReducedMotion = (): boolean | undefined => this._mqlReducedMotion?.matches;

  /**
   * Is (hover:none) and (pointer: coarse) media?
   *
   */
  getTouchMedia = (): boolean | undefined => this._mqlTouch?.matches;

  getIsPortrait = (): boolean =>
    !isNode ? window.matchMedia('(orientation: portrait)').matches : true;

  /**
   *  Notify all subscribers with the latest data
   *
   */
  notifySubscribers = (detail: any): void => {
    this._subscribers.forEach((callback) => callback(detail));
  };

  /**
   * Create a listener function that will be called on media changes
   *
   */
  onChangeCallback = (): void => {
    const data = {
      medium: this.getMatchMedia(),
      device: this.getDevice(),
      isPortrait: this.getIsPortrait(),
    };
    this.notifySubscribers(data);
  };

  /**
   * Get device information
   *
   */
  getDevice = (): any => ({
    ...this._initialDevice,
    touch: this.getTouchMedia(),
    reducedmotion: this.getReducedMotion(),
  });

  /**
   * Get current breakpoint from MediaQueryList objects
   *
   */
  getMatchMedia = (): string => {
    switch (true) {
      case this._mqlDesktopUHD?.matches:
        return BREAKPOINTS.DESKTOP_UHD;
      case this._mqlDesktopHD?.matches:
        return BREAKPOINTS.DESKTOP_HD;
      case this._mqlDesktopMD?.matches:
        return BREAKPOINTS.DESKTOP_MD;
      case this._mqlDesktopLD?.matches:
        return BREAKPOINTS.DESKTOP_LD;
      case this._mqlTabletLarge?.matches:
        return BREAKPOINTS.TABLET_LARGE;
      case this._mqlTabletSmall?.matches:
        return BREAKPOINTS.TABLET_SMALL;
      case this._mqlMobileLarge?.matches:
        return BREAKPOINTS.MOBILE_LARGE;
      case this._mqlMobileSmall?.matches:
        return BREAKPOINTS.MOBILE_SMALL;
      default:
        return '';
    }
  };

  /**
   * Set MediaQueryList objects based on the defined media queries
   *
   */
  setMediaQueries = (): void => {
    this._mqlPortrait = window.matchMedia(MEDIA_QUERIES.portrait);
    this._mqlLandscape = window.matchMedia(MEDIA_QUERIES.landscape);
    this._mqlTouch = window.matchMedia(MEDIA_QUERIES.touch);
    this._mqlReducedMotion = window.matchMedia(MEDIA_QUERIES.reducedMotion);
    this._mqlMobileSmall = window.matchMedia(MEDIA_QUERIES[BREAKPOINTS.MOBILE_SMALL]);
    this._mqlMobileLarge = window.matchMedia(MEDIA_QUERIES[BREAKPOINTS.MOBILE_LARGE]);
    this._mqlTabletSmall = window.matchMedia(MEDIA_QUERIES[BREAKPOINTS.TABLET_SMALL]);
    this._mqlTabletLarge = window.matchMedia(MEDIA_QUERIES[BREAKPOINTS.TABLET_LARGE]);
    this._mqlDesktopLD = window.matchMedia(MEDIA_QUERIES[BREAKPOINTS.DESKTOP_LD]);
    this._mqlDesktopMD = window.matchMedia(MEDIA_QUERIES[BREAKPOINTS.DESKTOP_MD]);
    this._mqlDesktopHD = window.matchMedia(MEDIA_QUERIES[BREAKPOINTS.DESKTOP_HD]);
    this._mqlDesktopUHD = window.matchMedia(MEDIA_QUERIES[BREAKPOINTS.DESKTOP_UHD]);
  };

  /**
   * Add event listeners to MediaQueryList objects
   *
   */
  addListeners = (): void => {
    if (this._hasListeners) return;

    const callback = (mql: MediaQueryList | null): void =>
      mql?.addEventListener('change', this.onChangeCallback);

    [
      this._mqlPortrait,
      this._mqlLandscape,
      this._mqlTouch,
      this._mqlReducedMotion,
      this._mqlMobileSmall,
      this._mqlMobileLarge,
      this._mqlTabletSmall,
      this._mqlTabletLarge,
      this._mqlDesktopLD,
      this._mqlDesktopMD,
      this._mqlDesktopHD,
      this._mqlDesktopUHD,
    ].forEach(callback);

    this._hasListeners = true;
  };

  init = (): void => {
    if (this._isInit || isNode) return;
    this._isInit = true;

    const uaparser = UAParser(),
      {
        browser = { name: undefined },
        device = { name: undefined, model: undefined },
        engine = { name: undefined },
        os = { name: undefined },
      } = uaparser;

    this._initialDevice = {
      safari: browser.name?.includes('Safari'),
      android: os.name?.includes('Android'),
      webkit: engine.name === 'WebKit',
      chrome: engine.name === 'Blink',
      ios: os.name === 'iOS' && os.version,
      iphone: device.model === 'iPhone',
      ipad: ((): boolean => {
        const ua = navigator.userAgent;
        if (ua.includes('iPad')) return true;
        if (ua.includes('Macintosh')) {
          try {
            document.createEvent('TouchEvent');
            return true;
          } catch {
            return false;
          }
        }
        return false;
      })(),
      uaparser,
    };

    this.setMediaQueries();
    this.addListeners();

    this._medium = this.getMatchMedia();
    this._device = this.getDevice();
    this._isPortrait = this.getIsPortrait();

    this.onChangeCallback();
  };
}

export default MediaSingleton.getSingleton();

export const getVideoType = ({ videoName }: { videoName: string }): string => {
  if (videoName.endsWith('.mp4')) return 'video/mp4';
  return 'application/x-mpegURL';
};

export const getCustomAspectRatioCss = ({
  id,
  mobile,
  desktop,
}: GetCustomAspectRatioCssType): string =>
  `#${id} { aspect-ratio: ${desktop}; } @media (max-width: 960px) { #${id} { aspect-ratio: ${mobile}; } }`;
