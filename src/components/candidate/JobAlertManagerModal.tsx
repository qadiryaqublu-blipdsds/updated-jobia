import React, { useState } from 'react';
import { User } from '../../types';
import { X, Bell, Mail, CheckCircle2, Save, Sparkles, Filter } from 'lucide-react';

interface JobAlertManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: User | null;
  onShowToast?: (msg: string) => void;
}

export const JobAlertManagerModal: React.FC<JobAlertManagerModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [email, setEmail] = useState(currentUser?.email || '');
  const [keywords, setKeywords] = useState('Frontend, React, TypeScript');
  const [frequency, setFrequency] = useState<'instant' | 'daily' | 'weekly'>('instant');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Vakansiya Bildirişləri</h3>
              <p className="text-[11px] text-slate-500">Uyğun iş elanları çıxdıqda xəbərdar olun</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-5 space-y-4">
          {savedSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-emerald-900">Bildiriş tənzimləmələri yadda saxlanıldı!</p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Bildiriş E-poçtu
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ad@example.com"
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Maraqlandığınız Açar Sözlər / Vəzifələr
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="məsələn: Dizayn, Marketinq, Python"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Göndərilmə Tezliyi
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-medium">
                  {(['instant', 'daily', 'weekly'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFrequency(f)}
                      className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                        frequency === f
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {f === 'instant' ? 'Dərhal' : f === 'daily' ? 'Gündəlik' : 'Həftəlik'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Yadda saxla
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
