import React, { useState } from 'react';
import { useNavigation } from 'react-router-dom';

interface CreatorTokenProps {
  id: string;
  creatorName: string;
  creatorUsername: string;
  creatorAvatar: string;
  tokenSymbol: string;
  tokenPrice: number;
  tokenSupply: number;
  tokenHolders: number;
  owned?: number;
  onBuy?: (amount: number) => Promise<void>;
  onSell?: (amount: number) => Promise<void>;
}

const CreatorToken: React.FC<CreatorTokenProps> = ({
  id,
  creatorName,
  creatorUsername,
  creatorAvatar,
  tokenSymbol,
  tokenPrice,
  tokenSupply,
  tokenHolders,
  owned = 0,
  onBuy,
  onSell,
}) => {
  const [amount, setAmount] = useState<string>('1');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const estimatedCost = parseFloat(amount) * tokenPrice;
  
  const handleAction = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    try {
      setIsLoading(true);
      const parsedAmount = parseFloat(amount);
      
      if (activeTab === 'buy' && onBuy) {
        await onBuy(parsedAmount);
      } else if (activeTab === 'sell' && onSell) {
        if (parsedAmount > owned) {
          alert(`You only own ${owned} tokens`);
          return;
        }
        await onSell(parsedAmount);
      }
    } catch (error) {
      console.error('Transaction failed:', error);
      alert(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <img 
            src={creatorAvatar || 'https://via.placeholder.com/50'} 
            alt={creatorName}
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h3 className="text-lg font-bold">{creatorName}</h3>
            <p className="text-gray-600">@{creatorUsername}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-500">Price</p>
            <p className="font-bold text-lg">{tokenPrice.toFixed(4)} XLM</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Supply</p>
            <p className="font-bold text-lg">{tokenSupply.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Holders</p>
            <p className="font-bold text-lg">{tokenHolders}</p>
          </div>
        </div>

        {owned > 0 && (
          <div className="mb-4 bg-gray-100 p-3 rounded-md">
            <p className="text-center text-sm">
              You own <span className="font-bold">{owned}</span> {tokenSymbol} tokens
            </p>
          </div>
        )}
        
        <div className="mb-4">
          <div className="flex border-b">
            <button
              className={`flex-1 py-2 font-medium ${activeTab === 'buy' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('buy')}
            >
              Buy
            </button>
            <button
              className={`flex-1 py-2 font-medium ${activeTab === 'sell' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('sell')}
              disabled={owned <= 0}
            >
              Sell
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter amount"
          />
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Estimated {activeTab === 'buy' ? 'cost' : 'return'}: 
            <span className="font-bold ml-1">
              {estimatedCost.toFixed(4)} XLM
            </span>
          </p>
        </div>
        
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleAction}
          disabled={isLoading || !amount || parseFloat(amount) <= 0 || (activeTab === 'sell' && parseFloat(amount) > owned)}
        >
          {isLoading ? 'Processing...' : activeTab === 'buy' ? 'Buy Tokens' : 'Sell Tokens'}
        </button>
      </div>
    </div>
  );
};

export default CreatorToken;

