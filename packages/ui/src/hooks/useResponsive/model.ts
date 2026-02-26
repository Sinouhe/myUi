// Types
import type { ResponsiveType } from './type';
// te

export const getResponsiveValues = ({ detail }: { detail: any }): ResponsiveType => {
  const { medium = '', isPortrait } = detail || {};
  return {
    isMobile: medium.startsWith('mobile'),
    isMobileBehaviour: medium.startsWith('mobile') && isPortrait,
    isTablet: medium.startsWith('tablet'),
    isDesktop: medium.startsWith('desktop'),
    isPortrait,
  };
};
