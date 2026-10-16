'use client';

import React from 'react';
import { Phone, Share2 } from 'lucide-react';

interface ContactSocialSectionProps {
  settings: Record<string, string>;
  handleChange: (key: string, value: string) => void;
}

export const ContactSocialSection = React.memo(function ContactSocialSection({ settings, handleChange }: ContactSocialSectionProps) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
      <div className="flex items-center gap-2 text-slate-900 font-bold border-b border-slate-100 pb-3">
        <Phone className="w-5 h-5 text-[#c08a46]" />
        <span className="text-base">Helpline, WhatsApp & Customer Communication</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Primary Customer Helpline</label>
          <input
            type="text"
            value={settings.contact_phone || '+880 1700-000000'}
            onChange={(e) => handleChange('contact_phone', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-[#c08a46]"
            placeholder="+880 1700-000000"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Secondary / Hotline Phone</label>
          <input
            type="text"
            value={settings.contact_phone_secondary || '+880 1900-000000'}
            onChange={(e) => handleChange('contact_phone_secondary', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-[#c08a46]"
            placeholder="+880 1900-000000"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            WhatsApp Direct Number (with Country Code)
          </label>
          <input
            type="text"
            value={settings.contact_whatsapp || '8801700000000'}
            onChange={(e) => handleChange('contact_whatsapp', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-mono focus:bg-white focus:outline-none focus:border-[#c08a46]"
            placeholder="8801700000000"
          />
          <span className="text-[11px] text-slate-400 mt-1 block">Used for the floating WhatsApp button and direct chats</span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Customer Support Email</label>
          <input
            type="email"
            value={settings.contact_email || 'support@woodenmap.com'}
            onChange={(e) => handleChange('contact_email', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-[#c08a46]"
            placeholder="support@woodenmap.com"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Showroom & Factory Physical Address</label>
          <input
            type="text"
            value={settings.contact_address || 'House 12, Road 5, Dhanmondi, Dhaka, Bangladesh'}
            onChange={(e) => handleChange('contact_address', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-[#c08a46]"
            placeholder="House 12, Road 5, Dhanmondi, Dhaka, Bangladesh"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Google Maps Link / Embed URL</label>
          <input
            type="text"
            value={settings.contact_map_url || ''}
            onChange={(e) => handleChange('contact_map_url', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-[#c08a46]"
            placeholder="https://maps.google.com/..."
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-slate-900 font-bold border-b border-slate-100 pb-3 pt-4">
        <Share2 className="w-5 h-5 text-[#c08a46]" />
        <span className="text-base">Official Social Media Profiles</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Facebook Page URL</label>
          <input
            type="text"
            value={settings.facebook_url || 'https://facebook.com/woodenworldmapbd'}
            onChange={(e) => handleChange('facebook_url', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-[#c08a46]"
            placeholder="https://facebook.com/yourpage"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Instagram Profile URL</label>
          <input
            type="text"
            value={settings.instagram_url || 'https://instagram.com/woodenworldmap'}
            onChange={(e) => handleChange('instagram_url', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-[#c08a46]"
            placeholder="https://instagram.com/yourprofile"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">YouTube Channel URL</label>
          <input
            type="text"
            value={settings.youtube_url || ''}
            onChange={(e) => handleChange('youtube_url', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-[#c08a46]"
            placeholder="https://youtube.com/@channel"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">TikTok Profile URL</label>
          <input
            type="text"
            value={settings.tiktok_url || ''}
            onChange={(e) => handleChange('tiktok_url', e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-[#c08a46]"
            placeholder="https://tiktok.com/@profile"
          />
        </div>
      </div>
    </div>
  );
});

export default ContactSocialSection;
