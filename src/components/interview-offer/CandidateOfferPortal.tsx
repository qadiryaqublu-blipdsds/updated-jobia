import React, { useState } from 'react';
import { JobOffer } from '../../types';
import { 
  Building2, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  ShieldCheck, 
  Award,
  Sparkles,
  FileCheck
} from 'lucide-react';

interface CandidateOfferPortalProps {
  offer: JobOffer;
  onUpdateOfferStatus: (offerId: string, status: 'ACCEPTED' | 'DECLINED', reason?: any, log?: any) => void;
  onBackToApp: () => void;
}

export const CandidateOfferPortal: React.FC<CandidateOfferPortalProps> = ({
  offer,
  onUpdateOfferStatus,
  onBackToApp,
}) => {
  const [declineReason, setDeclineReason] = useState('');
  const [isDeclining, setIsDeclining] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState<'ACCEPTED' | 'DECLINED' | null>(
    offer.status === 'ACCEPTED' ? 'ACCEPTED' : offer.status === 'DECLINED' ? 'DECLINED' : null
  );

  const handleAccept = () => {
    onUpdateOfferStatus(offer.id, 'ACCEPTED');
    setSubmittedStatus('ACCEPTED');
  };

  const handleDeclineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateOfferStatus(offer.id, 'DECLINED', { reasonText: declineReason });
    setSubmittedStatus('DECLINED');
    setIsDeclining(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-6">
        {/* Navigation */}
        <button
          onClick={onBackToApp}
          className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Jobia Portala Qayıt
        </button>

        {/* Offer Letter Box */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-200">
                  Rəsmi Əmək Təklifi (Job Offer)
                </span>
                <h1 className="text-2xl sm:text-3xl font-black mt-1">{offer.position}</h1>
                <p className="text-sm text-blue-100 mt-1 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  {offer.companyName}
                </p>
              </div>

              <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 self-start sm:self-auto">
                <span className="text-[10px] uppercase font-bold text-blue-200 block">Status</span>
                <span className="text-xs font-extrabold text-white">
                  {submittedStatus === 'ACCEPTED'
                    ? 'QƏBUL EDİLDİ'
                    : submittedStatus === 'DECLINED'
                    ? 'İMTİNA EDİLDİ'
                    : 'QƏRAR GÖZLƏNİLİR'}
                </span>
              </div>
            </div>
          </div>

          {/* Letter Body */}
          <div className="p-6 sm:p-8 space-y-6 text-sm text-slate-700">
            <p className="leading-relaxed">
              Hörmətli <strong>{offer.candidateName}</strong>,
            </p>
            <p className="leading-relaxed">
              <strong>{offer.companyName}</strong> şirkətində apardığımız müsahibə prosesinin nəticəsi olaraq
              sizi komandamızda <strong>{offer.position}</strong> vəzifəsində görməkdən məmnunluq duyuruq.
              Sizə təklif olunan əmək şərtləri aşağıda qeyd edilmişdir:
            </p>

            {/* Offer Key Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
              <div>
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Net Maaş (Ələ çatan)</span>
                <span className="text-xl font-extrabold text-emerald-700 block mt-0.5">
                  {offer.netSalary} AZN
                </span>
                <span className="text-[10px] text-slate-500">Gross: {offer.grossSalary} AZN</span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 block uppercase">İş Qrafiki & Rejim</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">
                  {offer.employmentType}
                </span>
                <span className="text-[10px] text-slate-500">{offer.workLocation}</span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 block uppercase">Başlama Tarixi</span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">
                  {offer.startDate}
                </span>
                <span className="text-[10px] text-slate-500">Sınaq: {offer.probationPeriod || '3 ay'}</span>
              </div>
            </div>

            {/* Benefits & Perks */}
            {offer.benefits && offer.benefits.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-600" />
                  Şirkət Təminatları və Bonuslar
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {offer.benefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200/60">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="pt-6 border-t border-slate-200">
              {submittedStatus === 'ACCEPTED' ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-emerald-900">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <h4 className="text-base font-bold">Təklif Uğurla Qəbul Edildi!</h4>
                  <p className="text-xs text-emerald-700 mt-1">
                    Şirkətin İnsan Resursları departamenti rəsmi əmək müqaviləsinin imzalanması üçün sizinlə əlaqə saxlayacaq.
                  </p>
                </div>
              ) : submittedStatus === 'DECLINED' ? (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-center text-rose-900">
                  <XCircle className="w-8 h-8 text-rose-600 mx-auto mb-2" />
                  <h4 className="text-base font-bold">Təklif İmtina Edildi</h4>
                  <p className="text-xs text-rose-700 mt-1">
                    Qərarınız şirkət nümayəndələrinə çatdırıldı.
                  </p>
                </div>
              ) : (
                <div>
                  {!isDeclining ? (
                    <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsDeclining(true)}
                        className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      >
                        İmtina Et
                      </button>
                      <button
                        type="button"
                        onClick={handleAccept}
                        className="w-full sm:w-auto px-8 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <FileCheck className="w-4 h-4" />
                        Təklifi Rəsmən Qəbul Et
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleDeclineSubmit} className="space-y-3">
                      <label className="block text-xs font-bold text-slate-700">
                        İmtina səbəbini qeyd edin (Könüllü)
                      </label>
                      <textarea
                        rows={3}
                        value={declineReason}
                        onChange={(e) => setDeclineReason(e.target.value)}
                        placeholder="Maaş təklifi, lokasiya və ya digər səbəb..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsDeclining(false)}
                          className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                        >
                          Geri
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 text-xs font-bold bg-rose-600 text-white rounded-xl hover:bg-rose-700"
                        >
                          İmtinanı Təsdiqlə
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
