// import UAParser from 'ua-parser-js';
// import { BREAKPOINTS, MEDIA_QUERIES } from 'lib@constants/media';
// import { isNode } from 'lib@utils/isomorph';
// import type { MatchMediaType } from './type';

// // MediaQueryList instances (assigned later)
// let mqlPortrait: MediaQueryList,
// 	mqlLandscape: MediaQueryList,
// 	mqlTouch: MediaQueryList,
// 	mqlReducedMotion: MediaQueryList,
// 	mqlMobileSmall: MediaQueryList,
// 	mqlMobileLarge: MediaQueryList,
// 	mqlTabletSmall: MediaQueryList,
// 	mqlTabletLarge: MediaQueryList,
// 	mqlDesktopLD: MediaQueryList,
// 	mqlDesktopMD: MediaQueryList,
// 	mqlDesktopHD: MediaQueryList,
// 	mqlDesktopUHD: MediaQueryList,
// 	initialDevice: any = {};

// /**
//  * Set of subscriber callbacks
//  *
//  */
// const subscribers: Set<(detail: any) => void> = new Set();

// let hasListeners = false;

// /**
//  *  Notify all subscribers with the latest data
//  *
//  */
// const notifySubscribers = (detail: any): void => {
// 	subscribers.forEach((callback) => callback(detail));
// };

// /**
//  *  Allow a component to subscribe to new data
//  *
//  */
// const subscribeHydrate = (callback: (detail: any) => void): void => {
// 	subscribers.add(callback);
// };

// /**
//  *  Allow a component to unSubscribe to new data
//  *
//  */
// const unSubscribeHydrate = (callback: (detail: any) => void): void => {
// 	// Alow to call an unsubscribe function later in cleanup
// 	subscribers.delete(callback);
// };

// /**
//  * Getters
//  *
//  */
// const getReducedMotion = (): boolean => mqlReducedMotion.matches;

// /**
//  * Is (hover:none) and (pointer: coarse) media?
//  *
//  */
// const getTouchMedia = (): boolean => mqlTouch.matches;

// const getIsPortrait = (): boolean =>
// 	!isNode ? window.matchMedia('(orientation: portrait)').matches : true;

// /**
//  * Get device information
//  *
//  */
// const getDevice = (): any => ({
// 	...initialDevice,
// 	touch: getTouchMedia(),
// 	reducedmotion: getReducedMotion(),
// });

// /**
//  * Get current breakpoint from MediaQueryList objects
//  *
//  */
// const getMatchMedia = (): string => {
// 	switch (true) {
// 		case mqlDesktopUHD.matches:
// 			return BREAKPOINTS.DESKTOP_UHD;
// 		case mqlDesktopHD.matches:
// 			return BREAKPOINTS.DESKTOP_HD;
// 		case mqlDesktopMD.matches:
// 			return BREAKPOINTS.DESKTOP_MD;
// 		case mqlDesktopLD.matches:
// 			return BREAKPOINTS.DESKTOP_LD;
// 		case mqlTabletLarge.matches:
// 			return BREAKPOINTS.TABLET_LARGE;
// 		case mqlTabletSmall.matches:
// 			return BREAKPOINTS.TABLET_SMALL;
// 		case mqlMobileLarge.matches:
// 			return BREAKPOINTS.MOBILE_LARGE;
// 		case mqlMobileSmall.matches:
// 			return BREAKPOINTS.MOBILE_SMALL;
// 		default:
// 			return '';
// 	}
// };

