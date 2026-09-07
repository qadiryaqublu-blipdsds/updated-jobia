import { CVData, Vacancy } from '../types';

export interface ATSKeywordMatch {
  keyword: string;
  count: number;
  countInCV?: number;
  densityPercent?: number;
  densityStatus: 'optimal' | 'low' | 'high' | 'missing' | 'stuffing';
  importance: 'Kritik' | 'Vacib' | 'Əlavə' | string;
  category: string;
  targetDensityRange?: string;
  foundInSections?: string[];
  recommendation?: string;
  [key: string]: any;
}

export interface ATSFormattingCheck {
  id: string;
  title: string;
  category: string;
  status: 'passed' | 'warning' | 'failed' | 'pass' | 'fail';
  description: string;
  impact: string;
  fixSuggestion: string;
  message?: string;
  details?: string;
  howToFix?: string;
  [key: string]: any;
}

export interface ATSOptimizationAnalysis {
  overallAtsScore: number;
  targetJobTitle: string;
  targetCompany?: string;
  atsRankScore?: number;
  matchedKeywordsCount?: number;
  totalKeywordsCount?: number;
  keywordMatchRate?: number;
  potentialScoreBoost?: number;
  potentialMaxScore?: number;
  rankingTier?: string;
  totalWordCount?: number;
  passedChecksCount?: number;
  totalChecksCount?: number;
  highPrioritySuggestions?: Array<{ title?: string; description?: string; impact?: string; [key: string]: any }>;
  atsPlainTextView?: string;
  keywords: ATSKeywordMatch[];
  formattingChecks: ATSFormattingCheck[];
  parsedSummary: {
    wordCount: number;
    sectionCount: number;
    hasMetrics: boolean;
  };
  rawExtractedText?: string;
  [key: string]: any;
}

/**
 * Extracts all plain text from CV data structure for parsing and density analysis.
 */
export function extractCVPlainText(cv: CVData): string {
  const parts: string[] = [];
  if (cv.personalInfo) {
    parts.push(cv.personalInfo.fullName || '');
    parts.push(cv.personalInfo.jobTitle || '');
    parts.push(cv.personalInfo.summary || '');
    parts.push(cv.personalInfo.city || '');
  }
  (cv.experiences || []).forEach((exp) => {
    parts.push(exp.position || '');
    parts.push(exp.company || '');
    parts.push(exp.description || '');
    (exp.achievements || []).forEach((ach) => parts.push(ach));
  });
  (cv.education || []).forEach((edu) => {
    parts.push(edu.institution || '');
    parts.push(edu.degree || '');
    parts.push(edu.field || '');
  });
  (cv.skills || []).forEach((sk) => parts.push(sk.name || ''));
  (cv.languages || []).forEach((l) => parts.push(l.language || ''));
  (cv.projects || []).forEach((p) => {
    parts.push(p.title || '');
    parts.push(p.description || '');
    (p.technologies || []).forEach((t) => parts.push(t));
  });
  (cv.certificates || []).forEach((c) => parts.push(c.name || ''));
  return parts.join(' ');
}

