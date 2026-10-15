'use client';

import React from 'react';
import { useLanguage } from '../../../lib/LanguageContext';

interface ProductGallerySectionProps {
  images: any[];
  currentImage: any;
  selectedImageIndex: number;
  setSelectedImageIndex: (index: number) => void;
  discountPct: number;
  translatedName: string;
}

export const ProductGallerySection = React.memo(function ProductGallerySection({
  images,
  currentImage,
  selectedImageIndex,
  setSelectedImageIndex,
  discountPct,
  translatedName,
}: ProductGallerySectionProps) {
  const { t } = useLanguage();

  return (
    <div className="details-gallery-column">
      <div className="gallery-sticky-wrapper">
        <div className="gallery-main-viewport" id="galleryMainViewport">
          <div className="gallery-badges-overlay">
            {discountPct > 0 && (
              <span className="badge-discount" id="galleryDiscountBadge">
                <i className="fa-solid fa-tag"></i> -{discountPct}% OFF
              </span>
            )}
            <span className="badge-stock-floating badge-in" id="galleryStockBadge">
              <i className="fa-solid fa-circle-check"></i>
              <span>{t('product_in_stock', 'In Stock')}</span>
            </span>
          </div>

          <div className="main-image-container" id="mainImageContainer">
            <img
              className="details-main-image"
              id="detailsMainImage"
              src={currentImage?.imageUrl || currentImage?.image_url || '/images/no-image.svg'}
              alt={currentImage?.altText || translatedName || 'Product image'}
              onError={(e) => {
                e.currentTarget.src = '/images/no-image.svg';
              }}
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                className="gallery-nav-btn gallery-prev"
                onClick={() =>
                  setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length)
                }
                aria-label="Previous Image"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button
                type="button"
                className="gallery-nav-btn gallery-next"
                onClick={() => setSelectedImageIndex((selectedImageIndex + 1) % images.length)}
                aria-label="Next Image"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </>
          )}
        </div>

        {/* Thumbnails Strip */}
        {Array.isArray(images) && images.length > 1 && (
          <div className="details-thumbnails-strip" id="thumbnailsStrip" role="tablist">
            {images.map((img: any, idx: number) => (
              <button
                key={img?.id || idx}
                type="button"
                className={`details-thumb ${idx === selectedImageIndex ? 'active' : ''}`}
                onClick={() => setSelectedImageIndex(idx)}
                aria-label={img?.title || 'Product thumb'}
              >
                <img
                  src={img?.thumbnailUrl || img?.imageUrl || img?.image_url || '/images/no-image.svg'}
                  alt={img?.altText || translatedName || 'Product thumb'}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/images/no-image.svg';
                  }}
                />
              </button>
            ))}
          </div>
        )}

        {/* Store Guarantee Badges */}
        <div className="store-guarantees-grid">
          <div className="guarantee-item">
            <div className="guarantee-icon">
              <i className="fa-solid fa-truck-ramp-box"></i>
            </div>
            <div className="guarantee-text">
              <strong>{t('guarantee_delivery_title', 'Nationwide Delivery')}</strong>
              <small>{t('guarantee_delivery_desc', 'Inside Dhaka 24-48h, Outside Dhaka 2-4 days')}</small>
            </div>
          </div>
          <div className="guarantee-item">
            <div className="guarantee-icon">
              <i className="fa-solid fa-money-bill-wave"></i>
            </div>
            <div className="guarantee-text">
              <strong>{t('guarantee_cod_title', 'Cash on Delivery')}</strong>
              <small>{t('guarantee_cod_desc', 'Pay safely after inspecting the product')}</small>
            </div>
          </div>
          <div className="guarantee-item">
            <div className="guarantee-icon">
              <i className="fa-solid fa-award"></i>
            </div>
            <div className="guarantee-text">
              <strong>{t('guarantee_quality_title', '100% Quality Guaranteed')}</strong>
              <small>{t('guarantee_quality_desc', 'Precision laser-crafted premium natural wood')}</small>
            </div>
          </div>
          <div className="guarantee-item">
            <div className="guarantee-icon">
              <i className="fa-solid fa-rotate-left"></i>
            </div>
            <div className="guarantee-text">
              <strong>{t('guarantee_replacement_title', '7-Day Easy Replacement')}</strong>
              <small>{t('guarantee_replacement_desc', 'Hassle-free support for transit damages')}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
