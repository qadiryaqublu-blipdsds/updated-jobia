import React from 'react';
import { OfferAuditLog } from '../../types';
import { X, History, ShieldCheck, Clock } from 'lucide-react';

interface OfferAuditLogModalProps {
  logs: OfferAuditLog[];
  offerId: string;
  candidateName?: string;
  onClose: () => void;
}

export const OfferAuditLogModal: React.FC<OfferAuditLogModalProps> = ({
  logs,
  offerId,
  candidateName,
  onClose,
}) => {
  const filteredLogs = logs.filter((l) => l.offerId === offerId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Offer Audit & Əməliyyat Tarixçəsi</h3>
              <p className="text-[11px] text-slate-500">
                {candidateName ? `Namizəd: ${candidateName}` : 'Təhlükəsiz qeydiyyat qeydləri'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-3 flex-1 text-xs">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              Bu təklif üzrə əlavə audit qeydi tapılmadı.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-1"
              >
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>{log.actorName || 'Sistem / HR'}</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-normal">
                    <Clock className="w-3 h-3" />
                    {log.timestamp.replace('T', ' ').slice(0, 16)}
                  </span>
                </div>
                <p className="text-slate-600">{log.details || log.action}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
