'use client';

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { FloatingContact } from './FloatingContact';
import { CartDrawer } from './CartDrawer';

export function CustomerShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="mainContent">{children}</main>
      <Footer />
      <FloatingContact />
      <CartDrawer />
    </>
  );
}
