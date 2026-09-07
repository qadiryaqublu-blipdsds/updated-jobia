import React, { useMemo } from 'react';
import { Vacancy } from '../../types';
import { TrendingUp, DollarSign, Briefcase, Award, BarChart3, Building2, ArrowRight } from 'lucide-react';

interface SalaryTrendsViewProps {
  vacancies: Vacancy[];
  onSelectVacancy: (vacancy: Vacancy) => void;
}

export const SalaryTrendsView: React.FC<SalaryTrendsViewProps> = ({
  vacancies,
  onSelectVacancy,
}) => {
  // Category salary analytics
  const categoryStats = useMemo(() => {
    const map: Record<string, { total: number; count: number; max: number }> = {};
    vacancies.forEach((v) => {
      const cat = v.category || 'Digər';
      const sal = v.maxSalary || v.salaryMax || v.minSalary || v.salaryMin || 0;
      if (sal > 0) {
        if (!map[cat]) map[cat] = { total: 0, count: 0, max: 0 };
        map[cat].total += sal;
        map[cat].count += 1;
        if (sal > map[cat].max) map[cat].max = sal;
      }
    });

    return Object.entries(map).map(([category, data]) => ({
      category,
      avgSalary: Math.round(data.total / data.count),
      maxSalary: data.max,
      jobCount: data.count,
    })).sort((a, b) => b.avgSalary - a.avgSalary);
  }, [vacancies]);

  // Overall platform salary averages
  const overallAverage = useMemo(() => {
    let sum = 0;
    let count = 0;
    vacancies.forEach((v) => {
      const sal = v.maxSalary || v.salaryMax || v.minSalary || v.salaryMin;
      if (sal) {
        sum += sal;
        count++;
      }
    });
    return count > 0 ? Math.round(sum / count) : 1250;
  }, [vacancies]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
              Azərbaycan Əmək Bazarı Maaş Trendləri
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Real vakansiyalar əsasında hesablanmış orta və maksimum əməkhaqqı göstəriciləri.
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 px-5 text-center">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Bazar Üzrə Orta Maaş
            </span>
            <span className="text-2xl font-extrabold text-emerald-700">
              {overallAverage} AZN
            </span>
          </div>
        </div>
      </div>

      {/* Sector Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-600" />
          Sahələr Üzrə Maaş İndeksi
        </h3>

        <div className="space-y-4">
          {categoryStats.map((item) => {
            const percentage = Math.min(100, Math.round((item.avgSalary / 3500) * 100));
            return (
              <div key={item.category} className="space-y-1.5">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-bold text-slate-800">{item.category}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500">{item.jobCount} aktiv elan</span>
                    <span className="font-extrabold text-slate-900">{item.avgSalary} AZN</span>
                  </div>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* High Paying Jobs Showcase */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Ən Yüksək Maaş Təklif Edən Vakansiyalar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vacancies
            .filter((v) => (v.maxSalary || v.salaryMax || v.minSalary || v.salaryMin || 0) >= 1500)
            .slice(0, 6)
            .map((job) => (
              <div
                key={job.id}
                onClick={() => onSelectVacancy(job)}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-500">{job.companyName}</span>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">{job.title}</h4>
                  <span className="text-xs font-extrabold text-emerald-700 block mt-1.5">
                    {job.minSalary || job.salaryMin || 0} - {job.maxSalary || job.salaryMax || 0} {job.currency || 'AZN'}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
