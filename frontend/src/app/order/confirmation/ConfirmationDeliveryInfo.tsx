'use client';

import React from 'react';
import { useLanguage } from '../../../lib/LanguageContext';

interface ConfirmationDeliveryInfoProps {
  order: any;
}

export const ConfirmationDeliveryInfo = React.memo(function ConfirmationDeliveryInfo({ order }: ConfirmationDeliveryInfoProps) {
  const { t } = useLanguage();

  return (
    <div className="confirmation-section">
      <h3 className="section-sub">
        <i className="fa-solid fa-location-dot"></i> {t('confirm_delivery_address', 'ডেলিভারির ঠিকানা')}
      </h3>
      <div className="detail-block">
        <p>
          <strong>{t('order_label_fullname', 'গ্রাহকের নাম')}:</strong> {order.customerName}
        </p>
        <p>
          <strong>{t('order_label_phone', 'মোবাইল নম্বর')}:</strong> {order.phone}
        </p>
        {order.email && (
          <p>
            <strong>{t('order_label_email', 'ইমেইল')}:</strong> {order.email}
          </p>
        )}
        <p>
          <strong>{t('order_label_address', 'সম্পূর্ণ ঠিকানা')}:</strong> {order.address}
        </p>
        <p>
          <strong>{t('order_label_location', 'এলাকা')}:</strong>{' '}
          {order.district === 'inside_dhaka'
            ? t('order_opt_dhaka', 'ঢাকার ভিতরে')
            : t('order_opt_outside', 'ঢাকার বাইরে')}
        </p>
        {order.areaThana && (
          <p>
            <strong>{t('order_label_area', 'থানা / জেলা')}:</strong> {order.areaThana}
          </p>
        )}
        {order.deliveryNote && (
          <p>
            <strong>{t('order_label_note', 'ডেলিভারি নোট')}:</strong> {order.deliveryNote}
          </p>
        )}
      </div>
    </div>
  );
});
