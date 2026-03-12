export interface DepositEstimateParams {
  amount: string;
}

export interface GasEstimate {
  gasLimit: number;
  gasPrice: string;
  gasFee: string;
}

export interface DepositEstimateResponse {
  success: boolean;
  amount?: string;
  balanceBefore?: string;
  balanceAfter?: string;
  gasEstimate?: GasEstimate;
  message?: string;
}

export interface DepositParams {
  amount: string;
}

export interface DepositResponse {
  success: boolean;
  txHash?: string;
  message?: string;
}
