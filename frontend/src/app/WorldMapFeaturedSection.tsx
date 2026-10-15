'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { useCart } from '@/lib/CartContext';

interface WorldMapFeaturedSectionProps {
  featuredProduct: any;
  settings: Record<string, string>;
}

export const WorldMapFeaturedSection = React.memo(function WorldMapFeaturedSection({ featuredProduct, settings }: WorldMapFeaturedSectionProps) {
  const { lang, t, formatNum } = useLanguage();
  const { addToCart } = useCart();
  const router = useRouter();
  const currency = '৳';

  if (!featuredProduct || settings.featured_product_enabled === 'false') {
    return null;
  }

  const isBn = lang === 'bn';
  const featuredImg =
    (featuredProduct?.images || []).find((img: any) => img.isPrimary) ||
    (featuredProduct?.images || [])[0] ||
    { imageUrl: '/images/product-main.jpg', altText: '3D Wooden World Map' };

  const heroImgUrl =
    settings.featured_product_image ||
    featuredImg.imageUrl ||
    featuredProduct.imageUrl ||
    '/images/no-image.svg';

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
    ? (settings.featured_product_tagline_bn || settings.featured_product_tagline || featuredProduct.subtitle || '')
    : (settings.featured_product_tagline_en || settings.featured_product_tagline || featuredProduct.subtitle || '');

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
    ? (settings.featured_product_highlights_bn || settings.featured_product_highlights)
    : (settings.featured_product_highlights_en || settings.featured_product_highlights);

  let customHighlights: string[] = [];
  if (rawHighlights) {
    try {
      const parsed = JSON.parse(rawHighlights);
      if (Array.isArray(parsed) && parsed.length > 0) {
        customHighlights = parsed.filter(Boolean);
      }
    } catch {
      customHighlights = rawHighlights
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  if (customHighlights.length === 0) {
    customHighlights = isBn
      ? [
          '১০০% প্রাকৃতিক বার্চ প্লাইউড',
          '৩টি লেয়ার রিলিফ আর্কিটেকচার',
          'সারাদেশে ক্যাশ অন ডেলিভারি',
          'লাইফটাইম ক্রাফটম্যানশিপ ওয়ারেন্টি',
        ]
      : [
          '100% Natural Birch Plywood',
          '3-Layer Relief Architecture',
          'Cash on Delivery Nationwide',
          'Lifetime Craftsmanship Warranty',
        ];
  }

  const defaultVar =
    featuredProduct.variants?.find((v: any) => v.isDefault) ||
    featuredProduct.variants?.[0] ||
    {};
  const price = Number(defaultVar.price || featuredProduct.min_price || 5200);
  const originalPrice = defaultVar.originalPrice ? Number(defaultVar.originalPrice) : undefined;
  const savingsAmount = originalPrice && originalPrice > price ? originalPrice - price : 0;
  const savingsPercent = originalPrice && originalPrice > price ? Math.round((savingsAmount / originalPrice) * 100) : 0;

  const btnViewText = isBn
    ? (settings.featured_product_btn_view_bn || settings.featured_product_btn_view || t('home_featured_view_details', 'বিস্তারিত দেখুন'))
    : (settings.featured_product_btn_view_en || settings.featured_product_btn_view || t('home_featured_view_details', 'View Full Details'));

  const btnBuyText = isBn
    ? (settings.featured_product_btn_buy_bn || settings.featured_product_btn_buy || t('home_featured_buy_now', 'এখনই অর্ডার করুন'))
    : (settings.featured_product_btn_buy_en || settings.featured_product_btn_buy || t('home_featured_buy_now', 'Order Now'));

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: `${featuredProduct.id}-${defaultVar.id || 'std'}`,
      productId: featuredProduct.id,
      variantId: defaultVar.id || 1,
      productName: displayTitle,
      variantName: defaultVar.sizeName || defaultVar.size_name || 'Standard',
      colour: defaultVar.colour,
      colourHex: defaultVar.colourHex,
      price: price,
      originalPrice: originalPrice,
      quantity: 1,
      imageUrl: heroImgUrl,
    });
    router.push('/checkout');
  };

  return (
    <section className="home-section home-featured-section" id="featured-exclusive">
      <div className="container">
        <div className="home-section-head text-center">
          <h2 className="home-section-title">{sectionHeading}</h2>
          {sectionSub && <p className="home-section-sub">{sectionSub}</p>}
        </div>

        <div className="home-featured-card">
          {/* ROW 1: Two Sections — Image (Left) and Custom Info (Right) */}
          <div className="home-featured-row1">
            {/* Left Section: Featured Image */}
            <div className="home-featured-media-col">
              <Link
                className="home-featured-media"
                href={`/products/${featuredProduct.slug}`}
                title={displayTitle}
              >
                {badgeLabel && <span className="featured-badge-pill">{badgeLabel}</span>}
                <img
                  src={heroImgUrl}
                  alt={displayTitle}
                  loading="lazy"
                  className="home-featured-img"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/no-image.svg';
                  }}
                />
              </Link>
            </div>

            {/* Right Section: Custom Information */}
            <div className="home-featured-info-col">
              <div className="featured-top-meta">
                <span className="featured-rating-pill">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{isBn ? '৪.৯ (১২০+ রিভিউ)' : '4.9 (120+ Reviews)'}</span>
                </span>
                <span className="featured-stock-pill">
                  <i className="fa-solid fa-bolt text-emerald-600" aria-hidden="true"></i>
                  <span>{isBn ? 'ইন-স্টক • ফাস্ট ডেলিভারি' : 'In Stock • Fast Dispatch'}</span>
                </span>
                {priceNote && (
                  <span className="featured-discount-pill">
                    <span>{priceNote}</span>
                  </span>
                )}
              </div>

              <h3 className="home-featured-name">
                <Link href={`/products/${featuredProduct.slug}`}>
                  {displayTitle}
                </Link>
              </h3>

              {displayTagline && (
                <p className="home-featured-tagline">{displayTagline}</p>
              )}

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

              <div
                className="home-featured-desc"
                dangerouslySetInnerHTML={{
                  __html:
                    displayDesc ||
                    '<p>হাতে তৈরি নিখুঁত কাঠের শিল্পকর্ম — যা আপনার ঘরের দেয়ালে এনে দেবে আভিজাত্য আর রাজকীয় অনুভূতি।</p>',
                }}
              />

              <div className="home-featured-tags">
                {customHighlights.map((hl, idx) => (
                  <span key={idx} className="featured-tag">
                    <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
                    <span>{hl}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ROW 2: Two Buttons — View Details & Buy Now */}
          <div className="home-featured-row2">
            <Link
              href={`/products/${featuredProduct.slug}`}
              className="home-featured-btn-view"
            >
              <span>{btnViewText}</span>
              <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </Link>

            <button
              type="button"
              onClick={handleBuyNow}
              className="home-featured-btn-buy"
            >
              <i className="fa-solid fa-bag-shopping" aria-hidden="true"></i>
              <span>{btnBuyText}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});
