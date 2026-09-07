import React, { useState } from 'react';
import { Vacancy, CVData, User } from '../../types';
import {
  X,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Building2,
  CheckCircle2,
  Sparkles,
  Send,
  FileText,
  Clock,
  Share2,
  Bot
} from 'lucide-react';
import { calculateApplicationMatchScore } from '../../utils/applicationMatcher';

interface JobDetailModalProps {
  vacancy: Vacancy;
  onClose: () => void;
  savedCV?: CVData | null;
  onApply?: (coverNote: string, cvData?: CVData) => void;
  hasApplied?: boolean;
  onOpenCompanyProfile?: (companyName: string) => void;
  onOpenInterviewPrep?: (vacancy: Vacancy) => void;
  currentUser?: User | null;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  vacancy,
  onClose,
  savedCV,
  onApply,
  hasApplied = false,
  onOpenCompanyProfile,
  onOpenInterviewPrep,
  currentUser,
}) => {
  const [coverNote, setCoverNote] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const match = savedCV ? calculateApplicationMatchScore(vacancy, savedCV) : null;

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasApplied || isApplying) return;
    setIsApplying(true);
    setTimeout(() => {
      onApply?.(coverNote, savedCV || undefined);
      setIsApplying(false);
    }, 400);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
          <div className="flex items-start gap-4">
            {vacancy.companyLogo ? (
              <img
                src={vacancy.companyLogo}
                alt={vacancy.companyName}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-xl object-contain border border-slate-200 bg-white p-1.5 shrink-0 shadow-xs"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-700 font-extrabold flex items-center justify-center text-lg shrink-0 border border-blue-100">
                {vacancy.companyName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenCompanyProfile?.(vacancy.companyName)}
                  className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
                >
                  {vacancy.companyName}
                </button>
                {vacancy.isFeatured && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900">
                    VIP TƏKLİF
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                {vacancy.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Linki kopyala"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-sm">
          {copiedLink && (
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center border border-emerald-200">
              Vakansiya linki buferə kopyalandı!
            </div>
          )}

          {/* Key details pill grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-500 block">Şəhər & Ünvan</span>
              <div className="flex items-center gap-1.5 mt-1 font-bold text-slate-900 text-xs">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                {vacancy.city || 'Bakı'}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-500 block">İş Qrafiki</span>
              <div className="flex items-center gap-1.5 mt-1 font-bold text-slate-900 text-xs">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                {vacancy.employmentType || 'Tam ştat'}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-500 block">Təklif Olunan Maaş</span>
              <div className="flex items-center gap-1.5 mt-1 font-bold text-emerald-700 text-xs">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                {vacancy.salaryMin || vacancy.salaryMax
                  ? `${vacancy.salaryMin || ''} - ${vacancy.salaryMax || ''} ${vacancy.currency || 'AZN'}`
                  : 'Razılaşma ilə'}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-500 block">Elan Tarixi</span>
              <div className="flex items-center gap-1.5 mt-1 font-bold text-slate-900 text-xs">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                {vacancy.postedDate || 'Bu gün'}
              </div>
            </div>
          </div>

          {/* AI Match Overview Banner */}
          {match && (
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm">
                  %{match.overallScore}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    CV-nizlə Avtomatik ATS Uyğunluğu
                  </h4>
                  <p className="text-[11px] text-blue-700 mt-0.5">
                    Tələb olunan bacarıqlar və təcrübə üzrə yüksək korrelyasiya.
                  </p>
                </div>
              </div>

              {onOpenInterviewPrep && (
                <button
                  type="button"
                  onClick={() => onOpenInterviewPrep(vacancy)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white text-blue-700 border border-blue-300 hover:bg-blue-50 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Bot className="w-3.5 h-3.5" />
                  Müsahibəyə Hazırlaş (AI)
                </button>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Vəzifə Təlimatı və Tələblər
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs leading-relaxed whitespace-pre-line text-slate-700">
              {vacancy.description || 'Ətraflı məlumat daxil edilməyib.'}
            </div>
          </div>

          {/* Skills Required */}
          {vacancy.skills && vacancy.skills.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                Tələb Olunan Bacarıqlar
              </h3>
              <div className="flex flex-wrap gap-2">
                {vacancy.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-medium bg-slate-100 text-slate-800 px-3 py-1 rounded-lg border border-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Apply Form */}
          <div className="pt-4 border-t border-slate-200">
            {hasApplied ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-emerald-900">Müraciətiniz Qəbul Olundu</h4>
                <p className="text-xs text-emerald-700 mt-1">
                  Şirkətin HR komandası CV-nizi nəzərdən keçirdikdən sonra sizinlə əlaqə saxlayacaqdır.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Bu vakansiyaya müraciət edin</h3>
                  {savedCV && (
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      Aktiv CV: {savedCV.personalInfo?.fullName || 'Namizəd CV'}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Qısa Müraciət Məktubu (Könüllü)
                  </label>
                  <textarea
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    rows={3}
                    placeholder="Şirkətə nə üçün uyğun namizəd olduğunuzu 1-2 cümlə ilə bildirin..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Bağla
                  </button>
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="px-6 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isApplying ? 'Göndərilir...' : 'Müraciəti Tamamla'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
