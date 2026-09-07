import React, { useState } from 'react';
import { JobOfferTemplate } from '../../types';
import { X, FileText, Plus, Trash2, Check, Edit2 } from 'lucide-react';

interface JobOfferTemplatesModalProps {
  templates: JobOfferTemplate[];
  onUpdateTemplates: (templates: JobOfferTemplate[]) => void;
  onClose: () => void;
}

export const JobOfferTemplatesModal: React.FC<JobOfferTemplatesModalProps> = ({
  templates,
  onUpdateTemplates,
  onClose,
}) => {
  const [templateList, setTemplateList] = useState<JobOfferTemplate[]>(templates);
  const [newTitle, setNewTitle] = useState('');
  const [newPosition, setNewPosition] = useState('');

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    const newTmpl: JobOfferTemplate = {
      id: `tmpl-${Date.now()}`,
      title: newTitle.trim(),
      position: newPosition.trim() || 'Mütəxəssis',
      defaultGrossSalary: 2000,
      employmentType: 'Tam Ştat',
      workLocation: 'Bakı, Ofis',
      probationPeriod: '3 ay',
      defaultBenefits: ['Tibbi Sığorta', 'Nahar Təminatı'],
      createdAt: new Date().toISOString(),
    };
    const updated = [...templateList, newTmpl];
    setTemplateList(updated);
    onUpdateTemplates(updated);
    setNewTitle('');
    setNewPosition('');
  };

  const handleDelete = (id: string) => {
    const updated = templateList.filter((t) => t.id !== id);
    setTemplateList(updated);
    onUpdateTemplates(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">İş Təklifi Şablonları</h3>
              <p className="text-[11px] text-slate-500">Standart offer şablonlarını idarə edin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs text-slate-700">
          {/* Add form */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <span className="font-bold text-slate-800 block text-[11px] uppercase">Yeni Şablon Əlavə Et</span>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Şablon Adı (məs: Senior Dev Offer)"
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20"
              />
              <input
                type="text"
                value={newPosition}
                onChange={(e) => setNewPosition(e.target.value)}
                placeholder="Vəzifə Adı"
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={!newTitle.trim()}
              className="px-4 py-1.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
            >
              Şablonu Saxla
            </button>
          </div>

          {/* List */}
          <div className="space-y-2">
            {templateList.map((tmpl) => (
              <div
                key={tmpl.id}
                className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-2xs"
              >
                <div>
                  <h4 className="font-bold text-slate-900">{tmpl.title}</h4>
                  <span className="text-slate-500 text-[11px]">{tmpl.position} • Gross: {tmpl.defaultGrossSalary} AZN</span>
                </div>
                <button
                  onClick={() => handleDelete(tmpl.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
