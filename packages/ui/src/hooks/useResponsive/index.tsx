import { useState, useEffect, useRef, useCallback } from 'react';
import { isEqual } from 'lodash';

// Types
import type { ResponsiveType } from './type';

// Libs
import { getResponsiveValues } from './model';

// Singleton
import Media from '../../utils/media';

const useResponsive = ({
  forceDesktopFirst = false,
  withReady = false,
}: {
  forceDesktopFirst?: boolean;
  withReady?: boolean;
} = {}): ResponsiveType => {
  const [responsive, setResponsive] = useState<ResponsiveType>(
    forceDesktopFirst
      ? {
          isMobile: false,
          isMobileBehaviour: false,
          isTablet: false,
          isDesktop: true,
          isPortrait: false,
          ...(withReady && { ready: false }),
        }
      : {
          isMobile: true,
          isMobileBehaviour: true,
          isTablet: false,
          isDesktop: false,
          isPortrait: true,
          ...(withReady && { ready: false }),
        },
  );

  const responsiveRef = useRef<ResponsiveType>(responsive),
    hasInitRef = useRef(false),
    onMediaChange = useCallback(
      ({ medium, device: dvc, isPortrait }: any) => {
        const newValues = {
          ...getResponsiveValues({
            detail: { medium, device: dvc, isPortrait },
          }),
          ...(withReady && { ready: true }),
        };

        if (!isEqual(responsiveRef.current, newValues)) {
          responsiveRef.current = newValues;
          setResponsive((prev) => (!isEqual(prev, newValues) ? { ...newValues } : prev));
        }
      },
      [withReady],
    );

  useEffect(() => {
    Media?.subscribeHydrate(onMediaChange);

    if (!hasInitRef.current) {
      Media.init();

      onMediaChange({
        medium: Media.medium,
        device: Media.device,
        isPortrait: Media.isPortrait,
      });

      hasInitRef.current = true;
    }

    return () => {
      Media?.unSubscribeHydrate(onMediaChange);
    };
  }, [onMediaChange]);

  return responsive;
};

export default useResponsive;
