import React, { useState, useEffect, useRef } from 'react';
import { 
  CVData, 
  CVTemplateType, 
  CVLanguage,
  CVPhotoSize,
  CVPhotoShape,
  ExperienceItem, 
  EducationItem, 
  SkillItem, 
  LanguageItem, 
  ProjectItem, 
  CertificateItem 
} from '../../types';
import { CV_TEMPLATES, CVTemplateMeta } from '../cv-templates/templateRegistry';
import { CVRenderer } from '../cv-templates/CVRenderer';
import { CVMagicStudio } from './CVMagicStudio';
import { downloadCVAsPDF } from '../../utils/pdfExport';
import {
  Download,
  Save,
  Wand2,
  Sparkles,
  Eye,
  Edit3,
  Trash2,
  Plus,
  RotateCcw,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Layers,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Code,
  User,
  ChevronRight,
  FileCheck,
  Check,
  Camera,
  Loader2,
  FileDown,
  Clipboard,
  FileText,
  Languages,
  Maximize2,
  ChevronDown,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const SAMPLE_PASTE_TEXT = `Rəşad Quliyev
Senior Java & Backend Developer
Email: reshad.quliyev@example.com
Telefon: +994 50 345 67 89
Şəhər: Bakı, Azərbaycan
LinkedIn: linkedin.com/in/reshadquliyev
GitHub: github.com/reshadquliyev

Haqqımda:
Bank və maliyyə sektorunda yüksək yüklü mikroxidmət arxitekturalarının qurulması, Spring Boot və Kafka texnologiyaları üzrə 6 ildən artıq praktiki təcrübəyə malik Mühəndis. Verilənlər bazası sorğularının optimallaşdırılması və təhlükəsiz ödəniş sistemlərinin inteqrasiyası sahəsində ixtisaslaşmışam.

İş Təcrübəsi:
1. Kapital Bank ASC — Senior Java Developer (04.2021 – İndiyədək, Bakı)
• Birbank korporativ backend arxitekturasının hazırlanmasında iştirak etdim, gündəlik 1.5M tranzaksiyanı emal edən xidmətin gecikmə müddətini 45% azaltdım.
• Spring Cloud, Docker və Kubernetes ilə 12 mikroxidmətin problemsiz miqrasiyasını həyata keçirdim.
• PostgreSQL sorğularının indekslənməsi ilə hesabat generasiyasını 3 dəfə sürətləndirdim.

2. AccessBank Azerbaijan — Java Developer (09.2018 – 03.2021, Bakı)
• Daxili kredit və depozit uçot sistemlərinin RESTful API modullarını tərtib etdim.
• JUnit və Mockito ilə vahid test örtüyünü 80%-ə yüksəldərək xətaları minimuma endirdim.

Təhsil:
• Bakı Ali Neft Məktəbi (BANM) — İnformasiya Təhlükəsizliyi, Bakalavr (2014 – 2018, GPA: 3.8 / 4.0)

Bacarıqlar:
Java, Spring Boot, Spring Cloud, PostgreSQL, Apache Kafka, Redis, Docker, Kubernetes, CI/CD, Git, RESTful API, Problem həlli, Komandada iş

Dillər:
• Azərbaycan dili — Ana dili
• İngilis dili — C1-C2 (Sərbəst)
• Rus dili — B1-B2 (Orta/İşgüzar)

Sertifikatlar:
• Oracle Certified Professional: Java SE 11 Developer (2022)
• AWS Certified Solutions Architect – Associate (2023)`;

const EMPTY_BLANK_CV_DATA: CVData = {
  id: 'my-custom-cv',
  title: 'Mənim CV-im',
  language: 'az',
  lastUpdated: new Date().toISOString(),
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    address: '',
    linkedin: '',
    github: '',
    portfolio: '',
    summary: '',
    photoUrl: undefined,
    photoSize: '112px',
    photoShape: 'circle'
  },
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  projects: [],
  certificates: []
};

const SAMPLE_DEMO_CV_DATA: CVData = {
  id: 'my-custom-cv',
  title: 'Mənim CV-im',
  language: 'az',
  lastUpdated: new Date().toISOString(),
  personalInfo: {
    fullName: 'Fərid Həsənov',
    jobTitle: 'Senior Frontend Developer',
    email: 'farid.hasanov@example.com',
    phone: '+994 50 456 78 90',
    address: 'Bakı, Azərbaycan',
    linkedin: 'linkedin.com/in/faridhasanov',
    github: 'github.com/faridhasanov',
    portfolio: 'faridhasanov.dev',
    summary: 'Müasir web tətbiqləri, React ekosistemi və yüksək yüklü frontend sistemlərin yaradılmasında 5+ il təcrübəyə malik Mühəndis. Performans optimallaşdırılması, təmiz kod və komanda rəhbərliyi üzrə güclü təcrübəyə sahibəm. ATS uyğunluğu və yüksək keyfiyyətli istifadəçi təcrübəsinə fokuslanıram.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    photoSize: '112px',
    photoShape: 'circle'
  },
  experiences: [
    {
      id: 'exp-1',
      company: 'PASHA Bank OJSC',
      position: 'Senior Frontend Developer',
      location: 'Bakı, Azərbaycan',
      startDate: '03.2022',
      endDate: 'İndiyədək',
      current: true,
      description: '• Rəqəmsal korporativ bankçılıq tətbiqinin arxitekturasını qurdum, səhifə yüklənməsini 40% sürətləndirdim.\n• 8 nəfərlik mühəndis komandasında kod keyfiyyətinə və arxitektura standartlarına rəhbərlik etdim.\n• CI/CD konveyerlərini və vahid test (unit test) örtüyünü 85%-ə qədər artırdım.'
    },
    {
      id: 'exp-2',
      company: 'Azercell Telecom',
      position: 'Frontend Developer',
      location: 'Bakı, Azərbaycan',
      startDate: '09.2019',
      endDate: '02.2022',
      current: false,
      description: '• Şəxsi kabinet və abunə idarəetmə interfeyslərini React və Redux ilə tərtib etdim.\n• Mobil uyğunluğu və qlobal əlçatanlığı (a11y) təmin edərək istifadəçi məmnuniyyətini 25% artırdım.'
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'ADA Universiteti',
      degree: 'Bakalavr',
      fieldOfStudy: 'Kompüter Elmləri',
      startDate: '2015',
      endDate: '2019',
      current: false,
      gpa: '3.75 / 4.0'
    }
  ],
  skills: [
    { id: 'sk-1', name: 'TypeScript & JavaScript', level: 'Əla / Ekspert', category: 'Texniki' },
    { id: 'sk-2', name: 'React & Next.js', level: 'Əla / Ekspert', category: 'Texniki' },
    { id: 'sk-3', name: 'Tailwind CSS & UI/UX', level: 'Əla / Ekspert', category: 'Texniki' },
    { id: 'sk-4', name: 'RESTful API & GraphQL', level: 'Yaxşı', category: 'Texniki' },
    { id: 'sk-5', name: 'Git / GitHub & CI/CD', level: 'Yaxşı', category: 'Alət / Proqram' },
    { id: 'sk-6', name: 'Agile & Scrum', level: 'Əla / Ekspert', category: 'Soft skill' }
  ],
  languages: [
    { id: 'lang-1', language: 'Azərbaycan dili', proficiency: 'Ana dili' },
    { id: 'lang-2', language: 'İngilis dili', proficiency: 'C1-C2 (Sərbəst)' },
    { id: 'lang-3', language: 'Rus dili', proficiency: 'B1-B2 (Orta/İşgüzar)' }
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Real-time FinTech Dashboard',
      link: 'https://github.com/faridhasanov/fintech-portal',
      description: 'Real vaxt maliyyə məlumatlarının və qrafiklərinin təhlili üçün korporativ portal.',
      technologies: ['React', 'TypeScript', 'Tailwind', 'Chart.js']
    }
  ],
  certificates: [
    {
      id: 'cert-1',
      name: 'Meta Certified Front-End Developer',
      issuer: 'Meta / Coursera',
      date: '2022',
      issueDate: '2022'
    }
  ]
};

const STORAGE_KEY = 'jobia_cv_creator_data';
const STORAGE_TEMPLATE_KEY = 'jobia_cv_creator_template';
const STORAGE_LAST_SAVED_KEY = 'jobia_cv_last_saved_time';

interface CVCreatorProps {
  onBackToPortal?: () => void;
  onApplyWithCV?: (cv: CVData) => void;
  initialData?: CVData;
}

