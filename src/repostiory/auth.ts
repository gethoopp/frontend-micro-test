interface LoginParams {
  walletAddress: string;
  privateKey: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}

export async function login(params: LoginParams): Promise<LoginResponse> {
  try {
    const response = await fetch(
      "https://micro-payment-backend.onrender.com/api/v1/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: params.walletAddress,
          private_key: params.privateKey,
        }),
      },
    );

    const data = await response.json();

    if (response.ok && data.token) {
      localStorage.setItem("authToken", data.token);
      return {
        success: true,
        token: data.token,
      };
    }

    return {
      success: false,
      message: data.message || "Login failed",
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Failed to connect to server. Make sure the backend is running.",
    };
  }
}

export function logout() {
  localStorage.removeItem("authToken");
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}
