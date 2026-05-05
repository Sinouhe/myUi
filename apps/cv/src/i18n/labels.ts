import type { Lang } from '@/types/cv';

export type UiLabels = {
  skipToMain: string;
  contactMe: string;
  present: string;
  sections: {
    keyAchievements: string;
    skills: string;
    experience: string;
    projects: string;
    education: string;
    languages: string;
    contact: string;
  };
  viewProject: string;
  openInNewTab: string;
  langSwitch: string;
  client: string;
  at: string;
};

export const uiLabels: Record<Lang, UiLabels> = {
  en: {
    skipToMain: 'Skip to main content',
    contactMe: 'Contact me',
    present: 'Present',
    sections: {
      keyAchievements: 'Key Achievements',
      skills: 'Skills',
      experience: 'Experience',
      projects: 'Projects',
      education: 'Education',
      languages: 'Languages',
      contact: 'Contact',
    },
    viewProject: 'View project',
    openInNewTab: '(opens in new tab)',
    langSwitch: 'Switch language',
    client: 'Client',
    at: 'at',
  },
  fr: {
    skipToMain: 'Aller au contenu principal',
    contactMe: 'Me contacter',
    present: 'À ce jour',
    sections: {
      keyAchievements: 'Réalisations clés',
      skills: 'Compétences',
      experience: 'Expérience',
      projects: 'Projets',
      education: 'Formation',
      languages: 'Langues',
      contact: 'Contact',
    },
    viewProject: 'Voir le projet',
    openInNewTab: '(ouvre dans un nouvel onglet)',
    langSwitch: 'Changer de langue',
    client: 'Client',
    at: 'chez',
  },
};
