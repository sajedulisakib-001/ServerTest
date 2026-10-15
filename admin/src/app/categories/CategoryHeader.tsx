'use client';

import React from 'react';
import { FolderTree, X, Languages, Sparkles } from 'lucide-react';

interface CategoryHeaderProps {
  isEditing: boolean;
  onResetForm: () => void;
  onAutoTranslate: () => void;
  translateLoading: boolean;
  onAiProofread: () => void;
  aiLoading: boolean;
}

export const CategoryHeader = React.memo(function CategoryHeader({
  isEditing,
  onResetForm,
  onAutoTranslate,
  translateLoading,
  onAiProofread,
  aiLoading,
}: CategoryHeaderProps) {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-100 text-[#c08a46]">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Category Management</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Organize categories with imagery, sorting, and bilingual (English & বাংলা) copy
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {isEditing && (
          <button
            type="button"
            onClick={onResetForm}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Cancel Edit
          </button>
        )}

        <button
          type="button"
          onClick={onAutoTranslate}
          disabled={translateLoading}
          className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <Languages className="w-3.5 h-3.5 text-[#c08a46]" />
          <span>{translateLoading ? 'Translating...' : 'Auto-Translate (EN ➔ বাংলা)'}</span>
        </button>

        <button
          type="button"
          onClick={onAiProofread}
          disabled={aiLoading}
          className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>{aiLoading ? 'Proofreading...' : 'AI Auto-Proofread (EN & বাংলা)'}</span>
        </button>
      </div>
    </div>
  );
});

export default CategoryHeader;
