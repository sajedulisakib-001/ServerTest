'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { useAdminPrefix } from '@/lib/useAdminPrefix';
import { LoginHeader } from './LoginHeader';
import { LoginForm } from './LoginForm';
import { AdminFirstRunSetup } from '@/components/AdminFirstRunSetup';

// Safe localStorage accessor outside render cycle to eliminate memory thrashing
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {}
    return null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {}
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {}
  },
};

export default function Wrapper() {
  const router = useRouter();
  const prefix = useAdminPrefix();
  const isMountedRef = useRef(true);

  const [isCheckingSetup, setIsCheckingSetup] = useState(true);
  const [isSetupRequired, setIsSetupRequired] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [siteTitle, setSiteTitle] = useState('');

  // Check setup status and authentication
  useEffect(() => {
    isMountedRef.current = true;

    // 1. Check if First-Run Setup is required
    fetchApi('/auth/setup-status')
      .then((status) => {
        if (isMountedRef.current) {
          if (status?.isSetupRequired) {
            setIsSetupRequired(true);
          } else {
            setIsSetupRequired(false);
          }
          setIsCheckingSetup(false);
        }
      })
      .catch(() => {
        if (isMountedRef.current) {
          setIsCheckingSetup(false);
        }
      });

    // 2. Load site settings for branding title
    fetchApi('/settings/public')
      .then((data) => {
        if (isMountedRef.current && data && (data.store_name_en || data.store_name)) {
          setSiteTitle(data.store_name_en || data.store_name);
        }
      })
      .catch(() => {});

    // 3. Check existing valid session
    const existingToken = safeStorage.getItem('wm_admin_token');
    const existingUser = safeStorage.getItem('wm_admin_user');
    if (existingToken && existingUser) {
      router.push(prefix || '/');
      return;
    }

    // 4. Auto-populate remembered email
    const savedEmail = safeStorage.getItem('wm_remember_email');
    if (savedEmail) {
      setEmail(savedEmail);
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [prefix, router]);

  // Handle Form Submission
  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const sanitizedEmail = email.trim().toLowerCase();
      if (!sanitizedEmail || !password) {
        setError('Please enter both your email address and password.');
        return;
      }

      if (loading) return;

      setLoading(true);
      setError('');

      try {
        const res = await fetchApi('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: sanitizedEmail,
            email: sanitizedEmail,
            password: password,
          }),
        });

        if (res && res.accessToken) {
          // Store token and user
          safeStorage.setItem('wm_admin_token', res.accessToken);
          safeStorage.setItem('wm_admin_user', JSON.stringify(res.user || {}));

          if (rememberMe) {
            safeStorage.setItem('wm_remember_email', sanitizedEmail);
          } else {
            safeStorage.removeItem('wm_remember_email');
          }

          if (isMountedRef.current) {
            setLoginSuccess(true);
            setLoading(false);
          }

          // Trigger navigation
          setTimeout(() => {
            window.location.href = prefix || '/';
          }, 300);
        } else {
          throw new Error(res?.message || 'Authentication failed. Please check credentials.');
        }
      } catch (err: any) {
        if (isMountedRef.current) {
          setError(err.message || 'Invalid email or password.');
          setLoading(false);
        }
      }
    },
    [email, password, loading, rememberMe, prefix]
  );

  // While checking setup status
  if (isCheckingSetup) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If first-time setup is required, render the full multi-step setup wizard
  if (isSetupRequired) {
    return (
      <AdminFirstRunSetup
        onSetupComplete={() => {
          window.location.href = prefix || '/';
        }}
      />
    );
  }

  // Otherwise render standard login screen
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 sm:p-10 relative overflow-hidden">
        {/* Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-[#c08a46] to-amber-600" />

        {/* 1. Header */}
        <LoginHeader siteTitle={siteTitle} />

        {/* 2. Login Form */}
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          rememberMe={rememberMe}
          setRememberMe={setRememberMe}
          loading={loading}
          error={error}
          loginSuccess={loginSuccess}
          onSubmit={handleLogin}
        />
      </div>
    </div>
  );
}
