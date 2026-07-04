import { useEffect, useState } from 'react';
import { Platform, useWindowDimensions } from 'react-native';

const DESKTOP_MIN_WIDTH = 1024;

export function useIsDesktop(): boolean {
  const { width } = useWindowDimensions();
  const [isDesktop, setIsDesktop] = useState(Platform.OS === 'web' && width >= DESKTOP_MIN_WIDTH);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setIsDesktop(width >= DESKTOP_MIN_WIDTH);
    } else {
      setIsDesktop(false);
    }
  }, [width]);

  return isDesktop;
}

export const ADMIN_URL_PATH = '/admin';
