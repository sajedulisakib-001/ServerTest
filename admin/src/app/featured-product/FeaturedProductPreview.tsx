'use client';

import React from 'react';
import { Eye, ArrowRight, ShoppingBag, Save } from 'lucide-react';

interface FeaturedProductPreviewProps {
  previewLang: 'bn' | 'en';
  setPreviewLang: (lang: 'bn' | 'en') => void;
  prevSecTitle: string;
  prevSecSubtitle: string;
  displayImage: string;
  prevTitle: string;
  prevTagline: string;
  prevDesc: string;
  prevBadge: string;
  prevPriceNote: string;
  prevHighlights: string[];
  prevBtnView: string;
  prevBtnBuy: string;
  price: number;
  origPrice: number;
  onSave: () => void;
  saving: boolean;
}

export const FeaturedProductPreview = React.memo(function FeaturedProductPreview({
  previewLang,
  setPreviewLang,
  prevSecTitle,
  prevSecSubtitle,
  displayImage,
  prevTitle,
  prevTagline,
  prevDesc,
  prevBadge,
  prevPriceNote,
  prevHighlights,
  prevBtnView,
  prevBtnBuy,
  price,
  origPrice,
  onSave,
  saving,
}: FeaturedProductPreviewProps) {
  return (
    <div className="lg:col-span-5 space-y-4">
      <div className="sticky top-24 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#c08a46]" /> Real-time Storefront Preview
          </span>
          
          {/* Preview Language Toggle */}
          <div className="flex items-center gap-1 bg-slate-200 p-0.5 rounded-lg text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setPreviewLang('bn')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                previewLang === 'bn' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              বাংলা
            </button>
            <button
              type="button"
              onClick={() => setPreviewLang('en')}
              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                previewLang === 'en' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Preview Container simulating luxury storefront theme */}
        <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#e2d7cc] shadow-xl space-y-6">
          {/* Section Header */}
          <div className="text-center space-y-1">
            <h3 className="font-serif text-xl font-black text-[#2B1D14] tracking-tight">
              {prevSecTitle || (previewLang === 'bn' ? 'ওয়ার্ল্ড ম্যাপ' : 'World Map')}
            </h3>
            {prevSecSubtitle && (
              <p className="text-xs text-[#64748B]">{prevSecSubtitle}</p>
            )}
            <div className="w-12 h-0.5 bg-[#c08a46] mx-auto mt-2 rounded-full opacity-60" />
          </div>

          {/* The 2-Row Showcase Card */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8ded3] shadow-md space-y-5">
            {/* ROW 1: 2 Sections (Image + Custom Info) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* Section 1: Product Image */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shadow-inner group">
                <img
                  src={displayImage}
                  alt={prevTitle || 'Featured Product'}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {prevBadge && (
                  <span className="absolute top-2.5 left-2.5 bg-[#121519]/80 backdrop-blur-xs text-[#dfc276] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#dfc276]/30">
                    {prevBadge}
                  </span>
                )}
              </div>

              {/* Section 2: Custom Information */}
              <div className="space-y-2.5">
                {prevPriceNote && (
                  <span className="inline-block bg-[#fee2e2] text-[#991b1b] text-[10px] font-black px-2 py-0.5 rounded border border-[#f87171]/40">
                    {prevPriceNote}
                  </span>
                )}

                <h4 className="font-serif font-black text-slate-900 text-base leading-snug">
                  {prevTitle || 'Product Title'}
                </h4>

                {prevTagline && (
                  <p className="text-[11px] text-[#8e5a35] font-bold leading-tight">
                    {prevTagline}
                  </p>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-2 pt-0.5">
                  <span className="font-serif text-lg font-black text-[#2B1D14]">
                    ৳ {price.toLocaleString()}
                  </span>
                  {origPrice > price && (
                    <span className="text-xs text-slate-400 line-through">
                      ৳ {origPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                  {prevDesc || 'Exclusive artisanal handcrafted wooden map.'}
                </div>

                {/* Feature Pills */}
                {prevHighlights.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {prevHighlights.slice(0, 3).map((h, i) => (
                      <span
                        key={i}
                        className="text-[9.5px] font-bold text-[#8e5a35] bg-[#FAF3EB] px-2 py-0.5 rounded border border-[#ebdccc]"
                      >
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ROW 2: Two Buttons (View Details + Buy Now) */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#f0e8df]">
              <button
                type="button"
                className="w-full py-2.5 px-3 rounded-xl border-1.5 border-[#2B1D14] text-[#2B1D14] font-bold text-xs hover:bg-[#FAF3EB] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{prevBtnView}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#8E5A35] to-[#C08A46] text-white font-bold text-xs shadow hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{prevBtnBuy}</span>
              </button>
            </div>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Apply & Save Showcase'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default FeaturedProductPreview;
