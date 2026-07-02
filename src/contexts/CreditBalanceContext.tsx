'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';

async function fetchTotalCredits(): Promise<number> {
  const res = await fetch('/api/credits/me', { cache: 'no-store' });
  const json = await res.json();
  return Number(json.totalCredits || 0);
}

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
  const [fetchedCredits, setFetchedCredits] = useState<number | null>(null);
  const { data: session } = authClient.useSession();

  const fetchCredits = useCallback(async () => {
    if (!session) return;
    try {
      setFetchedCredits(await fetchTotalCredits());
    } catch (error) {
      console.error('Failed to fetch credits:', error);
      setFetchedCredits(0);
    }
  }, [session]);

  // Fetch on session change, setting state only inside async callbacks.
  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    fetchTotalCredits()
      .then((c) => { if (!cancelled) setFetchedCredits(c); })
      .catch((error) => {
        if (cancelled) return;
        console.error('Failed to fetch credits:', error);
        setFetchedCredits(0);
      });
    return () => { cancelled = true; };
  }, [session]);

  // Derive instead of syncing state in the effect: logged out -> no credits,
  // session resolving -> loading, logged in -> loading until first fetch lands.
  const credits = session ? fetchedCredits : null;
  const isLoading = session === undefined ? true : session ? fetchedCredits === null : false;

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
