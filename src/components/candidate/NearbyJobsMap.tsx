import React, { useState, useMemo } from 'react';
import { Vacancy } from '../../types';
import { BAKU_METRO_STATIONS, AZERBAIJAN_REGIONS } from '../../data/azerbaijanGeoData';
import { 
  MapPin, 
  Navigation, 
  Briefcase, 
  DollarSign, 
  Search, 
  Filter, 
  Bookmark, 
  BookmarkCheck, 
  Building2, 
  ArrowRight,
  Train
} from 'lucide-react';

interface NearbyJobsMapProps {
  vacancies: Vacancy[];
  onSelectVacancy: (vacancy: Vacancy) => void;
  savedJobIds?: string[];
  onToggleBookmark?: (vacancyId: string) => void;
  onQuickApply?: (vacancy: Vacancy) => void;
}

export const NearbyJobsMap: React.FC<NearbyJobsMapProps> = ({
  vacancies,
  onSelectVacancy,
  savedJobIds = [],
  onToggleBookmark,
  onQuickApply,
}) => {
  const [selectedMetro, setSelectedMetro] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('Bakı');
  const [selectedVacId, setSelectedVacId] = useState<string | null>(null);

  const filteredVacancies = useMemo(() => {
    return vacancies.filter((v) => {
      if (selectedRegion !== 'all' && v.city && !v.city.includes(selectedRegion)) {
        return false;
      }
      if (selectedMetro !== 'all' && v.metroStation && v.metroStation !== selectedMetro) {
        return false;
      }
      return true;
    });
  }, [vacancies, selectedRegion, selectedMetro]);

  const activeJob = vacancies.find((v) => v.id === selectedVacId) || filteredVacancies[0];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Navigation className="w-6 h-6 text-blue-600" />
              Yaxınlıqdakı Vakansiyalar və Metro Xəritəsi
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Bakı metro stansiyalarına və rayonlarına ən yaxın iş elanlarını seçin və vaxtınıza qənaət edin.
            </p>
          </div>

          {/* Metro Station Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <Train className="w-4 h-4 text-rose-500" />
              <select
                value={selectedMetro}
                onChange={(e) => setSelectedMetro(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="all">Bütün Metro Stansiyaları</option>
                {BAKU_METRO_STATIONS.map((stationName) => (
                  <option key={stationName} value={stationName}>
                    {stationName}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">Bütün Regionlar</option>
              {AZERBAIJAN_REGIONS.map((regionName) => (
                <option key={regionName} value={regionName}>{regionName}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Simulated Map & Metro Points */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 relative min-h-[480px] p-6 flex flex-col justify-between text-white shadow-xl">
          {/* Map stylized background grid */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />

          {/* Map Top Status */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 bg-slate-800/90 backdrop-blur-xs border border-slate-700 px-3 py-1 rounded-full text-xs font-semibold text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              Bakı Şəhəri Geo-İnteraktiv Zonası
            </span>
            <span className="text-xs text-slate-400">
              {filteredVacancies.length} vakansiya qeydiyyatda
            </span>
          </div>

          {/* Stylized Visual Metro Stations Hub */}
          <div className="relative z-10 my-auto py-8">
            <div className="max-w-md mx-auto bg-slate-800/80 backdrop-blur-md rounded-xl p-4 border border-slate-700 shadow-2xl">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Train className="w-4 h-4 text-rose-400" />
                Ən Çox Vakansiya Olan Nöqtələr
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {BAKU_METRO_STATIONS.slice(0, 6).map((stationName) => {
                  const count = vacancies.filter((v) => (v.metroStation || '').toLowerCase().includes(stationName.toLowerCase())).length || 2;
                  const isSelected = selectedMetro === stationName;
                  return (
                    <button
                      key={stationName}
                      onClick={() => setSelectedMetro(isSelected ? 'all' : stationName)}
                      className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600/30 border-blue-400 text-white font-bold'
                          : 'bg-slate-700/40 border-slate-600/50 hover:bg-slate-700/80 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs truncate">{stationName}</span>
                        <span className="text-[10px] bg-slate-800 text-cyan-300 px-1.5 py-0.2 rounded-full">
                          {count} iş
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Job preview banner inside map */}
          {activeJob && (
            <div className="relative z-10 bg-slate-800/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white truncate">{activeJob.title}</h4>
                  <p className="text-xs text-slate-300">{activeJob.companyName} • {activeJob.city}</p>
                </div>
              </div>
              <button
                onClick={() => onSelectVacancy(activeJob)}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                Ətraflı Bax
              </button>
            </div>
          )}
        </div>

        {/* Right: Vacancies List next to map */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Xəritəyə Uyğun Elanlar ({filteredVacancies.length})
            </h3>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {filteredVacancies.map((job) => {
              const isSelected = activeJob?.id === job.id;
              const isBookmarked = savedJobIds.includes(job.id);
              return (
                <div
                  key={job.id}
                  onClick={() => {
                    setSelectedVacId(job.id);
                    onSelectVacancy(job);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-medium text-slate-500">{job.companyName}</span>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">{job.title}</h4>
                    </div>
                    {job.metroStation && (
                      <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md shrink-0">
                        m. {job.metroStation}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3 text-xs text-slate-600">
                    <span>{job.city || 'Bakı'}</span>
                    {job.salaryMin && (
                      <span className="font-bold text-emerald-700">
                        {job.salaryMin} {job.currency || 'AZN'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
