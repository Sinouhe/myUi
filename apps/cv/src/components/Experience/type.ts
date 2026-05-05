import type { CvRole } from '@/types/cv';

export type ExperienceProps = Record<string, never>;

export type RoleItemProps = {
  role: CvRole;
  startFormatted: string;
  endFormatted: string;
};
