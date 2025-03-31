import {
  Account,
  Contract,
  SorobanRpc,
  TransactionBuilder,
  xdr,
  TimeoutInfinite,
  Networks,
  scValToNative,
  nativeToScVal,
  ScVal,
} from '@stellar/stellar-sdk';
import { NetworkConfig, ContractError, SimulationResponse, TxOptions, ContractTransactionResult } from './types';
import { DEFAULT_FEE, TX_TIMEOUT } from './config';

/**
 * Generic client for interacting with Soroban smart contracts
 */
export class ContractClient {
  private server: SorobanRpc.Server;
  private contractId: string;
  private networkConfig: NetworkConfig;

  /**
   * Creates a new contract client
   * 
   * @param contractId - ID of the contract to interact with
   * @param networkConfig - Network configuration
   */
  constructor(contractId: string, networkConfig: NetworkConfig) {
    this.contractId = contractId;
    this.networkConfig = networkConfig;
    this.server = new SorobanRpc.Server(networkConfig.sorobanRpcUrl);
  }

  /**
   * Gets the Contract instance for the specified contract ID
   * 
   * @returns Contract instance
   */
  public getContract(): Contract {
    return new Contract(this.contractId);
  }

  /**
   * Simulates a contract method call without submitting to the network
   * 
   * @param publicKey - Public key of the caller
   * @param method - Contract method name to call
   * @param args - Arguments to pass to the method
   * @returns Simulation result
   */
  public async simulateTransaction(
    publicKey: string,
    method: string,
    args: any[] = []
  ): Promise<SimulationResponse> {
    try {
      // Build the transaction
      const contract = this.getContract();
      const tx = new TransactionBuilder(
        new Account(publicKey, '0'),
        {
          fee: DEFAULT_FEE,
          networkPassphrase: this.networkConfig.networkPassphrase,
        }
      )
        .addOperation(contract.call(method, ...args))
        .setTimeout(TimeoutInfinite)
        .build();

      // Simulate the transaction
      const simResponse = await this.server.simulateTransaction(tx);

      if (simResponse.error) {
        return {
          transactionData: simResponse,
          error: new ContractError(
            `Simulation error: ${simResponse.error.toString()}`,
            'SIMULATION_ERROR',
            simResponse.error
          )
        };
      }

      return { transactionData: simResponse };
    } catch (e: any) {
      return {
        transactionData: {} as SorobanRpc.Api.SimulateTransactionResponse,
        error: new ContractError(
          `Failed to simulate transaction: ${e.message}`,
          'SIMULATION_FAILED',
          e
        )
      };
    }
  }

  /**
   * Prepares a transaction with proper auth and fees
   * 
   * @param source - Source account
   * @param simResponse - Simulation response
   * @param options - Transaction options
   * @returns Prepared transaction
   */
  private async prepareTransaction(
    source: Account,
    simResponse: SorobanRpc.Api.SimulateTransactionResponse,
    options: TxOptions = {}
  ): Promise<string> {
    try {
      const preparedTx = TransactionBuilder.fromXDR(
        simResponse.transactionData as string,
        this.networkConfig.networkPassphrase
      );

      preparedTx.fee = options.fee || DEFAULT_FEE;
      preparedTx.timeBounds = {
        minTime: 0,
        maxTime: Math.floor(Date.now() / 1000) + (options.timeout || TX_TIMEOUT),
      };

      return preparedTx.toXDR();
    } catch (e: any) {
      throw new ContractError(
        `Failed to prepare transaction: ${e.message}`,
        'PREPARE_FAILED',
        e
      );
    }
  }

  /**
   * Executes a contract method call
   * 
   * @param signedXdr - Signed transaction XDR
   * @param options - Transaction options
   * @returns Transaction result
   */
  public async executeTransaction(
    signedXdr: string,
    options: TxOptions = {}
  ): Promise<ContractTransactionResult> {
    try {
      const tx = TransactionBuilder.fromXDR(signedXdr, this.networkConfig.networkPassphrase);
      const sendResponse = await this.server.sendTransaction(tx);

      if (sendResponse.status === 'PENDING') {
        let txResponse: SorobanRpc.Api.GetTransactionResponse;

        // Poll for transaction status
        while (true) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          txResponse = await this.server.getTransaction(sendResponse.hash);

          if (txResponse.status !== 'PENDING') {
            break;
          }
        }

        if (txResponse.status === 'SUCCESS') {
          // Extract result from successful transaction
          let result = undefined;
          
          if (txResponse.returnValue) {
            try {
              result = scValToNative(txResponse.returnValue as ScVal);
            } catch (e) {
              console.warn('Could not parse transaction result:', e);
            }
          }

          return {
            successful: true,
            transactionId: sendResponse.hash,
            result,
          };
        } else {
          return {
            successful: false,
            transactionId: sendResponse.hash,
            error: new ContractError(
              `Transaction failed: ${txResponse.resultXdr || 'Unknown error'}`,
              'TRANSACTION_FAILED',
              txResponse
            ),
          };
        }
      }

      return {
        successful: false,
        error: new ContractError(
          `Transaction submission failed: ${sendResponse.errorResultXdr || sendResponse.status}`,
          'SUBMISSION_FAILED',
          sendResponse
        ),
      };
    } catch (e: any) {
      return {
        successful: false,
        error: new ContractError(
          `Transaction execution failed: ${e.message}`,
          'EXECUTION_FAILED',
          e
        ),
      };
    }
  }

  /**
   * Calls a read-only contract method (view function)
   * 
   * @param publicKey - Public key of the caller
   * @param method - Contract method name to call
   * @param args - Arguments to pass to the method
   * @returns Method result
   */
  public async callMethod(
    publicKey: string,
    method: string,
    args: any[] = []
  ): Promise<any> {
    const simResult = await this.simulateTransaction(publicKey, method, args);

    if (simResult.error) {
      throw simResult.error;
    }

    if (simResult.transactionData.result) {
      return scValToNative(simResult.transactionData.result.retval as ScVal);
    }

    throw new ContractError(
      'No result returned from contract call',
      'NO_RESULT',
      simResult
    );
  }

  /**
   * Converts a value to an ScVal type for contract interaction
   * 
   * @param value - Value to convert
   * @param type - Optional ScVal type hint
   * @returns ScVal representation
   */
  public static toScVal(value: any, type?: any): ScVal {
    return nativeToScVal(value, type);
  }

  /**
   * Converts an ScVal to a native JavaScript value
   * 
   * @param value - ScVal to convert
   * @returns Native JavaScript value
   */
  public static fromScVal(value: ScVal): any {
    return scValToNative(value);
  }
}

