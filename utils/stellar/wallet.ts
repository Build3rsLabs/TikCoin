import { getPublicKey, isConnected, isAllowed, signTransaction } from '@stellar/freighter-api';
import { WalletData } from './types';

/**
 * Checks if Freighter wallet is installed
 */
export const isFreighterInstalled = (): boolean => {
  return typeof window !== 'undefined' && !!window.freighter;
};

/**
 * Connects to the Freighter wallet
 * @returns Wallet data containing publicKey, connection status, and permission status
 */
export const connectWallet = async (): Promise<WalletData> => {
  try {
    if (!isFreighterInstalled()) {
      throw new Error('Freighter wallet is not installed');
    }

    const connected = await isConnected();
    const allowed = await isAllowed();
    let publicKey = '';

    if (connected && allowed) {
      publicKey = await getPublicKey();
    }

    return {
      publicKey,
      isConnected: connected,
      isAllowed: allowed
    };
  } catch (error) {
    console.error('Error connecting to wallet:', error);
    throw error;
  }
};

/**
 * Requests permission to connect to the user's Freighter wallet
 */
export const requestWalletPermission = async (): Promise<boolean> => {
  try {
    const allowed = await isAllowed();
    if (allowed) return true;
    
    // The Freighter API will show a popup for the user to authorize the connection
    // The actual API call may differ based on current Freighter documentation
    // This is a placeholder based on current knowledge
    const result = await window.freighter?.authorize();
    return !!result;
  } catch (error) {
    console.error('Error requesting wallet permission:', error);
    throw error;
  }
};

// Export signTransaction for use in other modules
export { signTransaction };

