import {
  Account,
  Contract,
  Keypair,
  Networks,
  Operation,
  SorobanRpc,
  TransactionBuilder,
  scValToNative,
  nativeToScVal,
  xdr,
  BASE_FEE,
  TimeoutInfinite,
  SorobanDataBuilder,
} from 'stellar-sdk';
import { 
  isConnected as freighterIsConnected,
  isAllowed,
  getPublicKey,
  signTransaction,
} from '@stellar/freighter-api';

export type Network = 'TESTNET' | 'PUBLIC';

export interface WalletData {
  publicKey: string;
  isConnected: boolean;
}

export interface TokenDetails {
  tokenId: string;
  creatorAddress: string;
  name: string;
  symbol: string;
  supply: string;
  initialPrice: string;
  slope: string;
  fee: string;
}

export interface TokenListing {
  id: string;
  tokenId: string;
  seller: string;
  amount: string;
  price: string;
}

// Network configuration
const NETWORKS = {
  TESTNET: {
    network: Networks.TESTNET,
    sorobanRpcUrl: 'https://soroban-testnet.stellar.org',
  },
  PUBLIC: {
    network: Networks.PUBLIC,
    sorobanRpcUrl: 'https://soroban.stellar.org',
  },
};

// Contract IDs - these would be the deployed contract IDs for your application
const CONTRACT_IDS = {
  TESTNET: {
    creatorToken: 'CCZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ',
    marketplace: 'CDZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ',
  },
  PUBLIC: {
    creatorToken: '',  // To be filled when deployed to mainnet
    marketplace: '',   // To be filled when deployed to mainnet
  },
};

// Initialize Soroban RPC client
export const getSorobanRpc = (network: Network = 'TESTNET'): SorobanRpc.Server => {
  return new SorobanRpc.Server(NETWORKS[network].sorobanRpcUrl, { allowHttp: true });
};

// Initialize contracts
export const getCreatorTokenContract = (network: Network = 'TESTNET'): Contract => {
  const contractId = CONTRACT_IDS[network].creatorToken;
  return new Contract(contractId);
};

export const getMarketplaceContract = (network: Network = 'TESTNET'): Contract => {
  const contractId = CONTRACT_IDS[network].marketplace;
  return new Contract(contractId);
};

// Check wallet connection status
export const checkWalletConnection = async (): Promise<WalletData> => {
  try {
    const connected = await freighterIsConnected();
    if (!connected) {
      return { publicKey: '', isConnected: false };
    }

    const allowed = await isAllowed();
    if (!allowed) {
      return { publicKey: '', isConnected: false };
    }

    const publicKey = await getPublicKey();
    return { publicKey, isConnected: true };
  } catch (error) {
    console.error('Failed to check wallet connection:', error);
    return { publicKey: '', isConnected: false };
  }
};

// Get account details from the network
export const getAccountDetails = async (
  publicKey: string,
  network: Network = 'TESTNET'
): Promise<Account> => {
  const server = getSorobanRpc(network);
  const account = await server.getAccount(publicKey);
  return new Account(publicKey, account.sequence);
};

// Submit a transaction to the network
export const submitTransaction = async (
  signedXDR: string,
  network: Network = 'TESTNET'
): Promise<SorobanRpc.GetTransactionResponse> => {
  const server = getSorobanRpc(network);
  const tx = TransactionBuilder.fromXDR(signedXDR, NETWORKS[network].network);
  const sendResponse = await server.sendTransaction(tx);
  
  if (sendResponse.status !== 'PENDING') {
    throw new Error(`Transaction failed: ${sendResponse.status}`);
  }
  
  // Poll for transaction status
  let getResponse = await server.getTransaction(sendResponse.hash);
  let status = getResponse.status;
  
  while (status === 'NOT_FOUND') {
    // Wait a bit before checking again
    await new Promise(resolve => setTimeout(resolve, 1000));
    getResponse = await server.getTransaction(sendResponse.hash);
    status = getResponse.status;
  }
  
  return getResponse;
};

