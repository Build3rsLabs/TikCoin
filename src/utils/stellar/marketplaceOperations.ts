import { Server } from 'stellar-sdk';
import { Contract } from 'stellar-sdk/lib/contract';
import { NetworkConfig, ContractIds } from './config';
import { 
  Listing, 
  MarketplaceListingResult, 
  TokenId 
} from './types';

export class MarketplaceClient {
  private contract: Contract;
  private server: Server;

  constructor(networkConfig: NetworkConfig, contractIds: ContractIds) {
    this.server = new Server(networkConfig.rpcUrl);
    this.contract = new Contract(contractIds.marketplace);
  }

  /**
   * Creates a new token listing on the marketplace
   * @param tokenId The token ID to list
   * @param amount The amount of tokens to list
   * @param price The price per token in XLM
   * @param seller The wallet address of the seller
   * @returns The transaction response
   */
  async listToken(
    tokenId: TokenId,
    amount: string,
    price: string,
    seller: string
  ): Promise<any> {
    try {
      const tx = await this.contract.call(
        "list_token",
        tokenId,
        amount,
        price
      ).setSourceAccount(seller);
      
      return await tx.sign().submit();
    } catch (error) {
      console.error("Error listing token:", error);
      throw new Error(`Failed to list token: ${error.message}`);
    }
  }

  /**
   * Purchases a token from an existing listing
   * @param listingId The ID of the listing to purchase from
   * @param buyer The wallet address of the buyer
   * @returns The transaction response
   */
  async buyToken(listingId: string, buyer: string): Promise<any> {
    try {
      const tx = await this.contract.call(
        "buy_token",
        listingId
      ).setSourceAccount(buyer);
      
      return await tx.sign().submit();
    } catch (error) {
      console.error("Error buying token:", error);
      throw new Error(`Failed to buy token: ${error.message}`);
    }
  }

  /**
   * Cancels an existing token listing
   * @param listingId The ID of the listing to cancel
   * @param seller The wallet address of the seller
   * @returns The transaction response
   */
  async cancelListing(listingId: string, seller: string): Promise<any> {
    try {
      const tx = await this.contract.call(
        "cancel_listing",
        listingId
      ).setSourceAccount(seller);
      
      return await tx.sign().submit();
    } catch (error) {
      console.error("Error canceling listing:", error);
      throw new Error(`Failed to cancel listing: ${error.message}`);
    }
  }

  /**
   * Retrieves information about a specific marketplace listing
   * @param listingId The ID of the listing to retrieve
   * @returns The listing information
   */
  async getListing(listingId: string): Promise<Listing> {
    try {
      const result = await this.contract.call(
        "get_listing",
        listingId
      );
      
      return this.parseListingResult(result);
    } catch (error) {
      console.error("Error getting listing:", error);
      throw new Error(`Failed to get listing: ${error.message}`);
    }
  }

  /**
   * Retrieves all active listings on the marketplace
   * @returns An array of all active listings
   */
  async getAllListings(): Promise<Listing[]> {
    try {
      const result = await this.contract.call("get_all_listings");
      
      if (!Array.isArray(result)) {
        throw new Error("Invalid response from contract");
      }
      
      return result.map(listing => this.parseListingResult(listing));
    } catch (error) {
      console.error("Error getting all listings:", error);
      throw new Error(`Failed to get listings: ${error.message}`);
    }
  }

  /**
   * Helper function to parse listing results from contract calls
   * @param result The raw result from the contract
   * @returns A properly typed Listing object
   */
  private parseListingResult(result: MarketplaceListingResult): Listing {
    return {
      id: result.id,
      tokenId: result.token_id,
      seller: result.seller,
      amount: result.amount,
      price: result.price,
      createdAt: new Date(Number(result.created_at)),
      active: result.active
    };
  }
}

import {
  ContractConfig,
  ContractError,
  ContractTransactionResult,
  Listing,
  MarketplaceListing,
  TxOptions,
} from './types';
import { ContractClient } from './contractClient';
import { CONTRACTS } from './config';

/**
 * MarketplaceOperations class provides a comprehensive interface for
 * interacting with the Stellar marketplace contract.
 */
