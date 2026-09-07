import React, { useState } from 'react';
import { calculateFromGross, calculateFromNet, SectorType } from '../../services/salaryCalculator';
import { Calculator, DollarSign, Calendar, ArrowRight, ShieldCheck, PieChart, HelpCircle } from 'lucide-react';

interface SalariaCalculatorProps {
  defaultSubTab?: 'salaria' | 'vacatia' | 'severance';
  onExploreJobs?: () => void;
}

export const SalariaCalculator: React.FC<SalariaCalculatorProps> = ({
  defaultSubTab = 'salaria',
  onExploreJobs,
}) => {
  const [activeTab, setActiveTab] = useState<'salaria' | 'vacatia' | 'severance'>(defaultSubTab);

  // Salary Calculator State
  const [inputMode, setInputMode] = useState<'gross' | 'net'>('gross');
  const [amount, setAmount] = useState<number>(1500);
  const [sector, setSector] = useState<SectorType>('non-oil-private');

  // Vacation (Vacatia) State
  const [monthlySalary, setMonthlySalary] = useState<number>(1200);
  const [vacationDays, setVacationDays] = useState<number>(21);

  // Calculation results
  const salaryResult =
    inputMode === 'gross'
      ? calculateFromGross(amount, sector)
      : calculateFromNet(amount, sector);

  // Vacatia calculation: Daily average = (monthlySalary * 12) / 30.4 / 12 = monthlySalary / 30.4
  const dailyAverageSalary = Math.round((monthlySalary / 30.4) * 100) / 100;
  const vacationPay = Math.round(dailyAverageSalary * vacationDays * 100) / 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Calculator className="w-6 h-6 text-purple-600" />
            Salaria & Vacatia — Əməkhaqqı və Müavinət Kalkulyatoru
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Azərbaycan Respublikasının Əmək Məcəlləsi və Vergi Məcəlləsinə tam uyğun vergi, DSMF və məzuniyyət hesablaması.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            onClick={() => setActiveTab('salaria')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'salaria'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Maaş (Gross / Net)
          </button>
          <button
            onClick={() => setActiveTab('vacatia')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'vacatia'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Məzuniyyət (Vacatia)
          </button>
        </div>
      </div>

      {activeTab === 'salaria' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Hesablama Parametrləri
            </h3>

            {/* Input mode */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Hesablama növü</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setInputMode('gross')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    inputMode === 'gross'
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Gross (Vergilər daxil)
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('net')}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    inputMode === 'net'
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Net (Ələ çatan)
                </button>
              </div>
            </div>

            {/* Amount input */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                {inputMode === 'gross' ? 'Gross Əməkhaqqı (AZN)' : 'Net Əməkhaqqı (AZN)'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-lg font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  AZN
                </span>
              </div>
            </div>

            {/* Sector */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Sektor / Güzəşt kateqoriyası</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value as SectorType)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              >
                <option value="non-oil-private">Qeyri-neft özəl sektor (0% Gəlir vergisi güzəşti)</option>
                <option value="it-park">IT Park / Texnopark Rezidenti</option>
                <option value="oil-or-state">Dövlət / Neft-qaz sektoru</option>
              </select>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-600" />
              Nəticələr və Rəsmi Tutulmalar
            </h3>

            {/* Key 2 cards: Net and Gross */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4">
                <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block">
                  Ələ Çatan (Net)
                </span>
                <span className="text-3xl font-extrabold text-purple-900 mt-1 block">
                  {salaryResult.net} AZN
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Hesablanan (Gross)
                </span>
                <span className="text-3xl font-extrabold text-slate-900 mt-1 block">
                  {salaryResult.gross} AZN
                </span>
              </div>
            </div>

            {/* Detailed Deductions Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              <div className="p-3 bg-slate-50/80 font-bold text-slate-800 flex justify-between">
                <span>İşçidən Tutulmalar</span>
                <span className="text-rose-600">-{salaryResult.breakdown.totalEmployeeDeductions} AZN</span>
              </div>
              <div className="p-3 flex justify-between text-slate-600">
                <span>Gəlir vergisi:</span>
                <span className="font-semibold text-slate-800">{salaryResult.breakdown.incomeTax} AZN</span>
              </div>
              <div className="p-3 flex justify-between text-slate-600">
                <span>DSMF (Sosial sığorta):</span>
                <span className="font-semibold text-slate-800">{salaryResult.breakdown.dsmfEmployee} AZN</span>
              </div>
              <div className="p-3 flex justify-between text-slate-600">
                <span>İcbari Tibbi Sığorta (İTS):</span>
                <span className="font-semibold text-slate-800">{salaryResult.breakdown.itsEmployee} AZN</span>
              </div>
              <div className="p-3 flex justify-between text-slate-600">
                <span>İşsizlikdən sığorta (0.5%):</span>
                <span className="font-semibold text-slate-800">{salaryResult.breakdown.unemploymentEmployee} AZN</span>
              </div>
            </div>

            {/* Employer Total Cost */}
            <div className="p-3 bg-slate-100/70 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900">İşəgötürən üçün ümumi xərc:</span>
                <p className="text-[10px] text-slate-500">Gross + İşəgötürən DSMF və İTS töhfələri</p>
              </div>
              <span className="text-base font-extrabold text-blue-700">
                {salaryResult.breakdown.totalEmployerCost} AZN
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Vacatia Tab */
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs max-w-xl mx-auto space-y-5">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-600" />
            Məzuniyyət Haqqı Hesablanması (Vacatia)
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Son 12 ayın orta aylıq əməkhaqqı (Gross AZN)
            </label>
            <input
              type="number"
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Məzuniyyət günlərinin sayı (təqvim günü)
            </label>
            <input
              type="number"
              value={vacationDays}
              onChange={(e) => setVacationDays(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-slate-900"
            />
          </div>

          <div className="p-5 bg-purple-50 rounded-xl border border-purple-200 text-center">
            <span className="text-xs font-bold text-purple-800 uppercase tracking-wider block">
              Hesablanan Məzuniyyət Pulu
            </span>
            <span className="text-3xl font-black text-purple-900 mt-1 block">
              {vacationPay} AZN
            </span>
            <p className="text-[11px] text-purple-700 mt-2">
              Bir günlük orta əməkhaqqı: {dailyAverageSalary} AZN × {vacationDays} gün
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
