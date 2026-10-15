'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageContext';

interface TopSellingProductsSectionProps {
  products: any[];
  onAddToCart: (e: React.MouseEvent, prod: any) => void;
}

export const TopSellingProductsSection = React.memo(function TopSellingProductsSection({ products, onAddToCart }: TopSellingProductsSectionProps) {
  const { t, formatNum } = useLanguage();
  const currency = '৳';

  if (!products || products.length === 0) return null;

  return (
    <section
      className="home-section home-best-sellers-section"
      id="best-sellers"
      aria-label={t('home_best_sellers_title', 'সর্বাধিক বিক্রিত পণ্য')}
    >
      <div className="container">
        <div className="home-section-head text-center">
          <h2 className="home-section-title">{t('home_best_sellers_title', 'সর্বাধিক বিক্রিত পণ্য')}</h2>
          <p className="home-section-sub">{t('home_best_sellers_sub', 'ক্রেতাদের সবচেয়ে প্রিয় সংগ্রহ')}</p>
        </div>

        <div
          className={`catalog-grid home-best-sellers-grid ${
            products.length === 1
              ? 'catalog-grid-1'
              : products.length === 2
              ? 'catalog-grid-2'
              : ''
          }`}
        >
          {products.map((prod) => {
            const defaultVar = prod.variants?.find((v: any) => v.isDefault) || prod.variants?.[0] || {};
            const primaryImg = prod.images?.find((img: any) => img.isPrimary) || prod.images?.[0] || {};
            const minPriceVal = prod.min_price || defaultVar.price || 4500;
            const maxPriceVal = prod.max_price || defaultVar.price;
            const origPrice = Number(defaultVar.originalPrice || defaultVar.original_price || 0);
            const catName = prod.category?.name || prod.category_name;
            const catSlug = prod.category?.slug || prod.category_slug;
            const availableVariant = (prod.variants || []).find((v: any) => v.stockStatus !== 'out_of_stock' && v.stock !== 0);

            return (
              <article key={prod.id} className="catalog-product">
                <Link className="catalog-product-image" href={`/products/${prod.slug}`}>
                  <img
                    src={primaryImg.imageUrl || primaryImg.image_url || prod.imageUrl || '/images/no-image.svg'}
                    alt={t(`product_${prod.id}_name`, prod.name)}
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/no-image.svg';
                    }}
                  />
                  {catName && (
                    <span className="catalog-category">
                      {t(`category_${catSlug}`, catName)}
                    </span>
                  )}
                  {origPrice > minPriceVal && (
                    <span className="badge-discount-top">
                      {t('product_save_badge', 'ছাড়')} {currency} {formatNum(origPrice - minPriceVal)}
                    </span>
                  )}
                </Link>

                <div className="catalog-product-body">
                  <div className="catalog-product-copy">
                    <h2>
                      <Link href={`/products/${prod.slug}`}>
                        {t(`product_${prod.id}_name`, prod.name)}
                      </Link>
                    </h2>
                    <p>
                      {t(
                        `product_${prod.id}_short_description`,
                        prod.shortDescription || prod.short_description || prod.tagline || '',
                      )}
                    </p>
                  </div>

                  <div className="catalog-product-price">
                    {minPriceVal !== null && minPriceVal !== undefined ? (
                      <>
                        <strong>
                          {currency} {formatNum(minPriceVal)}
                        </strong>
                        {Number(maxPriceVal) > Number(minPriceVal) && (
                          <span>
                            {' '}– {currency} {formatNum(maxPriceVal)}
                          </span>
                        )}
                        {origPrice > minPriceVal && (
                          <span className="catalog-orig-price">
                            {currency} {formatNum(origPrice)}
                          </span>
                        )}
                      </>
                    ) : (
                      <span>{t('catalog_price_unavailable', 'Price unavailable')}</span>
                    )}
                  </div>

                  <div className="catalog-card-actions">
                    <Link href={`/products/${prod.slug}`} className="btn btn-outline" style={{ flex: '1', justifyContent: 'center' }}>
                      <span>{t('view_details', 'বিস্তারিত')}</span>
                      <i className="fa-solid fa-arrow-right ms-1"></i>
                    </Link>
                    {availableVariant ? (
                      <button
                        type="button"
                        onClick={(e) => onAddToCart(e, prod)}
                        className="btn btn-primary"
                        style={{ flex: '1', justifyContent: 'center' }}
                      >
                        <i className="fa-solid fa-cart-shopping"></i>
                        <span>{t('catalog_add_cart', 'কার্ট')}</span>
                      </button>
                    ) : (
                      <span className="catalog-out-stock">{t('product_out_of_stock', 'Out of stock')}</span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
});
