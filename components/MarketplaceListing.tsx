import React from 'react';
import { formatAmount } from '../utils/format';

interface MarketplaceListingProps {
  id: string;
  tokenName: string;
  creatorName: string;
  creatorAddress: string;
  creatorAvatar?: string;
  price: number;
  quantity: number;
  tokenSymbol: string;
  onPurchase: (id: string, quantity: number) => Promise<void>;
}

const MarketplaceListing: React.FC<MarketplaceListingProps> = ({
  id,
  tokenName,
  creatorName,
  creatorAddress,
  creatorAvatar,
  price,
  quantity,
  tokenSymbol,
  onPurchase,
}) => {
  const [isPurchasing, setIsPurchasing] = React.useState(false);
  const [purchaseQuantity, setPurchaseQuantity] = React.useState(1);

  const handlePurchase = async () => {
    try {
      setIsPurchasing(true);
      await onPurchase(id, purchaseQuantity);
    } catch (error) {
      console.error('Failed to purchase tokens:', error);
    } finally {
      setIsPurchasing(false);
    }
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            {creatorAvatar ? (
              <img
                src={creatorAvatar}
                alt={creatorName}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-blue-500 font-bold text-lg">
                {creatorName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{tokenName}</h3>
            <p className="text-gray-600 text-sm flex items-center">
              by {creatorName}{' '}
              <span className="ml-1 text-gray-400">
                ({truncateAddress(creatorAddress)})
              </span>
            </p>
          </div>
        </div>

        <div className="mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-gray-500 text-xs mb-1">Price</p>
              <p className="font-medium">
                {formatAmount(price)} XLM per {tokenSymbol}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-gray-500 text-xs mb-1">Available</p>
              <p className="font-medium">
                {quantity} {tokenSymbol}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Purchase Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            max={quantity}
            value={purchaseQuantity}
            onChange={(e) => setPurchaseQuantity(Math.min(Number(e.target.value), quantity))}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          />
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={handlePurchase}
            disabled={isPurchasing || purchaseQuantity <= 0 || purchaseQuantity > quantity}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isPurchasing ? 'Processing...' : `Purchase ${purchaseQuantity} ${tokenSymbol}`}
          </button>
        </div>

        <div className="mt-3 text-xs text-gray-500 text-center">
          Total Cost: {formatAmount(price * purchaseQuantity)} XLM
        </div>
      </div>
    </div>
  );
};

export default MarketplaceListing;

