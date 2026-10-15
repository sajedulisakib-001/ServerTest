'use client';

import React, { useState, useCallback } from 'react';
import { Shield, Sliders, Lock, CheckCircle2, AlertCircle, ExternalLink, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface AdminSecuritySectionProps {
  settings: Record<string, string>;
  handleChange: (key: string, value: string) => void;
}

export const AdminSecuritySection = React.memo(function AdminSecuritySection({ settings, handleChange }: AdminSecuritySectionProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChangePassword = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('Please enter current password');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match');
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await fetchApi('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      setPasswordSuccess(res.message || 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setUpdatingPassword(false);
    }
  }, [currentPassword, newPassword, confirmPassword]);

  const adminBaseUrl =
    (typeof window !== 'undefined' && window.location.origin) ||
    process.env.NEXT_PUBLIC_ADMIN_URL ||
    process.env.ADMIN_URL ||
    'http://localhost:4000';

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2.5 text-slate-900 font-bold border-b border-slate-100 pb-3.5">
        <div className="p-2 rounded-xl bg-red-50 border border-red-100 text-red-600">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <span className="text-base font-bold text-slate-900 block">Admin Credentials & Security Protection</span>
          <span className="text-xs text-slate-500 font-normal">
            Configure custom stealth routes, anti-bot protection, and master administrator authentication credentials
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Column 1: Custom Admin Route & Stealth Path */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between h-full">
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-900">Custom Admin Route & Stealth URL Path</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Change the default <span className="font-mono font-bold text-slate-700">/admin</span> path to a secret custom URL slug (e.g. <span className="font-mono text-purple-700 font-bold">/portal</span> or <span className="font-mono text-purple-700 font-bold">/manage</span>) to prevent automated bot attacks and brute-force scans.
              </p>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Custom Admin Route Slug
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-slate-200 border border-r-0 border-slate-300 rounded-l-xl text-xs font-mono text-slate-600 select-none">
                    /
                  </span>
                  <input
                    type="text"
                    value={settings.admin_route_prefix ?? 'admin'}
                    onChange={(e) => {
                      const clean = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
                      handleChange('admin_route_prefix', clean);
                      if (typeof document !== 'undefined') {
                        document.cookie = `admin_custom_slug=${clean || 'admin'}; path=/; max-age=31536000`;
                      }
                    }}
                    placeholder="admin"
                    className="w-full px-3.5 py-2 rounded-r-xl bg-white border border-slate-200 text-slate-900 font-mono text-xs focus:outline-none focus:border-purple-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Only lowercase letters, numbers, hyphens, and underscores allowed.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Custom Moderator Dashboard Route Slug
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-slate-200 border border-r-0 border-slate-300 rounded-l-xl text-xs font-mono text-slate-600 select-none">
                    /
                  </span>
                  <input
                    type="text"
                    value={settings.moderator_route_prefix ?? 'moderator'}
                    onChange={(e) => {
                      const clean = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
                      handleChange('moderator_route_prefix', clean);
                    }}
                    placeholder="moderator"
                    className="w-full px-3.5 py-2 rounded-r-xl bg-white border border-slate-200 text-slate-900 font-mono text-xs focus:outline-none focus:border-purple-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Direct access path for staff moderators (e.g. /staff or /moderator).
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Stealth Protection Mode
                </label>
                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer hover:border-slate-300 transition-colors">
                  <input
                    type="checkbox"
                    checked={settings.hide_default_admin === 'true'}
                    onChange={(e) =>
                      handleChange('hide_default_admin', e.target.checked ? 'true' : 'false')
                    }
                    className="mt-0.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 block">Hide default /admin route</span>
                    <span className="text-slate-500 text-[11px] block mt-0.5 leading-snug">
                      When enabled, unauthorized visitors who navigate to <span className="font-mono">/admin</span> will be redirected to the homepage.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
                    Active Admin Access URL:
                  </span>
                  <div className="font-mono font-bold text-purple-950 break-all text-xs">
                    {adminBaseUrl}/{settings.admin_route_prefix || 'admin'}
                  </div>
                </div>

                <a
                  href={`/${settings.admin_route_prefix || 'admin'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors shrink-0"
                >
                  <span>Test Admin</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                    Active Moderator Access URL:
                  </span>
                  <div className="font-mono font-bold text-indigo-950 break-all text-xs">
                    {adminBaseUrl}/{settings.moderator_route_prefix || 'moderator'}
                  </div>
                </div>

                <a
                  href={`/${settings.moderator_route_prefix || 'moderator'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors shrink-0"
                >
                  <span>Test Moderator</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Admin Password Change Form */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between h-full">
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-900">Change Admin Password</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Update master account password for the admin portal. Requires your current active password.
              </p>
            </div>

            <form id="change-pwd-form" onSubmit={handleChangePassword} className="space-y-3.5 pt-1">
              {passwordSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-red-600 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">New Password (Min 6 chars)</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-red-600"
                />
              </div>
            </form>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-200">
            <button
              type="submit"
              form="change-pwd-form"
              disabled={updatingPassword}
              className="w-full sm:w-auto px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors shadow disabled:opacity-50"
            >
              {updatingPassword ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{updatingPassword ? 'Updating...' : 'Change Password'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AdminSecuritySection;
