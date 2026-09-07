import { Vacancy, Company, Application, CVData, EmploymentType, ExperienceLevel } from '../types';

export const JOB_CATEGORIES = [
  'İnformasiya Texnologiyaları & Proqramlaşdırma',
  'Maliyyə, Mühasibat & Audit',
  'Marketinq, PR & Reklam',
  'Satış & Müştəri Xidmətləri',
  'İnsan Resursları (HR) & İdarəetmə',
  'Dizayn & Kreativ',
  'Təhsil & Təlim',
  'Mühəndislik & Tikinti',
  'Logistika & Nəqliyyat',
  'Tibb & Əczaçılıq',
  'Hüquq',
  'Restoran & Otelçilik'
];

export const CITIES = [
  'Bakı',
  'Sumqayıt',
  'Gəncə',
  'Xırdalan',
  'Mingəçevir',
  'Şəki',
  'Naxçıvan',
  'Lənkəran',
  'Quba',
  'Şamaxı',
  'Göyçay',
  'Bərdə',
  'Şirvan'
];

export const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  'Təcrübəsiz / Junior',
  '1-3 il (Mid)',
  '3-5 il (Senior)',
  '5+ il (Lead/Head)'
];

export const EMPLOYMENT_TYPES: EmploymentType[] = [
  'Tam ştat',
  'Natamam ştat',
  'Məsafədən (Remote)',
  'Hibrid',
  'Təcrübəçi'
];

export const INITIAL_EMPTY_CV: CVData = {
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    city: 'Bakı',
    address: '',
    summary: '',
    photoUrl: '',
    socialLinks: {}
  },
  experiences: [],
  education: [],
  skills: [],
  languages: [
    { id: 'lang-1', language: 'Azərbaycan', proficiency: 'Ana dili' }
  ],
  projects: [],
  certificates: [],
  language: 'az',
  photoSize: '112px',
  photoShape: 'circle'
};

export const SAMPLE_CANDIDATE_CV: CVData = {
  personalInfo: {
    fullName: 'Rəşad Əliyev',
    jobTitle: 'Senior Frontend & React Developer',
    email: 'rashad.aliyev@jobia.az',
    phone: '+994 (50) 876-54-32',
    city: 'Bakı, Azərbaycan',
    address: 'Nizami rayonu, Qara Qarayev pr.',
    summary: 'Müasir TypeScript, React, Next.js və Tailwind CSS texnologiyaları üzrə 6 ildən çox praktiki təcrübəyə malik komanda yönümlü proqram mühəndisi. Yüksək yüklü FinTech və elektron ticarət tətbiqlərinin memarlığı və optimallaşdırılmasında dərin ixtisaslaşma.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/rashad-aliyev',
      github: 'https://github.com/rashad-dev',
      portfolio: 'https://rashad.dev'
    }
  },
  experiences: [
    {
      id: 'exp-1',
      company: 'Pasha Pay MMC',
      position: 'Lead Frontend Engineer',
      startDate: '2022-03',
      endDate: '',
      current: true,
      description: 'Milli ödəniş sistemi və rəqəmsal pulqabı arxitekturasının React Native və Next.js ilə qurulması. Performansın 35% artırılması və micro-frontend inteqrasiyası.',
      location: 'Bakı',
      achievements: [
        'Aylıq 1.5M+ aktiv istifadəçiyə malik mBilling modulunun sıfırdan yaradılması',
        'LCP və Core Web Vitals göstəricilərinin 92+ bala yüksəldilməsi'
      ]
    },
    {
      id: 'exp-2',
      company: 'Kapital Bank ASC',
      position: 'Senior React Developer',
      startDate: '2019-09',
      endDate: '2022-02',
      current: false,
      description: 'Korporativ internet bankçılıq platformasının hazırlanması, Redux Toolkit və REST API inteqrasiyaları.',
      location: 'Bakı',
      achievements: [
        'Komanda daxilində Design System komponent kitabxanasının formalaşdırılması'
      ]
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'ADA Universiteti',
      degree: 'Bakalavr',
      field: 'Kompüter Elmləri (Computer Science)',
      startDate: '2015',
      endDate: '2019',
      current: false,
      gpa: '3.78'
    }
  ],
  skills: [
    { id: 'sk-1', name: 'React 19 & Next.js', level: 'Ekspert', category: 'Texniki' },
    { id: 'sk-2', name: 'TypeScript', level: 'Ekspert', category: 'Texniki' },
    { id: 'sk-3', name: 'Tailwind CSS', level: 'Ekspert', category: 'Texniki' },
    { id: 'sk-4', name: 'State Management (Redux/Zustand)', level: 'Əla', category: 'Texniki' },
    { id: 'sk-5', name: 'REST & GraphQL APIs', level: 'Əla', category: 'Texniki' },
    { id: 'sk-6', name: 'Komanda Liderliyi & Agile', level: 'Yaxşı', category: 'Soft skill' }
  ],
  languages: [
    { id: 'lang-1', language: 'Azərbaycan dili', proficiency: 'Ana dili' },
    { id: 'lang-2', language: 'İngilis dili', proficiency: 'Sərbəst (C1-C2)' },
    { id: 'lang-3', language: 'Rus dili', proficiency: 'Orta (B1-B2)' }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Jobia.az AI İş və CV Platforması',
      description: 'Azərbaycan bazarı üçün müasir karyera platforması, ATS analizatoru və interaktiv vakansiya xəritəsi.',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Firebase', 'Gemini AI']
    }
  ],
  certificates: [
    {
      id: 'cert-1',
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      date: '2023-11'
    }
  ],
  language: 'az',
  photoSize: '112px',
  photoShape: 'circle'
};

