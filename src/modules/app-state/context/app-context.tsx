'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  id: string;
  productId: string;
  type: 'rent' | 'buy';
  name: string;
  image: string;
  size: string;
  price: number;
  rentStartDate?: string;
  rentEndDate?: string;
  rentDuration?: number;
  deposit?: number;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AppContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartItem: (id: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  user: AppUser | null;
  login: (user: AppUser) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const USER_KEY = 'kygo_user';

function safeReadUser(): AppUser | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = sessionStorage.getItem(USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return null;
    const p = parsed as Record<string, unknown>;
    if (typeof p.id !== 'string' || typeof p.name !== 'string' || typeof p.email !== 'string') return null;
    return {
      id: p.id,
      name: p.name,
      email: p.email,
      avatar: typeof p.avatar === 'string' ? p.avatar : undefined,
    };
  } catch {
    return null;
  }
}

function safeWriteUser(user: AppUser | null) {
  try {
    if (typeof window === 'undefined') return;
    if (!user) {
      sessionStorage.removeItem(USER_KEY);
      return;
    }
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    setUser(safeReadUser());
  }, []);

  const addToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCartItem = (id: string, updates: Partial<CartItem>) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const login = (userData: AppUser) => {
    setUser(userData);
    safeWriteUser(userData);
  };

  const logout = () => {
    setUser(null);
    safeWriteUser(null);
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
