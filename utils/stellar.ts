import { SorobanRpc, Networks, Contract, Address, xdr, TransactionBuilder, BASE_FEE, TimeoutInfinite } from 'stellar-sdk';
import { getPublicKey, isConnected, isAllowed, signTransaction } from '@stellar/freighter-api';

// Types
export interface WalletData {
  publicKey: string;
  isConnected: boolean;
  isAllowed: boolean;
}

export interface TokenInfo {
  id: string;
  name: string;
  creator: string;
  supply: number;
  price: number;
  description: string;
  createdAt: number;
}

export interface MarketplaceListing {
  id: string;
  tokenId: string;
  seller: string;
  amount: number;
  price: number;
  listedAt: number;
}

// Configuration
const TESTNET_RPC_URL = 'https://soroban-testnet.stellar.org';
const MAINNET_RPC_URL = 'https://soroban.stellar.org';

// Contract IDs - replace these with actual deployed contract IDs
const CREATOR_TOKEN_CONTRACT_ID = 'PLACEHOLDER_CREATOR_TOKEN_CONTRACT_ID';
const MARKETPLACE_CONTRACT_ID = 'PLACEHOLDER_MARKETPLACE_CONTRACT_ID';

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

// Wallet Connection Functions

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

// Contract Interaction Functions

/**
 * Initializes a contract instance
 * @param contractId The ID of the contract to initialize
 * @returns The initialized Contract instance
 */
export const initContract = (contractId: string): Contract => {
  const contractAddress = new Address(contractId);
  return new Contract(contractAddress);
};

/**
 * Gets the creator token contract
 * @returns The creator token contract instance
 */
export const getCreatorTokenContract = (): Contract => {
  return initContract(CREATOR_TOKEN_CONTRACT_ID);
};

/**
 * Gets the marketplace contract
 * @returns The marketplace contract instance
 */
export const getMarketplaceContract = (): Contract => {
  return initContract(MARKETPLACE_CONTRACT_ID);
};

// Creator Token Contract Functions

/**
 * Creates a new creator token
 * @param walletPublicKey The public key of the creator's wallet
 * @param name The name of the token
 * @param description A description of the token and what it represents
 * @param initialPrice The initial price of the token
 * @param slope The slope parameter for the bonding curve
 * @param creatorFee The percentage fee the creator receives on each transaction
 * @returns Transaction result
 */