export function analyzeCVForATS(
  cvData: CVData,
  targetVacancy?: Vacancy | null,
  customText?: string
): ATSOptimizationAnalysis {
  const fullText = (customText ? customText + ' ' : '') + extractCVPlainText(cvData);
  const lowerFullText = fullText.toLowerCase();

  const targetJobTitle =
    targetVacancy?.title ||
    cvData.personalInfo?.jobTitle ||
    'Mütəxəssis';

  // Extract keywords from vacancy or standard industry keywords
  const rawKeywords = targetVacancy?.skills?.length
    ? targetVacancy.skills
    : ['React', 'TypeScript', 'Tailwind', 'JavaScript', 'Git', 'Agile', 'Komanda', 'Optimizasiya', 'Layihə İdarəetməsi'];

  const keywords: ATSKeywordMatch[] = rawKeywords.map((kw, idx) => {
    const kwLower = kw.toLowerCase();
    // Count occurrences
    const regex = new RegExp(`\\b${kwLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = lowerFullText.match(regex);
    const count = matches ? matches.length : 0;

    let densityStatus: ATSKeywordMatch['densityStatus'] = 'missing';
    if (count >= 2 && count <= 6) {
      densityStatus = 'optimal';
    } else if (count === 1) {
      densityStatus = 'low';
    } else if (count > 6) {
      densityStatus = 'high';
    }

    const importance: ATSKeywordMatch['importance'] =
      idx < 3 ? 'Kritik' : idx < 6 ? 'Vacib' : 'Əlavə';

    return {
      keyword: kw,
      count,
      densityStatus,
      importance,
      category: 'Texniki Bacarıq',
      recommendation:
        densityStatus === 'missing'
          ? `Bu açar söz CV-də tapılmadı. Təcrübə və ya bacarıq bölmənizə əlavə edin.`
          : densityStatus === 'optimal'
          ? `Əla! Açar söz optimal sayda istifadə olunub.`
          : densityStatus === 'low'
          ? `Açar söz cəmi 1 dəfə qeyd olunub. 1-2 fərqli layihədə də təkrar etmək tövsiyə olunur.`
          : `Açar söz normadan çox təkrarlanır (${count} dəfə). Spamlama kimi görünməməsi üçün azaldın.`,
    };
  });

  // Formatting & ATS parser checks
  const formattingChecks: ATSFormattingCheck[] = [
    {
      id: 'contact_info',
      title: 'Əlaqə Məlumatlarının Tamlığı',
      category: 'Əsas Məlumat',
      status:
        cvData.personalInfo?.email && cvData.personalInfo?.phone && cvData.personalInfo?.fullName
          ? 'passed'
          : 'failed',
      description: 'ATS botları tərəfindən namizədə dərhal zəng və ya email çatması üçün mütləqdir.',
      impact: 'Yüksək',
      fixSuggestion: 'Email, telefon və şəhər məlumatlarını dəqiq qeyd edin.',
    },
    {
      id: 'summary_section',
      title: 'Peşəkar Xülasə (Summary) Mövcudluğu',
      category: 'Məzmun',
      status: (cvData.personalInfo?.summary || '').trim().length >= 50 ? 'passed' : 'warning',
      description: '1-3 cümləlik hədəf və ixtisas profili mətni ATS sıralamasında 15% çəkiyə malikdir.',
      impact: 'Orta',
      fixSuggestion: 'Haqqınızda ən azı 50 simvoldan ibarət xülasə qeyd edin.',
    },
    {
      id: 'measurable_metrics',
      title: 'Ölçülə Bilən Nəticələr (% və Rəqəmlər)',
      category: 'Təcrübə',
      status:
        /\d+%|\d+\s*(AZN|\$|nəfər|istifadəçi|qat)/i.test(fullText) ? 'passed' : 'warning',
      description: 'Məsuliyyətlər yerinə faizlər, rəqəmlər və ölçülən nəticələr yazılmalıdır.',
      impact: 'Kritik',
      fixSuggestion: 'Təcrübə bəndlərinə faiz (%) və kəmiyyət göstəriciləri əlavə edin.',
    },
    {
      id: 'experience_chronology',
      title: 'Təcrübə və Vəzifə Ardıcıllığı',
      category: 'Xronologiya',
      status: (cvData.experiences || []).length > 0 ? 'passed' : 'failed',
      description: 'Təcrübə tarixləri və şirkət adları aydın və xronoloji olmalıdır.',
      impact: 'Yüksək',
      fixSuggestion: 'Ən azı 1 iş təcrübəsi və başlama-bitmə tarixlərini qeyd edin.',
    },
    {
      id: 'skills_count',
      title: 'Strukturlaşdırılmış Bacarıqlar Siyahısı',
      category: 'Bacarıqlar',
      status: (cvData.skills || []).length >= 5 ? 'passed' : 'warning',
      description: 'Ən azı 5 əsas bacarıq ATS alqoritmləri tərəfindən avtomatik indekslənir.',
      impact: 'Yüksək',
      fixSuggestion: 'İxtisasınıza uyğun ən azı 5 əsas bacarıq daxil edin.',
    },
  ];

  // Calculate overall ATS score
  const matchedCount = keywords.filter((k) => k.densityStatus !== 'missing').length;
  const keywordRatio = keywords.length > 0 ? matchedCount / keywords.length : 0.8;
  const passedChecks = formattingChecks.filter((c) => c.status === 'passed').length;
  const formatRatio = passedChecks / formattingChecks.length;

  const rawScore = Math.round(keywordRatio * 50 + formatRatio * 50);
  const overallAtsScore = Math.max(20, Math.min(99, rawScore));

  const words = fullText.split(/\s+/).filter(Boolean);
  const hasMetrics = /\d+%|\d+\s*(AZN|\$|nəfər|istifadəçi)/i.test(fullText);

  return {
    overallAtsScore,
    targetJobTitle,
    keywords,
    formattingChecks,
    parsedSummary: {
      wordCount: words.length,
      sectionCount: 6,
      hasMetrics,
    },
    rawExtractedText: fullText,
  };
}