// Prepare a transaction for signing
export const prepareTransaction = async (
  sourceAccount: Account,
  operations: Operation[],
  network: Network = 'TESTNET'
): Promise<string> => {
  const server = getSorobanRpc(network);
  
  // Create transaction
  let transaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: NETWORKS[network].network,
  })
    .setTimeout(TimeoutInfinite)
    .addOperations(operations);
  
  // Build transaction
  transaction = transaction.build();
  
  // Prepare transaction for the network
  const preparedTransaction = await server.prepareTransaction(transaction);
  
  return preparedTransaction.toXDR();
};

// Sign a transaction with Freighter wallet
export const signWithFreighter = async (
  xdrTransaction: string,
  network: Network = 'TESTNET'
): Promise<string> => {
  try {
    const signedTransaction = await signTransaction(xdrTransaction, {
      networkPassphrase: NETWORKS[network].network,
    });
    return signedTransaction;
  } catch (error) {
    console.error('Failed to sign transaction:', error);
    throw error;
  }
};

// Create a new creator token
export const createCreatorToken = async (
  creatorAddress: string,
  name: string,
  symbol: string,
  initialPrice: string,
  slope: string,
  fee: string,
  network: Network = 'TESTNET'
): Promise<string> => {
  try {
    const contract = getCreatorTokenContract(network);
    const account = await getAccountDetails(creatorAddress, network);
    
    // Convert parameters to Soroban contract parameter format
    const params = [
      nativeToScVal(name, { type: 'string' }),
      nativeToScVal(symbol, { type: 'string' }),
      nativeToScVal(initialPrice, { type: 'i128' }),
      nativeToScVal(slope, { type: 'i128' }),
      nativeToScVal(fee, { type: 'u32' }),
    ];
    
    // Create the contract invocation operation
    const operation = contract.call(
      'create_token',
      ...params
    );
    
    // Prepare the transaction
    const xdr = await prepareTransaction(account, [operation], network);
    
    // Sign the transaction using Freighter
    const signedXDR = await signWithFreighter(xdr, network);
    
    // Submit the transaction
    const response = await submitTransaction(signedXDR, network);
    
    if (response.status === 'SUCCESS') {
      // Extract token ID from the result
      if (response.returnValue) {
        const tokenId = scValToNative(response.returnValue);
        return tokenId.toString();
      }
    }
    
    throw new Error(`Transaction failed: ${response.status}`);
  } catch (error) {
    console.error('Failed to create creator token:', error);
    throw error;
  }
};

// Buy creator tokens
export const buyCreatorTokens = async (
  buyerAddress: string,
  tokenId: string,
  amount: string,
  maxPrice: string,
  network: Network = 'TESTNET'
): Promise<boolean> => {
  try {
    const contract = getCreatorTokenContract(network);
    const account = await getAccountDetails(buyerAddress, network);
    
    // Convert parameters to Soroban contract parameter format
    const params = [
      nativeToScVal(tokenId, { type: 'string' }),
      nativeToScVal(amount, { type: 'i128' }),
      nativeToScVal(maxPrice, { type: 'i128' }),
    ];
    
    // Create the contract invocation operation
    const operation = contract.call(
      'buy_tokens',
      ...params
    );
    
    // Prepare the transaction
    const xdr = await prepareTransaction(account, [operation], network);
    
    // Sign the transaction using Freighter
    const signedXDR = await signWithFreighter(xdr, network);
    
    // Submit the transaction
    const response = await submitTransaction(signedXDR, network);
    
    return response.status === 'SUCCESS';
  } catch (error) {
    console.error('Failed to buy creator tokens:', error);
    throw error;
  }
};

// Sell creator tokens
export const sellCreatorTokens = async (
  sellerAddress: string,
  tokenId: string,
  amount: string,
  minPrice: string,
  network: Network = 'TESTNET'
): Promise<boolean> => {
  try {
    const contract = getCreatorTokenContract(network);
    const account = await getAccountDetails(sellerAddress, network);
    
    // Convert parameters to Soroban contract parameter format
    const params = [
      nativeToScVal(tokenId, { type: 'string' }),
      nativeToScVal(amount, { type: 'i128' }),
      nativeToScVal(minPrice, { type: 'i128' }),
    ];
    
    // Create the contract invocation operation
    const operation = contract.call(
      'sell_tokens',
      ...params
    );
    
    // Prepare the transaction
    const xdr = await prepareTransaction(account, [operation], network);
    
    // Sign the transaction using Freighter
    const signedXDR = await signWithFreighter(xdr, network);
    
    // Submit the transaction
    const response = await submitTransaction(signedXDR, network);
    
    return response.status === 'SUCCESS';
  } catch (error) {
    console.error('Failed to sell creator tokens:', error);
    throw error;
  }
};