export const createCreatorToken = async (
  walletPublicKey: string,
  name: string,
  description: string,
  initialPrice: number,
  slope: number,
  creatorFee: number
): Promise<SorobanRpc.Api.SendTransactionResponse> => {
  try {
    const contract = getCreatorTokenContract();
    const client = getSorobanClient();
    
    // Build the transaction to call the create_token function on the smart contract
    const sourceAddress = walletPublicKey;
    const operation = contract.call(
      "create_token", // function name from the contract
      ...[
        // parameters needed for create_token, formatted according to contract
        new Address(sourceAddress).toScVal(),
        xdr.ScVal.scvString(name),
        xdr.ScVal.scvString(description),
        xdr.ScVal.scvI128(new xdr.Int128Parts({ hi: 0, lo: Math.floor(initialPrice * 10000000) })),
        xdr.ScVal.scvI128(new xdr.Int128Parts({ hi: 0, lo: Math.floor(slope * 10000000) })),
        xdr.ScVal.scvI128(new xdr.Int128Parts({ hi: 0, lo: Math.floor(creatorFee * 10000000) })),
      ]
    );

    const tx = new TransactionBuilder(await client.getAccount(sourceAddress), {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(operation)
      .setTimeout(TimeoutInfinite)
      .build();

    // Sign the transaction using Freighter
    const signedXDR = await signTransaction(tx.toXDR(), {
      networkPassphrase: Networks.TESTNET,
    });

    // Submit the signed transaction
    const txResult = await client.sendTransaction(signedXDR);
    return txResult;
  } catch (error) {
    console.error('Error creating creator token:', error);
    throw error;
  }
};

/**
 * Buys tokens from a creator
 * @param walletPublicKey The public key of the buyer's wallet
 * @param tokenId The ID of the token to buy
 * @param amount The amount of tokens to buy
 * @param maxPrice The maximum price willing to pay per token
 * @returns Transaction result
 */
export const buyCreatorTokens = async (
  walletPublicKey: string,
  tokenId: string,
  amount: number,
  maxPrice: number
): Promise<SorobanRpc.Api.SendTransactionResponse> => {
  try {
    const contract = getCreatorTokenContract();
    const client = getSorobanClient();
    
    const sourceAddress = walletPublicKey;
    const operation = contract.call(
      "buy_tokens",
      ...[
        new Address(sourceAddress).toScVal(),
        xdr.ScVal.scvString(tokenId),
        xdr.ScVal.scvI128(new xdr.Int128Parts({ hi: 0, lo: amount })),
        xdr.ScVal.scvI128(new xdr.Int128Parts({ hi: 0, lo: Math.floor(maxPrice * 10000000) })),
      ]
    );

    const tx = new TransactionBuilder(await client.getAccount(sourceAddress), {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(operation)
      .setTimeout(TimeoutInfinite)
      .build();

    const signedXDR = await signTransaction(tx.toXDR(), {
      networkPassphrase: Networks.TESTNET,
    });

    return await client.sendTransaction(signedXDR);
  } catch (error) {
    console.error('Error buying creator tokens:', error);
    throw error;
  }
};

/**
 * Sells creator tokens
 * @param walletPublicKey The public key of the seller's wallet
 * @param tokenId The ID of the token to sell
 * @param amount The amount of tokens to sell
 * @param minPrice The minimum price acceptable per token
 * @returns Transaction result
 */
export const sellCreatorTokens = async (
  walletPublicKey: string,
  tokenId: string,
  amount: number,
  minPrice: number
): Promise<SorobanRpc.Api.SendTransactionResponse> => {
  try {
    const contract = getCreatorTokenContract();
    const client = getSorobanClient();
    
    const sourceAddress = walletPublicKey;
    const operation = contract.call(
      "sell_tokens",
      ...[
        new Address(sourceAddress).toScVal(),
        xdr.ScVal.scvString(tokenId),
        xdr.ScVal.scvI128(new xdr.Int128Parts({ hi: 0, lo: amount })),
        xdr.ScVal.scvI128(new xdr.Int128Parts({ hi: 0, lo: Math.floor(minPrice * 10000000) })),
      ]
    );

    const tx = new TransactionBuilder(await client.getAccount(sourceAddress), {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(operation)
      .setTimeout(TimeoutInfinite)
      .build();

    const signedXDR = await signTransaction(tx.toXDR(), {
      networkPassphrase: Networks.TESTNET,
    });

    return await client.sendTransaction(signedXDR);
  } catch (error) {
    console.error('Error selling creator tokens:', error);
    throw error;
  }
};

// Marketplace Contract Functions

/**
 * Lists creator tokens on the marketplace
 * @param walletPublicKey The public key of the seller's wallet
 * @param tokenId The ID of the token to list
 * @param amount The amount of tokens to list
 * @param price The listing price per token
 * @returns Transaction result
 */
export const listTokensOnMarketplace = async (
  walletPublicKey: string,
  tokenId: string,
  amount: number,
  price: number
): Promise<SorobanRpc.Api.SendTransactionResponse> => {
  try {
    const contract = getMarketplaceContract();
    const client = getSorobanClient();
    
    const sourceAddress = walletPublicKey;
    const operation = contract.call(
      "list_tokens",
      ...[
        new Address(sourceAddress).toScVal(),
        xdr.ScVal.scvString(tokenId),
        xdr.ScVal.scvI128(new xdr.Int128Parts({ hi: 0, lo: amount })),
        xdr.ScVal.scvI128(new xdr.Int128Parts({ hi: 0, lo: Math.floor(price * 10000000) })),
      ]
    );

    const tx = new TransactionBuilder(await client.getAccount(sourceAddress), {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(operation)
      .setTimeout(TimeoutInfinite)
      .build();

    const signedXDR = await signTransaction(tx.toXDR(), {
      networkPassphrase: Networks.TESTNET,
    });

    return await client.sendTransaction(signedXDR);
  } catch (error) {
    console.error('Error listing tokens on marketplace:', error);
    throw error;
  }
};

/**
 * Buys tokens from the marketplace
 * @param walletPublicKey The public key of the buyer's wallet
 * @param listingId The ID of the marketplace listing
 * @returns Transaction result
 */
export const buyTokensFromMarketplace = async (
  walletPublicKey: string,
  listingId: string
): Promise<SorobanRpc.Api.SendTransactionResponse> => {
  try {
    const contract = getMarketplaceContract();
    const client = getSorobanClient();
    
    const sourceAddress = walletPublicKey;
    const operation = contract.call(
      "buy_listing",
      ...[
        new Address(sourceAddress).toScVal(),
        xdr.ScVal.scvString(listingId),
      ]
    );

    const tx = new TransactionBuilder(await client.getAccount(sourceAddress), {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(operation)
      .setTimeout(TimeoutInfinite)
      .build();

    const signedXDR = await signTransaction(tx.toXDR(), {
      networkPassphrase: Networks.TESTNET,
    });

    return await client.sendTransaction(signedXDR);
  } catch (error) {
    console.error('Error buying tokens from marketplace:', error);
    throw error;
  }
};

/**
 * Cancels a marketplace listing
 * @param walletPublicKey The public key of the seller's wallet
 * @param listingId The ID of the listing to cancel
 * @returns Transaction result
 */
export const cancelMarketplaceListing = async (
  walletPublicKey: string,
  listingId: string
): Promise<SorobanRpc.Api.SendTransactionResponse> => {
  try {
    const contract = getMarketplaceContract();
    const client = getSorobanClient();
    
    const sourceAddress = walletPublicKey;
    const operation = contract.call(
      "cancel_listing",
      ...[
        new Address(sourceAddress).toScVal(),
        xdr.ScVal.scvString(listingId),
      ]
    );

    const tx = new TransactionBuilder(await client.getAccount(sourceAddress), {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET,
    })
      .addOperation(operation)
      .setTimeout(TimeoutInfinite)
      .build();

    const signedXDR = await signTransaction(tx.toXDR(), {
      networkPassphrase: Networks.TESTNET,
    });

    return await client.sendTransaction(signedXDR);
  } catch (error) {
    console.error('Error canceling marketplace listing:', error);
    throw error;
  }
};

// Query Functions

/**
 * Gets all creator tokens
 * @returns Array of token information
 */
export const getAllCreatorTokens = async (): Promise<TokenInfo[]> => {
  try {
    const contract