export class MarketplaceOperations {
  private client: ContractClient;
  private contractConfig: ContractConfig;

  /**
   * Creates a new instance of the MarketplaceOperations class
   * 
   * @param contractConfig - Configuration for contracts and network
   */
  constructor(contractConfig: ContractConfig = CONTRACTS) {
    this.contractConfig = contractConfig;
    this.client = new ContractClient(
      contractConfig.marketplaceContractId,
      contractConfig.network
    );
  }

  /**
   * Lists a token for sale on the marketplace
   * 
   * @param publicKey - Public key of the seller
   * @param tokenId - ID of the token to list
   * @param amount - Amount of tokens to list
   * @param price - Price per token in XLM (in stroops)
   * @param options - Transaction options
   * @returns Result of the listing operation
   * @throws ContractError if the operation fails
   */
  public async listToken(
    publicKey: string,
    tokenId: string,
    amount: string,
    price: string,
    options?: TxOptions
  ): Promise<ContractTransactionResult> {
    try {
      // Convert parameters to contract-friendly format
      const args = [
        ContractClient.toScVal(tokenId),
        ContractClient.toScVal(amount),
        ContractClient.toScVal(price)
      ];

      // Simulate the transaction first
      const simResult = await this.client.simulateTransaction(publicKey, 'list_token', args);
      
      if (simResult.error) {
        throw simResult.error;
      }

      // Prepare the transaction from simulation
      const source = new Account(publicKey, '0'); // Sequence will be filled by wallet
      const preparedTx = await this.prepareTransaction(source, simResult.transactionData, options);

      // The transaction needs to be signed by the wallet
      // This would typically be handled by the wallet provider
      return {
        successful: false,
        error: new ContractError(
          'Transaction requires signing by wallet',
          'REQUIRES_SIGNING',
          { xdr: preparedTx }
        ),
        transactionId: undefined,
        preparedXdr: preparedTx,
      };
    } catch (e: any) {
      if (e instanceof ContractError) {
        throw e;
      }
      throw new ContractError(
        `Failed to list token: ${e.message}`,
        'LIST_TOKEN_FAILED',
        e
      );
    }
  }

  /**
   * Buys a token from a listing on the marketplace
   * 
   * @param publicKey - Public key of the buyer
   * @param listingId - ID of the listing to buy from
   * @param amount - Amount of tokens to buy
   * @param options - Transaction options
   * @returns Result of the buy operation
   * @throws ContractError if the operation fails
   */
  public async buyToken(
    publicKey: string,
    listingId: string,
    amount: string,
    options?: TxOptions
  ): Promise<ContractTransactionResult> {
    try {
      // Convert parameters to contract-friendly format
      const args = [
        ContractClient.toScVal(listingId),
        ContractClient.toScVal(amount)
      ];

      // Simulate the transaction first
      const simResult = await this.client.simulateTransaction(publicKey, 'buy_token', args);
      
      if (simResult.error) {
        throw simResult.error;
      }

      // Prepare the transaction from simulation
      const source = new Account(publicKey, '0'); // Sequence will be filled by wallet
      const preparedTx = await this.prepareTransaction(source, simResult.transactionData, options);

      // The transaction needs to be signed by the wallet
      // This would typically be handled by the wallet provider
      return {
        successful: false,
        error: new ContractError(
          'Transaction requires signing by wallet',
          'REQUIRES_SIGNING',
          { xdr: preparedTx }
        ),
        transactionId: undefined,
        preparedXdr: preparedTx,
      };
    } catch (e: any) {
      if (e instanceof ContractError) {
        throw e;
      }
      throw new ContractError(
        `Failed to buy token: ${e.message}`,
        'BUY_TOKEN_FAILED',
        e
      );
    }
  }

