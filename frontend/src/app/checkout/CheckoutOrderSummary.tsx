'use client';

import React from 'react';
import { ShoppingBag, TicketPercent, Tag, Loader2, AlertCircle, X, Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';

interface CheckoutOrderSummaryProps {
  t: (key: string, fallback: string) => string;
  formatNum: (val: number | string) => string;
  currency: string;
  items: any[];
  totalPrice: number;
  district: string;
  currentDelivery: number;
  grandTotal: number;
  appliedPromo: {
    code: string;
    discountType: 'fixed' | 'percentage';
    discountValue: number;
    discountAmount: number;
    description?: string;
  } | null;
  promoInput: string;
  setPromoInput: (val: string) => void;
  promoLoading: boolean;
  promoError: string;
  setPromoError: (val: string) => void;
  onApplyPromo: (e?: React.FormEvent) => void;
  onRemovePromo: () => void;
}

function parseCheckoutItemColor(displayColor?: string): string {
  if (!displayColor) return '';
  try {
    if (displayColor.startsWith('[') && displayColor.endsWith(']')) {
      const parsed = JSON.parse(displayColor);
      if (Array.isArray(parsed)) return parsed[0] || '';
    }
  } catch {}
  return displayColor;
}

export default React.memo(function CheckoutOrderSummary({
  t,
  formatNum,
  currency,
  items,
  totalPrice,
  district,
  currentDelivery,
  grandTotal,
  appliedPromo,
  promoInput,
  setPromoInput,
  promoLoading,
  promoError,
  setPromoError,
  onApplyPromo,
  onRemovePromo,
}: CheckoutOrderSummaryProps) {
  const totalItemCount = items.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <div className="order-summary-col">
      <div className="order-summary-card bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-md space-y-5 sticky top-24">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3.5">
          <h3 className="font-black text-stone-900 text-sm sm:text-base flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#C08A46]" />
            <span>{t('order_summary_title', 'অর্ডার সামারি')}</span>
          </h3>
          <span className="text-xs font-bold text-stone-500">
            {formatNum(totalItemCount)} {t('items_count_label', 'টি পণ্য')}
          </span>
        </div>

        {/* Product items list */}
        <div className="summary-items-list space-y-3 max-h-[320px] overflow-y-auto pr-1">
          {items.map((item) => {
            const displayColor = parseCheckoutItemColor(item.colour);

            return (
              <div
                key={item.id}
                className="summary-product-item flex items-center gap-3 p-2.5 rounded-xl bg-stone-50/80 border border-stone-200/70"
              >
                <img
                  src={item.imageUrl || '/images/no-image.svg'}
                  alt={item.productName}
                  loading="lazy"
                  className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0 bg-white"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/no-image.svg';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-stone-900 text-xs truncate leading-snug">
                    {item.productName}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-stone-600 truncate">
                    {item.variantName && (
                      <span className="font-medium text-stone-700 shrink-0">
                        {item.variantName}
                      </span>
                    )}
                    {displayColor && (
                      <>
                        <span className="text-stone-300 shrink-0">•</span>
                        <span className="inline-flex items-center gap-1 text-stone-600 truncate">
                          {item.colourHex && (
                            <span
                              className="w-2 h-2 rounded-full border border-stone-300 shrink-0 inline-block"
                              style={{ backgroundColor: item.colourHex }}
                            />
                          )}
                          <span className="truncate">{displayColor}</span>
                        </span>
                      </>
                    )}
                    <span className="text-stone-300 shrink-0">•</span>
                    <span className="font-bold text-stone-800 shrink-0">
                      × {formatNum(item.quantity)}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-serif font-black text-stone-900 text-xs sm:text-sm">
                    {currency} {formatNum(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Promo Code Voucher Section */}
        <div className="promo-voucher-section pt-3 border-t border-stone-100">
          {appliedPromo ? (
            <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <TicketPercent className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-black text-xs text-emerald-900 tracking-wider">
                      {appliedPromo.code}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded">
                      {appliedPromo.discountType === 'percentage'
                        ? `${appliedPromo.discountValue}% ${t('product_save_badge', 'ছাড়')}`
                        : t('promo_flat_discount', 'ফ্ল্যাট ছাড়')}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-emerald-700 truncate">
                    ৳{formatNum(appliedPromo.discountAmount)} {t('promo_saved_text', 'সাশ্রয় হয়েছে!')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onRemovePromo}
                className="p-1.5 rounded-lg text-emerald-700 hover:text-red-600 hover:bg-emerald-100/50 transition-colors cursor-pointer shrink-0"
                title={t('remove', 'মুছে ফেলুন')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={onApplyPromo} className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Tag className="w-3.5 h-3.5 text-[#C08A46]" />
                  </div>
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => {
                      setPromoInput(e.target.value.toUpperCase());
                      setPromoError('');
                    }}
                    placeholder={t('checkout_promo_placeholder', 'প্রোমো কোড লিখুন')}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-mono text-xs font-bold uppercase tracking-wider focus:bg-white focus:outline-none focus:border-[#C08A46] transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={promoLoading || !promoInput.trim()}
                  className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-[#8E5A35] text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1 shrink-0 shadow-2xs"
                >
                  {promoLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>{t('promo_apply_btn', 'প্রয়োগ')}</span>
                  )}
                </button>
              </div>

              {promoError && (
                <p className="text-[11px] font-semibold text-red-600 flex items-center gap-1 animate-in fade-in">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{promoError}</span>
                </p>
              )}
            </form>
          )}
        </div>

        {/* Financial Calculation Breakdown */}
        <div className="summary-calculation-lines pt-3 border-t border-stone-100 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-stone-600">
            <span>{t('order_subtotal', 'পণ্য মূল্য (সাবটোটাল):')}</span>
            <span className="font-bold text-stone-900">{currency} {formatNum(totalPrice)}</span>
          </div>

          {appliedPromo && (
            <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold animate-in fade-in">
              <span className="flex items-center gap-1">
                <TicketPercent className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('order_promo_discount', 'প্রোমো ছাড়')} ({appliedPromo.code}):</span>
              </span>
              <span className="font-bold font-mono">- {currency} {formatNum(appliedPromo.discountAmount)}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-stone-600">
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-[#C08A46]" />
              <span>{t('order_delivery_charge', 'ডেলিভারি চার্জ')}</span>
              <span className="text-[10px] text-stone-400">
                ({district === 'inside_dhaka' ? t('order_opt_dhaka', 'ঢাকার ভিতরে') : t('order_opt_outside', 'ঢাকার বাইরে')})
              </span>:
            </span>
            <span className="font-bold text-stone-900">{currency} {formatNum(currentDelivery)}</span>
          </div>

          <div className="calc-divider my-2 border-t border-dashed border-stone-200"></div>

          <div className="flex items-center justify-between text-sm sm:text-base font-black text-stone-900">
            <span>{t('order_total_payable', 'সর্বমোট পরিশোধযোগ্য:')}</span>
            <span className="font-serif text-lg sm:text-xl text-[#8E5A35]">
              {currency} {formatNum(grandTotal)}
            </span>
          </div>
        </div>

        {/* Trust Badges in Sidebar */}
        <div className="p-3.5 rounded-2xl bg-[#FAF3EB]/70 border border-[#ebdccc] space-y-2 text-[11px] text-[#8E5A35]">
          <div className="flex items-center gap-2 font-bold">
            <ShieldCheck className="w-4 h-4 text-[#C08A46] shrink-0" />
            <span>{t('checkout_guarantee_1', '১০০% অরিজিনাল কাঠের পণ্য গ্যারান্টি')}</span>
          </div>
          <div className="flex items-center gap-2 font-bold">
            <RotateCcw className="w-4 h-4 text-[#C08A46] shrink-0" />
            <span>{t('checkout_guarantee_2', 'ডেলিভারির সময় চেক করে নেওয়ার সুযোগ')}</span>
          </div>
          <div className="flex items-center gap-2 font-bold">
            <Headphones className="w-4 h-4 text-[#C08A46] shrink-0" />
            <span>{t('checkout_guarantee_3', 'সার্বক্ষণিক কাস্টমার সাপোর্ট ও গাইডলাইন')}</span>
          </div>
        </div>
      </div>
    </div>
  );
});
