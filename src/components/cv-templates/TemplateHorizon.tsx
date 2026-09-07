import React from 'react';
import { CVData } from '../../types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Award } from 'lucide-react';
import { getCVTerms, getPhotoClasses } from './cvDictionary';

interface TemplateProps {
  data: CVData;
  showPhoto?: boolean;
}

export const TemplateHorizon: React.FC<TemplateProps> = ({ data, showPhoto = true }) => {
  const { personalInfo, experiences, education, skills, languages, projects, certificates, language } = data;
  const terms = getCVTerms(language);
  const displayPhoto = showPhoto && !!personalInfo.photoUrl;

  return (
    <div id="cv-preview-horizon" className="bg-white text-slate-800 p-8 rounded-lg shadow-sm border border-slate-200 font-sans max-w-[850px] mx-auto min-h-[1050px]">
      {/* Horizon Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-6 -mx-8 -mt-8 mb-8 rounded-t-lg shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
          <div className="text-center sm:text-left flex-1 min-w-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-white break-words">
              {personalInfo.fullName || terms.fullNamePlaceholder}
            </h1>
            <p className="text-sm font-semibold text-blue-200 mt-1 uppercase tracking-wider break-words">
              {personalInfo.jobTitle || terms.jobTitlePlaceholder}
            </p>
          </div>

          {displayPhoto && (
            <div className="shrink-0">
              <img
                src={personalInfo.photoUrl}
                alt={personalInfo.fullName || terms.candidate}
                className={`${getPhotoClasses(personalInfo.photoSize, personalInfo.photoShape)} border-4 border-white shadow-lg bg-slate-100 ring-2 ring-blue-400`}
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>

        {/* Contact Links */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-1.5 gap-x-4 mt-4 pt-3 border-t border-blue-500/50 text-xs text-blue-100">
          {personalInfo.email && (
            <div className="flex items-center gap-1.5 min-w-0 max-w-full">
              <Mail className="w-3.5 h-3.5 text-blue-300 shrink-0" />
              <span className="break-all">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1.5 min-w-0 max-w-full">
              <Phone className="w-3.5 h-3.5 text-blue-300 shrink-0" />
              <span className="break-all">{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.address && (
            <div className="flex items-center gap-1.5 min-w-0 max-w-full">
              <MapPin className="w-3.5 h-3.5 text-blue-300 shrink-0" />
              <span className="break-words">{personalInfo.address}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-1.5 min-w-0 max-w-full">
              <Linkedin className="w-3.5 h-3.5 text-blue-300 shrink-0" />
              <span className="truncate max-w-[150px]">{personalInfo.linkedin.replace(/^https?:\/\//, '')}</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-1.5 min-w-0 max-w-full">
              <Github className="w-3.5 h-3.5 text-blue-300 shrink-0" />
              <span className="truncate max-w-[150px]">{personalInfo.github.replace(/^https?:\/\//, '')}</span>
            </div>
          )}
          {personalInfo.portfolio && (
            <div className="flex items-center gap-1.5 min-w-0 max-w-full">
              <Globe className="w-3.5 h-3.5 text-blue-300 shrink-0" />
              <span className="truncate max-w-[150px]">{personalInfo.portfolio.replace(/^https?:\/\//, '')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 border-b border-slate-200 pb-1 mb-2">
            {terms.aboutMe || terms.summary}
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line break-words">{personalInfo.summary}</p>
        </div>
      )}

      {/* 2-Column Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Main 2 Cols */}
        <div className="col-span-8 space-y-6 min-w-0">
          {/* Experience */}
          {experiences && experiences.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 border-b border-slate-200 pb-1 mb-3">
                {terms.experience}
              </h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-3 border-l-2 border-blue-500 min-w-0">
                    <div className="flex justify-between items-baseline flex-wrap gap-x-2 gap-y-1">
                      <h3 className="text-xs font-bold text-slate-900 break-words flex-1 min-w-0">{exp.position}</h3>
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded whitespace-nowrap shrink-0">
                        {exp.startDate} – {exp.current ? terms.present : exp.endDate}
                      </span>
                    </div>
                    <div className="text-[11px] font-medium text-slate-600 mb-1 break-words">
                      {exp.company} {exp.location ? `• ${exp.location}` : ''}
                    </div>
                    <div className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line break-words">
                      {exp.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 border-b border-slate-200 pb-1 mb-3">
                {terms.projects}
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 min-w-0">
                    <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
                      <h3 className="text-xs font-bold text-slate-900 break-words flex-1 min-w-0">{proj.title}</h3>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 font-semibold hover:underline shrink-0">
                          {terms.portfolio || 'Link ↗'}
                        </a>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-600 mb-1.5 break-words whitespace-pre-line">{proj.description}</p>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {proj.technologies.map((t, idx) => (
                          <span key={idx} className="text-[9px] font-medium bg-white text-blue-800 px-1.5 py-0.5 rounded border border-blue-200 break-words">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar 1 Col */}
        <div className="col-span-4 space-y-6 min-w-0">
          {/* Skills */}
          {skills && skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 border-b border-slate-200 pb-1 mb-3">
                {terms.skills}
              </h2>
              <div className="flex flex-wrap gap-1">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="text-[10px] font-medium bg-blue-50 text-blue-800 px-2 py-1 rounded border border-blue-100"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 border-b border-slate-200 pb-1 mb-3">
                {terms.education}
              </h2>
              <div className="space-y-2.5">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <h3 className="font-bold text-slate-900 text-[11px]">{edu.degree}</h3>
                    <p className="text-blue-700 font-medium text-[11px]">{edu.fieldOfStudy}</p>
                    <p className="text-slate-500 text-[10px]">{edu.institution}</p>
                    <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                      <span>{edu.startDate} – {edu.endDate}</span>
                      {edu.gpa && <span className="font-semibold text-slate-600">GPA: {edu.gpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 border-b border-slate-200 pb-1 mb-2">
                {terms.languages}
              </h2>
              <div className="space-y-1 text-xs">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between py-1 border-b border-slate-100">
                    <span className="font-medium text-slate-800 text-[11px]">{lang.language}</span>
                    <span className="text-blue-700 text-[10px] font-semibold">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificates */}
          {certificates && certificates.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 border-b border-slate-200 pb-1 mb-2">
                {terms.certificates}
              </h2>
              <div className="space-y-1.5 text-xs">
                {certificates.map((cert) => (
                  <div key={cert.id} className="text-[11px]">
                    <div className="font-semibold text-slate-900 flex items-center gap-1">
                      <Award className="w-3 h-3 text-blue-600 shrink-0" />
                      <span>{cert.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 pl-4">{cert.issuer} ({cert.issueDate})</div>
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
