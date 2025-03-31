import React, { ReactNode, useEffect, useState } from 'react';
import { WalletContext, WalletContextState, initialWalletState } from './WalletContext';
import { WalletData } from '../../utils/stellar/types';
import {
  connectWallet,
  isFreighterInstalled,
  requestWalletPermission,
  getPublicKey,
  isConnected,
  signTransaction
} from '../../utils/stellar/wallet';
import { isAllowed } from '@stellar/freighter-api';

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  // State for managing wallet connection status and user data
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [isWalletAllowed, setIsWalletAllowed] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Check if Freighter wallet is installed
  const checkFreighterInstallation = (): boolean => {
    return isFreighterInstalled();
  };

  // Connect to wallet
  const connect = async (): Promise<WalletData> => {
    setIsConnecting(true);
    setError(null);
    
    try {
      const walletData = await connectWallet();
      
      setPublicKey(walletData.publicKey);
      setIsWalletConnected(walletData.isConnected);
      setIsWalletAllowed(walletData.isAllowed);
      
      return walletData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown wallet connection error');
      setError(error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  // Request wallet permission
  const requestPermission = async (): Promise<boolean> => {
    setError(null);
    
    try {
      const allowed = await requestWalletPermission();
      setIsWalletAllowed(allowed);
      
      // If permission was granted, refresh connection info
      if (allowed) {
        await connect();
      }
      
      return allowed;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to request wallet permission');
      setError(error);
      throw error;
    }
  };

  // Get user's public key
  const fetchPublicKey = async (): Promise<string> => {
    setError(null);
    
    try {
      const key = await getPublicKey();
      setPublicKey(key);
      return key;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch public key');
      setError(error);
      throw error;
    }
  };

  // Sign a transaction
  const handleSignTransaction = async (tx: string): Promise<string> => {
    setError(null);
    
    try {
      return await signTransaction(tx);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to sign transaction');
      setError(error);
      throw error;
    }
  };

  // Check wallet connection status on mount and when window gains focus
  useEffect(() => {
    const checkWalletStatus = async () => {
      if (!isFreighterInstalled()) return;
      
      try {
        const connected = await isConnected();
        const allowed = await isAllowed();
        
        setIsWalletConnected(connected);
        setIsWalletAllowed(allowed);
        
        if (connected && allowed) {
          const key = await getPublicKey();
          setPublicKey(key);
        }
      } catch (err) {
        console.error('Error checking wallet status:', err);
      }
    };

    // Check status on mount
    checkWalletStatus();

    // Add event listener to check status when window gains focus
    window.addEventListener('focus', checkWalletStatus);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('focus', checkWalletStatus);
    };
  }, []);

  // Context value with all wallet state and functions
  const contextValue: WalletContextState = {
    isConnected: isWalletConnected,
    isConnecting,
    isAllowed: isWalletAllowed,
    publicKey,
    error,
    connect,
    requestPermission,
    checkFreighterInstallation,
    getPublicKey: fetchPublicKey,
    signTransaction: handleSignTransaction
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;

