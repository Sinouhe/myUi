import { useRef, useState, useEffect, useCallback } from 'react';
import { isEqual } from 'lodash';

// Libs
import { getDeviceValues } from './model';

// Singleton
import Media from '../../utils/media';

// Types
import type { DeviceType } from './type';

const useDevice = (): DeviceType => {
  const [device, setDevice] = useState<DeviceType>({ device: {}, medium: '' }),
    matchRef = useRef<any>(null),
    hasInitRef = useRef(false),
    onMediaChange = useCallback(({ medium, device: dvc }: any) => {
      const newValues = getDeviceValues({ detail: { medium, device: dvc } });

      if (!isEqual(matchRef.current, newValues)) {
        matchRef.current = newValues;
        setDevice((prev) => (!isEqual(prev, newValues) ? { ...newValues } : prev));
      }
    }, []);

  useEffect(() => {
    Media.subscribeHydrate(onMediaChange);

    if (!hasInitRef.current) {
      Media.init();

      onMediaChange({
        medium: Media.medium,
        device: Media.device,
      });

      hasInitRef.current = true;
    }

    return () => {
      Media.unSubscribeHydrate(onMediaChange);
    };
  }, [onMediaChange]);

  return device;
};

export default useDevice;
