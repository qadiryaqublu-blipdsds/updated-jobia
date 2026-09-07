import React from 'react';
import { JobOffer, OfferAuditLog } from '../../types';
import { 
  Building2, 
  History, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Send, 
  Trash2, 
  Eye, 
  FileText,
  DollarSign
} from 'lucide-react';

interface JobOffersTableProps {
  offers: JobOffer[];
  auditLogs?: OfferAuditLog[];
  onOpenAuditLog?: (offerId: string, candidateName: string) => void;
  onResendOffer?: (offer: JobOffer) => void;
  onDeleteOffer?: (offerId: string) => void;
  onOpenOfferWorkflow?: (offer: JobOffer) => void;
  onOpenCandidatePortal?: (offer: JobOffer) => void;
}

export const JobOffersTable: React.FC<JobOffersTableProps> = ({
  offers,
  auditLogs = [],
  onOpenAuditLog,
  onResendOffer,
  onDeleteOffer,
}) => {
  const getOfferStatusBadge = (status: JobOffer['status']) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Qəbul edildi
          </span>
        );
      case 'DECLINED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
            <XCircle className="w-3.5 h-3.5" /> İmtina edildi
          </span>
        );
      case 'SENT':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
            <Clock className="w-3.5 h-3.5" /> Cavab gözlənilir
          </span>
        );
    }
  };

  if (offers.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h4 className="text-sm font-bold text-slate-800">Aktiv iş təklifi yoxdur</h4>
        <p className="text-xs text-slate-500 mt-1">
          Namizədlərin müraciətlərini dəyərləndirdikdən sonra birbaşa rəsmi təklif göndərə bilərsiniz.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">
          Göndərilmiş Rəsmi Əmək Təklifləri ({offers.length})
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-4">Namizəd</th>
              <th className="py-3.5 px-4">Vəzifə</th>
              <th className="py-3.5 px-4">Maaş (Net / Gross)</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Tarix</th>
              <th className="py-3.5 px-4 text-right">Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {offers.map((offer) => (
              <tr key={offer.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900">
                  {offer.candidateName}
                  <span className="block text-[10px] text-slate-400 font-normal">{offer.candidateEmail}</span>
                </td>
                <td className="py-3 px-4 font-semibold">{offer.position}</td>
                <td className="py-3 px-4">
                  <span className="font-extrabold text-emerald-700">{offer.netSalary} AZN</span>
                  <span className="text-[10px] text-slate-400 block">Gross: {offer.grossSalary} AZN</span>
                </td>
                <td className="py-3 px-4">{getOfferStatusBadge(offer.status)}</td>
                <td className="py-3 px-4 text-slate-500">
                  {offer.createdAt.split('T')[0]}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {onOpenAuditLog && (
                      <button
                        onClick={() => onOpenAuditLog(offer.id, offer.candidateName)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Audit Log / Tarixçə"
                      >
                        <History className="w-4 h-4" />
                      </button>
                    )}
                    {onResendOffer && (
                      <button
                        onClick={() => onResendOffer(offer)}
                        className="p-1.5 text-slate-500 hover:text-emerald-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Yenidən Redaktə / Göndər"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    )}
                    {onDeleteOffer && (
                      <button
                        onClick={() => onDeleteOffer(offer.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
