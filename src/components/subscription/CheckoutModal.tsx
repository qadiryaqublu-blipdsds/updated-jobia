import React, { useState } from 'react';
import { SubscriptionPlan, BillingCycle, User, UserSubscription } from '../../types';
import { updateUserSubscription } from '../../services/subscriptionService';
import { X, CreditCard, Lock, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan;
  billingCycle: BillingCycle;
  currentUser?: User | null;
  onSuccess?: (newSub: UserSubscription) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  plan,
  billingCycle,
  currentUser,
  onSuccess,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState(currentUser?.fullName || currentUser?.name || 'AD SOYAD');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;

  const handleTestAutofill = () => {
    setCardNumber('4169 8812 3456 7890');
    setExpiry('12/28');
    setCvv('888');
    setCardHolder(currentUser?.fullName || currentUser?.name || 'TEST İSTİFADƏÇİ');
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const activatedSub = updateUserSubscription(currentUser?.id, plan.tier, billingCycle);
      setIsProcessing(false);
      onSuccess?.(activatedSub);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Təhlükəsiz Ödəniş</h3>
              <p className="text-[11px] text-slate-500">256-bit SSL şifrələnmiş tranzaksiya</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Order Summary */}
        <div className="p-5 bg-blue-50/50 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">
              Seçilmiş Paket
            </span>
            <h4 className="text-sm font-black text-slate-900">{plan.name}</h4>
            <span className="text-xs text-slate-500 capitalize">{billingCycle === 'monthly' ? 'Aylıq abunəlik' : 'İllik abunəlik'}</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-blue-900">{price} {plan.currency}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handlePay} className="p-5 space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-700">Bank Kartı Məlumatları</label>
            <button
              type="button"
              onClick={handleTestAutofill}
              className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Test kartını doldur
            </button>
          </div>

          <div>
            <input
              type="text"
              required
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">Bitmə Tarixi</label>
              <input
                type="text"
                required
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">CVV / CVC</label>
              <input
                type="password"
                required
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="•••"
                maxLength={4}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 mb-1">Kart Sahibinin Adı</label>
            <input
              type="text"
              required
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
              placeholder="AD SOYAD"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" />
              {isProcessing ? 'Ödəniş təsdiqlənir...' : `${price} ${plan.currency} Ödə və Aktivləşdir`}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>İstənilən vaxt bir kliklə abunəliyi dayandırmaq mümkündür</span>
          </div>
        </form>
      </div>
    </div>
  );
};
