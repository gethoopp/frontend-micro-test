interface LoginParams {
  address: string;
  signature: string;
  nonce: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}

interface NonceResponse {
  success: boolean;
  nonce?: string;
  message?: string;
}

export async function getNonce(address: string): Promise<NonceResponse> {
  try {
    const response = await fetch(
      `/api/proxy?path=/api/v1/auth/nonce?address=${encodeURIComponent(address)}`
    );

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        nonce: data.nonce,
      };
    }

    return {
      success: false,
      message: data.message || "Failed to get nonce",
    };
  } catch (error) {
    console.error("Get nonce error:", error);
    return {
      success: false,
      message: "Failed to connect to server",
    };
  }
}

export async function login(params: LoginParams): Promise<LoginResponse> {
  try {
    console.log("Login request:", {
      address: params.address,
      signature: params.signature,
      nonce: params.nonce,
    });

    const response = await fetch(
      `/api/proxy?path=/api/v1/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: params.address,
          signature: params.signature,
          nonce: params.nonce,
        }),
      },
    );

    const data = await response.json();
    console.log("Login response:", response.status, data);

    if (response.ok && data.token) {
      console.log("Login success, storing token:", data.token.substring(0, 20) + "...");
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
