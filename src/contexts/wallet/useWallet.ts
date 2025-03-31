import { useContext } from 'react';
import { WalletContext, WalletContextState } from './WalletContext';

/**
 * Hook for accessing the wallet context
 * @throws Error if used outside of WalletProvider
 * @returns WalletContextState The complete wallet context state and methods
 */
export const useWallet = (): WalletContextState => {
  const context = useContext(WalletContext);
  
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  
  return context;
};

export default useWallet;