  /**
   * Cancels a listing on the marketplace
   * 
   * @param publicKey - Public key of the seller
   * @param listingId - ID of the listing to cancel
   * @param options - Transaction options
   * @returns Result of the cancel operation
   * @throws ContractError if the operation fails
   */
  public async cancelListing(
    publicKey: string,
    listingId: string,
    options?: TxOptions
  ): Promise<ContractTransactionResult> {
    try {
      // Convert parameters to contract-friendly format
      const args = [ContractClient.toScVal(listingId)];

      // Simulate the transaction first
      const simResult = await this.client.simulateTransaction(publicKey, 'cancel_listing', args);
      
      if (simResult.error) {
        throw simResult.error;
      }

      // Prepare the transaction from simulation
      const source = new Account(publicKey, '0'); // Sequence will be filled by wallet
      const preparedTx = await this.prepareTransaction(source, simResult.transactionData, options);

      // The transaction needs to be signed by the wallet
      // This would typically be handled by the wallet provider
      return {
        successful: false,
        error: new ContractError(
          'Transaction requires signing by wallet',
          'REQUIRES_SIGNING',
          { xdr: preparedTx }
        ),
        transactionId: undefined,
        preparedXdr: preparedTx,
      };
    } catch (e: any) {
      if (e instanceof ContractError) {
        throw e;
      }
      throw new ContractError(
        `Failed to cancel listing: ${e.message}`,
        'CANCEL_LISTING_FAILED',
        e
      );
    }
  }

  /**
   * Gets details for a specific listing
   * 
   * @param publicKey - Public key of the caller
   * @param listingId - ID of the listing to retrieve
   * @returns Listing details
   * @throws ContractError if the operation fails
   */
  public async getListing(
    publicKey: string,
    listingId: string
  ): Promise<Listing> {
    try {
      const args = [ContractClient.toScVal(listingId)];
      const result = await this.client.callMethod(publicKey, 'get_listing', args);
      
      return this.parseListingData(result);
    } catch (e: any) {
      if (e instanceof ContractError) {
        throw e;
      }
      throw new ContractError(
        `Failed to get listing: ${e.message}`,
        'GET_LISTING_FAILED',
        e
      );
    }
  }

