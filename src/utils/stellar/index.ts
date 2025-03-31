import { getSorobanClient } from './clientSetup';
import {
  connectWallet,
  disconnectWallet,
  isWalletConnected,
  getPublicKey,
  signTransaction
} from './walletConnection';
import {
  createCreatorToken,
  buyCreatorTokens,
  sellCreatorTokens,
  getAllCreatorTokens,
  getTokenDetails
} from './tokenOperations';
import {
  listTokensOnMarketplace,
  buyTokensFromMarketplace,
  cancelMarketplaceListing,
  getMarketplaceListings,
  getUserListings,
  getListingDetails,
  getListingPrice
} from './marketplaceOperations';
import type {
  WalletData,
  TokenInfo,
  MarketplaceListing
} from './types';

// Export client setup
export { getSorobanClient };

// Export wallet functions
export {
  connectWallet,
  disconnectWallet,
  isWalletConnected,
  getPublicKey,
  signTransaction
};

// Export token operations
export {
  createCreatorToken,
  buyCreatorTokens,
  sellCreatorTokens,
  getAllCreatorTokens,
  getTokenDetails
};

// Export marketplace operations
export {
  listTokensOnMarketplace,
  buyTokensFromMarketplace,
  cancelMarketplaceListing,
  getMarketplaceListings,
  getUserListings,
  getListingDetails,
  getListingPrice
};

// Export types
export type {
  WalletData,
  TokenInfo,
  MarketplaceListing
};

// Export all functions from the modules

// Client exports
export { initSorobanClient, getSorobanClient } from './client';

// Contract exports
export { initContract, getCreatorTokenContract, getMarketplaceContract } from './contracts';

// Wallet exports
export { 
  isFreighterInstalled, 
  connectWallet, 
  requestWalletPermission, 
  signTransaction 
} from './wallet';

// Token operations exports
export {
  createCreatorToken,
  buyCreatorTokens,
  sellCreatorTokens,
  getAllCreatorTokens,
  getTokenDetails
} from './tokenOperations';

// Marketplace operations exports
export {
  listTokensOnMarketplace,
  buyTokensFromMarketplace,
  cancelMarketplaceListing,
  getMarketplaceListings,
  getUserListings,
  getListingDetails
} from './marketplaceOperations';

// Type exports
export type { WalletData, TokenInfo, MarketplaceListing } from './types';

// Configuration exports
export {
  TESTNET_RPC_URL,
  MAINNET_RPC_URL,
  CREATOR_TOKEN_CONTRACT_ID,
  MARKETPLACE_CONTRACT_ID
} from './config';

