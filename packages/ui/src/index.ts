// ─── Top-level components ─────────────────────────────────────────────────────
export { default as SwipeBtn } from './components/swipebtn';
export { default as TextIntro } from './components/textIntroText';
export { default as VideoTextMask } from './components/VideoTextMask';
export { default as ZoomNodeJs } from './components/zoomNodeJs';

// ─── animeFormation ───────────────────────────────────────────────────────────
// Note: AnimeSwipeBtn aliased to avoid collision with top-level SwipeBtn
// TODO: Fix internal export naming in animeFormation/backgroudText (currently exports LightingButton)
export { default as BackgroundText } from './components/animeFormation/backgroudText';
export { default as ContinueScrolling } from './components/animeFormation/continueScrolling';
export { default as LightingBtn } from './components/animeFormation/lightingBtn';
export { default as MixBlendBtn } from './components/animeFormation/mixBlendBtn';
export { default as AnimeSwipeBtn } from './components/animeFormation/swipebtn';
export { default as TextIntersection } from './components/animeFormation/textIntersection';

// ─── FreeGSAP3Express ─────────────────────────────────────────────────────────
export { default as AnimatedMenu } from './components/FreeGSAP3Express/animatedMenu';
export { default as SplitLine } from './components/FreeGSAP3Express/splitLine';
export { default as SplitText } from './components/FreeGSAP3Express/splitText';
export { default as SplitWord } from './components/FreeGSAP3Express/splitWord';
export { default as TypeWriter } from './components/FreeGSAP3Express/typewriter';
// BeyondTheBasic variant — aliased to avoid collision with SplitLine
export { default as BtbSplitLine } from './components/FreeGSAP3Express/BeyondTheBasic/splitLine';

// ─── Hooks ────────────────────────────────────────────────────────────────────
export { default as useDevice } from './hooks/useDevice';
export { default as useHideBodyChildren } from './hooks/useHideBodyChildren';
export { default as useKeyboardInModal } from './hooks/useKeyboardInModal';
export { default as useResponsive } from './hooks/useResponsive';
export { default as useScript } from './hooks/useScript';
export { default as useScrollControl } from './hooks/useScrollControl';
