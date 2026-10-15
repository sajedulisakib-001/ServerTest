'use client';

import React from 'react';
import {
  Store,
  Package,
  Phone,
  Truck,
  CreditCard,
  Globe,
  MessageSquare,
  Printer,
  Bot,
  Shield,
} from 'lucide-react';

export type TabType =
  | 'general'
  | 'product_defaults'
  | 'contact'
  | 'delivery'
  | 'payments'
  | 'seo'
  | 'sms'
  | 'invoice'
  | 'ai'
  | 'security';

interface SettingsTabNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const TABS_CONFIG: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'general', label: 'General & Store', icon: <Store className="w-4 h-4" /> },
  { id: 'product_defaults', label: 'Product Defaults', icon: <Package className="w-4 h-4" /> },
  { id: 'contact', label: 'Contact & Social', icon: <Phone className="w-4 h-4" /> },
  { id: 'delivery', label: 'Delivery & Courier', icon: <Truck className="w-4 h-4" /> },
  { id: 'payments', label: 'Payment Gateways', icon: <CreditCard className="w-4 h-4" /> },
  { id: 'seo', label: 'SEO & Analytics', icon: <Globe className="w-4 h-4" /> },
  { id: 'sms', label: 'SMS Gateways', icon: <MessageSquare className="w-4 h-4" /> },
  { id: 'invoice', label: 'Invoice & Print', icon: <Printer className="w-4 h-4" /> },
  { id: 'ai', label: 'AI Multi-Agent Studio', icon: <Bot className="w-4 h-4" /> },
  { id: 'security', label: 'Admin Security', icon: <Shield className="w-4 h-4" /> },
];

export const SettingsTabNav = React.memo(function SettingsTabNav({ activeTab, setActiveTab }: SettingsTabNavProps) {
  return (
    <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-slate-200/90 shadow-sm">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {TABS_CONFIG.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`group relative px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer text-center ${
                isActive
                  ? 'bg-[#c08a46] text-white shadow-md shadow-[#c08a46]/25 ring-1 ring-[#c08a46]'
                  : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/70 hover:border-slate-300'
              }`}
            >
              <span className={`shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'}`}>
                {tab.icon}
              </span>
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

export default SettingsTabNav;
