import { useState, useCallback } from 'react';

export type ProductFormTab = 'main' | 'badges' | 'specs' | 'other';

export const useProductFormTabs = (initialTab: ProductFormTab = 'main') => {
  const [activeTab, setActiveTab] = useState<ProductFormTab>(initialTab);

  const changeTab = useCallback((tab: ProductFormTab) => {
    console.log('ProductFormTabs - Mudando de', activeTab, 'para', tab);
    setActiveTab(tab);
  }, [activeTab]);

  const nextTab = useCallback(() => {
    const tabs: ProductFormTab[] = ['main', 'badges', 'specs', 'other'];
    const currentIndex = tabs.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    changeTab(tabs[nextIndex]);
  }, [activeTab, changeTab]);

  const prevTab = useCallback(() => {
    const tabs: ProductFormTab[] = ['main', 'badges', 'specs', 'other'];
    const currentIndex = tabs.indexOf(activeTab);
    const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    changeTab(tabs[prevIndex]);
  }, [activeTab, changeTab]);

  return {
    activeTab,
    changeTab,
    nextTab,
    prevTab
  };
};