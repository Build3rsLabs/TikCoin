import { createContext } from 'react';
import { WalletData } from '../../utils/stellar/types';
import { 
  connectWallet, 
  isFreighterInstalled,
  requestWalletPermission,
  getPublicKey, 
  isConnected, 
  signTransaction
} from '../../utils/stellar/wallet';

// Type definitions for the wallet context
export interface WalletContextState {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;
  isAllowed: boolean;
  
  // Wallet details
  publicKey: string | null;
  
  // Error state
  error: Error | null;
  
  // Functions
  connect: () => Promise<WalletData>;
  requestPermission: () => Promise<boolean>;
  checkFreighterInstallation: () => boolean;
  getPublicKey: () => Promise<string>;
  signTransaction: (tx: string) => Promise<string>;
}

// Initial state for the context
export const initialWalletState: WalletContextState = {
  isConnected: false,
  isConnecting: false,
  isAllowed: false,
  publicKey: null,
  error: null,
  connect: async () => { throw new Error('WalletContext not initialized'); },
  requestPermission: async () => { throw new Error('WalletContext not initialized'); },
  checkFreighterInstallation: () => { throw new Error('WalletContext not initialized'); },
  getPublicKey: async () => { throw new Error('WalletContext not initialized'); },
  signTransaction: async () => { throw new Error('WalletContext not initialized'); },
};

// Create the context with the initial state
export const WalletContext = createContext<WalletContextState>(initialWalletState);

