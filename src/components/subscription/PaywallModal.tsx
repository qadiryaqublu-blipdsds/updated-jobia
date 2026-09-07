import React from 'react';
import { X, Sparkles, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { UserRole } from '../../types';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredTier: string;
  featureTitle: string;
  featureDescription: string;
  userRole: UserRole;
  onUpgradeClick: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  requiredTier,
  featureTitle,
  featureDescription,
  userRole,
  onUpgradeClick,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-center p-6 sm:p-8 space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            {requiredTier} Abunəlik Tələb Olunur
          </span>
          <h3 className="text-xl font-black text-slate-900 pt-1">
            {featureTitle}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
            {featureDescription || 'Bu eksklüziv xüsusiyyətdən istifadə etmək üçün abunəlik planınızı yüksəldin.'}
          </p>
        </div>

        <div className="pt-2 space-y-2.5">
          <button
            type="button"
            onClick={onUpgradeClick}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Paketlərə Bax və Yüksəlt
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            Daha Sonra
          </button>
        </div>
      </div>
    </div>
  );
};
