'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '../../lib/LanguageContext';

interface SearchResultsGridProps {
  products: any[];
  loading: boolean;
  activeFilterCount: number;
  currency: string;
  onAddToCart: (e: React.MouseEvent, product: any) => void;
  onReset: (e: React.MouseEvent) => void;
}

export const SearchResultsGrid = React.memo(function SearchResultsGrid({
  products,
  loading,
  activeFilterCount,
  currency,
  onAddToCart,
  onReset,
}: SearchResultsGridProps) {
  const { t, formatNum } = useLanguage();

  return (
    <div className="search-results">
      <div className="search-results-heading">
        <strong>
          {formatNum(products.length)} {t('search_results_count', 'products')}
        </strong>
        {activeFilterCount > 0 && <span>{t('search_filtered_label', 'Filtered results')}</span>}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 bg-stone-200/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="catalog-grid search-catalog-grid">
          {products.map((product) => {
            const defaultVar =
              product.variants?.find((v: any) => v.isDefault) || product.variants?.[0] || {};
            const primaryImg =
              product.images?.find((img: any) => img.isPrimary) || product.images?.[0] || {};
            const availableVariant = (product.variants || []).find(
              (v: any) => v.stockStatus !== 'out_of_stock' && v.stock !== 0,
            );

            const minPriceVal = product.min_price || defaultVar.price || 4500;
            const maxPriceVal = product.max_price || defaultVar.price;
            const catName = product.category?.name || product.category_name;
            const catSlug = product.category?.slug || product.category_slug;

            return (
              <article key={product.id} className="catalog-product">
                <Link className="catalog-product-image" href={`/products/${product.slug}`}>
                  <img
                    src={primaryImg.imageUrl || primaryImg.image_url || product.imageUrl || '/images/no-image.svg'}
                    alt={t(`product_${product.id}_name`, product.name)}
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/no-image.svg';
                    }}
                  />
                  {catName && (
                    <span className="catalog-category">{t(`category_${catSlug}`, catName)}</span>
                  )}
                </Link>

                <div className="catalog-product-body">
                  <div className="catalog-product-copy">
                    <h2>
                      <Link href={`/products/${product.slug}`}>
                        {t(`product_${product.id}_name`, product.name)}
                      </Link>
                    </h2>
                    <p>
                      {t(
                        `product_${product.id}_short_description`,
                        product.shortDescription ||
                          product.short_description ||
                          product.tagline ||
                          '',
                      )}
                    </p>
                  </div>

                  <div className="catalog-product-price">
                    {minPriceVal !== null && minPriceVal !== undefined ? (
                      <>
                        <strong>
                          {currency}
                          {formatNum(minPriceVal)}
                        </strong>
                        {Number(maxPriceVal) > Number(minPriceVal) && (
                          <span>
                            {' '}
                            – {currency}
                            {formatNum(maxPriceVal)}
                          </span>
                        )}
                      </>
                    ) : (
                      <span>{t('catalog_price_unavailable', 'Price unavailable')}</span>
                    )}
                  </div>

                  <div className="catalog-card-actions">
                    <Link className="btn btn-outline" href={`/products/${product.slug}`}>
                      <i className="fa-solid fa-eye"></i>
                      <span>{t('catalog_details', 'Details')}</span>
                    </Link>

                    {availableVariant ? (
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={(e) => onAddToCart(e, product)}
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
              </article>
            );
          })}
        </div>
      ) : (
        <div className="catalog-empty">
          <i className="fa-solid fa-magnifying-glass"></i>
          <h2>{t('search_no_results', 'No products match those filters')}</h2>
          <a className="btn btn-outline" href="/search" onClick={onReset}>
            {t('search_reset', 'Reset filters')}
          </a>
        </div>
      )}
    </div>
  );
});
