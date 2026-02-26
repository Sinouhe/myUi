import { useEffect, useRef, useCallback } from 'react';

/**
 * This custom hook `useScrollControl` is designed to manage page scrolling behavior dynamically.
 * The primary goal is to lock general page scrolling (`document.body`) while allowing scroll inside a specific element (`elt`) if provided.
 *
 * - The `lock` flag determines whether scrolling should be blocked.
 * - On touch devices, it prevents unwanted page jumps by fixing the body's position and allowing scrolling only within `elt` (if provided).
 * - On desktops, there are two different behaviors for blocking scroll:
 *   1. In some cases (e.g., QCA), we want to keep the main scrollbar visible to prevent layout shifts when hiding it.
 *      - Here, we block scrolling via event listeners without modifying `document.body` styles.
 *   2. In other cases (e.g., LookShow zoom), we need to completely hide the body scroll while enabling it inside the zoomed element.
 *      - The `hideBodyScroll` flag controls whether `document.body` should be set to `overflow: hidden`.
 *
 * The hook listens for `wheel`, `touchmove`, and `keydown` events to prevent unintended scrolling.
 * It properly restores the initial scroll state when unlocking.
 */

const useScrollControl = ({
  lock,
  isTouchDevice,
  elt,
  hideBodyScroll = false,
}: {
  lock: boolean;
  isTouchDevice: boolean;
  elt?: HTMLElement | null | undefined;
  hideBodyScroll?: boolean;
}): void => {
  const refIsDisableScroll = useRef<boolean>(lock),
    refLastScrollY = useRef<number>(0),
    refBodyInitialStyle = useRef<{
      position?: string;
      overflowY?: string;
      top?: string;
      width?: string;
    }>({}),
    refDocumentElementInitialStyle = useRef<{
      position?: string;
      overflowY?: string;
      top?: string;
      width?: string;
    }>({}),
    refHeaderInitialStyle = useRef<{
      top: string;
    }>({
      top: '',
    }),
    // eslint-disable-next-line no-unused-vars
    refPreventDefault = useRef<(e: Event) => void>((e: Event): void => {
      e.preventDefault();
    }),
    // eslint-disable-next-line no-unused-vars
    refAllowTouchMove = useRef<(e: TouchEvent) => void>((e: TouchEvent): void => {
      e.stopPropagation();
    }),
    // eslint-disable-next-line no-unused-vars
    refAllowScroll = useRef<(e: WheelEvent) => void>((e: WheelEvent): void => {
      const element = e.currentTarget as HTMLElement;

      // Check if the user is trying to scroll past the top or bottom with wheel event
      if (element.scrollTop === 0 && e.deltaY < 0) {
        refPreventDefault.current(e);
      } else if (element.scrollHeight - element.scrollTop <= element.clientHeight && e.deltaY > 0) {
        refPreventDefault.current(e);
      } else {
        e.stopPropagation();
      }
    }),
    // eslint-disable-next-line no-unused-vars
    refPreventExcessiveScroll = useRef<(e: WheelEvent) => void>((e: WheelEvent): void => {
      const element = e.target as HTMLElement;

      // Check if the user is trying to scroll past the top or bottom
      if (element.scrollTop === 0 && e.deltaY < 0) {
        refPreventDefault.current(e);
      } else if (element.scrollHeight - element.scrollTop <= element.clientHeight && e.deltaY > 0) {
        refPreventDefault.current(e);
      }
    }),
    // eslint-disable-next-line no-unused-vars
    refPreventDefaultForScrollKeys = useRef<(e: KeyboardEvent) => void>(
      (e: KeyboardEvent): void => {
        // Keys that cause scrolling
        if ([32, 37, 38, 39, 40].includes(e.keyCode)) {
          refPreventDefault.current(e);
        }
      },
    );

  const disableScroll = useCallback((): void => {
    refIsDisableScroll.current = lock;

    // Need to block totally scroll to avoir reload page on touchmove
    if (isTouchDevice) {
      const { scrollY } = window;
      refLastScrollY.current = scrollY;

      if (document.body.style.position !== 'fixed') {
        // keep in memory initial style of body
        refBodyInitialStyle.current = {
          position: document.body.style.position,
          overflowY: document.body.style.overflowY,
          top: document.body.style.top,
          width: document.body.style.width,
        };

        // To avoid jump issue on iPad, need to fix width to 100%
        document.body.style.width = '100%';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.overflowY = 'scroll';
      }

      if (document.documentElement.style.position !== 'fixed') {
        refDocumentElementInitialStyle.current = {
          position: document.documentElement.style.position,
          overflowY: document.documentElement.style.overflowY,
          top: document.documentElement.style.top,
          width: document.documentElement.style.width,
        };

        document.documentElement.style.width = '100%';
        document.documentElement.style.position = 'fixed';
        document.documentElement.style.top = `-${scrollY}px`;
        document.documentElement.style.overflowY = 'scroll';
      }

      const header = document.querySelector('.cc-header__content') as HTMLDivElement;

      if (header) {
        // keep in memory initial style of header
        refHeaderInitialStyle.current.top = header.style.top;
        // Need to stick header to top
        header.style.top = '0px';
      }

      window.addEventListener('touchmove', refPreventDefault.current, { passive: false });

      if (elt) {
        elt.addEventListener('touchmove', refAllowTouchMove.current, { passive: false });
      }
    } else {
      if (hideBodyScroll) {
        if (document.body.style.overflowY !== 'hidden') {
          refBodyInitialStyle.current.overflowY = document.body.style.overflowY;
          document.body.style.overflowY = 'hidden';
        }
        if (document.documentElement.style.overflowY !== 'hidden') {
          refDocumentElementInitialStyle.current.overflowY =
            document.documentElement.style.overflowY;
          document.documentElement.style.overflowY = 'hidden';
        }
      } else {
        // Prevent scroll for wheel events on the window
        window.addEventListener('wheel', refPreventDefault.current as EventListener, {
          passive: false,
        });

        // Prevent scroll for keyboard events on the window
        window.addEventListener(
          'keydown',
          refPreventDefaultForScrollKeys.current as EventListener,
          {
            passive: false,
          },
        );

        // Allow scroll on the specific element
        if (elt) {
          elt.addEventListener('wheel', refAllowScroll.current as EventListener, {
            passive: false,
          });
          elt.addEventListener('scroll', refPreventExcessiveScroll.current as EventListener, {
            passive: false,
          });
        }
      }
    }
  }, [lock, isTouchDevice, elt, hideBodyScroll]);

  const enableScroll = useCallback((): void => {
    refIsDisableScroll.current = lock;

    // Free scroll
    if (isTouchDevice) {
      const {
        position: positionBody,
        overflowY: overflowYBody,
        top: topBody,
        width: widthBody,
      } = refBodyInitialStyle.current;
      if (typeof positionBody === 'string') document.body.style.position = positionBody;
      if (typeof overflowYBody === 'string') document.body.style.overflowY = overflowYBody;
      if (typeof topBody === 'string') document.body.style.top = topBody;
      if (typeof widthBody === 'string') document.body.style.width = widthBody;

      const {
        position: positionDocumentElement,
        overflowY: overflowYDocumentElement,
        top: topDocumentElement,
        width: widthDocumentElement,
      } = refDocumentElementInitialStyle.current;
      if (typeof positionDocumentElement === 'string')
        document.documentElement.style.position = positionDocumentElement;
      if (typeof overflowYDocumentElement === 'string')
        document.documentElement.style.overflowY = overflowYDocumentElement;
      if (typeof topDocumentElement === 'string')
        document.documentElement.style.top = topDocumentElement;
      if (typeof widthDocumentElement === 'string')
        document.documentElement.style.width = widthDocumentElement;

      const header = document.querySelector('.cc-header__content') as HTMLDivElement;

      if (header) {
        header.style.top = refHeaderInitialStyle.current.top;
      }

      window.scrollTo(0, refLastScrollY.current);

      window.removeEventListener('touchmove', refPreventDefault.current);

      if (elt) {
        elt.removeEventListener('touchmove', refAllowTouchMove.current);
      }
    } else {
      if (hideBodyScroll) {
        const { overflowY: overYBody } = refBodyInitialStyle.current;
        if (typeof overYBody === 'string') document.body.style.overflowY = overYBody;
        const { overflowY: OverYDocElement } = refDocumentElementInitialStyle.current;
        if (typeof OverYDocElement === 'string')
          document.documentElement.style.overflowY = OverYDocElement;
      } else {
        // Re-enable scroll for wheel events on the window
        window.removeEventListener('wheel', refPreventDefault.current as EventListener);

        // Re-enable scroll for keyboard events on the window
        window.removeEventListener(
          'keydown',
          refPreventDefaultForScrollKeys.current as EventListener,
        );

        // Remove scroll on the specific element
        if (elt) {
          elt.removeEventListener('wheel', refAllowScroll.current as EventListener);
          elt.removeEventListener('scroll', refPreventExcessiveScroll.current as EventListener);
        }
      }
    }
  }, [lock, isTouchDevice, elt, hideBodyScroll]);

  useEffect(() => {
    if (lock) {
      disableScroll();
    } else if (refIsDisableScroll.current) {
      enableScroll();
    }

    // Cleanup
    return () => {
      enableScroll();
    };
  }, [disableScroll, enableScroll, lock]);
};

export default useScrollControl;