export const SAMPLE_COMPANIES: Company[] = [
  {
    id: 'comp-pasha',
    name: 'PASHA Bank ASC',
    logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=160&auto=format&fit=crop&q=80',
    email: 'hr@pashabank.az',
    phone: '+994 12 496 50 00',
    website: 'https://pashabank.az',
    industry: 'Bankçılıq və Maliyyə',
    size: '1000-5000 işçi',
    description: 'Azərbaycanın qabaqcıl korporativ və investisiya bankı. Müasir rəqəmsal texnologiyalar və çevik idarəetmə metodologiyalarını uğurla tətbiq edir.',
    location: 'Bakı, Yusif Məmmədəliyev küç. 13',
    verified: true,
    verificationStatus: 'verified'
  },
  {
    id: 'comp-azercell',
    name: 'Azercell Telecom',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=160&auto=format&fit=crop&q=80',
    email: 'recruitment@azercell.com',
    phone: '+994 12 496 70 07',
    website: 'https://azercell.com',
    industry: 'Telekommunikasiya və Rəqəmsal Həllər',
    size: '1000+ işçi',
    description: 'Ölkənin lider mobil rabitə operatoru və rəqəmsal innovasiyalar ekosistemi.',
    location: 'Bakı, Tbilisi pr. 149',
    verified: true,
    verificationStatus: 'verified'
  },
  {
    id: 'comp-kapital',
    name: 'Kapital Bank ASC',
    logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=160&auto=format&fit=crop&q=80',
    email: 'career@kapitalbank.az',
    phone: '+994 12 196',
    website: 'https://kapitalbank.az',
    industry: 'Bankçılıq',
    size: '5000+ işçi',
    description: 'BirBank rəqəmsal ekosisteminin yaradıcısı, ən böyük filial şəbəkəsinə malik bank.',
    location: 'Bakı, Füzuli küç. 71',
    verified: true,
    verificationStatus: 'verified'
  },
  {
    id: 'comp-socar',
    name: 'SOCAR Midstream Operations',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=160&auto=format&fit=crop&q=80',
    email: 'jobs@socar.az',
    phone: '+994 12 521 00 00',
    website: 'https://socar.az',
    industry: 'Energetika və Neft-Qaz',
    size: '10000+ işçi',
    description: 'Azərbaycan Respublikası Dövlət Neft Şirkətinin qlobal əməliyyatlar şöbəsi.',
    location: 'Bakı, Heydər Əliyev pr. 121',
    verified: true,
    verificationStatus: 'verified'
  }
];

