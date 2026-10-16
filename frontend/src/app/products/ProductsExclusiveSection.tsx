'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../lib/LanguageContext';

interface ProductsExclusiveSectionProps {
  exclusiveProducts: any[];
  currency: string;
  onAddToCart: (e: React.MouseEvent, product: any) => void;
}

export const ProductsExclusiveSection = React.memo(function ProductsExclusiveSection({
  exclusiveProducts,
  currency,
  onAddToCart,
}: ProductsExclusiveSectionProps) {
  const { t, formatNum } = useLanguage();

  if (!exclusiveProducts || exclusiveProducts.length === 0) return null;

  return (
    <section className="exclusive-section">
      <div className="container">
        <div className="exclusive-header">
          <div className="exclusive-title-wrap">
            <span className="exclusive-line" aria-hidden="true"></span>
            <h2 className="exclusive-heading">
              <span className="exclusive-crown-icon">
                <i className="fa-solid fa-crown"></i>
              </span>
              <span>{t('exclusive_badge', 'Exclusive Collection')}</span>
            </h2>
            <span className="exclusive-line" aria-hidden="true"></span>
          </div>
        </div>

        <div
          className={`exclusive-grid ${
            exclusiveProducts.length === 1
              ? 'exclusive-grid-1 exclusive-grid-single'
              : exclusiveProducts.length === 2
              ? 'exclusive-grid-2 exclusive-grid-double'
              : ''
          }`}
        >
          {exclusiveProducts.map((product) => {
            const defaultVar =
              product.variants?.find((v: any) => v.isDefault) || product.variants?.[0] || {};
            const primaryImg =
              product.images?.find((img: any) => img.isPrimary) || product.images?.[0] || {};
            const minPriceVal = product.min_price || defaultVar.price || 4500;
            const maxPriceVal = product.max_price || defaultVar.price;
            const origPrice = Number(
              defaultVar.original_price ||
              defaultVar.originalPrice ||
              product.original_price ||
              product.originalPrice ||
              0
            );
            const discountPercent =
              origPrice > minPriceVal ? Math.round(((origPrice - minPriceVal) / origPrice) * 100) : 0;
            const catName = product.category?.name || product.category_name;
            const catSlug = product.category?.slug || product.category_slug;
            const availableVariant = (product.variants || []).find(
              (v: any) => v.stockStatus !== 'out_of_stock' && v.stock !== 0,
            );

            return (
              <article key={product.id} className="exclusive-card">
                {/* 1. Product Image & Badges */}
                <div className="exclusive-image-wrap">
                  <Link
                    href={`/products/${product.slug}`}
                    className="exclusive-image-link"
                    aria-label={product.name}
                  >
                    <img
                      src={primaryImg.imageUrl || primaryImg.image_url || product.imageUrl || '/images/no-image.svg'}
                      alt={product.name}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/no-image.svg';
                      }}
                    />
                  </Link>

                  <div className="exclusive-badges-overlay">
                    <span className="badge-signature">
                      <i className="fa-solid fa-gem"></i>
                      <span>{t('signature_piece', 'সিগনেচার আর্টওয়ার্ক')}</span>
                    </span>
                    {catName && (
                      <span className="badge-cat">{t(`category_${catSlug}`, catName)}</span>
                    )}
                  </div>
                </div>

                {/* 2. Structured Card Content */}
                <div className="exclusive-content">
                  {/* Meta: Star Rating & In-Stock Status */}
                  <div className="exclusive-meta-row">
                    <div className="exclusive-rating">
                      <i className="fa-solid fa-star"></i>
                      <strong className="rating-score">
                        {formatNum(product.averageRating || product.average_rating || 5.0)}
                      </strong>
                      <span className="rating-count">
                        ({formatNum(product.reviewCount || product.review_count || 0)})
                      </span>
                    </div>

                    <div className="exclusive-stock">
                      {availableVariant ? (
                        <span className="exclusive-stock-chip in-stock">
                          <span className="stock-dot"></span>
                          <span>{t('in_stock', 'ইন স্টক')}</span>
                        </span>
                      ) : (
                        <span className="exclusive-stock-chip out-stock">
                          <span>{t('product_out_of_stock', 'স্টক নেই')}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="exclusive-title">
                    <Link href={`/products/${product.slug}`}>
                      {t(`product_${product.id}_name`, product.name)}
                    </Link>
                  </h3>

                  

                  {/* Pricing: Payable on left, Original & Discount on right */}
                  <div className="exclusive-price-row">
                    <div className="exclusive-price-payable">
                      <strong className="price-val">
                        {currency}{formatNum(minPriceVal)}
                      </strong>
                      {Number(maxPriceVal) > Number(minPriceVal) && (
                        <span className="price-max">
                          {' '}– {currency}{formatNum(maxPriceVal)}
                        </span>
                      )}
                    </div>

                    {origPrice > minPriceVal && (
                      <div className="exclusive-price-orig-wrap">
                        <span className="original-price">
                          {currency}{formatNum(origPrice)}
                        </span>
                        <span className="discount-badge">
                          -{formatNum(discountPercent)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons: View Details & Add to Cart */}
                  <div className="exclusive-actions">
                    <Link
                      href={`/products/${product.slug}`}
                      className="btn-exclusive-details"
                    >
                      <span>{t('explore', 'অনুসন্ধান করুন')}</span>
                    </Link>

                    {availableVariant ? (
                      <button
                        type="button"
                        onClick={(e) => onAddToCart(e, product)}
                        className="btn-exclusive-cart"
                      >
                        <i className="fa-solid fa-cart-shopping"></i>
                        <span>{t('catalog_add_cart', 'কার্টে যোগ করুন')}</span>
                      </button>
                    ) : (
                      <button type="button" disabled className="btn-exclusive-cart disabled">
                        <span>{t('product_out_of_stock', 'স্টক নেই')}</span>
                      </button>
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
