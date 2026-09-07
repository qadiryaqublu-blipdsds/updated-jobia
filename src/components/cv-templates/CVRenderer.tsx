import React from 'react';
import { CVData } from '../../types';
import { TemplateHorizon } from './TemplateHorizon';
import { TemplateNordic } from './TemplateNordic';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Award, Briefcase, GraduationCap, Code } from 'lucide-react';
import { getCVTerms, getPhotoClasses } from './cvDictionary';

interface CVRendererProps {
  data?: CVData | null;
  template?: string;
  showPhoto?: boolean;
  id?: string;
  className?: string;
}

export const CVRenderer: React.FC<CVRendererProps> = ({
  data,
  template = 'horizon',
  showPhoto = true,
  id = 'cv-renderer-preview',
  className = '',
}) => {
  if (!data || !data.personalInfo) {
    return (
      <div id={id} className={`bg-white p-12 text-center rounded-xl border border-slate-200 shadow-sm ${className}`}>
        <p className="text-slate-500 font-medium">CV məlumatları tapılmadı və ya hələ daxil edilməyib.</p>
      </div>
    );
  }

  // Route to specific template components if match
  if (template === 'horizon') {
    return (
      <div id={id} className={className}>
        <TemplateHorizon data={data} showPhoto={showPhoto} />
      </div>
    );
  }

  if (template === 'nordic') {
    return (
      <div id={id} className={className}>
        <TemplateNordic data={data} showPhoto={showPhoto} />
      </div>
    );
  }

  // Default clean multi-template renderer (Emerald, ATS, Tech, etc.)
  const { personalInfo, experiences, education, skills, languages, projects, certificates, language } = data;
  const terms = getCVTerms(language);
  const displayPhoto = showPhoto && !!personalInfo.photoUrl;

  const isEmerald = template.includes('emerald');
  const isATS = template.includes('ats');
  const isTech = template.includes('tech');

  const accentColorClass = isEmerald
    ? 'text-emerald-700 border-emerald-600 bg-emerald-50'
    : isTech
    ? 'text-sky-700 border-sky-600 bg-sky-50'
    : 'text-blue-700 border-blue-600 bg-blue-50';

  const headingBorderClass = isEmerald ? 'border-emerald-600' : isTech ? 'border-sky-600' : 'border-slate-800';

  return (
    <div
      id={id}
      className={`bg-white text-slate-800 p-8 sm:p-10 rounded-xl shadow-sm border border-slate-200 font-sans max-w-[850px] mx-auto min-h-[1050px] ${className}`}
    >
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {personalInfo.fullName || 'Ad Soyad'}
            </h1>
            <p className="text-lg font-semibold text-blue-600 mt-1">
              {personalInfo.jobTitle || 'Peşə / Vəzifə'}
            </p>
            {personalInfo.summary && (
              <p className="text-sm text-slate-600 mt-3 leading-relaxed max-w-2xl">
                {personalInfo.summary}
              </p>
            )}

            {/* Contact links */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 text-xs text-slate-600">
              {personalInfo.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {personalInfo.email}
                </span>
              )}
              {personalInfo.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {personalInfo.phone}
                </span>
              )}
              {personalInfo.city && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {personalInfo.city}
                </span>
              )}
              {personalInfo.socialLinks?.linkedin && (
                <span className="flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5 text-slate-400" />
                  {personalInfo.socialLinks.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
                </span>
              )}
              {personalInfo.socialLinks?.github && (
                <span className="flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-slate-400" />
                  {personalInfo.socialLinks.github.replace(/^https?:\/\/(www\.)?/, '')}
                </span>
              )}
            </div>
          </div>

          {displayPhoto && (
            <div className="shrink-0">
              <img
                src={personalInfo.photoUrl}
                alt={personalInfo.fullName}
                referrerPolicy="no-referrer"
                className={`object-cover border-2 border-slate-200 shadow-sm ${getPhotoClasses(
                  data.photoSize || personalInfo.photoSize,
                  data.photoShape || personalInfo.photoShape
                )}`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-6">
        {/* Experience */}
        {experiences && experiences.length > 0 && (
          <div>
            <h2 className={`text-base font-bold uppercase tracking-wider text-slate-900 border-b-2 ${headingBorderClass} pb-1 mb-4 flex items-center gap-2`}>
              <Briefcase className="w-4 h-4 text-blue-600" />
              {terms.experience}
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm">
                    <span className="font-bold text-slate-900">{exp.position}</span>
                    <span className="text-xs text-slate-500 font-medium">
                      {exp.startDate} — {exp.current ? (terms.current || terms.present) : exp.endDate}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-blue-600">{exp.company}</div>
                  {exp.description && (
                    <p className="text-xs text-slate-600 leading-relaxed mt-1 whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5 mt-1 pl-1">
                      {exp.achievements.map((ach, i) => (
                        <li key={i}>{ach}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div>
            <h2 className={`text-base font-bold uppercase tracking-wider text-slate-900 border-b-2 ${headingBorderClass} pb-1 mb-4 flex items-center gap-2`}>
              <GraduationCap className="w-4 h-4 text-blue-600" />
              {terms.education}
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="text-sm">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900">{edu.institution}</span>
                    <span className="text-xs text-slate-500">
                      {edu.startDate} — {edu.endDate}
                    </span>
                  </div>
                  <div className="text-xs text-slate-700">
                    {edu.degree} {edu.field ? `— ${edu.field}` : ''}
                    {edu.gpa && <span className="ml-2 text-slate-500 font-medium">GPA: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div>
            <h2 className={`text-base font-bold uppercase tracking-wider text-slate-900 border-b-2 ${headingBorderClass} pb-1 mb-3 flex items-center gap-2`}>
              <Code className="w-4 h-4 text-blue-600" />
              {terms.skills}
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((sk) => (
                <span
                  key={sk.id}
                  className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200"
                >
                  {sk.name}
                  {sk.level && <span className="text-[10px] text-slate-500 ml-1.5 font-normal">({sk.level})</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages & Certificates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {languages && languages.length > 0 && (
            <div>
              <h2 className={`text-base font-bold uppercase tracking-wider text-slate-900 border-b-2 ${headingBorderClass} pb-1 mb-3 flex items-center gap-2`}>
                <Globe className="w-4 h-4 text-blue-600" />
                {terms.languages}
              </h2>
              <div className="space-y-1.5 text-xs text-slate-700">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between">
                    <span className="font-semibold">{l.language}</span>
                    <span className="text-slate-500">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certificates && certificates.length > 0 && (
            <div>
              <h2 className={`text-base font-bold uppercase tracking-wider text-slate-900 border-b-2 ${headingBorderClass} pb-1 mb-3 flex items-center gap-2`}>
                <Award className="w-4 h-4 text-blue-600" />
                {terms.certificates}
              </h2>
              <div className="space-y-2 text-xs text-slate-700">
                {certificates.map((c) => (
                  <div key={c.id}>
                    <div className="font-semibold text-slate-900">{c.name}</div>
                    <div className="text-slate-500">{c.issuer} {c.date && `• ${c.date}`}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
