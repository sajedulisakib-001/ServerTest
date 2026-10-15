'use client';

import React from 'react';
import { Store } from 'lucide-react';

interface LoginHeaderProps {
  siteTitle?: string;
}

export const LoginHeader = React.memo(function LoginHeader({ siteTitle }: LoginHeaderProps) {
  return (
    <div className="text-center space-y-2 mb-8">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#c08a46] shadow-inner mb-2">
        <Store className="w-7 h-7" />
      </div>
      <h1 className="text-2xl font-black text-slate-900 tracking-tight">
        {siteTitle ? `${siteTitle} Administration` : 'StoreForge Administration'}
      </h1>
      <p className="text-xs text-slate-500 max-w-xs mx-auto">
        Sign in with your administrator or staff credentials to access the management portal.
      </p>
    </div>
  );
});

export default LoginHeader;

