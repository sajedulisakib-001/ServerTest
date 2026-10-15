'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Store,
  User,
  Mail,
  Lock,
  Phone,
  Truck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Eye,
  EyeOff,
  Globe,
  Check,
} from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface AdminFirstRunSetupProps {
  onSetupComplete?: () => void;
}

export function AdminFirstRunSetup({ onSetupComplete }: AdminFirstRunSetupProps) {
  const [step, setStep] = useState<1 | 2>(1);

  // Auto-detect if setup was already performed elsewhere/earlier
  useEffect(() => {
    fetchApi('/auth/setup-status')
      .then((status) => {
        if (status && status.isSetupRequired === false) {
          window.location.href = '/login';
        }
      })
      .catch(() => {});
  }, []);

  // Step 1: Admin Profile Details
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2: Store / Site Configuration
  const [storeName, setStoreName] = useState('StoreForge');
  const [siteTitle, setSiteTitle] = useState('StoreForge E-Commerce');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [deliveryDhaka, setDeliveryDhaka] = useState('60');
  const [deliveryOutside, setDeliveryOutside] = useState('120');

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [setupSuccess, setSetupSuccess] = useState(false);

  // Validate Step 1 and proceed to Step 2
  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanName = adminName.trim();
    const cleanEmail = adminEmail.trim().toLowerCase();
    const cleanPhone = adminPhone.trim();
    const cleanPass = password.trim();
    const cleanConfirm = confirmPassword.trim();

    if (!cleanName) {
      setError('Please enter your full name.');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid administrator email address.');
      return;
    }

    if (!cleanPhone) {
      setError('Please enter your administrator contact phone number.');
      return;
    }

    if (!cleanPass || cleanPass.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (cleanPass !== cleanConfirm) {
      setError('Passwords do not match. Please re-check.');
      return;
    }

    // Auto-fill Step 2 defaults if currently blank
    if (!contactEmail) setContactEmail(cleanEmail);
    if (!contactPhone && cleanPhone) setContactPhone(cleanPhone);
    if (!siteTitle) setSiteTitle(`${storeName || 'StoreForge'} E-Commerce`);

    setStep(2);
  };

  // Submit full setup to backend
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanStoreName = storeName.trim();
    const cleanSiteTitle = siteTitle.trim();
    const cleanContactPhone = contactPhone.trim();
    const cleanContactEmail = contactEmail.trim().toLowerCase();
    const cleanDeliveryDhaka = deliveryDhaka.trim();
    const cleanDeliveryOutside = deliveryOutside.trim();

    if (!cleanStoreName) {
      setError('Please enter your store or brand name.');
      return;
    }

    if (!cleanSiteTitle) {
      setError('Please enter the website title.');
      return;
    }

    if (!cleanContactPhone) {
      setError('Please enter the support contact phone number.');
      return;
    }

    if (!cleanContactEmail || !cleanContactEmail.includes('@')) {
      setError('Please enter a valid support contact email address.');
      return;
    }

    if (!cleanDeliveryDhaka || isNaN(Number(cleanDeliveryDhaka)) || Number(cleanDeliveryDhaka) < 0) {
      setError('Please enter a valid delivery charge for inside Dhaka.');
      return;
    }

    if (!cleanDeliveryOutside || isNaN(Number(cleanDeliveryOutside)) || Number(cleanDeliveryOutside) < 0) {
      setError('Please enter a valid delivery charge for outside Dhaka.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: adminName.trim(),
        email: adminEmail.trim().toLowerCase(),
        password: password.trim(),
        phone: adminPhone.trim(),
        store_name: cleanStoreName,
        site_title: cleanSiteTitle,
        contact_phone: cleanContactPhone,
        contact_email: cleanContactEmail,
        delivery_charge_dhaka: cleanDeliveryDhaka,
        delivery_charge_outside: cleanDeliveryOutside,
      };

      const res = await fetchApi('/auth/first-run-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res && res.accessToken) {
        // Save session locally
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('wm_admin_token', res.accessToken);
          localStorage.setItem('wm_admin_user', JSON.stringify(res.user || {}));
          localStorage.setItem('wm_remember_email', adminEmail.trim().toLowerCase());
        }

        setSetupSuccess(true);

        setTimeout(() => {
          if (onSetupComplete) {
            onSetupComplete();
          } else {
            window.location.href = '/';
          }
        }, 1500);
      } else {
        throw new Error(res?.message || 'Failed to complete site setup.');
      }
    } catch (err: any) {
      const errMsg = err?.message || 'An error occurred during site setup. Please try again.';
      if (
        errMsg.toLowerCase().includes('already been completed') ||
        errMsg.toLowerCase().includes('already completed')
      ) {
        setError('Initial setup has already been completed. Redirecting to login page...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1200);
      } else {
        setError(errMsg);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-amber-600/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative z-10">
        {/* Top Gradient Banner */}
        <div className="h-2 bg-gradient-to-r from-amber-500 via-indigo-500 to-indigo-600" />

        <div className="p-6 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/25 mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome to StoreForge
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-md mx-auto">
              Initial Setup Wizard — Create your master superadmin account and configure store essentials in 2 quick steps.
            </p>
          </div>

          {/* Stepper Progress Bar */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 mb-8 max-w-md mx-auto">
            {/* Step 1 Pill */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                step === 1
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {step > 1 ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-black">
                  1
                </span>
              )}
              <span>Admin Profile</span>
            </div>

            <div className="h-0.5 w-8 bg-slate-800" />

            {/* Step 2 Pill */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                step === 2
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'bg-slate-800 text-slate-500 border border-slate-700/50'
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                step === 2 ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'
              }`}>
                2
              </span>
              <span>Site Configuration</span>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {setupSuccess && (
            <div className="mb-6 p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 animate-bounce" />
              <div>
                <p className="font-bold">Setup Completed Successfully!</p>
                <p className="text-xs text-emerald-400/80 mt-0.5">
                  Your superadmin account and store configs are saved. Redirecting to dashboard...
                </p>
              </div>
            </div>
          )}

          {/* STEP 1 FORM: Admin Profile Creation */}
          {step === 1 && !setupSuccess && (
            <form onSubmit={handleProceedToStep2} className="space-y-4">
              <div className="border-b border-slate-800 pb-3 mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Step 1: Superadmin Profile Creation
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  This user will have full master authority over orders, inventory, settings, and staff.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Full Name <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      placeholder="e.g. Sajedul Sakib"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Superadmin Email <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="admin@yourdomain.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Contact Phone Number <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    placeholder="+880 1700-000000"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Password <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Confirm Password <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 1 Next Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all cursor-pointer"
                >
                  <span>Continue to Site Configuration</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2 FORM: Site Configuration */}
          {step === 2 && !setupSuccess && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <div className="border-b border-slate-800 pb-3 mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Store className="w-4 h-4 text-indigo-400" />
                  Step 2: Store & Site Configuration
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Customize branding, customer contact points, and shipping rates. (You can update these anytime later).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Store Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Store / Brand Name <span className="text-indigo-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Store className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="StoreForge"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                {/* Site Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Website Title <span className="text-indigo-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Globe className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={siteTitle}
                      onChange={(e) => setSiteTitle(e.target.value)}
                      placeholder="StoreForge E-Commerce"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Support Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Support Contact Phone <span className="text-indigo-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+880 1700-000000"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                {/* Support Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Support Contact Email <span className="text-indigo-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="support@storeforge.io"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Delivery Inside Dhaka */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Inside Dhaka Delivery (৳) <span className="text-indigo-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Truck className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      required
                      value={deliveryDhaka}
                      onChange={(e) => setDeliveryDhaka(e.target.value)}
                      placeholder="60"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Delivery Outside Dhaka */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Outside Dhaka Delivery (৳) <span className="text-indigo-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Truck className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      required
                      value={deliveryOutside}
                      onChange={(e) => setDeliveryOutside(e.target.value)}
                      placeholder="120"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-white text-xs font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2 Actions */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Configurations...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Setup & Launch Dashboard</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
export default AdminFirstRunSetup;
