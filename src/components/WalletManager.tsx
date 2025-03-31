import React, { useState } from 'react';
import { useWallet } from '../contexts/wallet';

const WalletManager: React.FC = () => {
  const {
    isConnected,
    isConnecting,
    isAllowed,
    publicKey,
    error,
    connect,
    requestPermission,
    checkFreighterInstallation
  } = useWallet();

  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [isFreighterAvailable, setIsFreighterAvailable] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if Freighter is installed when component mounts
  React.useEffect(() => {
    const checkAvailability = () => {
      const available = checkFreighterInstallation();
      setIsFreighterAvailable(available);
      setIsLoading(false);
    };
    
    checkAvailability();
  }, [checkFreighterInstallation]);

  const handleConnectWallet = async () => {
    try {
      await connect();
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    }
  };

  const handleRequestPermission = async () => {
    try {
      await requestPermission();
    } catch (err) {
      console.error('Failed to request permission:', err);
    }
  };

  const handleCheckAvailability = async () => {
    setCheckingAvailability(true);
    // Perform the actual check
    const available = checkFreighterInstallation();
    setIsFreighterAvailable(available);
    
    // Give visual feedback
    setTimeout(() => {
      setCheckingAvailability(false);
    }, 1000);
  };
  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Wallet Manager</h2>
      
      {/* Wallet Status Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Wallet Status</h3>
        
        {isLoading ? (
          <p className="text-gray-600">Checking wallet availability...</p>
        ) : !isFreighterAvailable ? (
          <div className="p-3 bg-yellow-100 text-yellow-800 rounded-md mb-4">
            <p className="font-medium">Freighter wallet is not installed</p>
            <p className="text-sm mt-1">
              Please install the Freighter wallet extension to continue.
            </p>
            <a 
              href="https://www.freighter.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              Get Freighter
            </a>
          </div>
        ) : isConnected ? (
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <p className="font-medium text-green-700">Connected</p>
            </div>
            <div className="break-all">
              <p className="text-sm text-gray-600">Wallet Address:</p>
              <p className="font-mono text-sm">{publicKey || 'No public key found'}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <p className="font-medium text-red-700">Disconnected</p>
          </div>
        )}
        
        {error && (
          <div className="mt-3 p-3 bg-red-100 text-red-800 rounded-md">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error.message || 'Unknown error'}</p>
          </div>
        )}
      </div>
      
      {/* Actions Section */}
      <div className="space-y-3">
        <button
          onClick={handleCheckAvailability}
          disabled={checkingAvailability || isLoading}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {checkingAvailability || isLoading ? 'Checking...' : 'Check Wallet Installation'}
        </button>
        
        {isFreighterAvailable && (
          <>
            {!isAllowed && (
              <button
                onClick={handleRequestPermission}
                disabled={isConnecting || !isFreighterAvailable}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? 'Processing...' : 'Request Wallet Permission'}
              </button>
            )}
            
            <button
              onClick={handleConnectWallet}
              disabled={isConnecting || !isFreighterAvailable || (!isAllowed && !isConnected)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? 'Connecting...' : isConnected ? 'Reconnect Wallet' : 'Connect Wallet'}
            </button>
          </>
        )}
      </div>
      
      {/* Additional Info */}
      {isFreighterAvailable && !isConnected && !error && (
        <div className="mt-4 text-sm text-gray-600">
          <p>
            Connect your Freighter wallet to interact with the Stellar network.
            {!isAllowed && ' You need to grant permission before connecting.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default WalletManager;
