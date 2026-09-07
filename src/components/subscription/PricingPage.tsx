import React, { useState } from 'react';
import { User, UserRole, UserSubscription, SubscriptionPlan, BillingCycle } from '../../types';
import { SUBSCRIPTION_PLANS } from '../../services/subscriptionService';
import { Check, Sparkles, ArrowLeft, Shield, Zap, Building2, User as UserIcon } from 'lucide-react';

interface PricingPageProps {
  currentUser?: User | null;
  currentRole: UserRole;
  currentSubscription?: UserSubscription | null;
  onSelectPlan?: (plan: SubscriptionPlan, cycle: BillingCycle) => void;
  onBack?: () => void;
  onRequireAuth?: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  currentUser,
  currentRole,
  currentSubscription,
  onSelectPlan,
  onBack,
  onRequireAuth,
}) => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly');
  const [roleTab, setRoleTab] = useState<'candidate' | 'business'>(
    currentRole === 'business' ? 'business' : 'candidate'
  );

  const plans = SUBSCRIPTION_PLANS.filter((p) => p.targetRole === roleTab);

  const handlePlanClick = (plan: SubscriptionPlan) => {
    if (!currentUser && onRequireAuth) {
      onRequireAuth();
      return;
    }
    onSelectPlan?.(plan, billingCycle);
  };

  return (
    <div className="py-10 px-4 max-w-6xl mx-auto space-y-8">
      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Əsas Səhifəyə Qayıt
        </button>
      )}

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Şəffaf Qiymət Siyasəti
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Karyeranızı və Biznesinizi Zirvəyə Daşıyın
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          AI alətləri, limitsiz müraciət, ATS optimizasiyası və rekrutment analitikası üçün ən əlverişli planı seçin.
        </p>

        {/* Role toggle (Candidate vs Business) */}
        <div className="pt-4 flex justify-center">
          <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              onClick={() => setRoleTab('candidate')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                roleTab === 'candidate'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserIcon className="w-4 h-4 text-blue-600" />
              Namizədlər üçün
            </button>
            <button
              onClick={() => setRoleTab('business')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                roleTab === 'business'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-indigo-600" />
              Şirkətlər üçün
            </button>
          </div>
        </div>

        {/* Billing cycle switch */}
        <div className="flex items-center justify-center gap-3 pt-2 text-xs font-bold">
          <span className={billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}>
            Aylıq
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-12 h-6 rounded-full bg-blue-600 p-0.5 transition-colors relative cursor-pointer"
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-400'}>
            İllik <span className="text-emerald-600 font-extrabold text-[10px] ml-1 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">2 ay pulsuz</span>
          </span>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = currentSubscription?.tier === plan.tier;
          const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;
          const isPopular = plan.tier === 'PRO' || plan.tier === 'BUSINESS';

          return (
            <div
              key={plan.id}
              className={`bg-white rounded-3xl p-7 border transition-all flex flex-col justify-between relative ${
                isPopular
                  ? 'border-blue-500 shadow-xl ring-2 ring-blue-500/20'
                  : 'border-slate-200 shadow-xs hover:shadow-md'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-xs">
                  Tövsiyə Olunur
                </div>
              )}

              <div>
                <h3 className="text-lg font-black text-slate-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">{price}</span>
                  <span className="text-xs font-bold text-slate-500">
                    {plan.currency} / {billingCycle === 'monthly' ? 'ay' : 'il'}
                  </span>
                </div>

                {/* Features list */}
                <ul className="mt-6 space-y-3 text-xs text-slate-700">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handlePlanClick(plan)}
                  disabled={isCurrent}
                  className={`w-full py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-100 text-slate-400 cursor-default'
                      : isPopular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {isCurrent ? 'Cari Abunəliyiniz' : price === 0 ? 'Pulsuz Başla' : 'İndi Abunə Ol'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