  /**
   * Gets all active listings from the marketplace
   * 
   * @param publicKey - Public key of the caller
   * @param limit - Maximum number of listings to return (default: 50)
   * @param offset - Offset for pagination (default: 0)
   * @returns Array of listing details
   * @throws ContractError if the operation fails
   */
  public async getAllListings(
    publicKey: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<Listing[]> {
    try {
      const args = [
        ContractClient.toScVal(limit),
        ContractClient.toScVal(offset)
      ];
      
      const result = await this.client.callMethod(publicKey, 'get_all_listings', args);

      if (!Array.isArray(result)) {
        throw new ContractError(
          'Invalid response format from contract',
          'INVALID_RESPONSE',
          result
        );
      }
      
      return result.map(this.parseListingData.bind(this));
    } catch (e: any) {
      if (e instanceof ContractError) {
        throw e;
      }
      throw new ContractError(
        `Failed to get all listings: ${e.message}`,
        'GET_ALL_LISTINGS_FAILED',
        e
      );
    }
  }

  /**
   * Gets listings by seller
   * 
   * @param publicKey - Public key of the caller
   * @param sellerAddress - Address of the seller
   * @param limit - Maximum number of listings to return (default: 50)
   * @param offset - Offset for pagination (default: 0)
   * @returns Array of listing details
   * @throws ContractError if the operation fails
   */
  public async getListingsBySeller(
    publicKey: string,
    sellerAddress: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<Listing[]> {
    try {
      const args = [
        ContractClient.toScVal(sellerAddress),
        ContractClient.toScVal(limit),
        ContractClient.toScVal(offset)
      ];
      
      const result = await this.client.callMethod(publicKey, 'get_listings_by_seller', args);

      if (!Array.isArray(result)) {
        throw new ContractError(
          'Invalid response format from contract',
          'INVALID_RESPONSE',
          result
        );
      }
      
      return result.map(this.parseListingData.bind(this));
    } catch (e: any) {
      if (e instanceof ContractError) {
        throw e;
      }
      throw new ContractError(
        `Failed to get listings by seller: ${e.message}`,
        'GET_LISTINGS_BY_SELLER_FAILED',
        e
      );
    }
  }

  /**
   * Gets listings by token ID
   * 
   * @param publicKey - Public key of the caller
   * @param tokenId - ID of the token
   * @param limit - Maximum number of listings to return (default: 50)
   * @param offset - Offset for pagination (default: 0)
   * @returns Array of listing details
   * @throws ContractError if the operation fails
   */
  public async getListingsByToken(
    publicKey: string,
    tokenId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<Listing[]> {
    try {
      const args = [
        ContractClient.toScVal(tokenId),
        ContractClient.toScVal(limit),
        ContractClient.toScVal(offset)
      ];
      
      const result = await this.client.callMethod(publicKey, 'get_listings_by_token', args);

      if (!Array.isArray(result)) {
        throw new ContractError(
          'Invalid response format from contract',
          'INVALID_RESPONSE',
          result
        );
      }
      
      return result.map(this.parseListingData.bind(this));
    } catch (e: any) {
      if (e instanceof ContractError) {
        throw e;
      }
      throw new ContractError(
        `Failed to get listings by token: ${e.message}`,
        'GET_LISTINGS_BY_TOKEN_FAILED',
        e
      );
    }
  }

  /**
   * Updates the price of an existing listing
   * 
   * @param publicKey - Public key of the seller
   * @param listingId - ID of the listing to update
   * @param newPrice - New price for the listing (in stroops)
   * @param options - Transaction options
   * @returns Result of the update operation
   * @throws ContractError if the operation fails
   */
  public async updateListingPrice(
    publicKey: string,
    listingId: string,
    newPrice: string,
    options?: TxOptions
  ): Promise<ContractTransactionResult> {
    try {
      // Convert parameters to contract-friendly format
      const args = [
        ContractClient.toScVal(listingId),
        ContractClient.toScVal(newPrice)
      ];

      // Simulate the transaction first
      const simResult = await this.client.simulateTransaction(publicKey, 'update_listing_price', args);
      
      if (simResult.error) {
        throw simResult.error;
      }

      // Prepare the transaction from simulation
      const source = new Account(publicKey, '0'); // Sequence will be filled by wallet
      const preparedTx = await this.prepareTransaction(source, simResult.transactionData, options);

      // The transaction needs to be signed by the wallet
      // This would typically be handled by the wallet provider
      return {
        successful: false,
        error: new ContractError(
          'Transaction requires signing by wallet',
          'REQUIRES_SIGNING',
          { xdr: preparedTx }
        ),
        transactionId: undefined,
        preparedXdr: preparedTx,
      };
    } catch (e: any) {
      if (e instanceof ContractError) {
        throw e;
      }
      throw new ContractError(
        `Failed to update listing price: ${e.message}`,
        'UPDATE_LISTING_PRICE_FAILED',
        e
      );
    }
  }

  /**
   * Parses raw listing data from the contract into a structured Listing object
   * 
   * @param rawListing - Raw listing data from the contract
   * @returns Structured Listing object
   */
  private parseListingData(rawListing: any): Listing {
    if (!rawListing || typeof rawListing !== 'object') {
      throw new ContractError(
        'Invalid listing data format',
        'INVALID_LISTING_FORMAT',
        rawListing
      );
    }

    return {
      id: rawListing.id || '',
      seller: rawListing.seller || '',
      tokenId: rawListing.token_id || '',
      amount: rawListing.amount?.toString() || '0',
      price: rawListing.price?.toString() || '0',
      isActive: Boolean(rawListing.is_active),
      createdAt: Number(rawListing.created_at || 0),
    };
  }

  /**
   * Private utility to prepare a transaction with proper auth and fees
   * Similar to ContractClient's prepareTransaction but with specific error handling
   * 
   * @param source - Source account
   * @param simResponse - Simulation response
   * @param options - Transaction options
   * @returns Prepared transaction XDR
   */
  private async prepareTransaction(
    source: Account,
    simResponse: any,
    options?: TxOptions
  ): Promise<string> {
    try {
      return await this.client['prepareTransaction'](source, simResponse, options);
    } catch (e: any) {
      throw new ContractError(
        `Failed to prepare marketplace transaction: ${e.message

