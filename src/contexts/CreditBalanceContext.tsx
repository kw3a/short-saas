'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';

type CreditBalanceContextType = {
  credits: number | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
};

const CreditBalanceContext = createContext<CreditBalanceContextType>({
  credits: null,
  isLoading: true,
  refresh: async () => {},
});

export function CreditBalanceProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = authClient.useSession();

  const fetchCredits = async () => {
    if (!session) {
      setCredits(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('/api/credits/me', { cache: 'no-store' });
      const json = await res.json();
      setCredits(Number(json.totalCredits || 0));
    } catch (error) {
      console.error('Failed to fetch credits:', error);
      setCredits(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [session]);

  return (
    <CreditBalanceContext.Provider
      value={{
        credits,
        isLoading,
        refresh: fetchCredits,
      }}
    >
      {children}
    </CreditBalanceContext.Provider>
  );
}

export const useCredits = () => {
  const context = useContext(CreditBalanceContext);
  if (context === undefined) {
    throw new Error('useCredits must be used within a CreditBalanceProvider');
  }
  return context;
};
