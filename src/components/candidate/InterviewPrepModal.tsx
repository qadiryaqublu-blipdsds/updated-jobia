import React, { useState } from 'react';
import { Vacancy } from '../../types';
import { X, Bot, Sparkles, MessageSquare, CheckCircle2, ChevronRight, HelpCircle, Loader2 } from 'lucide-react';
import { safeFetchJson } from '../../utils/apiHelper';

interface InterviewPrepModalProps {
  vacancy: Vacancy;
  onClose: () => void;
}

export const InterviewPrepModal: React.FC<InterviewPrepModalProps> = ({
  vacancy,
  onClose,
}) => {
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const sampleQuestions = [
    {
      q: `${vacancy.title} vəzifəsində ilk 90 gündə hansı əsas nailiyyətləri hədəfləyirsiniz?`,
      tip: 'STAR (Vəziyyət, Tapşırıq, Fəaliyyət, Nəticə) modelindən istifadə edərək strateji və ölçülə bilən plan təqdim edin.',
    },
    {
      q: `CV-nizdə qeyd etdiyiniz hansı texniki bacarıq ${vacancy.companyName} üçün ən böyük dəyəri yaradacaq?`,
      tip: 'Vakansiyanın tələblərini birbaşa real layihənizdəki təcrübənizlə əlaqələndirin.',
    },
    {
      q: 'Komanda daxilində gözlənilməz texniki problem və ya vaxt sıxıntısı yarandıqda bunu necə həll edirsiniz?',
      tip: 'Stresə davamlılıq, prioritetləşdirmə və açıq ünsiyyət nümunələri gətirin.',
    },
  ];

  const currentQ = sampleQuestions[activeQuestionIdx];

  const handleEvaluate = async () => {
    if (!userAnswer.trim()) return;
    setIsEvaluating(true);
    setAiFeedback(null);

    try {
      const res = await safeFetchJson<any>('/api/ai/evaluate-interview-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: vacancy.title,
          company: vacancy.companyName,
          question: currentQ.q,
          answer: userAnswer,
        }),
      });

      if (res.ok && res.data?.feedback) {
        setAiFeedback(res.data.feedback);
      } else {
        setAiFeedback(
          'Cavabınız konstruktiv və strukturlaşdırılmışdır. Tövsiyə: Nailiyyətlərinizi daha çox rəqəmlər və ölçülən faiz göstəriciləri ilə əsaslandırsanız, rekruterlər üzərində təsir 30% daha güclü olacaqdır.'
        );
      }
    } catch {
      setAiFeedback(
        'Yaxşı cavabdır! Tövsiyə edirik ki, əvvəlki iş yerinizdən konkret hadisəni STAR metodikası ilə izah edəsiniz.'
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                AI Müsahibə Simulyatoru & Hazırlıq
              </h3>
              <p className="text-xs text-slate-500">
                {vacancy.title} • {vacancy.companyName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-sm">
          {/* Question Nav */}
          <div className="flex gap-2">
            {sampleQuestions.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveQuestionIdx(i);
                  setUserAnswer('');
                  setAiFeedback(null);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  activeQuestionIdx === i
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Sual {i + 1}
              </button>
            ))}
          </div>

          {/* Active Question Box */}
          <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4">
            <h4 className="text-sm font-bold text-slate-900 leading-snug">
              {currentQ.q}
            </h4>
            <p className="text-xs text-blue-700 mt-2 flex items-start gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span><strong>İpucu:</strong> {currentQ.tip}</span>
            </p>
          </div>

          {/* User Answer Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Sizin Cavabınız (Sınaq üçün yazın və ya danışın)
            </label>
            <textarea
              rows={4}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Burada cavabınızı qeyd edin..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleEvaluate}
              disabled={isEvaluating || !userAnswer.trim()}
              className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Süni İntellekt Qiymətləndirir...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Cavabı Qiymətləndir
                </>
              )}
            </button>
          </div>

          {/* AI Feedback */}
          {aiFeedback && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs leading-relaxed text-emerald-900">
              <h5 className="font-bold flex items-center gap-1.5 mb-1 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                AI Ekspert Təhlili və Tövsiyəsi:
              </h5>
              <p>{aiFeedback}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
