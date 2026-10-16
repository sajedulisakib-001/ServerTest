'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, Ruler, Palette, ShoppingBag, ArrowRight, Check, Sparkles, Wand2, Zap } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useCart } from '@/lib/CartContext';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { CustomMapModal } from './CustomMapModal';

interface WorldMapFeaturedSectionProps {
  featuredProduct: any;
  settings: Record<string, string>;
}

export const WorldMapFeaturedSection = React.memo(function WorldMapFeaturedSection({
  featuredProduct,
  settings,
}: WorldMapFeaturedSectionProps) {
  const { lang, t, formatNum } = useLanguage();
  const { addToCart } = useCart();
  const router = useRouter();
  const currency = '৳';

  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  if (!featuredProduct || settings.featured_product_enabled === 'false') {
    return null;
  }

  const isBn = lang === 'bn';

  // 1. Resolve Variants & Options
  const variants = featuredProduct?.variants || [];
  const defaultVar =
    variants.find((v: any) => v.isDefault) ||
    variants[0] ||
    {};

  const [selectedVariantId, setSelectedVariantId] = useState<number>(defaultVar.id || 1);
  const selectedVariant = variants.find((v: any) => v.id === selectedVariantId) || defaultVar;

  // Synchronize variant if prop changes
  useEffect(() => {
    if (defaultVar?.id && (!selectedVariantId || !variants.some((v: any) => v.id === selectedVariantId))) {
      setSelectedVariantId(defaultVar.id);
    }
  }, [defaultVar?.id, variants, selectedVariantId]);

  // 2. Resolve Colors
  const rawColors = featuredProduct?.colors || [];
  const availableVariantColorNames: string[] = useMemo(() => {
    const raw = selectedVariant?.colour;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
        if (typeof parsed === 'string') return [parsed];
      } catch {
        if (raw.includes(',')) {
          return raw.split(',').map((s: string) => s.trim()).filter(Boolean);
        }
        return [raw.trim()].filter(Boolean);
      }
    }
    return [];
  }, [selectedVariant?.colour]);

  const displayedColors = useMemo(() => {
    if (rawColors.length > 0) {
      return availableVariantColorNames.length > 0
        ? rawColors.filter((c: any) => availableVariantColorNames.includes(c.name))
        : rawColors;
    }
    return availableVariantColorNames.length > 0
      ? availableVariantColorNames.map((name, i) => ({
          id: `var-col-${i}`,
          name,
          colourHex: '#8E5A35',
          priceAdjustment: 0,
        }))
      : [
          { id: 'c-1', name: 'Natural Oak & Walnut', colourHex: '#8E5A35', priceAdjustment: 0 },
          { id: 'c-2', name: 'Dark Walnut', colourHex: '#3D271D', priceAdjustment: 0 },
          { id: 'c-3', name: 'Terra Classic', colourHex: '#A0522D', priceAdjustment: 0 },
        ];
  }, [rawColors, availableVariantColorNames]);

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const selectedColor = displayedColors[selectedColorIndex] || displayedColors[0] || null;

  // 3. Resolve Images & Gallery
  const primaryImg =
    (featuredProduct?.images || []).find((img: any) => img.isPrimary) ||
    (featuredProduct?.images || [])[0] ||
    { imageUrl: '/images/product-main.jpg', altText: '3D Wooden World Map' };

  const initialHeroImg =
    settings.featured_product_image ||
    primaryImg.imageUrl ||
    featuredProduct.imageUrl ||
    '/images/product-main.jpg';

  const [activePhotoUrl, setActivePhotoUrl] = useState<string>(initialHeroImg);

  // Synchronize active photo when initial hero image changes
  useEffect(() => {
    if (initialHeroImg) {
      setActivePhotoUrl(initialHeroImg);
    }
  }, [initialHeroImg]);

  const allImages: string[] = useMemo(() => {
    const list: string[] = [];
    if (settings.featured_product_image) {
      list.push(settings.featured_product_image);
    }
    (featuredProduct?.images || []).forEach((img: any) => {
      if (img.imageUrl && !list.includes(img.imageUrl)) {
        list.push(img.imageUrl);
      }
    });
    if (list.length === 0) {
      list.push(initialHeroImg);
    }
    return list;
  }, [featuredProduct?.images, settings.featured_product_image, initialHeroImg]);

  // 4. Admin Content & Bilingual Translations
  const sectionHeading = isBn
    ? (settings.featured_product_section_title_bn || settings.featured_product_section_title || t('home_featured_title', 'ওয়ার্ল্ড ম্যাপ'))
    : (settings.featured_product_section_title_en || settings.featured_product_section_title || t('home_featured_title', 'World Map'));

  const sectionSub = isBn
    ? (settings.featured_product_section_sub_bn || settings.featured_product_section_sub || settings.featured_product_section_subtitle)
    : (settings.featured_product_section_sub_en || settings.featured_product_section_sub || settings.featured_product_section_subtitle);

  const displayTitle = isBn
    ? (settings.featured_product_title_bn || settings.featured_product_title || t(`product_${featuredProduct.id}_name`, featuredProduct.name))
    : (settings.featured_product_title_en || settings.featured_product_title || t(`product_${featuredProduct.id}_name`, featuredProduct.name));

  const displayTagline = isBn
    ? (settings.featured_product_tagline_bn || settings.featured_product_tagline || featuredProduct.subtitle || featuredProduct.tagline || '')
    : (settings.featured_product_tagline_en || settings.featured_product_tagline || featuredProduct.subtitle || featuredProduct.tagline || '');

  const badgeLabel = isBn
    ? (settings.featured_product_badge_bn || settings.featured_product_badge || 'এক্সক্লুসিভ কালেকশন')
    : (settings.featured_product_badge_en || settings.featured_product_badge || 'PREMIUM EXCLUSIVE');

  const priceNote = isBn
    ? (settings.featured_product_price_note_bn || settings.featured_product_price_note || '')
    : (settings.featured_product_price_note_en || settings.featured_product_price_note || '');

  const displayDesc = isBn
    ? (settings.featured_product_description_bn || settings.featured_product_description || featuredProduct.shortDescription || featuredProduct.fullDescription || '')
    : (settings.featured_product_description_en || settings.featured_product_description || featuredProduct.shortDescription || featuredProduct.fullDescription || '');

  const rawHighlights = isBn
    ? (settings.featured_product_highlights_bn !== undefined ? settings.featured_product_highlights_bn : settings.featured_product_highlights)
    : (settings.featured_product_highlights_en !== undefined ? settings.featured_product_highlights_en : settings.featured_product_highlights);

  let customHighlights: string[] = [];
  if (rawHighlights) {
    try {
      const parsed = JSON.parse(rawHighlights);
      if (Array.isArray(parsed)) {
        customHighlights = parsed.filter(Boolean);
      }
    } catch {
      customHighlights = rawHighlights
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }

  // 5. Pricing calculation based on selected variant
  const colorAdjustment = Number(selectedColor?.priceAdjustment || 0);
  const basePrice = Number(selectedVariant.price || featuredProduct.min_price || 4500);
  const price = basePrice + colorAdjustment;
  const originalPrice = selectedVariant.originalPrice ? Number(selectedVariant.originalPrice) + colorAdjustment : undefined;
  const savingsAmount = originalPrice && originalPrice > price ? originalPrice - price : 0;
  const savingsPercent = originalPrice && originalPrice > price ? Math.round((savingsAmount / originalPrice) * 100) : 0;

  const btnViewText = isBn
    ? (settings.featured_product_btn_view_bn || settings.featured_product_btn_view || t('home_featured_view_details', 'সম্পূর্ণ বিস্তারিত দেখুন'))
    : (settings.featured_product_btn_view_en || settings.featured_product_btn_view || t('home_featured_view_details', 'View Full Details'));

  const btnBuyText = isBn
    ? (settings.featured_product_btn_buy_bn || settings.featured_product_btn_buy || t('home_featured_buy_now', 'সরাসরি অর্ডার করুন'))
    : (settings.featured_product_btn_buy_en || settings.featured_product_btn_buy || t('home_featured_buy_now', 'Order Now'));

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: `${featuredProduct.id}-${selectedVariant.id || 'std'}-${selectedColor?.id || 'col'}`,
      productId: featuredProduct.id,
      variantId: selectedVariant.id || 1,
      productName: displayTitle,
      variantName: selectedVariant.sizeName || selectedVariant.size_name || 'Standard',
      sizeName: selectedVariant.sizeName || selectedVariant.size_name || 'Standard',
      colour: selectedColor?.name || selectedVariant.colour,
      colourHex: selectedColor?.colourHex || selectedVariant.colourHex,
      price: price,
      unitPrice: price,
      originalPrice: originalPrice,
      quantity: 1,
      imageUrl: activePhotoUrl,
    });
    router.push('/checkout');
  };

  return (
    <section className="home-section home-featured-section" id="featured-exclusive">
      <div className="container">
        {/* Section Heading */}
        <div className="home-section-head text-center">
          <h2 className="home-section-title">{sectionHeading}</h2>
          {sectionSub && <p className="home-section-sub">{sectionSub}</p>}
        </div>

        {/* MAIN FEATURED CARD (Structured according to the sketch) */}
        <div className="home-featured-card">
          <div className="home-featured-sketch-grid">
            {/* =========================================================
                LEFT COLUMN:
                1. Top: Photos Gallery
                2. Bottom: Description & Feature Highlights (under the photo)
               ========================================================= */}
            <div className="home-featured-left-col">
              {/* Top: Photos Gallery */}
              <div className="featured-media-wrapper">
                <div className="featured-photo-main">
                  {badgeLabel && <span className="featured-badge-pill">{badgeLabel}</span>}
                  <img
                    src={activePhotoUrl}
                    alt={displayTitle}
                    loading="lazy"
                    className="home-featured-img"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/no-image.svg';
                    }}
                  />
                </div>

                {allImages.length > 1 && (
                  <div className="featured-photo-thumbnails">
                    {allImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActivePhotoUrl(imgUrl)}
                        className={`featured-photo-thumb ${activePhotoUrl === imgUrl ? 'active' : ''}`}
                        aria-label={`Photo ${idx + 1}`}
                      >
                        <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom: Description & Feature Highlights (under the photo) */}
              <div className="featured-desc-under-photo">
                {displayTagline && (
                  <div className="home-featured-tagline">
                    <span>{displayTagline}</span>
                  </div>
                )}

                <div
                  className="home-featured-desc"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(
                      displayDesc ||
                        '<p>হাতে তৈরি নিখুঁত কাঠের শিল্পকর্ম — যা আপনার ঘরের দেয়ালে এনে দেবে আভিজাত্য আর রাজকীয় অনুভূতি।</p>',
                    ),
                  }}
                />

                {customHighlights.length > 0 && (
                  <div className="home-featured-tags">
                    {customHighlights.map((hl, idx) => (
                      <span key={idx} className="featured-tag">
                        <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                        <span>{hl}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* =========================================================
                RIGHT COLUMN:
                1. Top: Meta Chips & Title
                2. Middle: Sizes & Colors Option Selectors
                3. Bottom: Price, Buy Now (Highlighted), & View Details Underneath
               ========================================================= */}
            <div className="home-featured-right-col">
              {/* 1. Meta Chips (Review, Stock, Price Note) & Title */}
              <div className="space-y-3">
                <div className="featured-top-meta">
                  <span className="featured-rating-pill">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{isBn ? '৪.৯ (১২০+ রিভিউ)' : '4.9 (120+ Reviews)'}</span>
                  </span>
                  <span className="featured-stock-pill">
                    <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                    <span>{isBn ? 'ইন-স্টক • ফাস্ট ডেলিভারি' : 'In Stock • Fast Dispatch'}</span>
                  </span>
                  {priceNote && (
                    <span className="featured-discount-pill">
                      <span>{priceNote}</span>
                    </span>
                  )}
                </div>

                <h3 className="home-featured-name">
                  <Link href={`/products/${featuredProduct.slug}`} title={displayTitle}>
                    {displayTitle}
                  </Link>
                </h3>
              </div>

              {/* 2. Sizes & Colors Options Box */}
              <div className="featured-options-box">
                {/* Size Selector */}
                {variants.length > 0 && (
                  <div className="featured-option-group">
                    <div className="featured-option-title">
                      <span className="flex items-center gap-1.5">
                        <Ruler className="w-3.5 h-3.5 text-[#8E5A35]" />
                        <span>{isBn ? 'সাইজ বেছে নিন:' : 'Select Size:'}</span>
                      </span>
                      {selectedVariant?.sizeName && (
                        <span className="active-val">
                          {selectedVariant.sizeName}
                          {selectedVariant.dimensions ? ` (${selectedVariant.dimensions})` : ''}
                        </span>
                      )}
                    </div>

                    <div className="featured-sizes-grid">
                      {variants.map((v: any) => {
                        const isSelected = v.id === selectedVariantId;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setSelectedVariantId(v.id)}
                            className={`featured-size-card ${isSelected ? 'active' : ''}`}
                          >
                            <span className="featured-size-name">{v.sizeName}</span>
                            {v.dimensions && <span className="featured-size-dim">{v.dimensions}</span>}
                            {isSelected && (
                              <div className="featured-size-check">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Color / Wood Stain Selector */}
                {displayedColors.length > 0 && (
                  <div className="featured-option-group">
                    <div className="featured-option-title">
                      <span className="flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-[#8E5A35]" />
                        <span>{isBn ? 'কালার ও ফিনিশ:' : 'Select Color & Finish:'}</span>
                      </span>
                      {selectedColor?.name && (
                        <span className="active-val">{selectedColor.name}</span>
                      )}
                    </div>

                    <div className="featured-colors-grid">
                      {displayedColors.map((c: any, idx: number) => {
                        const isSelected = selectedColor?.name === c.name || idx === selectedColorIndex;
                        return (
                          <button
                            key={c.id || c.name || idx}
                            type="button"
                            onClick={() => {
                              setSelectedColorIndex(idx);
                              // If matching image found for color, switch photo
                              const matchingImg = featuredProduct.images?.find(
                                (img: any) => img.colorId === c.id || img.altText?.includes(c.name)
                              );
                              if (matchingImg?.imageUrl) {
                                setActivePhotoUrl(matchingImg.imageUrl);
                              }
                            }}
                            className={`featured-color-chip ${isSelected ? 'active' : ''}`}
                          >
                            <span
                              className="featured-color-dot"
                              style={{ backgroundColor: c.colourHex || '#8E5A35' }}
                            />
                            <span>{c.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Price Display, Highlighted Buy Now, & View Full Details Underneath */}
              <div className="space-y-4 pt-1">
                {/* Price Row */}
                <div className="home-featured-pricing">
                  <span className="featured-current-price">
                    {currency} {formatNum(price)}
                  </span>
                  {originalPrice && originalPrice > price && (
                    <span className="featured-orig-price">
                      {currency} {formatNum(originalPrice)}
                    </span>
                  )}
                  {savingsAmount > 0 && (
                    <span className="featured-save-badge">
                      <i className="fa-solid fa-tag text-xs" aria-hidden="true"></i>
                      <span>
                        {isBn
                          ? `৳ ${formatNum(savingsAmount)} ছাড় (${formatNum(savingsPercent)}% OFF)`
                          : `৳ ${formatNum(savingsAmount)} OFF (${formatNum(savingsPercent)}% OFF)`}
                      </span>
                    </span>
                  )}
                </div>

                {/* Stacked Action Buttons */}
                <div className="featured-actions-stacked">
                  {btnBuyText && (
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="home-featured-btn-buy-highlighted"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      <span>{btnBuyText}</span>
                    </button>
                  )}

                  {btnViewText && (
                    <Link
                      href={`/products/${featuredProduct.slug}`}
                      className="home-featured-btn-view-under"
                    >
                      <span>{btnViewText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            OUTSIDE HOME-FEATURED-CARD:
            "CUSTOM YOUR MAP" BANNER (Matches Sketch Diagram)
           ========================================================= */}
        <div className="custom-map-banner-container">
          <div className="custom-map-banner">
            <div className="custom-map-banner-content">
              <div className="custom-map-icon-box">
                <Wand2 className="w-7 h-7" />
              </div>
              <div className="custom-map-banner-text">
                <h3 className="custom-map-banner-title">
                  {isBn ? 'আপনার দেয়ালের মাপ অনুযায়ী কাস্টমাইজড ম্যাপ চান?' : 'CUSTOMIZE YOUR BESPOKE WOODEN MAP'}
                </h3>
                <p className="custom-map-banner-subtitle">
                  {isBn
                    ? 'নির্দিষ্ট দেয়ালের সাইজ, কাঠের বিশেষ রঙের শেড, পারিবারিক নাম খোদাই বা অ্যাম্বিয়েন্ট LED লাইটিং সহ আপনার পছন্দের ম্যাপ তৈরি করে নিন।'
                    : 'Personalize dimensions, custom wood stains, laser engraving, family name tags, or ambient LED backlights.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCustomModalOpen(true)}
              className="custom-map-banner-btn"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isBn ? 'কাস্টমাইজেশন রিকোয়েস্ট পাঠান' : 'Request Custom Map'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* POPUP MODAL FOR CUSTOM MAP REQUEST */}
      <CustomMapModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        defaultSize={selectedVariant?.sizeName}
        defaultColor={selectedColor?.name}
      />
    </section>
  );
});

export default WorldMapFeaturedSection;
