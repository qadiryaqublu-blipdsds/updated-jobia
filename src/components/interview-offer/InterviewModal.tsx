import React, { useState } from 'react';
import { Application, Company, JobOffer, OfferAuditLog, ApplicationStatus } from '../../types';
import { calculateNetSalary, calculateFromGross } from '../../services/salaryCalculator';
import { 
  X, 
  Sparkles, 
  Send, 
  DollarSign, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Building2, 
  Award,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface InterviewModalProps {
  application: Application;
  company: Company | null;
  existingOffer?: JobOffer;
  onClose: () => void;
  onSaveOffer: (savedOffer: JobOffer, log?: OfferAuditLog) => void;
  onUpdateAppStatus: (appId: string, status: ApplicationStatus, notes?: string) => void;
}

export const InterviewModal: React.FC<InterviewModalProps> = ({
  application,
  company,
  existingOffer,
  onClose,
  onSaveOffer,
  onUpdateAppStatus,
}) => {
  const [step, setStep] = useState<number>(1);
  const [position, setPosition] = useState(existingOffer?.position || application.vacancyTitle || 'Mütəxəssis');
  const [grossSalary, setGrossSalary] = useState<number>(existingOffer?.grossSalary || 1800);
  const [employmentType, setEmploymentType] = useState(existingOffer?.employmentType || 'Tam Ştat');
  const [workLocation, setWorkLocation] = useState(existingOffer?.workLocation || 'Bakı, Ofis');
  const [startDate, setStartDate] = useState(existingOffer?.startDate || '2025-04-01');
  const [probationPeriod, setProbationPeriod] = useState(existingOffer?.probationPeriod || '3 ay');
  const [benefitsInput, setBenefitsInput] = useState(
    existingOffer?.benefits?.join(', ') || 'Könüllü Tibbi Sığorta, Korporativ Nömrə, Təlim büdcəsi'
  );

  const calculated = calculateFromGross(grossSalary, 'non-oil-private');

  const handleSendOffer = () => {
    const benefitsList = benefitsInput.split(',').map((s) => s.trim()).filter(Boolean);
    const offerId = existingOffer?.id || `offer-${Date.now()}`;

    const newOffer: JobOffer = {
      id: offerId,
      applicationId: application.id,
      companyId: company?.id || 'comp-1',
      companyName: company?.name || application.companyName || 'Şirkət',
      companyLogo: company?.logo || application.companyLogo,
      candidateName: application.candidateName,
      candidateEmail: application.candidateEmail,
      candidatePhone: application.candidatePhone,
      position,
      grossSalary,
      netSalary: calculated.net,
      employmentType,
      workLocation,
      startDate,
      probationPeriod,
      benefits: benefitsList,
      status: 'SENT',
      createdAt: existingOffer?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const auditLog: OfferAuditLog = {
      id: `log-${Date.now()}`,
      offerId,
      actorName: company?.name || 'HR Menecer',
      action: existingOffer ? 'OFFER_UPDATED' : 'OFFER_SENT',
      timestamp: new Date().toISOString(),
      details: `${application.candidateName} üçün ${grossSalary} AZN Gross təklif göndərildi.`,
    };

    onSaveOffer(newOffer, auditLog);
    onUpdateAppStatus(application.id, 'Təklif Göndərildi', 'Rəsmi iş təklifi namizədə çatdırıldı.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Müsahibə & Rəsmi İş Təklifi (Job Offer) Tərtibatı
              </h3>
              <p className="text-xs text-slate-500">
                Namizəd: <strong className="text-slate-800">{application.candidateName}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Vəzifə Adı</label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">İş Rejimi & Qrafik</label>
              <input
                type="text"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Gross Əməkhaqqı (AZN)</label>
              <input
                type="number"
                min="0"
                step="50"
                value={grossSalary}
                onChange={(e) => setGrossSalary(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20"
              />
              <span className="text-[11px] text-emerald-700 font-bold block mt-1">
                Net (Ələ çatan): ~{calculated.net} AZN
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">İş Yeri / Lokasiya</label>
              <input
                type="text"
                value={workLocation}
                onChange={(e) => setWorkLocation(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">İşə Başlama Tarixi</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Sınaq Müddəti</label>
              <input
                type="text"
                value={probationPeriod}
                onChange={(e) => setProbationPeriod(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Bonuslar və Təminatlar (vergüllə ayırın)</label>
            <input
              type="text"
              value={benefitsInput}
              onChange={(e) => setBenefitsInput(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Quick Net breakdown summary */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Avtomatlaşdırılmış Vergi Xülasəsi</span>
              <span className="text-xs text-slate-700">İşçidən tutulmalar: {calculated.breakdown.totalEmployeeDeductions} AZN</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Şirkət üçün ümumi xərc:</span>
              <span className="text-sm font-extrabold text-blue-700">{calculated.breakdown.totalEmployerCost} AZN</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200/60 rounded-xl"
          >
            Bağla
          </button>
          <button
            type="button"
            onClick={handleSendOffer}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            Təklifi Rəsmiləşdir və Göndər
          </button>
        </div>
      </div>
    </div>
  );
};
