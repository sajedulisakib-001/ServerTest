'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, Printer, FileText } from 'lucide-react';
import { useAdminPrefix } from '@/lib/useAdminPrefix';

interface OrdersTableProps {
  orders: any[];
  loading: boolean;
  onOpenLabelPopup: (id: number) => void;
}

export const OrdersTable = React.memo(function OrdersTable({ orders, loading, onOpenLabelPopup }: OrdersTableProps) {
  const prefix = useAdminPrefix();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-20 text-center text-slate-500 shadow-sm">
        <div className="w-8 h-8 border-3 border-[#c08a46] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-medium">Loading orders list...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center text-slate-400 shadow-sm">
        <p className="text-sm font-semibold text-slate-700">No orders match your filter criteria.</p>
        <p className="text-xs text-slate-400 mt-1">Try broadening your search or resetting filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-slate-500 uppercase tracking-wider border-b border-slate-100 bg-slate-50/70">
            <tr>
              <th className="p-4">Order #</th>
              <th className="p-4">Customer</th>
              <th className="p-4">District</th>
              <th className="p-4">Total</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {orders.map((ord) => (
              <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4 font-mono font-bold text-[#c08a46]">
                  <Link href={`${prefix}/orders/${ord.id}`} className="hover:underline">
                    {ord.orderNumber}
                  </Link>
                </td>
                <td className="p-4">
                  <div className="font-bold text-slate-900">{ord.customerName}</div>
                  <div className="text-[11px] font-mono text-slate-400">{ord.phone}</div>
                </td>
                <td className="p-4 font-medium text-slate-600">{ord.district || 'Dhaka'}</td>
                <td className="p-4 font-bold text-slate-900">
                  ৳{Number(ord.total).toLocaleString()}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${ord.paymentStatus === 'paid'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                  >
                    {ord.paymentMethod} ({ord.paymentStatus})
                  </span>
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                    {ord.status}
                  </span>
                </td>
                <td className="p-4 text-slate-500 font-mono text-[11px]">
                  {new Date(ord.createdAt).toLocaleDateString('en-GB')}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`${prefix}/orders/${ord.id}`}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#c08a46] hover:text-white text-slate-700 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>

                    {/* <Link
                      href={`${prefix}/orders/${ord.id}/print`}
                      target="_blank"
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Print Invoice"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </Link> */}

                    <button
                      type="button"
                      onClick={() => onOpenLabelPopup(ord.id)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                      title="Shipping Label Sticker"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      {/* <FileText className="w-3.5 h-3.5 text-[#c08a46]" /> */}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