export const CVCreator: React.FC<CVCreatorProps> = ({ 
  onBackToPortal, 
  onApplyWithCV, 
  initialData 
}) => {
  // Load initial data:
  // If stored in this device's browser cache, load it (offline persistent!).
  // If opened on another device/fresh browser, start blank so no personal data leaks!
  const [cvData, setCvData] = useState<CVData>(() => {
    if (initialData) return initialData;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.personalInfo) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load cached CV data', e);
    }
    return EMPTY_BLANK_CV_DATA;
  });

  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplateType>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TEMPLATE_KEY);
      if (saved) return saved as CVTemplateType;
    } catch {}
    return 'modern-emerald';
  });

  const { dict, language, setLanguage } = useLanguage();
  const [showPhoto, setShowPhoto] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'paste' | 'editor' | 'templates' | 'preview'>('paste');
  const [editorSection, setEditorSection] = useState<'personal' | 'experience' | 'education' | 'skills' | 'languages' | 'projects' | 'certificates'>('personal');

  // Bidirectional sync: When the user toggles language at the top header, update CV template language immediately
  useEffect(() => {
    if (language && (language === 'az' || language === 'en' || language === 'ru')) {
      setCvData((prev) => {
        if (prev.language !== language) {
          return { ...prev, language };
        }
        return prev;
      });
    }
  }, [language]);
  const [previewScale, setPreviewScale] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return Math.min(0.6, Math.max(0.38, (window.innerWidth - 32) / 820));
    }
    return 1;
  });

  // Manual Save & Persistence States
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_LAST_SAVED_KEY);
    } catch {
      return null;
    }
  });

  // Clear All Data Modal & Notification
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);
  const [demoLoadedNotice, setDemoLoadedNotice] = useState(false);

  // Paste Text AI Auto-generation states
  const [pastedText, setPastedText] = useState('');
  const [isPastingAiLoading, setIsPastingAiLoading] = useState(false);
  const [pasteStatusMsg, setPasteStatusMsg] = useState('');
  const [pasteErrorMsg, setPasteErrorMsg] = useState('');

  // AI Modal States
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiJobTitle, setAiJobTitle] = useState('');
  const [aiExperienceLevel, setAiExperienceLevel] = useState<'junior' | 'mid' | 'senior' | 'lead'>('mid');
  const [aiFullName, setAiFullName] = useState('');
  const [aiCity, setAiCity] = useState('Bakı, Azərbaycan');
  const [aiSkillsHint, setAiSkillsHint] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState('');

  // Single-Click PDF Download State
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [pdfProgressText, setPdfProgressText] = useState('');
  const [pdfSuccess, setPdfSuccess] = useState(false);

  // Template filter category
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState<string>('Hamısı');

  // Translation States (Multi-language az, en, ru, tr)
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateNotification, setTranslateNotification] = useState<string | null>(null);

  // File upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentLanguage: CVLanguage = cvData.language || 'az';

  const applyClientFallback = (data: CVData, lang: CVLanguage): CVData => {
    const jobMap: Record<string, Record<string, string>> = {
      en: { 'Baş Mühasib': 'Chief Accountant', 'Mühasib': 'Accountant', 'Proqramçı': 'Software Developer', 'Dizayner': 'Designer', 'Menecer': 'Manager', 'Mütəxəssis': 'Specialist' },
      ru: { 'Baş Mühasib': 'Главный бухгалтер', 'Mühasib': 'Бухгалтер', 'Proqramçı': 'Разработчик ПО', 'Dizayner': 'Дизайнер', 'Menecer': 'Менеджер', 'Mütəxəssis': 'Специалист' },
      tr: { 'Baş Mühasib': 'Baş Muhasebeci', 'Mühasib': 'Muhasebeci', 'Proqramçı': 'Yazılım Geliştirici', 'Dizayner': 'Tasarımcı', 'Menecer': 'Müdür', 'Mütəxəssis': 'Uzman' },
      az: { 'Chief Accountant': 'Baş Mühasib', 'Accountant': 'Mühasib', 'Software Developer': 'Proqramçı' }
    };
    const degMap: Record<string, Record<string, string>> = {
      en: { 'Bakalavr': "Bachelor's Degree", 'Magistr': "Master's Degree", 'Doktorantura': 'Doctorate / PhD', 'Orta': 'Secondary School', 'Orta ixtisas': 'Vocational Education' },
      ru: { 'Bakalavr': 'Бакалавр', 'Magistr': 'Магистр', 'Doktorantura': 'Докторантура', 'Orta': 'Среднее', 'Orta ixtisas': 'Среднее специальное' },
      tr: { 'Bakalavr': 'Lisans', 'Magistr': 'Yüksek Lisans', 'Doktorantura': 'Doktora', 'Orta': 'Lise', 'Orta ixtisas': 'Meslek Yüksekokulu' },
      az: { 'Bachelor': 'Bakalavr', 'Master': 'Magistr' }
    };
    const lvlMap: Record<string, Record<string, string>> = {
      en: { 'Başlanğıc': 'Beginner', 'Orta': 'Intermediate', 'Yaxşı': 'Advanced', 'Əla': 'Expert', 'Ana dili': 'Native' },
      ru: { 'Başlanğıc': 'Начальный', 'Orta': 'Средний', 'Yaxşı': 'Продвинутый', 'Əla': 'Эксперт', 'Ana dili': 'Родной' },
      tr: { 'Başlanğıc': 'Başlangıç', 'Orta': 'Orta', 'Yaxşı': 'İleri', 'Əla': 'Uzman', 'Ana dili': 'Ana dil' },
      az: { 'Beginner': 'Başlanğıc', 'Intermediate': 'Orta', 'Advanced': 'Yaxşı', 'Expert': 'Əla', 'Native': 'Ana dili' }
    };
    const langNamesMap: Record<string, Record<string, string>> = {
      en: { 'Azərbaycan dili': 'Azerbaijani', 'İngilis dili': 'English', 'Rus dili': 'Russian', 'Türk dili': 'Turkish' },
      ru: { 'Azərbaycan dili': 'Азербайджанский', 'İngilis dili': 'Английский', 'Rus dili': 'Русский', 'Türk dili': 'Турецкий' },
      tr: { 'Azərbaycan dili': 'Azerbaycanca', 'İngilis dili': 'İngilizce', 'Rus dili': 'Rusça', 'Türk dili': 'Türkçe' },
      az: { 'Azerbaijani': 'Azərbaycan dili', 'English': 'İngilis dili', 'Russian': 'Rus dili', 'Turkish': 'Türk dili' }
    };

    const targetJobs = jobMap[lang] || {};
    const targetDegs = degMap[lang] || {};
    const targetLvls = lvlMap[lang] || {};
    const targetLangs = langNamesMap[lang] || {};

    return {
      ...data,
      language: lang,
      personalInfo: {
        ...data.personalInfo,
        jobTitle: targetJobs[data.personalInfo?.jobTitle || ''] || data.personalInfo?.jobTitle || ''
      },
      experiences: (data.experiences || []).map((exp) => ({
        ...exp,
        position: targetJobs[exp.position || ''] || exp.position || ''
      })),
      education: (data.education || []).map((edu) => ({
        ...edu,
        degree: targetDegs[edu.degree || ''] || edu.degree || ''
      })),
      skills: (data.skills || []).map((sk) => {
        let mappedLevel = sk.level;
        for (const [k, v] of Object.entries(targetLvls)) {
          if (sk.level?.includes(k)) {
            mappedLevel = v as 'Başlanğıc' | 'Orta' | 'Yaxşı' | 'Əla / Ekspert';
            break;
          }
        }
        return { ...sk, level: mappedLevel };
      }),
      languages: (data.languages || []).map((l) => {
        const orig = l.language || l.name || '';
        let mappedProf = l.proficiency || l.level || '';
        for (const [k, v] of Object.entries(targetLvls)) {
          if (mappedProf.includes(k)) {
            mappedProf = v;
            break;
          }
        }
        return {
          ...l,
          language: targetLangs[orig] || orig,
          name: targetLangs[orig] || orig,
          proficiency: mappedProf,
          level: mappedProf
        };
      })
    };
  };

  const handleTranslateContentWithAI = async (targetLang: CVLanguage) => {
    setIsTranslating(true);
    const langNames: Record<CVLanguage, string> = {
      az: 'Azərbaycan dili',
      en: 'İngilis dili (English)',
      ru: 'Rus dili (Русский)',
      tr: 'Türk dili (Türkçe)'
    };
    const targetName = langNames[targetLang] || targetLang.toUpperCase();
    setTranslateNotification(`AI bütün CV məlumatlarını başdan-başa ${targetName} dilinə tərcümə edir...`);

    // Immediate optimistic language update so templates react instantly
    setCvData((prev) => ({
      ...prev,
      language: targetLang
    }));

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch('/api/ai/translate-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          cvData: {
            ...cvData,
            language: targetLang
          },
          targetLanguage: targetLang
        })
      });
      clearTimeout(timeoutId);
      if (!res.ok) {
        throw new Error(`Server status: ${res.status}`);
      }
      const data = await res.json();
      if (data.success && data.cvData) {
        const fullTranslated = {
          ...data.cvData,
          language: targetLang
        };
        setCvData(fullTranslated);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(fullTranslated));
        } catch (_) {}
        setTranslateNotification(`✅ Bütün CV məzmunu uğurla ${targetName} dilinə tam tərcümə edildi!`);
      } else {
        const fallback = applyClientFallback(cvData, targetLang);
        setCvData(fallback);
        setTranslateNotification(`Şablon dili ${targetName} olaraq təyin edildi.`);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn('AI translation fallback notice:', err);
      const fallback = applyClientFallback(cvData, targetLang);
      setCvData(fallback);
      setTranslateNotification(`CV strukturu və şablon ${targetName} dilinə uyğunlaşdırıldı.`);
    } finally {
      setIsTranslating(false);
      setTimeout(() => setTranslateNotification(null), 4000);
    }
  };

  const handleLanguageSwitch = (lang: CVLanguage) => {
    setCvData((prev) => ({
      ...prev,
      language: lang
    }));
    if (lang === 'az' || lang === 'en' || lang === 'ru') {
      setLanguage(lang);
    }
    const langNames: Record<CVLanguage, string> = {
      az: 'Azərbaycan dili',
      en: 'İngilis dili (English)',
      ru: 'Rus dili (Русский)',
      tr: 'Türk dili (Türkçe)'
    };
    const notice = language === 'en'
      ? `Language set to "${langNames[lang]}". Click "AI Translate Text" to translate all content into this language.`
      : language === 'ru'
      ? `Выбран язык "${langNames[lang]}". Нажмите "ИИ Перевод текста", чтобы перевести всё резюме на этот язык.`
      : `Dil "${langNames[lang]}" seçildi. Bütün CV-ni bu dilə tərcümə etmək üçün "AI Mətni Tərcümə Et" düyməsini sıxın.`;
    setTranslateNotification(notice);
    setTimeout(() => setTranslateNotification(null), 3500);
  };

  const handlePhotoSizeChange = (size: CVPhotoSize) => {
    setCvData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        photoSize: size
      }
    }));
  };

  const handlePhotoShapeChange = (shape: CVPhotoShape) => {
    setCvData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        photoShape: shape
      }
    }));
  };

  // Manual Save to Local Storage Cache
  const handleSaveData = () => {
    try {
      const updated = {
        ...cvData,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      const timeStr = new Date().toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' });
      localStorage.setItem(STORAGE_LAST_SAVED_KEY, timeStr);
      setLastSavedTime(timeStr);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (e) {
      console.error('Failed to save CV data to local storage', e);
    }
  };

  // Clear all CV data completely
  const handleClearAllData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_LAST_SAVED_KEY);
    } catch {}
    setCvData(EMPTY_BLANK_CV_DATA);
    setLastSavedTime(null);
    setIsClearModalOpen(false);
    setClearSuccess(true);
    setTimeout(() => setClearSuccess(false), 4000);
  };

  // Load sample demo data
  const handleLoadSampleData = () => {
    setCvData(SAMPLE_DEMO_CV_DATA);
    setDemoLoadedNotice(true);
    setTimeout(() => setDemoLoadedNotice(false), 3500);
  };

  // Auto-save to local storage cache so it persists even if internet goes down
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cvData));
    } catch {}
  }, [cvData]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TEMPLATE_KEY, selectedTemplate);
    } catch {}
  }, [selectedTemplate]);

  // Handler for AI CV generation from pasted text
  const handleGenerateFromPastedText = async (customText?: string) => {
    const textToProcess = (typeof customText === 'string' ? customText : pastedText).trim();
    if (!textToProcess || textToProcess.length < 15) {
      setPasteErrorMsg('Zəhmət olmasa ən azı bir neçə cümlə mətn daxil edin və ya "Nümunə mətn qoy" düyməsindən istifadə edin.');
      return;
    }

    setIsPastingAiLoading(true);
    setPasteStatusMsg('AI mətni oxuyur və strukturlaşdırılmış CV-ni hazırlayır...');
    setPasteErrorMsg('');

    try {
      const res = await fetch('/api/ai/generate-full-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawPastedText: textToProcess,
          photoUrl: cvData.personalInfo.photoUrl
        })
      });

      const data = await res.json();
      if (data && data.cvData) {
        setCvData(data.cvData);
        setPasteStatusMsg('🎉 CV uğurla hazırlandı! Məlumatlar formaya yerləşdirildi.');
        // Switch to preview tab automatically
        setTimeout(() => {
          setActiveTab('preview');
          setPasteStatusMsg('');
        }, 1200);
      } else {
        throw new Error('CV məlumatları emal edilə bilmədi.');
      }
    } catch (err: any) {
      console.error('Paste AI generation error:', err);
      setPasteErrorMsg('Xəta baş verdi: ' + (err?.message || 'Zəhmət olmasa yenidən cəhd edin.'));
    } finally {
      setIsPastingAiLoading(false);
    }
  };

  // Handle Profile Photo Upload
  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Zəhmət olmasa şəkil formatında (PNG, JPG, WebP) fayl seçin.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Şəkil ölçüsü maksimum 5MB ola bilər.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCvData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          photoUrl: dataUrl
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  // One-Click PDF Download
  const handleDownloadPDF = async () => {
    setIsDownloadingPdf(true);
    setPdfProgressText('PDF formatı hesablanır...');
    setPdfSuccess(false);

    try {
      const cleanName = (cvData.personalInfo.fullName || 'Namized').replace(/[^a-zA-Z0-9əğıöşüƏĞIÖŞÜ_-]/g, '_');
      const cleanTitle = (cvData.personalInfo.jobTitle || 'CV').replace(/[^a-zA-Z0-9əğıöşüƏĞIÖŞÜ_-]/g, '_');
      const fileName = `Jobia_CV_${cleanName}_${cleanTitle}.pdf`;

      await downloadCVAsPDF('cv-live-creator-export', {
        fileName,
        onProgress: (status) => setPdfProgressText(status)
      });

      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 4000);
    } catch (err: any) {
      console.error('PDF export error', err);
      alert('PDF yüklənərkən xəta baş verdi: ' + (err?.message || 'Zəhmət olmasa yenidən yoxlayın.'));
    } finally {
      setIsDownloadingPdf(false);
      setPdfProgressText('');
    }
  };

  // Full AI Generation Trigger
  const handleGenerateFullCV = async () => {
    if (!aiJobTitle.trim()) {
      alert('Zəhmət olmasa vəzifə və ya ixtisas adını daxil edin.');
      return;
    }

    setIsAiGenerating(true);
    setAiSuccessMessage('');

    try {
      const res = await fetch('/api/ai/generate-full-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: aiJobTitle.trim(),
          experienceLevel: aiExperienceLevel,
          fullName: aiFullName.trim() || cvData.personalInfo.fullName || 'Əli Məmmədov',
          city: aiCity.trim() || 'Bakı, Azərbaycan',
          skillsSummary: aiSkillsHint.trim(),
          photoUrl: cvData.personalInfo.photoUrl
        })
      });

      const data = await res.json();
      if (data && data.cvData) {
        setCvData(data.cvData);
        setAiSuccessMessage(
          data.source === 'jobia_ai' || data.source === 'gemini_ai'
            ? '✨ CV Jobia AI tərəfindən uğurla generasiya edildi və formaya yerləşdirildi!'
            : '✨ CV peşəkar intellektual baza tərəfindən uğurla generasiya edildi!'
        );
        setTimeout(() => {
          setIsAiModalOpen(false);
          setAiSuccessMessage('');
          setActiveTab('preview');
        }, 1200);
      }
    } catch (err: any) {
      console.error('Full AI generation error', err);
      alert('AI ilə generasiya zamanı xəta baş verdi. Zəhmət olmasa yenidən yoxlayın.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  // AI improve single field (Summary)
  const [improvingSummary, setImprovingSummary] = useState(false);
  const handleImproveSummaryWithAI = async () => {
    setImprovingSummary(true);
    try {
      const res = await fetch('/api/ai/generate-cv-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'summary',
          role: cvData.personalInfo.jobTitle,
          currentText: cvData.personalInfo.summary,
          keywords: cvData.skills.map((s) => s.name).slice(0, 5)
        })
      });
      const json = await res.json();
      if (json.content) {
        setCvData((prev) => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            summary: json.content
          }
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setImprovingSummary(false);
    }
  };

  // Add experience
  const handleAddExperience = () => {
    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: 'Yeni Şirkət',
      position: cvData.personalInfo.jobTitle || 'Mütəxəssis',
      location: 'Bakı, Azərbaycan',
      startDate: '2023',
      endDate: 'İndiyədək',
      current: true,
      description: '• Əsas vəzifə və öhdəliklərin icrası.\n• Proseslərin təkmilləşdirilməsi və ölçülə bilən nəticələr.'
    };
    setCvData((prev) => ({
      ...prev,
      experiences: [newExp, ...prev.experiences]
    }));
  };

  const handleRemoveExperience = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id)
    }));
  };

  // Add education
  const handleAddEducation = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: 'Universitet',
      degree: 'Bakalavr',
      field: 'İxtisas',
      fieldOfStudy: 'İxtisas',
      startDate: '2018',
      endDate: '2022',
      current: false,
      gpa: '3.6 / 4.0'
    };
    setCvData((prev) => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const handleRemoveEducation = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      education: prev.education.filter((ed) => ed.id !== id)
    }));
  };

  // Add skill
  const handleAddSkill = (name = 'Yeni Bacarıq', category: SkillItem['category'] = 'Texniki') => {
    const newSkill: SkillItem = {
      id: `sk-${Date.now()}`,
      name,
      level: 'Yaxşı',
      category
    };
    setCvData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const handleRemoveSkill = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id)
    }));
  };

  // Add language
  const handleAddLanguage = () => {
    const newLang: LanguageItem = {
      id: `lang-${Date.now()}`,
      language: 'İngilis dili',
      proficiency: 'B1-B2 (Orta/İşgüzar)'
    };
    setCvData((prev) => ({
      ...prev,
      languages: [...prev.languages, newLang]
    }));
  };

  const handleRemoveLanguage = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l.id !== id)
    }));
  };

  // Add Project
  const handleAddProject = () => {
    const newProj: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: 'Yeni Layihə',
      description: 'Layihənin qısa təsviri və gətirdiyi dəyər.',
      technologies: ['React', 'Node.js']
    };
    setCvData((prev) => ({
      ...prev,
      projects: [...(prev.projects || []), newProj]
    }));
  };

  const handleRemoveProject = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      projects: (prev.projects || []).filter((p) => p.id !== id)
    }));
  };

  // Add Certificate
  const handleAddCertificate = () => {
    const newCert: CertificateItem = {
      id: `cert-${Date.now()}`,
      name: 'Peşəkar Sertifikat',
      issuer: 'Təşkilat / Platforma',
      date: '2023',
      issueDate: '2023'
    };
    setCvData((prev) => ({
      ...prev,
      certificates: [...(prev.certificates || []), newCert]
    }));
  };

  const handleRemoveCertificate = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      certificates: (prev.certificates || []).filter((c) => c.id !== id)
    }));
  };

  // Filter templates
  const categories = ['Hamısı', 'Sadə', 'Rəhbər', 'Xidmət & Texniki', 'Modern', 'Klassik', 'ATS', 'Kreativ', 'Texnoloji', 'Akademik'];
  const filteredTemplates = templateCategoryFilter === 'Hamısı'
    ? CV_TEMPLATES
    : CV_TEMPLATES.filter((t) => t.category === templateCategoryFilter);

  const currentTemplateMeta = CV_TEMPLATES.find((t) => t.id === selectedTemplate) || CV_TEMPLATES[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Navigation & Action Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBackToPortal && (
              <button
                onClick={onBackToPortal}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
              >
                {language === 'en' ? '← Back to Portal' : language === 'ru' ? '← Назад в портал' : '← Portala qayıt'}
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                  {language === 'en' ? 'CV Builder' : language === 'ru' ? 'Конструктор резюме' : 'CV yaradıcı'}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {language === 'en' ? 'AI-Powered' : language === 'ru' ? 'С поддержкой ИИ' : 'AI Dəstəkli'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                {language === 'en' 
                  ? 'Paste or enter text, automatically create your CV with AI, and download PDF in 1 click'
                  : language === 'ru'
                  ? 'Вставьте или введите текст, создайте резюме с ИИ и скачайте PDF в один клик'
                  : 'Mətni yapışdırın və ya daxil edin, AI ilə avtomatik CV yaradın və bir kliklə PDF endirin'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Clear All Data Button */}
            <button
              type="button"
              onClick={() => setIsClearModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title={language === 'en' ? 'Reset and clear all entered data' : language === 'ru' ? 'Сбросить и очистить все введенные данные' : 'Bütün daxil edilmiş məlumatları sıfırlayıb təmizlə'}
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="hidden sm:inline">
                {language === 'en' ? 'Clear All Data' : language === 'ru' ? 'Очистить всё' : 'Bütün Məlumatları Təmizlə'}
              </span>
              <span className="sm:hidden">
                {language === 'en' ? 'Clear' : language === 'ru' ? 'Очистить' : 'Təmizlə'}
              </span>
            </button>

            {/* Quick Paste / AI Button */}
            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'paste'
                  ? 'bg-[#00a859] text-white shadow-xs'
                  : 'bg-[#ecfdf5] text-[#007a40] hover:bg-[#dcfce7] border border-[#a7f3d0]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden md:inline">
                {language === 'en' ? 'AI CV Studio' : language === 'ru' ? 'AI CV Студия' : 'AI CV Studio'}
              </span>
              <span className="md:hidden">
                {language === 'en' ? 'AI Studio' : language === 'ru' ? 'AI Студия' : 'AI Studio'}
              </span>
            </button>

            {/* Manual Save Data Button */}
            <button
              type="button"
              onClick={handleSaveData}
              className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-extrabold shadow-sm transition-all cursor-pointer ${
                saveSuccess
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white'
              }`}
              title={language === 'en' ? 'Save data in local browser storage' : language === 'ru' ? 'Сохранить данные в локальном хранилище' : 'Məlumatları kompüterin keşində yadda saxla (internet kəsilsə də qalır)'}
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>{language === 'en' ? 'Saved!' : language === 'ru' ? 'Сохранено!' : 'Yadda Saxlanıldı!'}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{language === 'en' ? 'Save Data' : language === 'ru' ? 'Сохранить данные' : 'Məlumatları Yadda Saxla'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* View Switcher Tabs (Paste Text, Editor, Templates, Live Preview) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between border-t border-slate-100 bg-slate-50/70 overflow-x-auto">
          <div className="flex gap-1 py-1.5 min-w-max">
            <button
              onClick={() => setActiveTab('paste')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'paste'
                  ? 'bg-white text-[#007a40] shadow-xs border border-[#a7f3d0] ring-1 ring-[#00a859]/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00a859]" />
              <span>
                {language === 'en' ? 'AI Studio (voice · text · upload)' : language === 'ru' ? 'AI Студия (голос · текст · файл)' : 'AI Studio (səs · yazı · fayl)'}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('editor')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'editor'
                  ? 'bg-white text-indigo-600 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>
                {language === 'en' ? 'Edit Details' : language === 'ru' ? 'Редактировать данные' : 'Məlumatları redaktə et'}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('templates')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'templates'
                  ? 'bg-white text-indigo-600 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>
                {language === 'en' ? 'Templates' : language === 'ru' ? 'Шаблоны' : 'Şablonlar'}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-white text-indigo-600 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>
                {language === 'en' ? 'Full Preview & PDF' : language === 'ru' ? 'Предпросмотр и PDF' : 'Tam baxış & PDF'}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 shrink-0">
            {/* 4 Language Selector (AZ, EN, RU, TR) */}
            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 px-1.5 hidden md:inline flex items-center gap-1">
                <Languages className="w-3 h-3 text-slate-500" /> {language === 'en' ? 'Language:' : language === 'ru' ? 'Язык:' : 'Dil:'}
              </span>
              {(['az', 'en', 'ru', 'tr'] as CVLanguage[]).map((langCode) => {
                const isActive = currentLanguage === langCode;
                const langLabels: Record<CVLanguage, { label: string; flag: string; title: string }> = {
                  az: { label: 'AZ', flag: '🇦🇿', title: 'Azərbaycan dili' },
                  en: { label: 'EN', flag: '🇬🇧', title: 'English' },
                  ru: { label: 'RU', flag: '🇷🇺', title: 'Русский' },
                  tr: { label: 'TR', flag: '🇹🇷', title: 'Türkçe' }
                };
                const info = langLabels[langCode];

                return (
                  <button
                    key={langCode}
                    type="button"
                    title={info.title}
                    onClick={() => handleLanguageSwitch(langCode)}
                    className={`px-2 py-1 rounded text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span>{info.flag}</span>
                    <span>{info.label}</span>
                  </button>
                );
              })}

              {/* AI Auto-Translate Content Button (Translates directly to currently selected language) */}
              <button
                type="button"
                onClick={() => handleTranslateContentWithAI(currentLanguage)}
                disabled={isTranslating}
                title={language === 'en' ? `AI Translate all CV content into ${currentLanguage.toUpperCase()}` : language === 'ru' ? `ИИ перевести все данные резюме на ${currentLanguage.toUpperCase()}` : `Bütün CV məzmununu başdan-başa ${currentLanguage.toUpperCase()} dilinə AI ilə tərcümə et`}
                className="ml-1.5 px-3 py-1.5 rounded-md bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50 shadow-xs cursor-pointer select-none"
              >
                {isTranslating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                )}
                <span>
                  {language === 'en' ? 'AI Translate Text' : language === 'ru' ? 'ИИ Перевод текста' : 'AI Mətni Tərcümə Et'}
                </span>
                <span className="text-[10px] bg-purple-800 text-purple-100 px-1.5 py-0.5 rounded font-black tracking-wider">
                  {currentLanguage.toUpperCase()}
                </span>
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentTemplateMeta.colorTheme || currentTemplateMeta.accentColor }} />
              <span className="font-semibold text-slate-700 text-[11px] truncate max-w-[120px]">{currentTemplateMeta.name}</span>
            </div>

            <label className="hidden sm:flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showPhoto}
                onChange={(e) => setShowPhoto(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-[11px] font-medium text-slate-600">
                {language === 'en' ? 'Photo' : language === 'ru' ? 'Фото' : 'Şəkil'}
              </span>
            </label>
          </div>
        </div>

        {/* Global Notification banner for Translation / Actions */}
        {translateNotification && (
          <div className="bg-purple-600 text-white text-xs py-2 px-4 text-center font-medium shadow-sm flex items-center justify-center gap-2 animate-fadeIn">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{translateNotification}</span>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* TAB 0: PASTE TEXT AUTO-GENERATION */}
        {activeTab === 'paste' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: AI CV Studio — voice / text / upload (7 cols) */}
              <div className="lg:col-span-7">
                <CVMagicStudio
                  language={language}
                  isGenerating={isPastingAiLoading}
                  statusMsg={pasteStatusMsg}
                  errorMsg={pasteErrorMsg}
                  sampleText={SAMPLE_PASTE_TEXT}
                  onGenerate={(text) => {
                    setPastedText(text);
                    handleGenerateFromPastedText(text);
                  }}
                  onManualEdit={() => setActiveTab('editor')}
                />
              </div>

              {/* Right Column: Live A4 Preview & Template Selector (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800">
                      {language === 'en' ? 'Current Template:' : language === 'ru' ? 'Текущий шаблон:' : 'Cari Şablon:'}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 ml-1.5">{currentTemplateMeta.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('templates')}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                    >
                      {language === 'en' ? 'Change' : language === 'ru' ? 'Изменить' : 'Dəyişdir'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('preview')}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Full Preview & PDF' : language === 'ru' ? 'Предпросмотр и PDF' : 'Tam Baxış & PDF'}</span>
                    </button>
                  </div>
                </div>

                {/* Scaled Preview Box */}
                <div className="bg-slate-100 p-2 sm:p-3 rounded-2xl border border-slate-200 overflow-hidden shadow-inner flex flex-col items-center">
                  <div className="w-full text-center pb-2 text-[11px] font-semibold text-slate-500">
                    {language === 'en' ? 'Live A4 Preview' : language === 'ru' ? 'Живой предпросмотр A4' : 'Canlı A4 Önbaxış'}
                  </div>
                  <div className="w-full max-h-[640px] overflow-y-auto rounded-lg bg-white shadow-sm border border-slate-200 p-2">
                    <div className="transform scale-[0.68] sm:scale-[0.72] origin-top-left w-[138%] sm:w-[138%]">
                      <CVRenderer
                        data={cvData}
                        template={selectedTemplate}
                        showPhoto={showPhoto}
                        id="cv-live-creator-preview"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: TEMPLATES PICKER */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {language === 'en' ? 'CV Templates' : language === 'ru' ? 'Шаблоны резюме' : 'CV Şablonları'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'en'
                      ? 'Choose any layout — your data automatically adapts to the selected template.'
                      : language === 'ru'
                      ? 'Выберите любой макет — ваши данные автоматически адаптируются к выбранному шаблону.'
                      : 'İstədiyiniz formanı seçin — məlumatlarınız avtomatik olaraq həmin şablona tətbiq olunur.'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">
                    {language === 'en' ? 'Photo:' : language === 'ru' ? 'Фотография:' : 'Fotoşəkil:'}
                  </span>
                  <button
                    onClick={() => setShowPhoto(!showPhoto)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      showPhoto ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {showPhoto 
                      ? (language === 'en' ? 'With Photo' : language === 'ru' ? 'С фото' : 'Şəkilli')
                      : (language === 'en' ? 'Without Photo (ATS)' : language === 'ru' ? 'Без фото (ATS)' : 'Şəkilsiz (Anonim/ATS)')}
                  </button>
                </div>
              </div>

              {/* Category filter pills */}
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                {categories.map((cat) => {
                  const localizedCat = 
                    cat === 'Hamısı' ? (language === 'en' ? 'All' : language === 'ru' ? 'Все' : 'Hamısı') :
                    cat === 'Sadə' ? (language === 'en' ? 'Simple' : language === 'ru' ? 'Простые' : 'Sadə') :
                    cat === 'Rəhbər' ? (language === 'en' ? 'Executive' : language === 'ru' ? 'Руководители' : 'Rəhbər') :
                    cat === 'Xidmət & Texniki' ? (language === 'en' ? 'Service & Tech' : language === 'ru' ? 'Сервис и техника' : 'Xidmət & Texniki') :
                    cat === 'Modern' ? (language === 'en' ? 'Modern' : language === 'ru' ? 'Современные' : 'Modern') :
                    cat === 'Klassik' ? (language === 'en' ? 'Classic' : language === 'ru' ? 'Классические' : 'Klassik') :
                    cat === 'ATS' ? 'ATS' :
                    cat === 'Kreativ' ? (language === 'en' ? 'Creative' : language === 'ru' ? 'Креативные' : 'Kreativ') :
                    cat === 'Texnoloji' ? (language === 'en' ? 'Tech & IT' : language === 'ru' ? 'IT и Технологии' : 'Texnoloji') :
                    cat === 'Akademik' ? (language === 'en' ? 'Academic' : language === 'ru' ? 'Академические' : 'Akademik') : cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setTemplateCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                        templateCategoryFilter === cat
                          ? 'bg-slate-900 text-white font-bold shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {localizedCat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Template Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTemplates.map((tmpl) => {
                const isSelected = selectedTemplate === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => {
                      setSelectedTemplate(tmpl.id as CVTemplateType);
                    }}
                    className={`group relative rounded-xl border-2 p-5 bg-white cursor-pointer transition-all hover:shadow-md ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {/* Color Banner / Indicator */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-5 h-5 rounded-full shadow-xs border border-white"
                          style={{ backgroundColor: tmpl.colorTheme || tmpl.accentColor }}
                        />
                        <div>
                          <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {tmpl.name}
                          </h3>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                            {tmpl.category}
                          </span>
                        </div>
                      </div>

                      {tmpl.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                          {tmpl.badge}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed min-h-[38px] mb-4">
                      {tmpl.description}
                    </p>

                    {/* Preview Thumbnail Representation */}
                    <div className="h-28 rounded-lg bg-slate-50 border border-slate-200 p-2.5 flex flex-col justify-between overflow-hidden relative">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2.5 rounded w-16"
                            style={{ backgroundColor: tmpl.colorTheme || tmpl.accentColor }}
                          />
                          <div className="h-2 bg-slate-200 rounded w-24" />
                        </div>
                        <div className="h-1.5 bg-slate-200 rounded w-full" />
                        <div className="h-1.5 bg-slate-200 rounded w-4/5" />
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60">
                        <div className="col-span-2 space-y-1">
                          <div className="h-1.5 bg-slate-300 rounded w-2/3" />
                          <div className="h-1 bg-slate-200 rounded w-full" />
                          <div className="h-1 bg-slate-200 rounded w-5/6" />
                        </div>
                        <div className="space-y-1">
                          <div className="h-1.5 bg-slate-300 rounded w-full" />
                          <div className="h-1 bg-slate-200 rounded w-3/4" />
                        </div>
                      </div>

                      {isSelected && (
                        <div className="absolute inset-0 bg-emerald-900/10 backdrop-blur-[1px] flex items-center justify-center">
                          <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-sm flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>{language === 'en' ? 'Selected' : language === 'ru' ? 'Выбран' : 'Seçilib'}</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Select / Preview CTA */}
                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                      <span className="text-slate-500 font-medium">
                        {isSelected 
                          ? (language === 'en' ? 'Current template' : language === 'ru' ? 'Текущий шаблон' : 'Cari şablon') 
                          : (language === 'en' ? 'Click to select' : language === 'ru' ? 'Нажмите для выбора' : 'Kliklə seçin')}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTemplate(tmpl.id as CVTemplateType);
                          setActiveTab('preview');
                        }}
                        className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                      >
                        {language === 'en' ? 'Go to Preview →' : language === 'ru' ? 'К предпросмотру →' : 'Önbaxışa keç →'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: EDITOR (SPLIT VIEW ON DESKTOP) */}
        {activeTab === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Section Navigation & Forms (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* Data Cache & Management Toolbar */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                  <div className="text-[11px] text-slate-600">
                    <span className="font-bold text-slate-800">
                      {language === 'en' ? 'Local Storage: ' : language === 'ru' ? 'Локальное хранилище: ' : 'Cihazın Lokal Keşi: '}
                    </span>
                    {lastSavedTime ? (
                      <span className="text-emerald-700 font-semibold">
                        {language === 'en' ? `Saved (${lastSavedTime})` : language === 'ru' ? `Сохранено (${lastSavedTime})` : `Yadda saxlanılıb (${lastSavedTime})`}
                      </span>
                    ) : (
                      <span className="text-slate-500">
                        {language === 'en' ? 'Data is safely stored in your browser' : language === 'ru' ? 'Данные безопасно сохраняются в вашем браузере' : 'Məlumatlar kompüterinizin keşində qorunur'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Load Demo Data */}
                  <button
                    type="button"
                    onClick={handleLoadSampleData}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    title={language === 'en' ? 'Load pre-filled sample CV' : language === 'ru' ? 'Загрузить готовый пример резюме' : 'Hazır nümunə CV məlumatlarını yüklə'}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#00a859]" />
                    <span>{language === 'en' ? 'Sample CV' : language === 'ru' ? 'Пример резюме' : 'Nümunə CV'}</span>
                  </button>

                  {/* Clear All Data */}
                  <button
                    type="button"
                    onClick={() => setIsClearModalOpen(true)}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    title={language === 'en' ? 'Clear all data and restart' : language === 'ru' ? 'Очистить всё и начать сначала' : 'Bütün məlumatları silib sıfırdan başla'}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>{language === 'en' ? 'Clear All' : language === 'ru' ? 'Очистить всё' : 'Bütün Məlumatları Təmizlə'}</span>
                  </button>

                  {/* Save Data */}
                  <button
                    type="button"
                    onClick={handleSaveData}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer ${
                      saveSuccess
                        ? 'bg-indigo-800 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                    title={language === 'en' ? 'Save data locally in browser' : language === 'ru' ? 'Сохранить данные в браузере' : 'Məlumatları kompüterin keşində dərhal yadda saxla'}
                  >
                    {saveSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{language === 'en' ? 'Saved!' : language === 'ru' ? 'Сохранено!' : 'Saxlanıldı!'}</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>{language === 'en' ? 'Save Data' : language === 'ru' ? 'Сохранить' : 'Məlumatları Yadda Saxla'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Paste Prompt Banner */}
              <div className="bg-purple-50/70 border border-purple-200/80 rounded-xl p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-purple-100 text-purple-700 rounded-lg shrink-0">
                    <Clipboard className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-purple-900">
                      {language === 'en' ? 'Have your text ready?' : language === 'ru' ? 'Текст уже готов?' : 'Mətniniz hazırdır?'}
                    </h4>
                    <p className="text-[11px] text-purple-700">
                      {language === 'en'
                        ? 'Paste text directly, AI fills all sections in seconds.'
                        : language === 'ru'
                        ? 'Вставьте текст напрямую, ИИ заполнит все разделы за секунды.'
                        : 'Mətni birbaşa yapışdırın, AI saniyələr içində bütün bölmələri doldursun.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('paste')}
                  className="shrink-0 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  {language === 'en' ? 'Paste Text →' : language === 'ru' ? 'Вставить текст →' : 'Mətni Yapışdır →'}
                </button>
              </div>
              {/* Section Sub-Navigation Tabs */}
              <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-1">
                {[
                  { id: 'personal', label: language === 'en' ? 'Personal & Photo' : language === 'ru' ? 'Личные & Фото' : 'Şəxsi & Foto', icon: User },
                  { id: 'experience', label: language === 'en' ? 'Experience' : language === 'ru' ? 'Опыт' : 'Təcrübə', count: cvData.experiences?.length, icon: Briefcase },
                  { id: 'education', label: language === 'en' ? 'Education' : language === 'ru' ? 'Образование' : 'Təhsil', count: cvData.education?.length, icon: GraduationCap },
                  { id: 'skills', label: language === 'en' ? 'Skills' : language === 'ru' ? 'Навыки' : 'Bacarıqlar', count: cvData.skills?.length, icon: Code },
                  { id: 'languages', label: language === 'en' ? 'Languages' : language === 'ru' ? 'Языки' : 'Dillər', count: cvData.languages?.length, icon: Globe },
                  { id: 'projects', label: language === 'en' ? 'Projects' : language === 'ru' ? 'Проекты' : 'Layihələr', count: cvData.projects?.length, icon: Layers },
                  { id: 'certificates', label: language === 'en' ? 'Certificates' : language === 'ru' ? 'Сертификаты' : 'Sertifikatlar', count: cvData.certificates?.length, icon: Award }
                ].map((sec) => {
                  const Icon = sec.icon;
                  const isActive = editorSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => setEditorSection(sec.id as any)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{sec.label}</span>
                      {typeof sec.count === 'number' && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isActive ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {sec.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* 1. PERSONAL INFO SECTION */}
              {editorSection === 'personal' && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">
                        {language === 'en' ? 'Personal Information & Profile Photo' : language === 'ru' ? 'Личные данные и фото профиля' : 'Şəxsi Məlumatlar və Profil Şəkli'}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {language === 'en' ? 'Candidate core identity, contact details, and bio' : language === 'ru' ? 'Основная информация, контакты и краткая биография' : 'Namizədin əsas kimlik, əlaqə və bioqrafiya məlumatları'}
                      </p>
                    </div>
                  </div>

                  {/* Profile Photo Uploader & Sizing Customization */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="relative group shrink-0">
                        {cvData.personalInfo.photoUrl ? (
                          <img
                            src={cvData.personalInfo.photoUrl}
                            alt="Profil"
                            className={`object-cover border-2 border-emerald-500 shadow-sm transition-all ${
                              cvData.personalInfo.photoSize === '168px' || cvData.personalInfo.photoSize === 'xl' ? 'w-[168px] h-[168px]' :
                              cvData.personalInfo.photoSize === '140px' || cvData.personalInfo.photoSize === 'lg' ? 'w-[140px] h-[140px]' :
                              'w-28 h-28'
                            } ${
                              cvData.personalInfo.photoShape === 'square' ? 'rounded-lg' :
                              cvData.personalInfo.photoShape === 'rounded' ? 'rounded-2xl' : 'rounded-full'
                            }`}
                          />
                        ) : (
                          <div className={`bg-slate-200 text-slate-400 flex items-center justify-center border-2 border-dashed border-slate-300 transition-all ${
                            cvData.personalInfo.photoSize === '168px' || cvData.personalInfo.photoSize === 'xl' ? 'w-[168px] h-[168px]' :
                            cvData.personalInfo.photoSize === '140px' || cvData.personalInfo.photoSize === 'lg' ? 'w-[140px] h-[140px]' :
                            'w-28 h-28'
                          } ${
                            cvData.personalInfo.photoShape === 'square' ? 'rounded-lg' :
                            cvData.personalInfo.photoShape === 'rounded' ? 'rounded-2xl' : 'rounded-full'
                          }`}>
                            <Camera className="w-7 h-7" />
                          </div>
                        )}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handlePhotoFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>

                      <div className="flex-1 text-center sm:text-left space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="font-bold text-xs text-slate-900">
                            {language === 'en' ? 'Profile Photo' : language === 'ru' ? 'Фото профиля' : 'Profil Fotoşəkli'}
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium">PNG, JPG / WebP (max 5MB)</span>
                        </div>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>
                              {cvData.personalInfo.photoUrl 
                                ? (language === 'en' ? 'Change photo' : language === 'ru' ? 'Сменить фото' : 'Şəkli dəyiş') 
                                : (language === 'en' ? 'Upload photo' : language === 'ru' ? 'Загрузить фото' : 'Şəkil Yüklə')}
                            </span>
                          </button>
                          {cvData.personalInfo.photoUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                setCvData((prev) => ({
                                  ...prev,
                                  personalInfo: { ...prev.personalInfo, photoUrl: undefined }
                                }));
                              }}
                              className="px-2.5 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium cursor-pointer"
                            >
                              {language === 'en' ? 'Remove' : language === 'ru' ? 'Удалить' : 'Şəkli sil'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Photo Size & Shape Fine-Tuning Controls for Candidates */}
                    <div className="pt-3 border-t border-slate-200/70 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Photo Size selection */}
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700 flex items-center gap-1 text-[11px]">
                          <Maximize2 className="w-3.5 h-3.5 text-emerald-600" />
                          {language === 'en' ? 'Photo Size:' : language === 'ru' ? 'Размер фото:' : 'Şəkil Ölçüsü:'}
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { id: '112px', label: language === 'en' ? 'Standard' : language === 'ru' ? 'Стандарт' : 'Standart', px: '112 × 112' },
                            { id: '140px', label: language === 'en' ? 'Large' : language === 'ru' ? 'Крупный' : 'Böyük', px: '140 × 140' },
                            { id: '168px', label: language === 'en' ? 'Portrait' : language === 'ru' ? 'Портрет' : 'İri Portret', px: '168 × 168' }
                          ].map((sz) => {
                            const current = cvData.personalInfo.photoSize || '112px';
                            const isCurrent = current === sz.id || 
                              (sz.id === '112px' && (current === 'sm' || current === 'md')) ||
                              (sz.id === '140px' && current === 'lg') ||
                              (sz.id === '168px' && current === 'xl');
                            return (
                              <button
                                key={sz.id}
                                type="button"
                                onClick={() => handlePhotoSizeChange(sz.id as CVPhotoSize)}
                                className={`py-1.5 px-2 rounded-lg text-[11px] font-bold text-center transition-all border cursor-pointer ${
                                  isCurrent
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs ring-1 ring-emerald-500'
                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                <div>{sz.label}</div>
                                <div className={`text-[10px] ${isCurrent ? 'text-emerald-100' : 'text-slate-400'}`}>{sz.px}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Photo Shape selection */}
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700 flex items-center gap-1 text-[11px]">
                          <Camera className="w-3.5 h-3.5 text-emerald-600" />
                          {language === 'en' ? 'Photo Shape:' : language === 'ru' ? 'Форма фото:' : 'Şəkil Forması:'}
                        </label>
                        <div className="grid grid-cols-3 gap-1">
                          {[
                            { id: 'circle', label: language === 'en' ? 'Circle' : language === 'ru' ? 'Круг' : 'Dairəvi', shapeDesc: language === 'en' ? 'Full circle' : language === 'ru' ? 'Круглая' : 'Tam dairə' },
                            { id: 'rounded', label: language === 'en' ? 'Rounded' : language === 'ru' ? 'Скругленный' : 'Yuvarlaq', shapeDesc: language === 'en' ? 'Rounded corners' : language === 'ru' ? 'Скругленные углы' : 'Yumru künc' },
                            { id: 'square', label: language === 'en' ? 'Square' : language === 'ru' ? 'Квадрат' : 'Kvadrat', shapeDesc: language === 'en' ? 'Square' : language === 'ru' ? 'Прямоугольная' : 'Düzbucaqlı' }
                          ].map((shp) => {
                            const isCurrent = (cvData.personalInfo.photoShape || 'circle') === shp.id;
                            return (
                              <button
                                key={shp.id}
                                type="button"
                                onClick={() => handlePhotoShapeChange(shp.id as CVPhotoShape)}
                                className={`py-1 px-1.5 rounded text-[11px] font-semibold text-center transition-all border cursor-pointer ${
                                  isCurrent
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                <div>{shp.label}</div>
                                <div className={`text-[9px] ${isCurrent ? 'text-emerald-100' : 'text-slate-400'}`}>{shp.shapeDesc}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {language === 'en' ? 'Full Name *' : language === 'ru' ? 'ФИО *' : 'Ad və Soyad *'}
                      </label>
                      <input
                        type="text"
                        value={cvData.personalInfo.fullName || ''}
                        onChange={(e) =>
                          setCvData((prev) => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                          }))
                        }
                        placeholder={language === 'en' ? 'e.g. John Doe' : language === 'ru' ? 'Напр: Иван Иванов' : 'Məs: Fərid Həsənov'}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {language === 'en' ? 'Job Title / Role *' : language === 'ru' ? 'Должность / Профессия *' : 'Vəzifə / İxtisas *'}
                      </label>
                      <input
                        type="text"
                        value={cvData.personalInfo.jobTitle || ''}
                        onChange={(e) =>
                          setCvData((prev) => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, jobTitle: e.target.value }
                          }))
                        }
                        placeholder={language === 'en' ? 'e.g. Senior Frontend Developer' : language === 'ru' ? 'Напр: Senior Frontend Developer' : 'Məs: Senior Frontend Developer'}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email *</label>
                      <input
                        type="email"
                        value={cvData.personalInfo.email || ''}
                        onChange={(e) =>
                          setCvData((prev) => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, email: e.target.value }
                          }))
                        }
                        placeholder="email@example.com"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {language === 'en' ? 'Phone *' : language === 'ru' ? 'Телефон *' : 'Telefon *'}
                      </label>
                      <input
                        type="tel"
                        value={cvData.personalInfo.phone || ''}
                        onChange={(e) =>
                          setCvData((prev) => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, phone: e.target.value }
                          }))
                        }
                        placeholder="+994 50 123 45 67"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {language === 'en' ? 'City / Location' : language === 'ru' ? 'Город / Адрес' : 'Şəhər / Ünvan'}
                      </label>
                      <input
                        type="text"
                        value={cvData.personalInfo.address || ''}
                        onChange={(e) =>
                          setCvData((prev) => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, address: e.target.value }
                          }))
                        }
                        placeholder={language === 'en' ? 'Baku, Azerbaijan' : language === 'ru' ? 'Баку, Азербайджан' : 'Bakı, Azərbaycan'}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">LinkedIn</label>
                      <input
                        type="text"
                        value={cvData.personalInfo.linkedin || ''}
                        onChange={(e) =>
                          setCvData((prev) => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
                          }))
                        }
                        placeholder="linkedin.com/in/profile"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">GitHub / Behance</label>
                      <input
                        type="text"
                        value={cvData.personalInfo.github || ''}
                        onChange={(e) =>
                          setCvData((prev) => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, github: e.target.value }
                          }))
                        }
                        placeholder="github.com/username"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {language === 'en' ? 'Portfolio / Website' : language === 'ru' ? 'Сайт / Портфолио' : 'Şəxsi Vebsayt / Portfolio'}
                      </label>
                      <input
                        type="text"
                        value={cvData.personalInfo.portfolio || ''}
                        onChange={(e) =>
                          setCvData((prev) => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, portfolio: e.target.value }
                          }))
                        }
                        placeholder="mywebsite.com"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Professional Summary with AI rewrite button */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-bold text-slate-700 text-xs">
                        {language === 'en' ? 'Professional Summary' : language === 'ru' ? 'О себе / Профессиональное резюме' : 'Haqqımda / Peşəkar Xülasə (Summary)'}
                      </label>
                      <button
                        type="button"
                        onClick={handleImproveSummaryWithAI}
                        disabled={improvingSummary}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-md transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {improvingSummary ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>{language === 'en' ? 'AI writing...' : language === 'ru' ? 'ИИ пишет...' : 'AI yazır...'}</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3" />
                            <span>{language === 'en' ? 'Improve with AI' : language === 'ru' ? 'Улучшить с ИИ' : 'AI ilə təkmilləşdir'}</span>
                          </>
                        )}
                      </button>
                    </div>
                    <textarea
                      rows={4}
                      value={cvData.personalInfo.summary || ''}
                      onChange={(e) =>
                        setCvData((prev) => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, summary: e.target.value }
                        }))
                      }
                      placeholder={
                        language === 'en'
                          ? '3-4 impactful sentences highlighting your experience and achievements...'
                          : language === 'ru'
                          ? '3-4 убедительных предложения, подчеркивающих ваш опыт и ключевые результаты...'
                          : 'Özünüz haqqında 3-4 cümləlik güclü, nəticəyönümlü xülasə...'
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* 2. EXPERIENCE SECTION */}
              {editorSection === 'experience' && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">
                        {language === 'en' ? 'Work Experience' : language === 'ru' ? 'Опыт работы' : 'İş Təcrübələri'}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {language === 'en' ? 'List jobs in reverse chronological order' : language === 'ru' ? 'Указывайте места работы в обратном хронологическом порядке' : 'Ən son iş yerindən başlayaraq xronoloji qeyd edin'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddExperience}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Add Experience' : language === 'ru' ? 'Добавить опыт' : 'İş yeri əlavə et'}</span>
                    </button>
                  </div>

                  {cvData.experiences?.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      {language === 'en' 
                        ? 'No work experience added yet. Click above to add.'
                        : language === 'ru'
                        ? 'Опыт работы пока не добавлен. Нажмите кнопку выше для добавления.'
                        : 'Hələ ki iş təcrübəsi əlavə olunmayıb. Yuxarıdakı düymə ilə əlavə edin.'}
                    </div>
                  )}

                  <div className="space-y-4">
                    {cvData.experiences?.map((exp, idx) => (
                      <div key={exp.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-slate-800">
                            #{idx + 1} {exp.position || (language === 'en' ? 'Position' : language === 'ru' ? 'Должность' : 'Vəzifə')} — {exp.company || (language === 'en' ? 'Company' : language === 'ru' ? 'Компания' : 'Şirkət')}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveExperience(exp.id)}
                            className="p-1 rounded-md text-red-500 hover:bg-red-100 cursor-pointer"
                            title={language === 'en' ? 'Delete' : language === 'ru' ? 'Удалить' : 'Sil'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">
                              {language === 'en' ? 'Company / Organization' : language === 'ru' ? 'Компания / Организация' : 'Şirkət / Təşkilat'}
                            </label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCvData((prev) => ({
                                  ...prev,
                                  experiences: prev.experiences.map((x) =>
                                    x.id === exp.id ? { ...x, company: val } : x
                                  )
                                }));
                              }}
                              className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">
                              {language === 'en' ? 'Position / Title' : language === 'ru' ? 'Должность' : 'Vəzifə'}
                            </label>
                            <input
                              type="text"
                              value={exp.position}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCvData((prev) => ({
                                  ...prev,
                                  experiences: prev.experiences.map((x) =>
                                    x.id === exp.id ? { ...x, position: val } : x
                                  )
                                }));
                              }}
                              className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">
                              {language === 'en' ? 'Start Date' : language === 'ru' ? 'Дата начала' : 'Başlama Tarixi'}
                            </label>
                            <input
                              type="text"
                              value={exp.startDate}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCvData((prev) => ({
                                  ...prev,
                                  experiences: prev.experiences.map((x) =>
                                    x.id === exp.id ? { ...x, startDate: val } : x
                                  )
                                }));
                              }}
                              placeholder="03.2021"
                              className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="font-semibold text-slate-700">
                                {language === 'en' ? 'End Date' : language === 'ru' ? 'Дата окончания' : 'Bitmə Tarixi'}
                              </label>
                              <label className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={!!exp.current}
                                  onChange={(e) => {
                                    const isCur = e.target.checked;
                                    const presentText = language === 'en' ? 'Present' : language === 'ru' ? 'По настоящее время' : 'İndiyədək';
                                    setCvData((prev) => ({
                                      ...prev,
                                      experiences: prev.experiences.map((x) =>
                                        x.id === exp.id
                                          ? { ...x, current: isCur, endDate: isCur ? presentText : '' }
                                          : x
                                      )
                                    }));
                                  }}
                                  className="w-3 h-3 rounded"
                                />
                                <span>{language === 'en' ? 'Present role' : language === 'ru' ? 'Текущее место' : 'Cari iş yeri'}</span>
                              </label>
                            </div>
                            <input
                              type="text"
                              disabled={exp.current}
                              value={exp.current ? (language === 'en' ? 'Present' : language === 'ru' ? 'По н.в.' : 'İndiyədək') : exp.endDate}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCvData((prev) => ({
                                  ...prev,
                                  experiences: prev.experiences.map((x) =>
                                    x.id === exp.id ? { ...x, endDate: val } : x
                                  )
                                }));
                              }}
                              placeholder="05.2023"
                              className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white disabled:bg-slate-100 disabled:text-slate-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1 text-xs">
                            {language === 'en' 
                              ? 'Key Responsibilities & Achievements (use • for bullets)'
                              : language === 'ru'
                              ? 'Обязанности и достижения (используйте • для списков)'
                              : 'Nailiyyətlər və Vəzifələr (Hər bənd üçün • işarəsi istifadə edin)'}
                          </label>
                          <textarea
                            rows={3}
                            value={exp.description}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCvData((prev) => ({
                                ...prev,
                                experiences: prev.experiences.map((x) =>
                                  x.id === exp.id ? { ...x, description: val } : x
                                )
                              }));
                            }}
                            className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white text-xs leading-relaxed"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. EDUCATION SECTION */}
              {editorSection === 'education' && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">
                        {language === 'en' ? 'Education' : language === 'ru' ? 'Образование' : 'Təhsil Məlumatları'}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {language === 'en' ? 'University degrees and vocational certifications' : language === 'ru' ? 'Высшее и профессиональное образование' : 'Ali və ya orta ixtisas təhsili məlumatları'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddEducation}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Add Education' : language === 'ru' ? 'Добавить образование' : 'Təhsil əlavə et'}</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {cvData.education?.map((edu, idx) => (
                      <div key={edu.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-800">
                            #{idx + 1} {edu.degree} — {edu.institution}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveEducation(edu.id)}
                            className="p-1 rounded-md text-red-500 hover:bg-red-100 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">
                              {language === 'en' ? 'Institution / University' : language === 'ru' ? 'Учебное заведение' : 'Təhsil Müəssisəsi'}
                            </label>
                            <input
                              type="text"
                              value={edu.institution}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCvData((prev) => ({
                                  ...prev,
                                  education: prev.education.map((x) =>
                                    x.id === edu.id ? { ...x, institution: val } : x
                                  )
                                }));
                              }}
                              className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">
                              {language === 'en' ? 'Degree' : language === 'ru' ? 'Степень' : 'Dərəcə'}
                            </label>
                            <input
                              type="text"
                              value={edu.degree}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCvData((prev) => ({
                                  ...prev,
                                  education: prev.education.map((x) =>
                                    x.id === edu.id ? { ...x, degree: val } : x
                                  )
                                }));
                              }}
                              placeholder={language === 'en' ? 'Bachelor / Master' : language === 'ru' ? 'Бакалавр / Магистр' : 'Bakalavr / Magistr'}
                              className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                            />
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">
                              {language === 'en' ? 'Field of Study' : language === 'ru' ? 'Специальность' : 'İxtisas / Fakültə'}
                            </label>
                            <input
                              type="text"
                              value={edu.fieldOfStudy}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCvData((prev) => ({
                                  ...prev,
                                  education: prev.education.map((x) =>
                                    x.id === edu.id ? { ...x, fieldOfStudy: val } : x
                                  )
                                }));
                              }}
                              className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block font-semibold text-slate-700 mb-1">
                                {language === 'en' ? 'Years' : language === 'ru' ? 'Годы' : 'İllər'}
                              </label>
                              <input
                                type="text"
                                value={`${edu.startDate} – ${edu.endDate}`}
                                onChange={(e) => {
                                  const parts = e.target.value.split('–').map((p) => p.trim());
                                  setCvData((prev) => ({
                                    ...prev,
                                    education: prev.education.map((x) =>
                                      x.id === edu.id
                                        ? { ...x, startDate: parts[0] || '', endDate: parts[1] || '' }
                                        : x
                                    )
                                  }));
                                }}
                                placeholder="2016 – 2020"
                                className="w-full px-2 py-1.5 rounded border border-slate-300 bg-white text-[11px]"
                              />
                            </div>
                            <div>
                              <label className="block font-semibold text-slate-700 mb-1">
                                {language === 'en' ? 'GPA' : language === 'ru' ? 'Средний балл (GPA)' : 'GPA (Orta bal)'}
                              </label>
                              <input
                                type="text"
                                value={edu.gpa || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setCvData((prev) => ({
                                    ...prev,
                                    education: prev.education.map((x) =>
                                      x.id === edu.id ? { ...x, gpa: val } : x
                                    )
                                  }));
                                }}
                                placeholder="3.8 / 4.0"
                                className="w-full px-2 py-1.5 rounded border border-slate-300 bg-white text-[11px]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. SKILLS SECTION */}
              {editorSection === 'skills' && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">
                        {language === 'en' ? 'Skills & Competencies' : language === 'ru' ? 'Навыки и компетенции' : 'Bacarıqlar və Kompetensiyalar'}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {language === 'en' ? 'Technical, soft skills, and software proficiency' : language === 'ru' ? 'Технические, гибкие навыки и владение программами' : 'Texniki, fərdi və proqram təminatı səriştələri'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddSkill()}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Add Skill' : language === 'ru' ? 'Добавить навык' : 'Bacarıq əlavə et'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {cvData.skills?.map((skill) => (
                      <div key={skill.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                        <div className="flex-1 space-y-1">
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCvData((prev) => ({
                                ...prev,
                                skills: prev.skills.map((s) => (s.id === skill.id ? { ...s, name: val } : s))
                              }));
                            }}
                            className="w-full font-bold px-2 py-1 rounded border border-slate-200 bg-white text-xs"
                          />
                          <div className="flex items-center gap-2">
                            <select
                              value={skill.level}
                              onChange={(e) => {
                                const val = e.target.value as any;
                                setCvData((prev) => ({
                                  ...prev,
                                  skills: prev.skills.map((s) => (s.id === skill.id ? { ...s, level: val } : s))
                                }));
                              }}
                              className="text-[11px] px-1.5 py-0.5 rounded border border-slate-200 bg-white cursor-pointer"
                            >
                              <option value="Başlanğıc">{language === 'en' ? 'Beginner' : language === 'ru' ? 'Начальный' : 'Başlanğıc'}</option>
                              <option value="Orta">{language === 'en' ? 'Intermediate' : language === 'ru' ? 'Средний' : 'Orta'}</option>
                              <option value="Yaxşı">{language === 'en' ? 'Advanced' : language === 'ru' ? 'Продвинутый' : 'Yaxşı'}</option>
                              <option value="Əla / Ekspert">{language === 'en' ? 'Expert' : language === 'ru' ? 'Эксперт' : 'Əla / Ekspert'}</option>
                            </select>

                            <select
                              value={skill.category}
                              onChange={(e) => {
                                const val = e.target.value as any;
                                setCvData((prev) => ({
                                  ...prev,
                                  skills: prev.skills.map((s) => (s.id === skill.id ? { ...s, category: val } : s))
                                }));
                              }}
                              className="text-[11px] px-1.5 py-0.5 rounded border border-slate-200 bg-white cursor-pointer"
                            >
                              <option value="Texniki">{language === 'en' ? 'Technical' : language === 'ru' ? 'Технический' : 'Texniki'}</option>
                              <option value="Soft skill">{language === 'en' ? 'Soft Skill' : language === 'ru' ? 'Soft Skill' : 'Soft skill'}</option>
                              <option value="Alət / Proqram">{language === 'en' ? 'Tool / Software' : language === 'ru' ? 'Инструмент / ПО' : 'Alət / Proqram'}</option>
                            </select>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill.id)}
                          className="p-1 rounded text-red-500 hover:bg-red-100 cursor-pointer"
                          title={language === 'en' ? 'Delete' : language === 'ru' ? 'Удалить' : 'Sil'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. LANGUAGES SECTION */}
              {editorSection === 'languages' && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">
                        {language === 'en' ? 'Languages' : language === 'ru' ? 'Языки' : 'Xarici Dillər'}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {language === 'en' ? 'Indicate your proficiency level for each language' : language === 'ru' ? 'Укажите языки и уровень владения' : 'Bilik səviyyəsi ilə birlikdə qeyd edin'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddLanguage}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Add Language' : language === 'ru' ? 'Добавить язык' : 'Dil əlavə et'}</span>
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    {cvData.languages?.map((lang) => (
                      <div key={lang.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder={language === 'en' ? 'Language name (e.g. English, French)' : language === 'ru' ? 'Название языка (напр: Английский)' : 'Dilin adı (məs: İngilis, Rus)'}
                            value={lang.language || (lang as any).name || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCvData((prev) => ({
                                ...prev,
                                languages: prev.languages.map((l) =>
                                  l.id === lang.id ? { ...l, language: val, name: val } : l
                                )
                              }));
                            }}
                            className="px-2.5 py-1.5 rounded border border-slate-300 bg-white font-medium"
                          />
                          <input
                            type="text"
                            placeholder={language === 'en' ? 'Proficiency (e.g. C1-C2, Fluent, Native)' : language === 'ru' ? 'Уровень (напр: C1-C2, Свободный)' : 'Səviyyə (məs: C1-C2, Sərbəst, Fluent)'}
                            value={lang.proficiency || (lang as any).level || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCvData((prev) => ({
                                ...prev,
                                languages: prev.languages.map((l) =>
                                  l.id === lang.id ? { ...l, proficiency: val, level: val } : l
                                )
                              }));
                            }}
                            className="px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                            list={`proficiency-suggestions-${lang.id}`}
                          />
                          <datalist id={`proficiency-suggestions-${lang.id}`}>
                            <option value="Ana dili" />
                            <option value="C1-C2 (Sərbəst)" />
                            <option value="B1-B2 (Orta/İşgüzar)" />
                            <option value="A1-A2 (Başlanğıc)" />
                            <option value="Native / Bilingual" />
                            <option value="Fluent (C1-C2)" />
                            <option value="Professional Working (B1-B2)" />
                            <option value="Elementary (A1-A2)" />
                            <option value="Родной язык" />
                            <option value="Свободно (C1-C2)" />
                            <option value="Деловой (B1-B2)" />
                            <option value="Базовый (A1-A2)" />
                            <option value="Ana Dil" />
                            <option value="İleri Düzey (C1-C2)" />
                            <option value="Orta Düzey (B1-B2)" />
                            <option value="Temel Düzey (A1-A2)" />
                          </datalist>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveLanguage(lang.id)}
                          className="p-1 rounded text-red-500 hover:bg-red-100 cursor-pointer"
                          title={language === 'en' ? 'Delete' : language === 'ru' ? 'Удалить' : 'Sil'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. PROJECTS SECTION */}
              {editorSection === 'projects' && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">
                        {language === 'en' ? 'Portfolio & Projects' : language === 'ru' ? 'Портфолио и проекты' : 'Portfolio & Layihələr'}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {language === 'en' ? 'Key projects you built or contributed to' : language === 'ru' ? 'Ключевые проекты, в которых вы участвовали' : 'İştirak etdiyiniz əsas layihələr'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddProject}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Add Project' : language === 'ru' ? 'Добавить проект' : 'Layihə əlavə et'}</span>
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    {cvData.projects?.map((proj) => (
                      <div key={proj.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <input
                            type="text"
                            value={proj.title}
                            placeholder={language === 'en' ? 'Project Title' : language === 'ru' ? 'Название проекта' : 'Layihənin adı'}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCvData((prev) => ({
                                ...prev,
                                projects: (prev.projects || []).map((p) =>
                                  p.id === proj.id ? { ...p, title: val } : p
                                )
                              }));
                            }}
                            className="font-bold px-2 py-1 rounded border border-slate-300 bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveProject(proj.id)}
                            className="p-1 rounded text-red-500 hover:bg-red-100 cursor-pointer"
                            title={language === 'en' ? 'Delete' : language === 'ru' ? 'Удалить' : 'Sil'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={proj.link || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCvData((prev) => ({
                              ...prev,
                              projects: (prev.projects || []).map((p) =>
                                p.id === proj.id ? { ...p, link: val } : p
                              )
                            }));
                          }}
                          placeholder={language === 'en' ? 'https://project-link.com' : 'https://layihe-linki.az'}
                          className="w-full px-2 py-1 rounded border border-slate-300 bg-white text-[11px]"
                        />
                        <textarea
                          rows={2}
                          value={proj.description}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCvData((prev) => ({
                              ...prev,
                              projects: (prev.projects || []).map((p) =>
                                p.id === proj.id ? { ...p, description: val } : p
                              )
                            }));
                          }}
                          className="w-full px-2 py-1 rounded border border-slate-300 bg-white text-xs"
                          placeholder={language === 'en' ? 'Short project description, tech stack, and results...' : language === 'ru' ? 'Краткое описание проекта, стек и результаты...' : 'Layihə haqqında qısa məlumat...'}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. CERTIFICATES SECTION */}
              {editorSection === 'certificates' && (
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">
                        {language === 'en' ? 'Certificates & Licenses' : language === 'ru' ? 'Сертификаты и дипломы' : 'Sertifikatlar'}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {language === 'en' ? 'International and professional certifications' : language === 'ru' ? 'Международные и профессиональные сертификаты' : 'Beynəlxalq və yerli peşəkar sertifikatlar'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCertificate}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Add Certificate' : language === 'ru' ? 'Добавить сертификат' : 'Sertifikat əlavə et'}</span>
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    {cvData.certificates?.map((cert) => (
                      <div key={cert.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCvData((prev) => ({
                                ...prev,
                                certificates: (prev.certificates || []).map((c) =>
                                  c.id === cert.id ? { ...c, name: val } : c
                                )
                              }));
                            }}
                            placeholder={language === 'en' ? 'Certificate Name' : language === 'ru' ? 'Название сертификата' : 'Sertifikat adı'}
                            className="px-2 py-1 rounded border border-slate-300 bg-white font-medium"
                          />
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCvData((prev) => ({
                                ...prev,
                                certificates: (prev.certificates || []).map((c) =>
                                  c.id === cert.id ? { ...c, issuer: val } : c
                                )
                              }));
                            }}
                            placeholder={language === 'en' ? 'Issuing Organization' : language === 'ru' ? 'Организация' : 'Təşkilat'}
                            className="px-2 py-1 rounded border border-slate-300 bg-white"
                          />
                          <input
                            type="text"
                            value={cert.issueDate}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCvData((prev) => ({
                                ...prev,
                                certificates: (prev.certificates || []).map((c) =>
                                  c.id === cert.id ? { ...c, issueDate: val } : c
                                )
                              }));
                            }}
                            placeholder={language === 'en' ? 'Year (e.g. 2024)' : language === 'ru' ? 'Год (напр: 2024)' : 'İl (məs: 2023)'}
                            className="px-2 py-1 rounded border border-slate-300 bg-white"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveCertificate(cert.id)}
                          className="p-1 rounded text-red-500 hover:bg-red-100 cursor-pointer"
                          title={language === 'en' ? 'Delete' : language === 'ru' ? 'Удалить' : 'Sil'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Live Sticky Document Preview (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 space-y-3">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      {language === 'en' ? 'Live Preview' : language === 'ru' ? 'Живой предпросмотр' : 'Canlı Önbaxış'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      ({currentTemplateMeta.name})
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{language === 'en' ? 'View full screen' : language === 'ru' ? 'Во весь экран' : 'Tam ekrana bax'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Scaled Preview Frame */}
                <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 overflow-hidden shadow-inner max-h-[calc(100vh-220px)] overflow-y-auto">
                  <div className="origin-top scale-[0.55] sm:scale-[0.65] -mb-[40%] transition-transform">
                    <CVRenderer
                      data={cvData}
                      template={selectedTemplate}
                      showPhoto={showPhoto}
                      id="cv-live-creator-preview"
                    />
                  </div>
                </div>

                {/* Clean Minimalism Pro Tip Callout */}
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <p className="text-xs font-semibold text-indigo-700 uppercase mb-1">
                    {language === 'en' ? 'Pro Tip' : language === 'ru' ? 'Совет' : 'Faydalı Məsləhət'}
                  </p>
                  <p className="text-xs text-indigo-600 leading-relaxed">
                    {language === 'en' 
                      ? 'Use bullet points for your experience to make it scannable for recruiters.'
                      : language === 'ru'
                      ? 'Используйте маркеры для опыта работы, чтобы рекрутерам было легче читать.'
                      : 'Təcrübənizdə bəndlərdən (bullet points) istifadə edin ki, işəgötürənlər üçün oxunaqlı olsun.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FULL LIVE PREVIEW & EXPORT VIEW */}
        {activeTab === 'preview' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  {dict.cvPreview?.title || 'CV Önbaxışı'} ({currentTemplateMeta.name})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {dict.cvPreview?.subtitle || 'CV birbaşa A4 formatında tərtib olunub. "PDF Endir" düyməsi ilə dərhal yükləyə bilərsiniz.'}
                </p>
              </div>

              {/* Action Buttons & Zoom Bar */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Responsive Zoom Controls */}
                <div className="flex items-center bg-slate-100/90 rounded-xl p-0.5 border border-slate-200 shrink-0">
                  <button
                    type="button"
                    onClick={() => setPreviewScale((s) => Math.max(0.35, parseFloat((s - 0.1).toFixed(2))))}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
                    title={dict.cvPreview?.zoomOut || 'Kiçilt'}
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 text-[11px] font-bold text-slate-700 min-w-[42px] text-center select-none">
                    {Math.round(previewScale * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewScale((s) => Math.min(1.4, parseFloat((s + 0.1).toFixed(2))))}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
                    title={dict.cvPreview?.zoomIn || 'Böyüt'}
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        const fit = Math.min(1, Math.max(0.35, (window.innerWidth - 48) / 820));
                        setPreviewScale(parseFloat(fit.toFixed(2)));
                      }
                    }}
                    className="px-2 py-1 rounded-lg text-[10px] font-bold text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer ml-0.5"
                    title={dict.cvPreview?.fitToScreen || 'Ekrana Uyğunlaşdır'}
                  >
                    {dict.cvPreview?.fitToScreen || 'Fit'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('templates')}
                  className="px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shrink-0 cursor-pointer shadow-2xs"
                >
                  {dict.cvPreview?.changeTemplate || 'Şablonu dəyiş'}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={isDownloadingPdf}
                  className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-lg shadow-indigo-100 cursor-pointer shrink-0 transition-all"
                >
                  {isDownloadingPdf ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{pdfProgressText || dict.cvPreview?.preparingPdf || 'PDF hazırlanır...'}</span>
                    </>
                  ) : (
                    <>
                      <FileDown className="w-4 h-4" />
                      <span>{dict.cvPreview?.downloadPdf || 'PDF Kimi Endir'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {language === 'en' ? 'A4 Document Canvas' : language === 'ru' ? 'Холст документа А4' : 'A4 Sənəd Kətanı'}
              </span>
              <p className="text-[10px] text-slate-400 text-right">
                Overlapping data issues resolved in PDF export engine v2.1
              </p>
            </div>

            {/* Target Element for Live Rendering and PDF Export with responsive scaling */}
            <div className="bg-slate-100 p-2 sm:p-6 rounded-2xl border border-slate-200 flex justify-center overflow-x-auto shadow-inner min-h-[500px]">
              <div 
                className="transition-transform duration-150 origin-top flex justify-center"
                style={{
                  transform: `scale(${previewScale})`,
                  width: `${820 * previewScale}px`,
                  height: `${1160 * previewScale}px`,
                }}
              >
                <div className="w-[820px] shadow-xl rounded-xl overflow-hidden bg-white shrink-0">
                  <CVRenderer
                    data={cvData}
                    template={selectedTemplate}
                    showPhoto={showPhoto}
                    id="cv-live-creator-fullpreview"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Pristine, unscaled export container for flawless high-DPI PDF generation */}
      <div
        aria-hidden="true"
        className="fixed -left-[10000px] top-0 w-[820px] pointer-events-none z-[-9999] overflow-visible bg-white"
        style={{ transform: 'none' }}
      >
        <CVRenderer
          data={cvData}
          template={selectedTemplate}
          showPhoto={showPhoto}
          id="cv-live-creator-export"
        />
      </div>

      {/* ========================================================================= */}
      {/* AI AUTO-GENERATION MODAL */}
      {/* ========================================================================= */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-slate-900 p-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-white/10 backdrop-blur-xs">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base">
                      {language === 'en' ? 'AI Automatic CV Generator' : language === 'ru' ? 'Автоматическое создание резюме с ИИ' : 'Süni İntellekt (AI) ilə Avtomatik CV Yarat'}
                    </h3>
                    <p className="text-xs text-purple-200 mt-0.5">
                      {language === 'en' ? 'Enter target job title, AI will craft a complete professional CV in seconds' : language === 'ru' ? 'Введите должность, и ИИ составит профессиональное резюме за секунды' : 'Vəzifəni daxil edin, AI bütün CV-ni saniyələr içində tərtib etsin'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAiModalOpen(false)}
                  disabled={isAiGenerating}
                  className="p-1 rounded-lg text-white/80 hover:bg-white/20 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              {aiSuccessMessage ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center font-bold space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <div>{aiSuccessMessage}</div>
                  <div className="text-[11px] text-emerald-600 font-normal">
                    {language === 'en' ? 'Closing modal and redirecting to preview...' : language === 'ru' ? 'Окно закрывается, переход к предпросмотру...' : 'Pəncərə bağlanır və önbaxışa yönləndirilirsiniz...'}
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      {language === 'en' ? 'Target Position / Job Title *' : language === 'ru' ? 'Для какой должности составить резюме? *' : 'Hansı vəzifə üçün CV yaradılsın? *'}
                    </label>
                    <input
                      type="text"
                      value={aiJobTitle}
                      onChange={(e) => setAiJobTitle(e.target.value)}
                      placeholder={language === 'en' ? 'e.g. Senior Frontend Developer, Chief Accountant, HR Manager' : language === 'ru' ? 'Напр: Senior Frontend Developer, Главный бухгалтер, HR-менеджер' : 'Məs: Senior Frontend Developer, Baş Mühasib, HR Menecer'}
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-medium text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        {language === 'en' ? 'Experience Level' : language === 'ru' ? 'Уровень опыта' : 'Təcrübə Səviyyəsi'}
                      </label>
                      <select
                        value={aiExperienceLevel}
                        onChange={(e) => setAiExperienceLevel(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium cursor-pointer"
                      >
                        <option value="junior">{language === 'en' ? 'Junior (1-2 yrs)' : language === 'ru' ? 'Junior (1-2 года)' : 'Junior (1-2 il)'}</option>
                        <option value="mid">{language === 'en' ? 'Mid-level (3-5 yrs)' : language === 'ru' ? 'Mid-level (3-5 лет)' : 'Mid-level (3-5 il)'}</option>
                        <option value="senior">{language === 'en' ? 'Senior (5-8 yrs)' : language === 'ru' ? 'Senior (5-8 лет)' : 'Senior (5-8 il)'}</option>
                        <option value="lead">{language === 'en' ? 'Team Lead / Executive (8+ yrs)' : language === 'ru' ? 'Team Lead / Руководитель (8+ лет)' : 'Team Lead / Rəhbər (8+ il)'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        {language === 'en' ? 'Candidate Full Name' : language === 'ru' ? 'Имя и фамилия кандидата' : 'Namizədin Adı & Soyadı'}
                      </label>
                      <input
                        type="text"
                        value={aiFullName}
                        onChange={(e) => setAiFullName(e.target.value)}
                        placeholder={language === 'en' ? 'John Doe' : language === 'ru' ? 'Иван Иванов' : 'Əli Məmmədov'}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      {language === 'en' ? 'City / Country' : language === 'ru' ? 'Город / Страна' : 'Şəhər / Region'}
                    </label>
                    <input
                      type="text"
                      value={aiCity}
                      onChange={(e) => setAiCity(e.target.value)}
                      placeholder={language === 'en' ? 'Baku, Azerbaijan' : language === 'ru' ? 'Баку, Азербайджан' : 'Bakı, Azərbaycan'}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      {language === 'en' ? 'Key skills or notes (Optional)' : language === 'ru' ? 'Ключевые навыки или заметки (Опционально)' : 'Xüsusi qeydlər və ya əsas bacarıqlar (İstəyə görə)'}
                    </label>
                    <textarea
                      rows={2}
                      value={aiSkillsHint}
                      onChange={(e) => setAiSkillsHint(e.target.value)}
                      placeholder={language === 'en' ? 'e.g. Fintech experience, React, Redux, Docker, AWS' : language === 'ru' ? 'Напр: Финтех опыт, React, Redux, Docker, AWS' : 'Məs: PASHA Bank təcrübəsi, React, Redux, Docker bilikləri'}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-normal"
                    />
                  </div>

                  {/* Preset Quick Chips */}
                  <div className="pt-1">
                    <span className="text-[11px] text-slate-500 block mb-1.5 font-semibold">
                      {language === 'en' ? 'Quick Suggestions:' : language === 'ru' ? 'Быстрый выбор:' : 'Sürətli seçimlər:'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Senior Frontend Developer',
                        'Rəqəmsal Marketinq Meneceri',
                        'Baş Mühasib / Maliyyəçi',
                        'İnsan Resursları (HR) Mütəxəssisi',
                        'Python & Data Analitik'
                      ].map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => setAiJobTitle(chip)}
                          className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-purple-100 hover:text-purple-900 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          + {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                disabled={isAiGenerating}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs cursor-pointer"
              >
                {language === 'en' ? 'Cancel' : language === 'ru' ? 'Отмена' : 'İmtina'}
              </button>
              <button
                type="button"
                onClick={handleGenerateFullCV}
                disabled={isAiGenerating || !!aiSuccessMessage}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-xs inline-flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isAiGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{language === 'en' ? 'AI generating CV...' : language === 'ru' ? 'ИИ составляет резюме...' : 'AI CV-ni tərtib edir...'}</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>{language === 'en' ? 'Generate Full CV' : language === 'ru' ? 'Сгенерировать резюме полностью' : 'CV-ni Tam Generasiya Et'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All CV Data Confirmation Modal */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4 shadow-2xs">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
              {language === 'en' ? 'Clear All CV Data?' : language === 'ru' ? 'Очистить все данные резюме?' : 'Bütün Məlumatları Təmizləmək İstəyirsiniz?'}
            </h3>
            <p className="text-xs text-slate-600 text-center leading-relaxed mb-6">
              {language === 'en'
                ? 'This action will reset all experience, education, skills, and personal information, creating a blank CV. Local storage cache will also be cleared.'
                : language === 'ru'
                ? 'Это действие сбросит весь опыт работы, образование, навыки и личную информацию. Локальный кэш также будет очищен.'
                : 'Bu əməliyyat daxil etdiyiniz bütün iş təcrübələrini, təhsilləri, bacarıqları və şəxsi məlumatları sıfırlayacaq və yeni boş CV vərəqi açacaq. Kompüterinizdəki keş məlumatları da təmizlənəcək.'}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsClearModalOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                {language === 'en' ? 'Cancel' : language === 'ru' ? 'Отмена' : 'İmtina'}
              </button>
              <button
                type="button"
                onClick={handleClearAllData}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                {language === 'en' ? 'Yes, Clear' : language === 'ru' ? 'Да, очистить' : 'Bəli, Təmizlə'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Save Data Notification Toast */}
      {saveSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-emerald-700 animate-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <div className="font-bold text-white">
              {language === 'en' ? 'Data saved to browser cache!' : language === 'ru' ? 'Данные сохранены в браузере!' : 'Məlumatlar brauzer keşində saxlanıldı!'}
            </div>
            <div className="text-emerald-200 text-[11px]">
              {language === 'en' ? 'Saved securely on this computer even if offline.' : language === 'ru' ? 'Сохранено на этом компьютере даже без интернета.' : 'İnternet kəsilsə belə bu kompüterdə saxlanacaq.'}
            </div>
          </div>
        </div>
      )}

      {/* Floating Clear Data Notification Toast */}
      {clearSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-4">
          <Trash2 className="w-5 h-5 text-rose-400 shrink-0" />
          <div className="text-xs">
            <div className="font-bold text-white">
              {language === 'en' ? 'All CV data cleared' : language === 'ru' ? 'Все данные очищены' : 'Bütün məlumatlar təmizləndi'}
            </div>
            <div className="text-slate-300 text-[11px]">
              {language === 'en' ? 'A new blank CV has been prepared.' : language === 'ru' ? 'Создан новый чистый лист резюме.' : 'Yeni və təmiz boş CV vərəqi yaradıldı.'}
            </div>
          </div>
        </div>
      )}

      {/* Floating Demo Loaded Toast */}
      {demoLoadedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-blue-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-blue-700 animate-in slide-in-from-bottom-4">
          <Sparkles className="w-5 h-5 text-blue-300 shrink-0" />
          <div className="text-xs">
            <div className="font-bold text-white">
              {language === 'en' ? 'Sample data loaded' : language === 'ru' ? 'Пример резюме загружен' : 'Nümunə məlumatlar yükləndi'}
            </div>
            <div className="text-blue-200 text-[11px]">
              {language === 'en' ? 'You can now customize each section freely.' : language === 'ru' ? 'Вы можете свободно редактировать любые поля.' : 'İstədiyiniz sahələri sərbəst redaktə edə bilərsiniz.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
