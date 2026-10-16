'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { fetchApi } from './api';

interface SettingsContextType {
  settings: Record<string, string>;
  categories: any[];
  refreshSettings: () => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: {},
  categories: [],
  refreshSettings: async () => {},
  loading: false,
});

export const SettingsProvider: React.FC<{
  children: React.ReactNode;
  initialSettings?: Record<string, string>;
  initialCategories?: any[];
}> = ({ children, initialSettings = {}, initialCategories = [] }) => {
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);
  const [categories, setCategories] = useState<any[]>(initialCategories);
  const [loading, setLoading] = useState(false);

  // If initialSettings or initialCategories change from SSR stream, synchronize
  useEffect(() => {
    if (initialSettings && Object.keys(initialSettings).length > 0) {
      setSettings((prev) => (Object.keys(prev).length === 0 ? initialSettings : prev));
    }
  }, [initialSettings]);

  useEffect(() => {
    if (initialCategories && initialCategories.length > 0) {
      setCategories((prev) => (prev.length === 0 ? initialCategories : prev));
    }
  }, [initialCategories]);

  const refreshSettings = useCallback(async () => {
    setLoading(true);
    try {
      const [newSettings, newCategories] = await Promise.all([
        fetchApi('/settings/public').catch(() => ({})),
        fetchApi('/categories?activeOnly=true').catch(() => []),
      ]);
      if (newSettings && typeof newSettings === 'object') {
        setSettings(newSettings);
      }
      if (Array.isArray(newCategories)) {
        setCategories(newCategories);
      }
    } catch (err) {
      console.warn('Failed to refresh public settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      settings,
      categories,
      refreshSettings,
      loading,
    }),
    [settings, categories, refreshSettings, loading]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => useContext(SettingsContext);
