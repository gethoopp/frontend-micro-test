interface DepositEstimateParams {
  amount: string;
}

interface GasEstimate {
  gasLimit: number;
  gasPrice: string;
  gasFee: string;
}

interface DepositEstimateResponse {
  success: boolean;
  amount?: string;
  balanceBefore?: string;
  balanceAfter?: string;
  gasEstimate?: GasEstimate;
  message?: string;
}
//test
export async function getDepositEstimate(
  params: DepositEstimateParams,
): Promise<DepositEstimateResponse> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  try {
    const response = await fetch(
      "https://micro-payment-backend.onrender.com/api/v1/payment/deposit-estimate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          amount: params.amount,
        }),
      },
    );

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        amount: data.amount,
        balanceBefore: data.balance_before,
        balanceAfter: data.balance_after,
        gasEstimate: {
          gasLimit: data.gas_estimate.gas_limit,
          gasPrice: data.gas_estimate.gas_price,
          gasFee: data.gas_estimate.gas_fee,
        },
      };
    }

    return {
      success: false,
      message: data.message || "Failed to get deposit estimate",
    };
  } catch (error) {
    console.error("Deposit estimate error:", error);
    return {
      success: false,
      message: "Failed to connect to server",
    };
  }
}

interface DepositParams {
  amount: string;
}

interface DepositResponse {
  success: boolean;
  txHash?: string;
  message?: string;
}

export async function deposit(params: DepositParams): Promise<DepositResponse> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  try {
    const response = await fetch(
      "http://localhost:8000/api/v1/payment/deposit",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          amount: params.amount,
        }),
      },
    );

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        txHash: data.tx_hash,
      };
    }

    return {
      success: false,
      message: data.error || data.message || "Deposit failed",
    };
  } catch (error) {
    console.error("Deposit error:", error);
    return {
      success: false,
      message: "Failed to connect to server",
    };
  }
}
