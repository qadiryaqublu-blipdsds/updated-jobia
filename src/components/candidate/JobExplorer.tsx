import React, { useState, useMemo } from 'react';
import { Vacancy, User, CVData } from '../../types';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Bookmark, 
  BookmarkCheck, 
  TrendingUp, 
  SlidersHorizontal, 
  Sparkles, 
  Building2, 
  ArrowRight, 
  Check, 
  HelpCircle,
  Compass,
  Calculator,
  X
} from 'lucide-react';
import { calculateApplicationMatchScore } from '../../utils/applicationMatcher';
import { useLanguage } from '../../context/LanguageContext';

interface JobExplorerProps {
  vacancies: Vacancy[];
  onSelectVacancy: (vacancy: Vacancy) => void;
  savedJobIds?: string[];
  onToggleBookmark?: (vacancyId: string) => void;
  jobNotes?: Record<string, string>;
  onSaveJobNote?: (vacancyId: string, note: string) => void;
  selectedCompany?: string | null;
  onSelectCompany?: (companyName: string | null) => void;
  onQuickApply?: (vacancy: Vacancy) => void;
  onOpenSalaryTrends?: () => void;
  onOpenNearbyMap?: () => void;
  onOpenCalculia?: () => void;
  onOpenIntroTour?: () => void;
  userCV?: CVData | null;
  currentUser?: User | null;
  onShowToast?: (msg: string) => void;
}

