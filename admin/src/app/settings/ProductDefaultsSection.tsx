'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Package, Palette, RotateCcw, Plus, Trash2, Shield, Languages } from 'lucide-react';
import { useAdminModal } from '@/lib/AdminModalContext';

export const DEFAULT_FALLBACK_COLORS = [
  { name: 'Natural Oak & Walnut', hex: '#8E5A35', priceAdjustment: 0 },
  { name: 'Dark Oak Relief', hex: '#241810', priceAdjustment: 0 },
  { name: 'Terra Multi-Layer', hex: '#D4A373', priceAdjustment: 0 },
  { name: 'Light Birch & Gold', hex: '#E9D5A1', priceAdjustment: 300 },
  { name: 'Monochrome Silver-Grey', hex: '#4A5568', priceAdjustment: 500 },
];

export const DEFAULT_FALLBACK_HIGHLIGHTS = [
  {
    title: 'Premium Natural Birch Wood',
    titleBn: 'প্রিমিয়াম প্রাকৃতিক বার্চ কাঠ',
    description: 'Handcrafted from 100% natural sustainably harvested birch plywood.',
    descriptionBn: '১০০% প্রাকৃতিক পরিবেশবান্ধব বার্চ কাঠ থেকে নিপুণ কারিগরি দক্ষতায় তৈরি।',
    icon: 'feather',
    sortOrder: 1,
  },
  {
    title: '3D Multi-Layer Relief (3-12mm)',
    titleBn: '৩ডি স্তরযুক্ত নকশা (৩-১২ মিমি)',
    description: 'Multi-tiered elevation and country borders create depth on your wall.',
    descriptionBn: 'বহুস্তরীয় উচ্চতা ও দেশের সীমানা আপনার দেওয়ালে নান্দনিক গভীরতা সৃষ্টি করে।',
    icon: 'layers',
    sortOrder: 2,
  },
  {
    title: 'Laser Precision Engravings',
    titleBn: 'লেজার নির্ভুল খোদাই',
    description: 'Crisp, detailed engraving of country names, capitals, and islands.',
    descriptionBn: 'দেশের নাম, রাজধানী এবং দ্বীপসমূহের অত্যন্ত নিখুঁত ও স্পষ্ট লেজার খোদাই।',
    icon: 'compass',
    sortOrder: 3,
  },
];

interface ProductDefaultsSectionProps {
  settings: Record<string, string>;
  handleChange: (key: string, value: string) => void;
}

