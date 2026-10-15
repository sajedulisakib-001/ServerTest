'use client';

import React from 'react';
import { useLanguage } from '../../../lib/LanguageContext';

interface ConfirmationReceiptTableProps {
  order: any;
  currency: string;
}

function parseItemColour(colour: any): string {
  if (!colour) return '';
  let displayColor = String(colour);
  try {
    if (displayColor.startsWith('[') && displayColor.endsWith(']')) {
      const parsed = JSON.parse(displayColor);
      if (Array.isArray(parsed)) displayColor = parsed[0] || '';
    }
  } catch (e) {}
  return displayColor;
}

export const ConfirmationReceiptTable = React.memo(function ConfirmationReceiptTable({
  order,
  currency,
}: ConfirmationReceiptTableProps) {
  const { t, formatNum } = useLanguage();

  return (
    <div className="confirmation-section">
      <h3 className="section-sub">
        <i className="fa-solid fa-receipt"></i> {t('order_summary_title', 'অর্ডার সামারি')}
      </h3>
      <table className="confirmation-table">
        <thead>
          <tr>
            <th>{t('confirm_item_col', 'পণ্য')}</th>
            <th>{t('confirm_qty_col', 'পরিমাণ')}</th>
            <th className="text-right">{t('confirm_price_col', 'মূল্য')}</th>
          </tr>
        </thead>
        <tbody>
          {(order.items || []).map((item: any) => {
            const itemImg =
              item.imageUrl ||
              item.product?.images?.[0]?.imageUrl ||
              item.product?.images?.[0]?.thumbnailUrl ||
              item.product?.imageUrl ||
              '/images/no-image.svg';

            const displayColor = parseItemColour(item.colour);

            return (
              <tr key={item.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={itemImg}
                      alt={item.productName}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/no-image.svg';
                      }}
                      style={{
                        width: '52px',
                        height: '52px',
                        minWidth: '52px',
                        maxWidth: '52px',
                        borderRadius: '10px',
                        objectFit: 'cover',
                        border: '1px solid rgba(142, 90, 53, 0.18)',
                        background: '#F8F5F1',
                        display: 'block',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <strong
                        style={{
                          display: 'block',
                          color: '#2b1d14',
                          fontSize: '0.95rem',
                          lineHeight: '1.3',
                        }}
                      >
                        {item.productName}
                      </strong>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginTop: '3px',
                          fontSize: '0.8rem',
                          color: '#64748B',
                          flexWrap: 'wrap',
                        }}
                      >
                        {item.sizeName && (
                          <span style={{ fontWeight: 600, color: '#475569' }}>
                            {item.sizeName}
                          </span>
                        )}
                        {displayColor && (
                          <>
                            <span style={{ color: '#CBD5E1' }}>•</span>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                color: '#64748B',
                              }}
                            >
                              {item.colourHex && (
                                <span
                                  style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: item.colourHex,
                                    border: '1px solid rgba(0,0,0,0.15)',
                                    display: 'inline-block',
                                    flexShrink: 0,
                                  }}
                                />
                              )}
                              <span>{displayColor}</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ verticalAlign: 'middle' }}>{formatNum(item.quantity)}</td>
                <td className="text-right" style={{ verticalAlign: 'middle', fontWeight: 600 }}>
                  {currency} {formatNum(item.totalPrice)}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}>{t('order_subtotal', 'সাবটোটাল')}</td>
            <td className="text-right">
              {currency} {formatNum(order.subtotal)}
            </td>
          </tr>
          {Number(order.discountAmount || 0) > 0 && (
            <tr style={{ color: '#059669', fontWeight: 600 }}>
              <td colSpan={2}>
                {t('order_promo_discount', 'প্রোমো ছাড়')}{' '}
                {order.promoCode ? `(${order.promoCode})` : ''}
              </td>
              <td className="text-right">- {currency} {formatNum(order.discountAmount)}</td>
            </tr>
          )}
          <tr>
            <td colSpan={2}>{t('order_delivery_charge', 'ডেলিভারি চার্জ')}</td>
            <td className="text-right">
              {currency} {formatNum(order.deliveryCharge)}
            </td>
          </tr>
          <tr className="total-row">
            <td colSpan={2}>
              <strong>{t('order_total_payable', 'সর্বমোট প্রদেয় বিল')}</strong>
            </td>
            <td className="text-right">
              <strong>
                {currency} {formatNum(order.total)}
              </strong>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
});
