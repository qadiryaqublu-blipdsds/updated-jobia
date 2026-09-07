import React from 'react';
import { Application, JobOffer, User } from '../../types';
import { 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Building2, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  Eye
} from 'lucide-react';

interface MyApplicationsProps {
  applications: Application[];
  offers?: JobOffer[];
  onOpenCVModal?: (application: Application) => void;
  onExploreJobs?: () => void;
  onViewOffer?: (offer: JobOffer) => void;
  currentUser?: User | null;
  onOpenAuthModal?: (mode?: 'login' | 'register', role?: 'candidate' | 'business') => void;
}

export const MyApplications: React.FC<MyApplicationsProps> = ({
  applications,
  offers = [],
  onOpenCVModal,
  onExploreJobs,
  onViewOffer,
  currentUser,
  onOpenAuthModal,
}) => {
  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'Qəbul Edildi':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Qəbul Edildi</span>;
      case 'Təklif Göndərildi':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">İş Təklifi Var</span>;
      case 'Müsahibə':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">Müsahibə</span>;
      case 'Baxıldı':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Baxıldı</span>;
      case 'İmtina':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">İmtina</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">Müraciət Edildi</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Mənim Müraciətlərim</h1>
          <p className="text-xs text-slate-600 mt-1">
            Göndərdiyiniz vakansiya müraciətlərinin cari statusu və şirkətlərdən gələn cavablar.
          </p>
        </div>

        {onExploreJobs && (
          <button
            onClick={onExploreJobs}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
          >
            Vakansiyaları Axtar <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Offers alert banner if any */}
      {offers.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Rəsmi İş Təklifləriniz ({offers.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {offers.map((offer) => (
              <div
                key={offer.id}
                onClick={() => onViewOffer?.(offer)}
                className="bg-amber-50/70 border border-amber-300 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                      Rəsmi Təklif • {offer.companyName}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{offer.position}</h4>
                    <p className="text-xs font-bold text-emerald-700 mt-0.5">
                      Net: {offer.netSalary} AZN
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-amber-900 bg-amber-200/80 px-3 py-1.5 rounded-xl">
                  Bax və İmzala →
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Applications list */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Müraciət Tarixçəsi ({applications.length})
        </h3>

        {applications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-800">Hələ ki müraciət etməmisiniz</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Uyğun vakansiyaları taparaq bir kliklə müraciət göndərə bilərsiniz.
            </p>
            {onExploreJobs && (
              <button
                onClick={onExploreJobs}
                className="mt-4 px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Vakansiyalara Keç
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-slate-300 shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{app.vacancyTitle}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">{app.companyName}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {app.appliedDate}
                      </span>
                      {app.matchScore && (
                        <span className="text-blue-600 font-semibold">
                          ATS Uyğunluğu: %{app.matchScore}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  {getStatusBadge(app.status)}
                  {onOpenCVModal && app.cvData && (
                    <button
                      onClick={() => onOpenCVModal(app)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" />
                      CV-yə Bax
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
