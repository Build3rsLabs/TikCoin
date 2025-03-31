import { SorobanRpc } from '@stellar/stellar-sdk';

/**
 * Network configuration for Soroban contract interaction
 */
export interface NetworkConfig {
  networkPassphrase: string;
  sorobanRpcUrl: string;
  networkUrl: string;
  networkPrefix?: string;
}

/**
 * Configuration for contract IDs and network
 */
export interface ContractConfig {
  network: NetworkConfig;
  tokenContractId: string;
  marketplaceContractId: string;
}

/**
 * Base contract error class
 */
export class ContractError extends Error {
  public readonly code?: string;
  public readonly data?: any;

  constructor(message: string, code?: string, data?: any) {
    super(message);
    this.name = 'ContractError';
    this.code = code;
    this.data = data;
  }
}

/**
 * Represents a creator token
 */
export interface CreatorToken {
  id: string;
  name: string;
  symbol: string;
  creator: string;
  totalSupply: string;
  decimals: number;
}

/**
 * Token balance with associated metadata
 */
export interface TokenBalance {
  token: CreatorToken;
  balance: string;
  formattedBalance: string;
}

/**
 * Marketplace listing information
 */
export interface Listing {
  id: string;
  seller: string;
  tokenId: string;
  amount: string;
  price: string;
  isActive: boolean;
  createdAt: number;
}

/**
 * Transaction options for contract interactions
 */
export interface TxOptions {
  fee?: string;
  timeout?: number;
  preflight?: boolean;
}

/**
 * Result of a contract transaction
 */
export interface ContractTransactionResult {
  successful: boolean;
  error?: ContractError;
  transactionId?: string;
  result?: any;
}

/**
 * Status of a transaction
 */
export type TransactionStatus = 
  | 'pending'
  | 'success'
  | 'error'
  | 'not_started';

/**
 * Transaction notification details
 */
export interface TransactionNotification {
  id: string;
  title: string;
  message: string;
  status: TransactionStatus;
  hash?: string;
  error?: string;
}

/**
 * Response from getting simulation diagnostics
 */
export interface SimulationResponse {
  transactionData: SorobanRpc.Api.SimulateTransactionResponse;
  error?: ContractError;
}

import { SorobanRpc } from 'stellar-sdk';

// Wallet data interface
export interface WalletData {
  publicKey: string;
  isConnected: boolean;
  isAllowed: boolean;
}

// Token information interface
export interface TokenInfo {
  id: string;
  name: string;
  creator: string;
  supply: number;
  price: number;
  description: string;
  createdAt: number;
}

// Marketplace listing interface
export interface MarketplaceListing {
  id: string;
  tokenId: string;
  seller: string;
  amount: number;
  price: number;
  listedAt: number;
}

