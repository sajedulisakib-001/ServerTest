'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../../lib/LanguageContext';

interface ProductSimilarSectionProps {
  relatedProducts: any[];
  currency: string;
  onAddRelatedToCart: (e: React.MouseEvent, rel: any) => void;
}

export const ProductSimilarSection = React.memo(function ProductSimilarSection({
  relatedProducts,
  currency,
  onAddRelatedToCart,
}: ProductSimilarSectionProps) {
  const { t, formatNum } = useLanguage();

  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <section className="related-products-section mt-16 pt-10 border-t border-stone-200/80">
      <div className="catalog-heading-row flex flex-col sm:flex-row justify-between sm:items-end gap-3 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8E5A35] bg-[#FAF3EB] px-3 py-1 rounded-full border border-[#ebdccc] uppercase tracking-wider mb-2">
            <i className="fa-solid fa-layer-group text-[#8E5A35]"></i>
            <span>{t('similar_products_eyebrow', 'সম্পর্কিত কালেকশন')}</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-serif tracking-tight">
            {t('details_related_title', 'একই ধরনের আরও আকর্ষণীয় কাঠের ম্যাপ')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            {t(
              'details_related_sub',
              'আপনার ঘরের দেয়াল সাজাতে আমাদের প্রিমিয়াম কালেকশনের আরও কিছু জনপ্রিয় শিল্পকর্ম।',
            )}
          </p>
        </div>
        <Link
          className="text-xs sm:text-sm font-bold text-[#8E5A35] hover:text-[#5c3519] flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0"
          href="/products"
        >
          <span>{t('home_search_link', 'সকল পণ্য দেখুন')}</span>
          <i className="fa-solid fa-arrow-right"></i>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {relatedProducts.map((rel: any) => {
          const relImg =
            rel.images?.find((i: any) => i.isPrimary)?.imageUrl ||
            rel.images?.[0]?.imageUrl ||
            rel.imageUrl ||
            '/images/no-image.svg';

          const defaultVariant =
            rel.variants?.find((v: any) => v.isDefault) || rel.variants?.[0] || {};
          const relMinPrice = Number(defaultVariant.price || rel.min_price || 4500);
          const relOrigPrice = defaultVariant.originalPrice
            ? Number(defaultVariant.originalPrice)
            : 0;
          const relDiscountPct =
            relOrigPrice > relMinPrice
              ? Math.round(((relOrigPrice - relMinPrice) / relOrigPrice) * 100)
              : 0;
          const relName = t(`product.${rel.slug}.name`, rel.name);

          return (
            <div
              key={rel.id}
              className="catalog-product-card group p-3.5 rounded-2xl bg-white border border-stone-200/90 hover:border-[#8E5A35]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <Link
                  href={`/products/${rel.slug}`}
                  className="block relative aspect-4/3 rounded-xl overflow-hidden bg-stone-100 mb-3 group"
                >
                  <img
                    src={relImg}
                    alt={relName}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/no-image.svg';
                    }}
                  />

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                    {rel.category ? (
                      <span className="px-2 py-0.5 rounded-md bg-stone-900/80 text-white text-[10px] font-bold backdrop-blur-xs">
                        {t(`category.${rel.category.slug}.name`, rel.category.name)}
                      </span>
                    ) : (
                      <span></span>
                    )}
                    {relDiscountPct > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black tracking-wide shadow-2xs">
                        -{relDiscountPct}%
                      </span>
                    )}
                  </div>
                </Link>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold">
                    <i className="fa-solid fa-star text-xs"></i>
                    <span>৫.০</span>
                    <span className="text-stone-400 font-normal">• ইন-স্টক</span>
                  </div>

                  <h3 className="font-bold text-sm text-stone-900 line-clamp-1 group-hover:text-[#8E5A35] transition-colors">
                    <Link href={`/products/${rel.slug}`}>{relName}</Link>
                  </h3>

                  <div className="flex items-baseline gap-2 pt-0.5">
                    <span className="text-sm font-black text-[#8E5A35]">
                      {currency} {formatNum(relMinPrice)}
                    </span>
                    {relOrigPrice > relMinPrice && (
                      <span className="text-xs text-stone-400 line-through">
                        {currency} {formatNum(relOrigPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2">
                <Link
                  href={`/products/${rel.slug}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-stone-100 hover:bg-[#FAF3EB] text-stone-800 hover:text-[#8E5A35] font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                >
                  <span>{t('product_btn_details', 'বিস্তারিত')}</span>
                  <i className="fa-solid fa-chevron-right text-[10px]"></i>
                </Link>

                <button
                  type="button"
                  onClick={(e) => onAddRelatedToCart(e, rel)}
                  className="p-2 rounded-xl bg-[#8E5A35] hover:bg-[#734322] text-white text-xs font-bold flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                  title={t('cart_add_btn', 'কার্টে যোগ করুন')}
                  aria-label="Add to cart"
                >
                  <i className="fa-solid fa-cart-plus"></i>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
});
