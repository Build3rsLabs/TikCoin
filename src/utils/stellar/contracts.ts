import { Contract, Address } from 'stellar-sdk';
import { CREATOR_TOKEN_CONTRACT_ID, MARKETPLACE_CONTRACT_ID } from './config';

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

