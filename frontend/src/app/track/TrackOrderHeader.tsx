'use client';

import React from 'react';
import { useLanguage } from '../../lib/LanguageContext';

interface TrackOrderHeaderProps {
  order: any;
  orderDate: string;
  isDhaka: boolean;
  statusSummary: any;
  copiedId: boolean;
  onCopyId: (text: string) => void;
}

export const TrackOrderHeader = React.memo(function TrackOrderHeader({
  order,
  orderDate,
  isDhaka,
  statusSummary,
  copiedId,
  onCopyId,
}: TrackOrderHeaderProps) {
  const { lang, t } = useLanguage();

  return (
    <div className="track-order-header-card">
      <div className="header-left">
        <div className="order-id-badge-wrap">
          <span className="order-label">{t('order_number_title', 'অর্ডার নম্বর')}:</span>
          <strong className="order-code">{order.orderNumber}</strong>
          <button
            type="button"
            onClick={() => onCopyId(order.orderNumber)}
            className="btn-copy-id"
            title={copiedId ? 'Copied!' : 'Copy Order Number'}
          >
            <i className={copiedId ? 'fa-solid fa-check text-emerald-600' : 'fa-regular fa-copy'}></i>
            {copiedId && <span className="copy-feedback">{lang === 'bn' ? 'কপি হয়েছে' : 'Copied!'}</span>}
          </button>
        </div>
        <div className="order-meta-info">
          <span className="meta-item">
            <i className="fa-regular fa-calendar-days"></i> {orderDate}
          </span>
          <span className="meta-item">
            <i className="fa-solid fa-location-dot"></i> {isDhaka ? 'Inside Dhaka' : 'Outside Dhaka'}
          </span>
        </div>
      </div>

      <div className="header-right">
        <span className={`track-status-pill status-${order.status?.toLowerCase() || 'pending'}`}>
          <span className="status-dot"></span>
          <span>{statusSummary?.badgeText || order.status}</span>
        </span>
      </div>
    </div>
  );
});
