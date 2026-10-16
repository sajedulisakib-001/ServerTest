'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { fetchApi } from '@/lib/api';
import { useAdminModal } from '@/lib/AdminModalContext';
import { ProductListHeader } from './ProductListHeader';
import { ProductListTable } from './ProductListTable';

export default function Wrapper() {
  const { showConfirm, showError, showSuccess } = useAdminModal();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(() => {
    setLoading(true);
    fetchApi('/products?status=all&limit=100')
      .then((data) => {
        setProducts(data.items || data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleDelete = useCallback(
    async (id: number, name: string) => {
      const confirmed = await showConfirm(
        `Are you sure you want to delete "${name}"? This will permanently remove its variants and images.`,
        {
          title: 'Delete Product',
          confirmText: 'Delete Product',
          confirmVariant: 'danger',
        }
      );
      if (!confirmed) return;

      try {
        await fetchApi(`/products/${id}`, { method: 'DELETE' });
        await showSuccess(`"${name}" was deleted successfully.`);
        loadProducts();
      } catch (err: any) {
        showError(err.message || 'Failed to delete product');
      }
    },
    [showConfirm, showSuccess, showError, loadProducts]
  );

  return (
    <div className="space-y-6 w-full pb-16">
      {/* 1. Products Header */}
      <ProductListHeader />

      {/* 2. Products Table */}
      <ProductListTable
        products={products}
        loading={loading}
        onDelete={handleDelete}
      />
    </div>
  );
}
