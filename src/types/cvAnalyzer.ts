export type CVLanguage = 'az' | 'en' | 'ru' | 'tr';

export interface CVPersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary?: string;
}

export interface CVWorkExperience {
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location?: string;
  responsibilities: string[];
  achievements?: string[];
  technologies?: string[];
}

export interface CVEducation {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  gpa?: string;
}

export interface ExplicitSkills {
  technical: string[];
  soft: string[];
  tools: string[];
  languages: string[];
}

export interface CVSkills {
  categories: {
    name: string;
    skills: string[];
  }[];
  allSkills: string[];
  explicitSkills?: ExplicitSkills;
}

export interface CVCertification {
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface CVProject {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface RedFlag {
  type: 'gap' | 'formatting' | 'typo' | 'vagueness' | 'inconsistency' | string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  location?: string;
  recommendation: string;
}

export interface DeterministicScoreItem {
  name: string;
  score: number;
  weight: number;
  maxScore: number;
  details: string;
  passed: boolean;
}

export interface DeterministicATSScore {
  overallScore: number;
  breakdown: DeterministicScoreItem[];
  verdict: 'Excellent' | 'Good' | 'Fair' | 'Poor' | string;
}

export interface ATSAnalysis {
  parseabilityScore: number;
  keywordMatchScore?: number;
  formattingScore: number;
  sectionsDetected: string[];
  missingCriticalSections: string[];
  formattingIssues: string[];
  recommendations: string[];
}

export interface QualityAnalysis {
  contentScore: number;
  impactScore: number;
  brevityScore: number;
  starMethodScore: number;
  actionVerbsCount: number;
  quantifiableMetricsCount: number;
  bulletQualityScore: number;
  critique: string;
}

export interface CareerTimelineGap {
  startDate: string;
  endDate: string;
  durationMonths: number;
  explanationNeeded: boolean;
}

export interface CareerTimeline {
  totalYearsExperience: number;
  averageTenureMonths: number;
  gaps: CareerTimelineGap[];
  progressionTrajectory: 'Rapid' | 'Steady' | 'Lateral' | 'Entry';
}

export interface JobMatchRequirementItem {
  requirement: string;
  category: 'must-have' | 'nice-to-have' | 'soft-skill';
  matched: boolean;
  confidence: number;
  evidence?: string;
}

export interface KeywordAnalysis {
  matchingKeywords: string[];
  missingKeywords: string[];
  frequencyMap: Record<string, number>;
  keywordDensity: number;
}

export interface AchievementAnalysis {
  strongAchievements: string[];
  weakBullets: string[];
  improvedVersions: { original: string; improved: string; reason: string }[];
}

export interface ExperienceRelevanceItem {
  position: string;
  company: string;
  relevanceScore: number;
  rationale: string;
}

export interface EvidenceReferenceItem {
  claim: string;
  evidence: string;
  section: string;
  verified: boolean;
}

export interface JobMatchAnalysis {
  matchScore: number;
  matchedRequirements: JobMatchRequirementItem[];
  missingRequirements: JobMatchRequirementItem[];
  keywords: KeywordAnalysis;
  fitAssessment: string;
}

export interface JobMatchingProfile {
  targetRole: string;
  seniorityTier: string;
  estimatedMarketSalaryMin: number;
  estimatedMarketSalaryMax: number;
  currency: string;
  recommendedCertifications: string[];
  targetIndustries: string[];
}

export interface CandidateProfileResult {
  personalInfo: CVPersonalInfo;
  experiences: CVWorkExperience[];
  education: CVEducation[];
  skills: CVSkills;
  certifications: CVCertification[];
  projects: CVProject[];
  languages: { language: string; level: string }[];
}

export interface CVAnalyzerResult {
  id: string;
  createdAt: string;
  candidateProfile: CandidateProfileResult;
  atsScore: DeterministicATSScore;
  atsAnalysis: ATSAnalysis;
  qualityAnalysis: QualityAnalysis;
  careerTimeline: CareerTimeline;
  redFlags: RedFlag[];
  jobMatch?: JobMatchAnalysis;
  careerMatchingProfile?: JobMatchingProfile;
  achievements?: AchievementAnalysis;
  executiveSummary: string;
}
