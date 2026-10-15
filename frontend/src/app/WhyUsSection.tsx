'use client';

import React from 'react';
import { Gem, Trees, Layers, Award, Truck } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface WhyUsSectionProps {
  settings?: Record<string, string>;
}

export const WhyUsSection = React.memo(function WhyUsSection({ settings }: WhyUsSectionProps) {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Trees className="w-7 h-7" />,
      faIcon: 'fa-solid fa-tree',
      title: t('why_feat_1_title', '১০০% অরিজিনাল বার্চ প্লাইউড'),
      desc: t(
        'why_feat_1_desc',
        'আমদানিকৃত উন্নতমানের গ্রেড-এ বার্চ কাঠ ব্যবহার করা হয়, যা আবহাওয়া ও আর্দ্রতা প্রতিরোধী।'
      ),
    },
    {
      icon: <Layers className="w-7 h-7" />,
      faIcon: 'fa-solid fa-layer-group',
      title: t('why_feat_2_title', '৩ডি মাল্টি-লেয়ারড গভীরতা'),
      desc: t(
        'why_feat_2_desc',
        'বিভিন্ন শেড এবং ভিন্ন ভিন্ন গভীরতার কাঠের নিখুঁত জোড়া দিয়ে দেয়ালে এনে দেয় বাস্তবসম্মত ত্রিমাত্রিক রূপ।'
      ),
    },
    {
      icon: <Award className="w-7 h-7" />,
      faIcon: 'fa-solid fa-certificate',
      title: t('why_feat_3_title', 'লাইফটাইম ক্রাফটম্যানশিপ'),
      desc: t(
        'why_feat_3_desc',
        'লেজার কাটিং এবং দক্ষ শিল্পীদের হাতের পলিশে প্রস্তুত হওয়ায় বছরের পর বছর ধরে নতুনের মতো ঔজ্জ্বল্য থাকে।'
      ),
    },
    {
      icon: <Truck className="w-7 h-7" />,
      faIcon: 'fa-solid fa-truck-fast',
      title: t('why_feat_4_title', 'নিরাপদ ডেলিভারি ও সাপোর্ট'),
      desc: t(
        'why_feat_4_desc',
        'বিশেষ থ্রি-প্লাই বাবল ও কাঠের ফ্রেমিং প্যাকেজিং সহ সারাদেশে হোম ডেলিভারি ও ফ্রি ইনস্টলেশন গাইড।'
      ),
    },
  ];

  return (
    <section
      className="home-section home-why-us-section py-14 sm:py-20 bg-[#FBF8F4] border-t border-[#8E5A35]/10"
      id="why-us"
      aria-label={t('why_us_title', 'কেন উডেন মীর?')}
    >
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="home-section-head text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#FAF3EB] text-[#8E5A35] border border-[#C08A46]/20 mb-3.5 shadow-2xs">
            <Gem className="w-3.5 h-3.5 text-[#C08A46]" />
            <span>{t('why_us_badge', 'শ্রেষ্ঠত্বের প্রতিশ্রুতি')}</span>
          </div>
          <h2 className="home-section-title text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2C1810] tracking-tight">
            {t('why_us_title', 'কেন উডেন মীর সেরা পছন্দ?')}
          </h2>
          <p className="home-section-sub text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {t(
              'why_us_sub',
              'আমাদের প্রতিটি কাঠের শিল্পকর্মে থাকে দীর্ঘস্থায়ী মান, নিখুঁত কারিগরি এবং নান্দনিক আভিজাত্যের স্পর্শ'
            )}
          </p>
        </div>

        {/* 4-Column Feature Grid */}
        <div className="why-us-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="why-us-card group relative p-6 sm:p-7 rounded-2xl bg-white border border-[#8E5A35]/15 hover:border-[#8E5A35]/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center overflow-hidden"
            >
              {/* Subtle Ambient Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#FAF3EB]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Icon Container */}
              <div className="why-us-icon-wrapper w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FAF3EB] to-[#F5ECE1] border border-[#C08A46]/30 flex items-center justify-center text-[#8E5A35] group-hover:scale-110 group-hover:text-[#C08A46] group-hover:border-[#C08A46]/60 group-hover:shadow-md transition-all duration-300 mb-5 shrink-0 relative z-10">
                {feat.icon}
              </div>

              {/* Title */}
              <h3 className="why-us-card-title font-extrabold text-[#2C1810] text-base sm:text-[1.05rem] leading-snug mb-2.5 group-hover:text-[#8E5A35] transition-colors relative z-10">
                {feat.title}
              </h3>

              {/* Description */}
              <p className="why-us-card-desc text-stone-600 text-xs sm:text-sm leading-relaxed m-0 relative z-10 flex-1">
                {feat.desc}
              </p>

              {/* Micro-interaction underline */}
              <div className="w-8 h-0.5 bg-[#C08A46]/25 group-hover:w-14 group-hover:bg-[#C08A46] transition-all duration-300 mt-5 rounded-full relative z-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