export const JobExplorer: React.FC<JobExplorerProps> = ({
  vacancies,
  onSelectVacancy,
  savedJobIds = [],
  onToggleBookmark,
  jobNotes = {},
  onSaveJobNote,
  selectedCompany = null,
  onSelectCompany,
  onQuickApply,
  onOpenSalaryTrends,
  onOpenNearbyMap,
  onOpenCalculia,
  onOpenIntroTour,
  userCV,
  currentUser,
  onShowToast,
}) => {
  const { dict } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'salary' | 'match'>('newest');

  // Categories extraction
  const categories = useMemo(() => {
    const set = new Set<string>();
    vacancies.forEach((v) => {
      if (v.category) set.add(v.category);
    });
    return Array.from(set);
  }, [vacancies]);

  // Locations extraction
  const locations = useMemo(() => {
    const set = new Set<string>();
    vacancies.forEach((v) => {
      if (v.city) set.add(v.city);
    });
    return Array.from(set);
  }, [vacancies]);

  // Filtered & Sorted Vacancies
  const filteredVacancies = useMemo(() => {
    return vacancies
      .filter((v) => {
        if (selectedCompany && v.companyName !== selectedCompany) return false;
        if (onlyBookmarked && !savedJobIds.includes(v.id)) return false;
        if (selectedCategory !== 'all' && v.category !== selectedCategory) return false;
        if (selectedLocation !== 'all' && v.city !== selectedLocation) return false;
        if (selectedType !== 'all' && v.employmentType !== selectedType) return false;

        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchTitle = v.title.toLowerCase().includes(q);
          const matchCompany = v.companyName.toLowerCase().includes(q);
          const matchSkills = (v.skills || []).some((s) => s.toLowerCase().includes(q));
          const matchDesc = (v.description || '').toLowerCase().includes(q);
          if (!matchTitle && !matchCompany && !matchSkills && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'salary') {
          const salA = a.salaryMax || a.salaryMin || 0;
          const salB = b.salaryMax || b.salaryMin || 0;
          return salB - salA;
        }
        if (sortBy === 'match' && userCV) {
          const scoreA = calculateApplicationMatchScore(a, userCV).overallScore;
          const scoreB = calculateApplicationMatchScore(b, userCV).overallScore;
          return scoreB - scoreA;
        }
        // Default newest
        return new Date(b.createdAt || b.postedDate || '').getTime() - new Date(a.createdAt || a.postedDate || '').getTime();
      });
  }, [
    vacancies,
    selectedCompany,
    onlyBookmarked,
    savedJobIds,
    selectedCategory,
    selectedLocation,
    selectedType,
    searchTerm,
    sortBy,
    userCV,
  ]);

  return (
    <div className="space-y-6">
      {/* Top Banner / Utility Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Aktiv Vakansiyalar və İş İmkanları
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Azərbaycan üzrə ən son təsdiqlənmiş iş elanları, maaş şəffaflığı və ağıllı namizəd uyğunluğu.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenNearbyMap && (
              <button
                type="button"
                onClick={onOpenNearbyMap}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Yaxınlıqdakı İşlər</span>
              </button>
            )}
            {onOpenSalaryTrends && (
              <button
                type="button"
                onClick={onOpenSalaryTrends}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Bazar Maaş Trendləri</span>
              </button>
            )}
            {onOpenCalculia && (
              <button
                type="button"
                onClick={onOpenCalculia}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-purple-600" />
                <span>Maaş & Məzuniyyət</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Main Filter Controls */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Vəzifə, şirkət adı və ya bacarıq axtarın..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
            >
              <option value="all">Bütün Sahələr</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
            >
              <option value="all">Bütün Şəhərlər</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
            >
              <option value="newest">Ən Yenilər</option>
              <option value="salary">Yüksək Maaş</option>
              {userCV && <option value="match">AI CV Uyğunluğu</option>}
            </select>
          </div>
        </div>

        {/* Selected company filter pill if any */}
        {selectedCompany && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Şirkət filtri:</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
              <Building2 className="w-3 h-3" />
              {selectedCompany}
              <button
                onClick={() => onSelectCompany?.(null)}
                className="hover:text-blue-900 ml-1 cursor-pointer"
              >
                ×
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Results Count & Bookmarks toggle */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Tapılan vakansiyalar: <span className="text-slate-900 font-extrabold">{filteredVacancies.length}</span>
        </span>

        <button
          type="button"
          onClick={() => setOnlyBookmarked(!onlyBookmarked)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            onlyBookmarked
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          {onlyBookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
          <span>Yadda saxlananlar ({savedJobIds.length})</span>
        </button>
      </div>

      {/* Vacancies Grid / List */}
      {filteredVacancies.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Axtarışa uyğun vakansiya tapılmadı</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Axtarış sözlərini dəyişdirərək və ya filtrləri sıfırlayaraq yenidən cəhd edin.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedLocation('all');
              setSelectedType('all');
              setOnlyBookmarked(false);
              onSelectCompany?.(null);
            }}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Filtrləri Sıfırla
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVacancies.map((vacancy) => {
            const isBookmarked = savedJobIds.includes(vacancy.id);
            const match = userCV ? calculateApplicationMatchScore(vacancy, userCV) : null;

            return (
              <div
                key={vacancy.id}
                onClick={() => onSelectVacancy(vacancy)}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Top row: Logo, Company, Title, Bookmark */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      {vacancy.companyLogo ? (
                        <img
                          src={vacancy.companyLogo}
                          alt={vacancy.companyName}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-xl object-contain border border-slate-100 bg-slate-50 p-1 shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-sm shrink-0 border border-blue-100">
                          {vacancy.companyName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectCompany?.(vacancy.companyName);
                            }}
                            className="text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
                          >
                            {vacancy.companyName}
                          </span>
                          {vacancy.isFeatured && (
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              VIP
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mt-0.5">
                          {vacancy.title}
                        </h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark?.(vacancy.id);
                        onShowToast?.(
                          isBookmarked ? 'Vakansiya saxlananlardan silindi.' : 'Vakansiya yadda saxlanıldı.'
                        );
                      }}
                      className={`p-2 rounded-xl transition-colors cursor-pointer shrink-0 ${
                        isBookmarked
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Badges row: City, Employment, Salary */}
                  <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
                    {vacancy.city && (
                      <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {vacancy.city}
                      </span>
                    )}
                    {vacancy.employmentType && (
                      <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        {vacancy.employmentType}
                      </span>
                    )}
                    {(vacancy.salaryMin || vacancy.salaryMax) && (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-lg">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        {vacancy.salaryMin && vacancy.salaryMax
                          ? `${vacancy.salaryMin} - ${vacancy.salaryMax} ${vacancy.currency || 'AZN'}`
                          : vacancy.salaryMin
                          ? `min. ${vacancy.salaryMin} ${vacancy.currency || 'AZN'}`
                          : `max. ${vacancy.salaryMax} ${vacancy.currency || 'AZN'}`}
                      </span>
                    )}
                  </div>

                  {/* Skills tags */}
                  {vacancy.skills && vacancy.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {vacancy.skills.slice(0, 4).map((sk) => (
                        <span
                          key={sk}
                          className="text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md"
                        >
                          {sk}
                        </span>
                      ))}
                      {vacancy.skills.length > 4 && (
                        <span className="text-[11px] text-slate-400 font-medium self-center">
                          +{vacancy.skills.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Row: AI Match Score & Action */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {match ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span className="text-slate-600">Uyğunluq:</span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-xs ${
                          match.overallScore >= 80
                            ? 'bg-emerald-100 text-emerald-800'
                            : match.overallScore >= 60
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        %{match.overallScore}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400">
                      {vacancy.postedDate || 'Bu gün'}
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    {onQuickApply && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickApply(vacancy);
                        }}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                      >
                        Tez Müraciət
                      </button>
                    )}
                    <span className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
