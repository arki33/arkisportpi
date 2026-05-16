'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface PiWallet {
  username: string;
  walletAddress: string;
  isConnected: boolean;
  balance: number;
  connectionDate: Date;
}

interface PiAuthContextType {
  wallet: PiWallet | null;
  connectWallet: (username: string, walletAddress: string) => Promise<void>;
  disconnectWallet: () => void;
  updateBalance: (amount: number) => void;
  isLoading: boolean;
  error: string | null;
}

const PiAuthContext = createContext<PiAuthContextType | undefined>(undefined);

export function PiAuthProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<PiWallet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async (username: string, walletAddress: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate Pi Network API call
      // In production, this would connect to actual Pi Network blockchain
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Validate wallet address format (basic validation)
      if (!walletAddress || walletAddress.length < 10) {
        throw new Error('Invalid wallet address format');
      }

      const newWallet: PiWallet = {
        username,
        walletAddress,
        isConnected: true,
        balance: 0,
        connectionDate: new Date(),
      };

      setWallet(newWallet);
      // Save to localStorage for persistence
      localStorage.setItem('piWallet', JSON.stringify(newWallet));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
    setError(null);
    localStorage.removeItem('piWallet');
  };

  const updateBalance = (amount: number) => {
    if (wallet) {
      const updated = { ...wallet, balance: wallet.balance + amount };
      setWallet(updated);
      localStorage.setItem('piWallet', JSON.stringify(updated));
    }
  };

  // Load wallet from localStorage on mount
  useState(() => {
    const stored = localStorage.getItem('piWallet');
    if (stored) {
      try {
        setWallet(JSON.parse(stored));
      } catch (err) {
        console.error('Failed to load wallet from storage:', err);
      }
    }
  });

  return (
    <PiAuthContext.Provider value={{ wallet, connectWallet, disconnectWallet, updateBalance, isLoading, error }}>
      {children}
    </PiAuthContext.Provider>
  );
}

export function usePiAuth() {
  const context = useContext(PiAuthContext);
  if (!context) {
    throw new Error('usePiAuth must be used within PiAuthProvider');
  }
  return context;
}