// /**
//  * Set MediaQueryList objects based on the defined media queries
//  *
//  */
// const setMediaQueries = (): void => {
// 	mqlPortrait = window.matchMedia(MEDIA_QUERIES.portrait);
// 	mqlLandscape = window.matchMedia(MEDIA_QUERIES.landscape);
// 	mqlTouch = window.matchMedia(MEDIA_QUERIES.touch);
// 	mqlReducedMotion = window.matchMedia(MEDIA_QUERIES.reducedMotion);
// 	mqlMobileSmall = window.matchMedia(MEDIA_QUERIES[BREAKPOINTS.MOBILE_SMALL]);
// 	mqlMobileLarge = window.matchMedia(MEDIA_QUERIES[BREAKPOINTS.MOBILE_LARGE]);
// 	mqlTabletSmall = window.matchMedia(MEDIA_QUERIES[BREAKPOINTS.TABLET_SMALL]);
// 	mqlTabletLarge = window.matchMedia(MEDIA_QUERIES[BREAKPOINTS.TABLET_LARGE]);
// 	mqlDesktopLD = window.matchMedia(MEDIA_QUERIES[BREAKPOINTS.DESKTOP_LD]);
// 	mqlDesktopMD = window.matchMedia(MEDIA_QUERIES[BREAKPOINTS.DESKTOP_MD]);
// 	mqlDesktopHD = window.matchMedia(MEDIA_QUERIES[BREAKPOINTS.DESKTOP_HD]);
// 	mqlDesktopUHD = window.matchMedia(MEDIA_QUERIES[BREAKPOINTS.DESKTOP_UHD]);
// };

// /**
//  * Create a listener function that will be called on media changes
//  *
//  */
// const onChangeCallback = (): void => {
// 	const data = {
// 		medium: getMatchMedia(),
// 		device: getDevice(),
// 		isPortrait: getIsPortrait(),
// 	};
// 	notifySubscribers(data);
// };

// /**
//  * Add event listeners to MediaQueryList objects
//  *
//  */
// const addListeners = (): void => {
// 	if (hasListeners) return;

// 	const callback = (mql: MediaQueryList): void =>
// 		mql.addEventListener('change', onChangeCallback);

// 	[
// 		mqlPortrait,
// 		mqlLandscape,
// 		mqlTouch,
// 		mqlReducedMotion,
// 		mqlMobileSmall,
// 		mqlMobileLarge,
// 		mqlTabletSmall,
// 		mqlTabletLarge,
// 		mqlDesktopLD,
// 		mqlDesktopMD,
// 		mqlDesktopHD,
// 		mqlDesktopUHD,
// 	].forEach(callback);

// 	hasListeners = true;
// };

// const init = (): MatchMediaType => {
// 	if (typeof window !== 'undefined' && window.__FS?.matchMedia) {
// 		return window.__FS.matchMedia;
// 	}

// 	const uaparser = UAParser(),
// 		{
// 			browser = { name: undefined },
// 			device = { name: undefined, model: undefined },
// 			engine = { name: undefined },
// 			os = { name: undefined },
// 		} = uaparser;

// 	initialDevice = {
// 		safari: browser.name?.includes('Safari'),
// 		android: os.name?.includes('Android'),
// 		webkit: engine.name === 'WebKit',
// 		chrome: engine.name === 'Blink',
// 		ios: os.name === 'iOS' && os.version,
// 		iphone: device.model === 'iPhone',
// 		ipad: ((): boolean => {
// 			const ua = navigator.userAgent;
// 			if (ua.includes('iPad')) return true;
// 			if (ua.includes('Macintosh')) {
// 				try {
// 					document.createEvent('TouchEvent');
// 					return true;
// 				} catch {
// 					return false;
// 				}
// 			}
// 			return false;
// 		})(),
// 		uaparser,
// 	};

// 	setMediaQueries();
// 	addListeners();

// 	const matchMediaObj: MatchMediaType = {
// 		medium: getMatchMedia(),
// 		device: getDevice(),
// 		isPortrait: getIsPortrait(),
// 		subscribeHydrate,
// 		unSubscribeHydrate,
// 	};

// 	if (typeof window !== 'undefined') {
// 		window.__FS = window.__FS || {};
// 		window.__FS.matchMedia = matchMediaObj;
// 	}

// 	return matchMediaObj;
// };

// export default {
// 	init,
// };

// export const getVideoType = ({ videoName }: { videoName: string }): string => {
// 	if (videoName.endsWith('.mp4')) return 'video/mp4';
// 	return 'application/x-mpegURL';
// };
