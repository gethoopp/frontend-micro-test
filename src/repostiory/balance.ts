interface BalanceParams {
  address: string;
}

interface BalanceResponse {
  success: boolean;
  address?: string;
  contractBalance?: string;
  internalBalance?: string;
  walletBalance?: string;
  message?: string;
}

export async function getBalance(
  params: BalanceParams,
): Promise<BalanceResponse> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  try {
    const response = await fetch(
      `https://micro-payment-backend.onrender.com/api/v1/payment/balance?address=${params.address}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
    );

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        address: data.address,
        contractBalance: data.contract_balance,
        internalBalance: data.internal_balance,
        walletBalance: data.wallet_balance,
      };
    }

    return {
      success: false,
      message: data.message || "Failed to get balance",
    };
  } catch (error) {
    console.error("Get balance error:", error);
    return {
      success: false,
      message: "Failed to connect to server",
    };
  }
}
