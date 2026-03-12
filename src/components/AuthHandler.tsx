"use client";

import { useEffect, useState, useRef } from "react";
import { useAccount } from "wagmi";
import { getNonce, login, getAuthToken } from "@/repostiory/auth";

export function AuthHandler({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const hasAuthed = useRef(false);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    console.log("AuthHandler: isConnected:", isConnected, "address:", address, "hasAuthed:", hasAuthed.current);

    if (!isConnected || !address || hasAuthed.current) return;

    const handleAuth = async () => {
      setIsAuthenticating(true);
      console.log("AuthHandler: Starting auth flow...");

      try {
        console.log("AuthHandler: Getting nonce for:", address);
        const nonceResult = await getNonce(address);
        console.log("AuthHandler: Nonce result:", nonceResult);
        
        if (!nonceResult.success || !nonceResult.nonce) {
          console.error("Failed to get nonce:", nonceResult.message);
          setIsAuthenticating(false);
          return;
        }

        const message = "Sign to login to MicroPayment: " + nonceResult.nonce;
        console.log("AuthHandler: Message to sign:", message);
        
        let signature: string;
        
        // Langsung pakai window.ethereum - lebih reliable
        if (typeof window !== "undefined" && (window as any).ethereum) {
          try {
            // Coba eth_sign dulu (raw message)
            signature = await (window as any).ethereum.request({
              method: "eth_sign",
              params: [address, message],
            });
            console.log("AuthHandler: Signed with eth_sign:", signature);
          } catch (ethSignErr) {
            console.error("eth_sign failed, trying personal_sign:", ethSignErr);
            // Fallback ke personal_sign
            signature = await (window as any).ethereum.request({
              method: "personal_sign",
              params: [message, address],
            });
            console.log("AuthHandler: Signed with personal_sign:", signature);
          }
        } else {
          console.error("No ethereum provider available");
          setIsAuthenticating(false);
          return;
        }

        localStorage.setItem("authSignature", signature);

        console.log("AuthHandler: Calling login...");
        const loginResult = await login({
          address,
          signature,
          nonce: nonceResult.nonce,
        });
        console.log("AuthHandler: Login result:", loginResult);

        if (loginResult.success) {
          setIsAuthenticated(true);
          hasAuthed.current = true;
        } else {
          console.error("Login failed:", loginResult.message);
        }
      } catch (error) {
        console.error("Auth error:", error);
      }

      setIsAuthenticating(false);
    };

    handleAuth();
  }, [isConnected, address]);

  return <>{children}</>;
}
