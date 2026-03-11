interface SendPaymentParams {
  to: string;
  amount: string;
}

interface SendPaymentResponse {
  success: boolean;
  txHash?: string;
  message?: string;
}

function toWei(ethAmount: string): string {
  const parsed = parseFloat(ethAmount);
  if (isNaN(parsed)) return "0";
  const wei = BigInt(Math.floor(parsed * 1e18));
  return wei.toString();
}

export async function sendPayment(
  params: SendPaymentParams,
): Promise<SendPaymentResponse> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  console.log("Sending payment:", params);
  console.log("Token:", token);

  const amountInWei = toWei(params.amount);

  try {
    const response = await fetch(
      "http://localhost:8000/api/v1/payment/send-direct",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          to: params.to,
          amount: amountInWei,
        }),
      },
    );

    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("Response data:", data);

    if (response.ok) {
      return {
        success: true,
        txHash: data.tx_hash,
      };
    }

    return {
      success: false,
      message: data.error || data.message || "Payment failed",
    };
  } catch (error) {
    console.error("Payment error:", error);
    return {
      success: false,
      message: "Failed to connect to server. Make sure the backend is running.",
    };
  }
}
