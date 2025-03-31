import { ContractConfig, NetworkConfig } from './types';

/**
 * Testnet network configuration
 */
export const TESTNET_CONFIG: NetworkConfig = {
  networkPassphrase: 'Test SDF Network ; September 2015',
  sorobanRpcUrl: 'https://soroban-testnet.stellar.org',
  networkUrl: 'https://horizon-testnet.stellar.org',
  networkPrefix: 'testnet',
};

/**
 * Public network configuration
 */
export const PUBLIC_CONFIG: NetworkConfig = {
  networkPassphrase: 'Public Global Stellar Network ; September 2015',
  sorobanRpcUrl: 'https://soroban.stellar.org',
  networkUrl: 'https://horizon.stellar.org',
};

/**
 * Default network to use (testnet for development)
 */
export const DEFAULT_NETWORK = TESTNET_CONFIG;

/**
 * Contract configuration - these values will be populated by the deployment script
 * 
 * Note: The placeholder values should be replaced with actual contract IDs after deployment
 */
export const CONTRACTS: ContractConfig = {
  network: DEFAULT_NETWORK,
  // These will be populated by the deployment script
  tokenContractId: 'PLACEHOLDER_TOKEN_CONTRACT_ID',
  marketplaceContractId: 'PLACEHOLDER_MARKETPLACE_CONTRACT_ID',
};

/**
 * Default fee for transactions (in stroops)
 */
export const DEFAULT_FEE = '100';

/**
 * Default transaction timeout (in seconds)
 */
export const TX_TIMEOUT = 30;

/**
 * Default number of confirmations to wait for
 */
export const DEFAULT_CONFIRMATIONS = 1;

// Configuration parameters

// RPC URLs
export const TESTNET_RPC_URL = 'https://soroban-testnet.stellar.org';
export const MAINNET_RPC_URL = 'https://soroban.stellar.org';

// Contract IDs - replace these with actual deployed contract IDs
export const CREATOR_TOKEN_CONTRACT_ID = 'PLACEHOLDER_CREATOR_TOKEN_CONTRACT_ID';
export const MARKETPLACE_CONTRACT_ID = 'PLACEHOLDER_MARKETPLACE_CONTRACT_ID';