export const SAMPLE_VACANCIES: Vacancy[] = [
  {
    id: 'vac-101',
    title: 'Senior Frontend React Developer',
    category: 'İnformasiya Texnologiyaları & Proqramlaşdırma',
    companyId: 'comp-pasha',
    companyName: 'PASHA Bank ASC',
    companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=160&auto=format&fit=crop&q=80',
    companyVerified: true,
    city: 'Bakı',
    location: 'Bakı, Port Baku Towers',
    latitude: 40.3758,
    longitude: 49.8557,
    workplaceType: 'hybrid',
    employmentType: 'Tam ştat',
    experienceLevel: '3-5 il (Senior)',
    minSalary: 3200,
    maxSalary: 4500,
    currency: 'AZN',
    hideSalary: false,
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit', 'Next.js'],
    description: 'PASHA Bank Rəqəmsal Bankçılıq qrupu üçün yüksək performanslı veb tətbiqlərinin hazırlanması üzrə təcrübəli Senior Frontend Mühəndis axtarılır.',
    responsibilities: [
      'Micro-frontend arxitekturasının inkişaf etdirilməsi',
      'Bankın müasir rəqəmsal xidmətlərinin UI/UX interfeysinin reallaşdırılması',
      'Kod keyfiyyətinin qorunması və unit testlərin yazılması'
    ],
    requirements: [
      'Ən azı 4 il peşəkar React və TypeScript təcrübəsi',
      'Mürəkkəb state idarəetməsi və REST/GraphQL arxitekturası biliyi',
      'Git, CI/CD və Agile (Scrum) prinsipləri üzrə biliklər'
    ],
    benefits: [
      'Könüllü tibbi sığorta (Ailə üzvləri daxil)',
      'İllik bonus və fəaliyyətə əsaslanan mükafatlar',
      'Peşəkar sertifikasiya və konfrans xərclərinin ödənilməsi',
      'Hibrid iş rejimi (həftədə 2 gün ofis, 3 gün ev)'
    ],
    deadline: '2026-10-15',
    postedDate: '2026-09-01',
    status: 'published',
    isApproved: true,
    isFeatured: true,
    viewsCount: 1420,
    applicantsCount: 28,
    contactEmail: 'hr@pashabank.az',
    contactPhone: '+994 12 496 50 00'
  } as any,
  {
    id: 'vac-102',
    title: 'Rəqəmsal Marketinq və SEO Meneceri',
    category: 'Marketinq, PR & Reklam',
    companyId: 'comp-azercell',
    companyName: 'Azercell Telecom',
    companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=160&auto=format&fit=crop&q=80',
    companyVerified: true,
    city: 'Bakı',
    location: 'Bakı, Tbilisi pr. 149',
    latitude: 40.3953,
    longitude: 49.8217,
    workplaceType: 'on-site',
    employmentType: 'Tam ştat',
    experienceLevel: '1-3 il (Mid)',
    minSalary: 1800,
    maxSalary: 2500,
    currency: 'AZN',
    hideSalary: false,
    skills: ['Google Ads', 'SEO / SEM', 'Meta Ads', 'Google Analytics 4', 'SMM'],
    description: 'Azercell-in yeni rəqəmsal xidmətlərinin onlayn tanıtımı, performans reklam kampaniyalarının optimallaşdırılması üzrə Marketinq Meneceri tələb olunur.',
    responsibilities: [
      'Aylıq reklam büdcəsinin səmərəli idarə olunması və ROI artırılması',
      'SEO auditlərinin aparılması və axtarış reytinqlərinin yüksəldilməsi',
      'Analitik hesabatların hazırlanması'
    ],
    requirements: [
      'Rəqəmsal marketinq sahəsində 2+ il uğurlu iş təcrübəsi',
      'Google Analytics 4 və Tag Manager bilikləri',
      'Azərbaycan və İngilis dillərində səlis ünsiyyət'
    ],
    benefits: [
      'Korporativ nömrə və limitsiz internet paketi',
      'Geniş tibbi sığorta təminatı',
      'İdman zalı və fitness kompensasiyası'
    ],
    deadline: '2026-09-30',
    postedDate: '2026-09-02',
    status: 'published',
    isApproved: true,
    isFeatured: true,
    viewsCount: 980,
    applicantsCount: 19
  },
  {
    id: 'vac-103',
    title: 'Maliyyə Analitiki və Xərclərə Nəzarət',
    category: 'Maliyyə, Mühasibat & Audit',
    companyId: 'comp-kapital',
    companyName: 'Kapital Bank ASC',
    companyLogo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=160&auto=format&fit=crop&q=80',
    companyVerified: true,
    city: 'Bakı',
    location: 'Bakı, Füzuli küç. 71',
    latitude: 40.3772,
    longitude: 49.8402,
    workplaceType: 'hybrid',
    employmentType: 'Tam ştat',
    experienceLevel: '3-5 il (Senior)',
    minSalary: 2200,
    maxSalary: 3000,
    currency: 'AZN',
    hideSalary: false,
    skills: ['Maliyyə Modelləşdirməsi', 'Power BI', 'Advanced Excel', 'SQL', 'Büdcələmə'],
    description: 'Bankın pərakəndə biznes modullarının maliyyə hesabatlılığı və risk modellərinin təhlili üzrə Maliyyə Analitiki axtarılır.',
    responsibilities: [
      'Gəlir-xərc proqnozlarının və büdcə modellərinin tərtibi',
      'Maliyyə risklərinin qiymətləndirilməsi və rəhbərliyə təqdimat',
      'Power BI hesabat panellərinin hazırlanması'
    ],
    requirements: [
      'İqtisadiyyat, Maliyyə və ya Tətbiqi Riyaziyyat üzrə ali təhsil',
      'Ən azı 3 il bank və ya audit təcrübəsi (Big4 üstünlükdür)',
      'ACCA F2, F3 və ya CFA sertifikatları arzuolunandır'
    ],
    benefits: [
      'İllik 13-cü maaş və rüblük performans mükafatları',
      'Təlim və inkişaf proqramları',
      'Ailəvi tibbi sığorta'
    ],
    deadline: '2026-10-10',
    postedDate: '2026-09-04',
    status: 'published',
    isApproved: true,
    isFeatured: false,
    viewsCount: 750,
    applicantsCount: 14
  },
  {
    id: 'vac-104',
    title: 'Logistika və Təchizat Əlaqələndiricisi',
    category: 'Logistika & Nəqliyyat',
    companyId: 'comp-socar',
    companyName: 'SOCAR Midstream Operations',
    companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=160&auto=format&fit=crop&q=80',
    companyVerified: true,
    city: 'Bakı',
    location: 'Bakı, Heydər Əliyev pr. 121',
    latitude: 40.4093,
    longitude: 49.8671,
    workplaceType: 'on-site',
    employmentType: 'Tam ştat',
    experienceLevel: '1-3 il (Mid)',
    minSalary: 1500,
    maxSalary: 2100,
    currency: 'AZN',
    hideSalary: false,
    skills: ['Təchizat Zənciri', 'SAP MM', 'Gömrük Rəsmiləşdirilməsi', 'Logistika'],
    description: 'Neft-qaz infrastruktur layihələri üçün avadanlıq və xammal təchizatının koordinasiyası.',
    responsibilities: [
      'Beynəlxalq və yerli təchizatçılarla danışıqlar',
      'Gömrük və nəqliyyat sənədlərinin yoxlanılması',
      'Anbar ehtiyatlarının monitorinqi'
    ],
    requirements: [
      'Müvafiq sahədə 2 il təcrübə',
      'SAP və ya 1C proqramlarında iş təcrübəsi',
      'İngilis dili yaxşı səviyyədə'
    ],
    benefits: [
      'Nahar və servis xidməti',
      'Tam tibbi sığorta paketi',
      'Dövlət standartlarına uyğun zəmanətli əmək şəraiti'
    ],
    deadline: '2026-10-01',
    postedDate: '2026-09-05',
    status: 'published',
    isApproved: true,
    isFeatured: false,
    viewsCount: 620,
    applicantsCount: 11
  }
];

export const SAMPLE_APPLICATIONS: Application[] = [
  {
    id: 'app-001',
    vacancyId: 'vac-101',
    jobId: 'vac-101',
    vacancyTitle: 'Senior Frontend React Developer',
    companyId: 'comp-pasha',
    companyName: 'PASHA Bank ASC',
    companyLogo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=160&auto=format&fit=crop&q=80',
    candidateName: 'Rəşad Əliyev',
    candidateEmail: 'rashad.aliyev@jobia.az',
    candidatePhone: '+994 (50) 876-54-32',
    appliedDate: '2026-09-05',
    status: 'Müsahibə',
    matchScore: 94,
    matchHighlights: ['React & Next.js ekspertizası', 'FinTech sahəsində 6 il təcrübə', 'TypeScript və Tailwind biliyi'],
    coverNote: 'Salam, PASHA Bank-da rəqəmsal məhsulların inkişafına töhfə verməkdən məmnun olaram.',
    cvData: SAMPLE_CANDIDATE_CV
  }
];
