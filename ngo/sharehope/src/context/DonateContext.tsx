import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { db } from '../services/database';
import { useAuth } from './AuthContext';

export interface DonateFormData {
  categoryId: string;
  category: string;
  categoryIcon: string;
  categoryColor: string;
  condition: string;
  quantity: string;
  description: string;
  photos: string[];
  addressId: string;
  address: string;
  pickupDate: string;
  pickupTime: string;
  contactNumber: string;
}

const defaultForm: DonateFormData = {
  categoryId: '',
  category: '',
  categoryIcon: '',
  categoryColor: '#1B5E20',
  condition: 'Good',
  quantity: '1',
  description: '',
  photos: [],
  addressId: '',
  address: '',
  pickupDate: '18 Jan 2026',
  pickupTime: '10:00 AM - 12:00 PM',
  contactNumber: '',
};

interface DonateContextType {
  form: DonateFormData;
  updateForm: (data: Partial<DonateFormData>) => void;
  resetForm: () => void;
  loadUserDefaults: () => Promise<void>;
}

const DonateContext = createContext<DonateContextType | undefined>(undefined);

export function DonateProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [form, setForm] = useState<DonateFormData>(defaultForm);

  const loadUserDefaults = useCallback(async () => {
    if (!user) return;
    const [addr, u] = await Promise.all([
      db.getDefaultAddress(user.id),
      db.getUserById(user.id),
    ]);
    setForm(prev => ({
      ...prev,
      addressId: addr?.id || '',
      address: addr?.address || prev.address,
      contactNumber: u?.phone || prev.contactNumber,
    }));
  }, [user]);

  useEffect(() => {
    loadUserDefaults();
  }, [loadUserDefaults]);

  const updateForm = useCallback((data: Partial<DonateFormData>) => {
    setForm(prev => ({ ...prev, ...data }));
  }, []);

  const resetForm = useCallback(() => {
    setForm({ ...defaultForm, contactNumber: user?.phone || '', address: form.address, addressId: form.addressId });
  }, [user, form.address, form.addressId]);

  return (
    <DonateContext.Provider value={{ form, updateForm, resetForm, loadUserDefaults }}>
      {children}
    </DonateContext.Provider>
  );
}

export function useDonate() {
  const ctx = useContext(DonateContext);
  if (!ctx) throw new Error('useDonate must be used within DonateProvider');
  return ctx;
}
