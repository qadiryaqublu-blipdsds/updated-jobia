import React, { useState } from 'react';
import { SAMPLE_CANDIDATE_CV } from '../../../data/mockData';
import { analyzeCVForATS } from '../../../utils/atsOptimizer';
import { ATSCheckList, BulletImprovement, CVAnalysisResult } from '../../../types';
import { ATSChecklistCard } from '../ATSChecklistCard';
import { BulletImprovementsCard } from '../BulletImprovementsCard';
import { CareerValuationSummaryCard } from '../CareerValuationSummaryCard';
import { Sparkles, FileText, Upload, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';

export const DeepCVAnalyzerView: React.FC = () => {
  const [cvData, setCvData] = useState(SAMPLE_CANDIDATE_CV);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const atsAnalysis = analyzeCVForATS(cvData);

  const atsChecks: ATSCheckList = {
    hasContactInfo: !!(cvData.personalInfo?.email && cvData.personalInfo?.phone),
    hasSummary: !!cvData.personalInfo?.summary && cvData.personalInfo.summary.length > 20,
    hasClearSections: (cvData.experiences?.length || 0) > 0 && (cvData.education?.length || 0) > 0,
    hasQuantifiableResults: atsAnalysis.parsedSummary.hasMetrics,
  };

  const improvements: BulletImprovement[] = [
    {
      original: 'Müştərilərlə əlaqələrin idarə olunması və sorğuların cavablandırılması.',
      improved: 'Aylıq 200+ müştəri sorğusunu cavablandıraraq müştəri məmnuniyyətini (CSAT) 94%-ə çatdırmışam.',
      reason: 'Ölçülə bilən rəqəm və KPI əlavə edildi.',
    },
    {
      original: 'Komanda daxilində layihələrin icrasında iştirak etmək.',
      improved: '5 nəfərlik komanda ilə 3 əsas rəqəmsal layihəni vaxtından əvvəl uğurla təhvil vermişəm.',
      reason: 'Komanda ölçüsü və dəqiq icra nəticəsi vurğulandı.',
    },
    {
      original: 'Yeni sistem və tətbiqlərin test edilməsi prosesinə dəstək vermək.',
      improved: '150+ test ssenarisi hazırlayaraq prodakşn xətalarını 35% azaltmışam.',
      reason: 'Nəticəyönümlü açar feillər və faiz təsiri qeyd edildi.',
    },
  ];

  const analysisResult: CVAnalysisResult = {
    overallScore: atsAnalysis.overallAtsScore,
    atsScore: atsAnalysis.overallAtsScore,
    candidateName: cvData.personalInfo?.fullName || 'Namizəd',
    detectedRole: cvData.personalInfo?.jobTitle || 'Mütəxəssis',
    seniorityLevel: (cvData.experiences?.length || 0) >= 3 ? 'Senior' : 'Middle',
    executiveSummary: cvData.personalInfo?.summary || 'Peşəkar mütəxəssis profili.',
    strengths: ['Güclü sahə təcrübəsi', 'Strukturlaşdırılmış məlumatlar', 'Aydın əlaqə vasitələri'],
    weaknesses: atsAnalysis.overallAtsScore < 80 ? ['Ölçülə bilən göstəricilərin sayını artırın'] : [],
    atsChecks,
    bulletImprovements: improvements,
    careerFit: {
      fitScore: atsAnalysis.overallAtsScore,
      recommendedIndustries: ['İnformasiya Texnologiyaları & SaaS', 'Bankçılıq & FinTech', 'E-Ticarət & Retail', 'Telekommunikasiya'],
      suitableRoles: [
        {
          role: cvData.personalInfo?.jobTitle || 'Mütəxəssis',
          matchPercentage: Math.max(atsAnalysis.overallAtsScore, 88),
          reason: 'Mövcud təcrübə və bacarıq dəsti ilə birbaşa tam uyğunluq təşkil edir.',
        },
      ],
      growthTrajectory: 'Strateji layihələrdə iştirak və aparıcı rəhbər rola yüksəlmə potensialı mövcuddur.',
    },
  };

  const handleReanalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            AI Dərin CV Audit & ATS Optimizatoru
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            CV-nizi beynəlxalq və yerli ATS filtrləri, açar söz sıxlığı və ölçülə bilən nailiyyətlər üzrə skan edin.
          </p>
        </div>

        <button
          onClick={handleReanalyze}
          disabled={isAnalyzing}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          Yenidən Skan Et
        </button>
      </div>

      {/* Main Analysis Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <CareerValuationSummaryCard
            result={analysisResult}
          />
          <ATSChecklistCard
            atsChecks={atsChecks}
          />
        </div>

        <div className="lg:col-span-8 space-y-6">
          <BulletImprovementsCard
            improvements={improvements}
          />
        </div>
      </div>
    </div>
  );
};
