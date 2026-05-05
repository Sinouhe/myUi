export type Lang = 'en' | 'fr';

export type CvMeta = {
  version: string;
  locale: string;
  updatedAt: string;
};

export type CvLocation = {
  city: string;
  region: string;
  country: string;
};

export type CvContacts = {
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  github: string | null;
  portfolio: string | null;
};

export type CvBasics = {
  fullName: string;
  headline: string;
  summary: string;
  location: CvLocation;
  contacts: CvContacts;
};

export type CvSkillItem = {
  name: string;
  aliases?: string[];
  level?: string;
  yearsApprox?: number;
};

export type CvSkillGroup = {
  category: string;
  items: Array<string | CvSkillItem>;
};

export type CvRole = {
  title: string;
  client?: string;
  startDate: string;
  endDate: string | null;
  summary: string;
  highlights: string[];
  tech: string[];
};

export type CvCompany = {
  company: string;
  sector?: string;
  client?: string;
  location: string;
  roles: CvRole[];
};

export type CvProjectLink = {
  type: string;
  url: string;
};

export type CvProject = {
  name: string;
  role: string;
  summary: string;
  highlights: string[];
  tech: string[];
  links?: CvProjectLink[];
};

export type CvEducation = {
  institution: string;
  degree: string;
  field: string;
  endDate: string;
  note?: string;
};

export type CvLanguage = {
  name: string;
  level: string;
};

export type CvData = {
  meta: CvMeta;
  keyAchievements: string[];
  basics: CvBasics;
  skills: CvSkillGroup[];
  experience: CvCompany[];
  projects: CvProject[];
  education: CvEducation[];
  languages: CvLanguage[];
};