export const ProductDefaultsSection = React.memo(function ProductDefaultsSection({ settings, handleChange }: ProductDefaultsSectionProps) {
  const { showSuccess, showWarning, showConfirm } = useAdminModal();
  const [newPresetColorName, setNewPresetColorName] = useState('');
  const [newPresetColorHex, setNewPresetColorHex] = useState('#8E5A35');
  const [newPresetColorPrice, setNewPresetColorPrice] = useState(0);
  const [craftNoticeLangMode, setCraftNoticeLangMode] = useState<'both' | 'en' | 'bn'>('both');
  const [highlightsLangMode, setHighlightsLangMode] = useState<'both' | 'en' | 'bn'>('both');

  const defaultColors = React.useMemo((): { name: string; hex: string; priceAdjustment: number }[] => {
    try {
      if (settings.default_product_colors) {
        const parsed = JSON.parse(settings.default_product_colors);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_FALLBACK_COLORS;
  }, [settings.default_product_colors]);

  const handleAddPresetColor = useCallback(() => {
    if (!newPresetColorName.trim()) {
      showWarning('Please enter a color name.');
      return;
    }
    const updated = [
      ...defaultColors,
      {
        name: newPresetColorName.trim(),
        hex: newPresetColorHex || '#8E5A35',
        priceAdjustment: Number(newPresetColorPrice) || 0,
      },
    ];
    handleChange('default_product_colors', JSON.stringify(updated));
    setNewPresetColorName('');
    setNewPresetColorPrice(0);
  }, [newPresetColorName, newPresetColorHex, newPresetColorPrice, defaultColors, handleChange, showWarning]);

  const handleRemovePresetColor = useCallback((index: number) => {
    const updated = defaultColors.filter((_, i) => i !== index);
    handleChange('default_product_colors', JSON.stringify(updated));
  }, [defaultColors, handleChange]);

  const handleResetColorsToDefault = useCallback(async () => {
    const confirmed = await showConfirm('Reset quick preset colors to system defaults?', {
      title: 'Reset Preset Colors',
      confirmText: 'Reset Defaults',
      confirmVariant: 'primary',
    });
    if (confirmed) {
      handleChange('default_product_colors', JSON.stringify(DEFAULT_FALLBACK_COLORS));
      showSuccess('Preset colors reset to defaults.');
    }
  }, [showConfirm, handleChange, showSuccess]);

  const defaultHighlights = React.useMemo((): any[] => {
    try {
      if (settings.default_product_highlights) {
        const parsed = JSON.parse(settings.default_product_highlights);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_FALLBACK_HIGHLIGHTS;
  }, [settings.default_product_highlights]);

  const handleAddDefaultHighlight = useCallback(() => {
    const updated = [
      ...defaultHighlights,
      {
        title: 'New Feature Highlight',
        titleBn: 'নতুন বৈশিষ্ট্য',
        description: 'Detailed description in English...',
        descriptionBn: 'বিস্তারিত বিবরণ বাংলায়...',
        icon: 'sparkles',
        sortOrder: defaultHighlights.length + 1,
      },
    ];
    handleChange('default_product_highlights', JSON.stringify(updated));
  }, [defaultHighlights, handleChange]);

  const handleUpdateDefaultHighlight = useCallback((index: number, field: string, value: any) => {
    const updated = [...defaultHighlights];
    updated[index] = { ...updated[index], [field]: value };
    handleChange('default_product_highlights', JSON.stringify(updated));
  }, [defaultHighlights, handleChange]);

  const handleRemoveDefaultHighlight = useCallback((index: number) => {
    const updated = defaultHighlights.filter((_, i) => i !== index);
    handleChange('default_product_highlights', JSON.stringify(updated));
  }, [defaultHighlights, handleChange]);

  const handleResetHighlightsToDefault = useCallback(async () => {
    const confirmed = await showConfirm('Reset default bullet highlights to system defaults?', {
      title: 'Reset Highlights',
      confirmText: 'Reset Defaults',
      confirmVariant: 'primary',
    });
    if (confirmed) {
      handleChange('default_product_highlights', JSON.stringify(DEFAULT_FALLBACK_HIGHLIGHTS));
      showSuccess('Product highlights reset to defaults.');
    }
  }, [showConfirm, handleChange, showSuccess]);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-8">
      {/* Tab Header */}
      <div className="flex items-center gap-3 text-slate-900 font-bold border-b border-slate-100 pb-4">
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[#c08a46]">
          <Package className="w-5 h-5" />
        </div>
        <div>
          <span className="text-base font-bold text-slate-900 block">Default Product Configuration & Presets</span>
          <span className="text-xs text-slate-500 font-normal">
            Configure default wood stains (for quick-add buttons), default craftsmanship notice disclaimer, and default bilingual bullet highlights for new products
          </span>
        </div>
      </div>

      {/* SECTION 1: DEFAULT WOOD STAINS & QUICK COLOR PRESETS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
              <Palette className="w-4 h-4 text-[#c08a46]" /> 1. Suggested Default Colors (Quick Colors)
            </h3>
            <p className="text-[11px] text-slate-500">
              These color swatches will be suggested as 1-click quick presets in the product creation and edit pages.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetColorsToDefault}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Colors</span>
          </button>
        </div>

        {/* Active Color Presets List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {defaultColors.map((col, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 hover:border-slate-300 transition-all shadow-2xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded-full border-2 border-white shadow shrink-0"
                  style={{ backgroundColor: col.hex }}
                />
                <div className="min-w-0">
                  <div className="font-bold text-xs text-slate-900 truncate">{col.name}</div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                    <span>{col.hex}</span>
                    {col.priceAdjustment > 0 && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                        +৳{col.priceAdjustment}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemovePresetColor(idx)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                title="Delete color preset"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add New Color Preset Form */}
        <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/80 space-y-3">
          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-[#c08a46]" />
            <span>Add New Color Preset:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-5">
              <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">
                Color / Stain Name
              </label>
              <input
                type="text"
                value={newPresetColorName}
                onChange={(e) => setNewPresetColorName(e.target.value)}
                placeholder="e.g. Royal Ebony Black"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#c08a46]"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">
                Hex Swatch
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newPresetColorHex}
                  onChange={(e) => setNewPresetColorHex(e.target.value)}
                  className="w-8 h-8 p-0.5 rounded-lg border border-slate-200 bg-white cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={newPresetColorHex}
                  onChange={(e) => setNewPresetColorHex(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 font-mono text-xs focus:outline-none focus:border-[#c08a46]"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">
                Extra Cost (৳)
              </label>
              <input
                type="number"
                value={newPresetColorPrice}
                onChange={(e) => setNewPresetColorPrice(Number(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#c08a46]"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={handleAddPresetColor}
                className="w-full px-4 py-2 rounded-xl bg-[#c08a46] hover:bg-[#a87435] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Color</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: DEFAULT WARNING (BILINGUAL) */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
              <Shield className="w-4 h-4 text-[#c08a46]" /> 2. Default Warning
            </h3>
            <p className="text-[11px] text-slate-500">
              This warning automatically fills in for new products to inform customers about handmade grain variations or disclaimers.
            </p>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setCraftNoticeLangMode('en')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                craftNoticeLangMode === 'en' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English (EN)
            </button>
            <button
              type="button"
              onClick={() => setCraftNoticeLangMode('bn')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                craftNoticeLangMode === 'bn' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              বাংলা (BN)
            </button>
            <button
              type="button"
              onClick={() => setCraftNoticeLangMode('both')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                craftNoticeLangMode === 'both' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Side-by-Side
            </button>
          </div>
        </div>

        <div className={`grid gap-4 ${craftNoticeLangMode === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {(craftNoticeLangMode === 'both' || craftNoticeLangMode === 'en') && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Default Warning (English - EN)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono font-bold">
                  EN
                </span>
              </label>
              <textarea
                rows={3}
                value={settings.default_craftsmanship_notice ?? 'Due to 100% natural wood grains, every handmade map is uniquely distinct.'}
                onChange={(e) => handleChange('default_craftsmanship_notice', e.target.value)}
                placeholder="Due to 100% natural wood grains, every handmade map is uniquely distinct."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#c08a46] leading-relaxed"
              />
              <p className="text-[11px] text-slate-400">
                Standard English default warning displayed in product details.
              </p>
            </div>
          )}

          {(craftNoticeLangMode === 'both' || craftNoticeLangMode === 'bn') && (
            <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200 space-y-2">
              <label className="block text-xs font-bold text-emerald-900 flex items-center justify-between">
                <span>ডিফল্ট সতর্কতা নোট (বাংলা - BN)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  বাংলা
                </span>
              </label>
              <textarea
                rows={3}
                value={settings.default_craftsmanship_notice_bn ?? '১০০% প্রাকৃতিক কাঠের রেশম বিন্যাস হওয়ার কারণে প্রতিটি মানচিত্র অনন্য।'}
                onChange={(e) => handleChange('default_craftsmanship_notice_bn', e.target.value)}
                placeholder="১০০% প্রাকৃতিক কাঠের রেশম বিন্যাস হওয়ার কারণে প্রতিটি মানচিত্র অনন্য।"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-600 leading-relaxed"
              />
              <p className="text-[11px] text-emerald-700/70">
                বাংলা ভার্সনে প্রদর্শিত কাঠের প্রাকৃতিক বৈশিষ্ট্যের সতর্কবার্তা।
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: DEFAULT KEY HIGHLIGHTS & BULLET SPECS (BILINGUAL) */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
              <Languages className="w-4 h-4 text-[#c08a46]" /> 3. Default Key Highlights & Bullet Specs (Bilingual)
            </h3>
            <p className="text-[11px] text-slate-500">
              These bullet points and warranty highlights will be automatically assigned to all newly created products.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setHighlightsLangMode('en')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  highlightsLangMode === 'en' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English (EN)
              </button>
              <button
                type="button"
                onClick={() => setHighlightsLangMode('bn')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  highlightsLangMode === 'bn' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                বাংলা (BN)
              </button>
              <button
                type="button"
                onClick={() => setHighlightsLangMode('both')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  highlightsLangMode === 'both' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Side-by-Side
              </button>
            </div>

            <button
              type="button"
              onClick={handleResetHighlightsToDefault}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
              title="Reset highlights to defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={handleAddDefaultHighlight}
              className="px-3 py-1.5 rounded-lg bg-[#c08a46] hover:bg-[#a87435] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Highlight</span>
            </button>
          </div>
        </div>

        {/* Highlights Cards List */}
        <div className="space-y-3.5">
          {defaultHighlights.map((h, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#c08a46] text-white text-xs flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {h.title || `Highlight #${idx + 1}`}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="text-[11px] font-bold">Icon:</span>
                    <select
                      value={h.icon || 'sparkles'}
                      onChange={(e) => handleUpdateDefaultHighlight(idx, 'icon', e.target.value)}
                      className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-medium"
                    >
                      <option value="feather">🪶 Feather / Natural</option>
                      <option value="layers">🥞 Layers / 3D Relief</option>
                      <option value="compass">🧭 Compass / Laser</option>
                      <option value="shield">🛡️ Shield / Quality</option>
                      <option value="sparkles">✨ Sparkles / Premium</option>
                      <option value="check">✅ Checkmark / Warranty</option>
                    </select>
                  </div>
                  {defaultHighlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDefaultHighlight(idx)}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                      title="Remove highlight"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Titles Row */}
              <div className={`grid gap-3 ${highlightsLangMode === 'both' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                {(highlightsLangMode === 'both' || highlightsLangMode === 'en') && (
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">
                      Title (English - EN)
                    </label>
                    <input
                      type="text"
                      value={h.title || ''}
                      onChange={(e) => handleUpdateDefaultHighlight(idx, 'title', e.target.value)}
                      placeholder="e.g. Premium Natural Birch Wood"
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#c08a46]"
                    />
                  </div>
                )}
                {(highlightsLangMode === 'both' || highlightsLangMode === 'bn') && (
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-emerald-800 mb-1">
                      শিরোনাম (বাংলা - BN)
                    </label>
                    <input
                      type="text"
                      value={h.titleBn || ''}
                      onChange={(e) => handleUpdateDefaultHighlight(idx, 'titleBn', e.target.value)}
                      placeholder="যেমন: প্রিমিয়াম প্রাকৃতিক বার্চ কাঠ"
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-emerald-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                )}
              </div>

              {/* Descriptions Row */}
              <div className={`grid gap-3 ${highlightsLangMode === 'both' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                {(highlightsLangMode === 'both' || highlightsLangMode === 'en') && (
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-600 mb-1">
                      Description (English - EN)
                    </label>
                    <textarea
                      rows={2}
                      value={h.description || ''}
                      onChange={(e) => handleUpdateDefaultHighlight(idx, 'description', e.target.value)}
                      placeholder="Handcrafted from 100% natural sustainably harvested birch plywood."
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-[#c08a46]"
                    />
                  </div>
                )}
                {(highlightsLangMode === 'both' || highlightsLangMode === 'bn') && (
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-emerald-800 mb-1">
                      বিবরণ (বাংলা - BN)
                    </label>
                    <textarea
                      rows={2}
                      value={h.descriptionBn || ''}
                      onChange={(e) => handleUpdateDefaultHighlight(idx, 'descriptionBn', e.target.value)}
                      placeholder="১০০% প্রাকৃতিক পরিবেশবান্ধব বার্চ কাঠ থেকে নিপুণ কারিগরি দক্ষতায় তৈরি।"
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-emerald-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default ProductDefaultsSection;
