export type ThemeName = 'modern' | 'minimal' | 'creative' | 'professional' | 'cyber';

export type ColorScheme =
  | 'blue'
  | 'purple'
  | 'blue-purple'
  | 'green'
  | 'pink'
  | 'black-white';

export type Language = 'ar' | 'en';

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  tags: string;
  projectLink: string;
  imageUrl: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  imageUrl: string;
}

export interface VolunteeringItem {
  id: string;
  role: string;
  organization: string;
  duration: string;
  description: string;
  logoUrl: string;
}

export interface Portfolio {
  username: string;
  ownerUid: string;
  name: string;
  bio: string;
  education: string;
  skills: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  githubUrl: string;
  photoUrl: string;
  theme: ThemeName;
  colorScheme: ColorScheme;
  language: Language;
  projects: ProjectItem[];
  experiences: ExperienceItem[];
  certificates: CertificateItem[];
  volunteering: VolunteeringItem[];
  createdAt?: number;
  updatedAt?: number;
}

export const EMPTY_PORTFOLIO: Portfolio = {
  username: '',
  ownerUid: '',
  name: '',
  bio: '',
  education: '',
  skills: '',
  email: '',
  phone: '',
  linkedinUrl: '',
  githubUrl: '',
  photoUrl: '',
  theme: 'modern',
  colorScheme: 'blue-purple',
  language: 'ar',
  projects: [],
  experiences: [],
  certificates: [],
  volunteering: []
};
