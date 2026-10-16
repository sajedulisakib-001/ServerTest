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
          {exclusiveProducts.map((product, idx) => {
            const defaultVar =
              product.variants?.find((v: any) => v.isDefault) || product.variants?.[0] || {};
            const primaryImg =
              product.images?.find((img: any) => img.isPrimary) || product.images?.[0] || {};
            const minPriceVal = product.min_price || defaultVar.price || 4500;
            const maxPriceVal = product.max_price || defaultVar.price;
            const catName = product.category?.name || product.category_name;
            const catSlug = product.category?.slug || product.category_slug;
            const availableVariant = (product.variants || []).find(
              (v: any) => v.stockStatus !== 'out_of_stock' && v.stock !== 0,
            );

            return (
              <article
                key={product.id}
                className={`exclusive-card ${idx === 0 ? 'exclusive-featured' : ''}`}
              >
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
                      <i className="fa-solid fa-gem"></i> {t('signature_piece', 'Signature Series')}
                    </span>
                    {catName && (
                      <span className="badge-cat">{t(`category_${catSlug}`, catName)}</span>
                    )}
                  </div>
                </div>

                <div className="exclusive-content">
                  <div className="exclusive-meta-top">
                    <div className="exclusive-rating">
                      <i className="fa-solid fa-star"></i>
                      <strong>
                        {formatNum(product.averageRating || product.average_rating || 5.0)}
                      </strong>
                      <span className="rating-count">
                        ({formatNum(product.reviewCount || product.review_count || 4)})
                      </span>
                    </div>
                  </div>

                  <h3 className="exclusive-item-title">
                    <Link href={`/products/${product.slug}`}>
                      {t(`product_${product.id}_name`, product.name)}
                    </Link>
                  </h3>

                  <div className="exclusive-bottom-row">
                    <div className="exclusive-price-box">
                      <div className="exclusive-price-val">
                        <strong>
                          {currency}
                          {formatNum(minPriceVal)}
                        </strong>
                        {Number(maxPriceVal) > Number(minPriceVal) && (
                          <span className="exclusive-price-max">
                            {' '}
                            – {currency}
                            {formatNum(maxPriceVal)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="exclusive-actions">
                      <Link
                        href={`/products/${product.slug}`}
                        className="btn btn-outline exclusive-details-btn"
                      >
                        <span>{t('explore', 'Explore')}</span>
                      </Link>
                      {availableVariant ? (
                        <button
                          type="button"
                          onClick={(e) => onAddToCart(e, product)}
                          className="btn btn-primary"
                        >
                          <i className="fa-solid fa-cart-shopping"></i>
                          <span>{t('catalog_add_cart', 'Add to cart')}</span>
                        </button>
                      ) : (
                        <span className="catalog-out-stock">
                          {t('product_out_of_stock', 'Out of stock')}
                        </span>
                      )}
                    </div>
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
