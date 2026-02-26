import React, { useEffect, useId, useRef } from 'react';
import './style.scss';

type Props = {
  src?: string;

  topText?: string;
  midText?: string;
  botText?: string;

  scrollVh?: number;
  triggerPx?: number;
  swapDurationMs?: number;

  travelXTop?: number;
  travelXBottom?: number;

  scaleStartPx?: number;
  maxScale?: number;
  zoomPow?: number;
};

const BASE_CLASSNAME = 'myui-video-text-mask';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export default function VideoTextMask({
  src = '/video_demo.mp4',
  topText = 'VS CODE',
  midText = 'REACT',
  botText = 'NODE JS',
  scrollVh = 900,
  triggerPx = 20,
  swapDurationMs = 200,
  travelXTop = 120,
  travelXBottom = 120,
  scaleStartPx = 890,
  maxScale = 120,
  zoomPow = 3.5,
}: Props) {
  const rawId = useId();
  const maskId = `text-hole-${rawId.replaceAll(':', '')}`;

  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const topGRef = useRef<SVGGElement | null>(null);
  const botGRef = useRef<SVGGElement | null>(null);

  // Persisted animation state
  const swapStateRef = useRef({ current: 0, lastTs: 0 }); // 0..1
  const targetSwapRef = useRef<0 | 1>(0);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    const overlay = overlayRef.current;
    if (!scrollArea || !overlay) return;

    let rafId = 0;

    const getLocalScrollPx = () => {
      const rect = scrollArea.getBoundingClientRect();
      const viewportH = window.innerHeight;

      // How much the scroll-area can scroll through viewport
      const scrollable = Math.max(1, rect.height - viewportH);

      // Convert rect.top into 0..scrollable
      const progress = clamp01(-rect.top / scrollable);
      return { localScrollPx: progress * scrollable, scrollable };
    };

    const applySwapAndZoom = (ts: number) => {
      rafId = 0;

      // --- Read local scroll in the scroll-area ---
      const { localScrollPx, scrollable } = getLocalScrollPx();

      // --- Update swap target based on threshold ---
      targetSwapRef.current = localScrollPx > triggerPx ? 1 : 0;

      // --- Advance swap animation towards target (time-based) ---
      const s = swapStateRef.current;

      const dt = s.lastTs ? Math.min(64, ts - s.lastTs) : 16;
      s.lastTs = ts;

      const target = targetSwapRef.current;
      const step = dt / Math.max(1, swapDurationMs);

      if (target > s.current) s.current = Math.min(1, s.current + step);
      else if (target < s.current) s.current = Math.max(0, s.current - step);

      // Smoothstep easing
      const easedSwap = s.current * s.current * (3 - 2 * s.current);

      const topX = travelXTop * (1 - 2 * easedSwap);
      const botX = -travelXBottom * (1 - 2 * easedSwap);

      if (topGRef.current) topGRef.current.setAttribute('transform', `translate(${topX} 0)`);
      if (botGRef.current) botGRef.current.setAttribute('transform', `translate(${botX} 0)`);

      // --- Zoom (progress-based) ---
      // Start at scaleStartPx, reach maxScale by the end of the scroll area
      const t = clamp01((localScrollPx - scaleStartPx) / Math.max(1, scrollable - scaleStartPx));
      const easedZoom = Math.pow(t, zoomPow);
      const scale = 1 + (maxScale - 1) * easedZoom;

      overlay.style.setProperty('--mask-scale', String(scale));

      // --- Continue RAF only if needed (perf) ---
      // Keep running while swap is not at target OR user is still scrolling through zoom range
      const swapDone = Math.abs(target - s.current) < 1e-4;
      const zoomActive = t > 0 && t < 1;

      if (!swapDone || zoomActive) {
        rafId = requestAnimationFrame(applySwapAndZoom);
      }
    };

    const requestTick = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(applySwapAndZoom);
    };

    // Start (in case page is already scrolled)
    requestTick();

    const onScroll = () => requestTick();
    const onResize = () => requestTick();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [triggerPx, swapDurationMs, scaleStartPx, maxScale, zoomPow, travelXTop, travelXBottom]);

  return (
    <>
      <div
        ref={scrollAreaRef}
        className={`${BASE_CLASSNAME}__scroll-area`}
        style={{ height: `${scrollVh}vh` }}
      />

      <video className={`${BASE_CLASSNAME}__video`} autoPlay muted loop playsInline preload="auto">
        <source src={src} type="video/mp4" />
      </video>

      <div ref={overlayRef} className={BASE_CLASSNAME} aria-hidden="true">
        <svg
          className={`${BASE_CLASSNAME}__overlay`}
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <mask
              id={maskId}
              maskUnits="userSpaceOnUse"
              maskContentUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1000"
              height="1000"
            >
              {/* White = visible, Black = hole */}
              <rect x="0" y="0" width="1000" height="1000" fill="white" />

              {/* TOP */}
              <g ref={topGRef}>
                <text
                  x="500"
                  y="420"
                  textAnchor="middle"
                  fontFamily="Impact, Arial Black, sans-serif"
                  fontWeight="900"
                  fontSize="110"
                  fill="black"
                >
                  {topText}
                </text>
              </g>

              {/* MIDDLE */}
              <text
                x="503"
                y="525"
                textAnchor="middle"
                fontFamily="Impact, Arial Black, sans-serif"
                fontWeight="900"
                fontSize="120"
                fill="black"
              >
                {midText}
              </text>

              {/* BOTTOM */}
              <g ref={botGRef}>
                <text
                  x="550"
                  y="620"
                  textAnchor="middle"
                  fontFamily="Impact, Arial Black, sans-serif"
                  fontWeight="900"
                  fontSize="110"
                  fill="black"
                >
                  {botText}
                </text>
              </g>
            </mask>
          </defs>

          {/* Full-screen black overlay, punched by the mask */}
          <rect
            x="0"
            y="0"
            width="1000"
            height="1000"
            className={`${BASE_CLASSNAME}__overlay-rect`}
            mask={`url(#${maskId})`}
          />
        </svg>
      </div>
    </>
  );
}