// List tokens for sale on the marketplace
export const listTokenForSale = async (
  sellerAddress: string,
  tokenId: string,
  amount: string,
  price: string,
  network: Network = 'TESTNET'
): Promise<string> => {
  try {
    const contract = getMarketplaceContract(network);
    const account = await getAccountDetails(sellerAddress, network);
    
    // Convert parameters to Soroban contract parameter format
    const params = [
      nativeToScVal(tokenId, { type: 'string' }),
      nativeToScVal(amount, { type: 'i128' }),
      nativeToScVal(price, { type: 'i128' }),
    ];
    
    // Create the contract invocation operation
    const operation = contract.call(
      'list_token',
      ...params
    );
    
    // Prepare the transaction
    const xdr = await prepareTransaction(account, [operation], network);
    
    // Sign the transaction using Freighter
    const signedXDR = await signWithFreighter(xdr, network);
    
    // Submit the transaction
    const response = await submitTransaction(signedXDR, network);
    
    if (response.status === 'SUCCESS') {
      // Extract listing ID from the result
      if (response.returnValue) {
        const listingId = scValToNative(response.returnValue);
        return listingId.toString();
      }
    }
    
    throw new Error(`Transaction failed: ${response.status}`);
  } catch (error) {
    console.error('Failed to list token for sale:', error);
    throw error;
  }
};

// Buy tokens from the marketplace
export const buyTokenFromMarketplace = async (
  buyerAddress: string,
  listingId: string,
  network: Network = 'TESTNET'
): Promise<boolean> => {
  try {
    const contract = getMarketplaceContract(network);
    const account = await getAccountDetails(buyerAddress, network);
    
    // Convert parameters to Soroban contract parameter format
    const params = [
      nativeToScVal(listingId, { type: 'string' }),
    ];
    
    // Create the contract invocation operation
    const operation = contract.call(
      'buy_listing',
      ...params
    );
    
    // Prepare the transaction
    const xdr = await prepareTransaction(account, [operation], network);
    
    // Sign the transaction using Freighter
    const signedXDR = await signWithFreighter(xdr, network);
    
    // Submit the transaction
    const response = await submitTransaction(signedXDR, network);
    
    return response.status === 'SUCCESS';
  } catch (error) {
    console.error('Failed to buy token from marketplace:', error);
    throw error;
  }
};

// Cancel a marketplace listing
export const cancelListing = async (
  sellerAddress: string,
  listingId: string,
  network: Network = 'TESTNET'
): Promise<boolean> => {
  try {
    const contract = getMarketplaceContract(network);
    const account = await getAccountDetails(sellerAddress, network);
    
    // Convert parameters to Soroban contract parameter format
    const params = [
      nativeToScVal(listingId, { type: 'string' }),
    ];
    
    // Create the contract invocation operation
    const operation = contract.call(
      'cancel_listing',
      ...params
    );
    
    // Prepare the transaction
    const xdr = await prepareTransaction(account, [operation], network);
    
    // Sign the transaction using Freighter
    const signedXDR = await signWithFreighter(xdr, network);
    
    // Submit the transaction
    const response = await submitTransaction(signedXDR, network);
    
    return response.status === 'SUCCESS';
  } catch (error) {
    console.error('Failed to cancel listing:', error);
    throw error;
  }
};

// Get token details
export const getTokenDetails = async (
  tokenId: string,
  network: Network = 'TESTNET'
): Promise<TokenDetails> => {
  try {
    const contract = getCreatorTokenContract(network);
    const server = getSorobanRpc(network);
    
    // Create the contract invocation operation
    const operation = contract.call(
      'get_token_details',
      nativeToScVal(tokenId, { type: 'string' })
    );
    
    // Simulate the transaction to get the result
    const result = await server.simulateTransaction(operation);
    
    if (result.result) {
      const tokenDetails =

