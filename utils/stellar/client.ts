import { SorobanRpc } from 'stellar-sdk';
import { TESTNET_RPC_URL, MAINNET_RPC_URL } from './config';

// Initialize Soroban client
let sorobanClient: SorobanRpc.Server;

/**
 * Initializes the Soroban RPC client
 * @param useTestnet Whether to use testnet or mainnet
 * @returns The initialized Soroban RPC client
 */
export const initSorobanClient = (useTestnet = true): SorobanRpc.Server => {
  const rpcUrl = useTestnet ? TESTNET_RPC_URL : MAINNET_RPC_URL;
  sorobanClient = new SorobanRpc.Server(rpcUrl, { allowHttp: useTestnet });
  return sorobanClient;
};

/**
 * Gets the current Soroban RPC client, initializing it if necessary
 */
export const getSorobanClient = (): SorobanRpc.Server => {
  if (!sorobanClient) {
    return initSorobanClient();
  }
  return sorobanClient;
};

