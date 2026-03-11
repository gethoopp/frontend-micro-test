"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { sendPayment } from "@/repostiory/sendPayment";
import { login, logout, getAuthToken } from "@/repostiory/auth";

export function SendPayment() {
  const { isConnected } = useAccount();
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = async () => {
    if (!walletAddress || !privateKey) {
      setError("Please enter wallet address and private key");
      return;
    }

    setIsLoggingIn(true);
    setError("");

    const result = await login({ walletAddress, privateKey });

    if (result.success) {
      setIsLoggedIn(true);
      setWalletAddress("");
      setPrivateKey("");
    } else {
      setError(result.message || "Login failed");
    }

    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
  };

  const toWei = (ethAmount: string): string => {
    const parsed = parseFloat(ethAmount);
    if (isNaN(parsed) || parsed <= 0) return "0";
    const wei = BigInt(Math.floor(parsed * 1e18));
    return wei.toString();
  };

  const handleSend = async () => {
    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }

    if (!isLoggedIn) {
      setError("Please login first");
      return;
    }

    if (!to || !amount) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");
    setTxHash("");

    try {
      const result = await sendPayment({
        to,
        amount,
      });

      if (result.success) {
        setTxHash(result.txHash || "");
        setTo("");
        setAmount("");
      } else {
        setError(result.message || "Payment failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="sign-card">
        <h3 className="card-title">Send Payment</h3>
        <div className="error-text">
          Please connect your wallet to send payments
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="sign-card">
        <h3 className="card-title">Send Payment</h3>

        <div className="input-group">
          <label className="input-label">Wallet Address</label>
          <input
            type="text"
            className="text-input"
            placeholder="0x..."
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Private Key</label>
          <input
            type="password"
            className="text-input"
            placeholder="Private Key"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
          />
        </div>

        <button
          className="action-btn"
          onClick={handleLogin}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? "Logging in..." : "Login"}
        </button>

        {error && <div className="error-text">{error}</div>}
      </div>
    );
  }

  return (
    <div className="sign-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h3 className="card-title" style={{ margin: 0 }}>
          Send Payment
        </h3>
        <button
          onClick={handleLogout}
          style={{
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
            padding: "4px 12px",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.75rem",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <div className="input-group">
        <label className="input-label">Recipient Address</label>
        <input
          type="text"
          className="text-input"
          placeholder="0x..."
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label className="input-label">Amount (ETH)</label>
        <input
          type="text"
          className="text-input"
          placeholder="0.0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        {amount && (
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
            }}
          >
            = {toWei(amount)} wei
          </span>
        )}
      </div>

      <button
        className="action-btn"
        onClick={handleSend}
        disabled={isLoading || !isConnected}
      >
        {isLoading ? "Sending..." : "Send Payment"}
      </button>

      {error && <div className="error-text">{error}</div>}

      {txHash && (
        <div className="result-box">
          <span className="result-label">Transaction Hash</span>
          <span className="result-value">{txHash}</span>
        </div>
      )}
    </div>
  );
}
