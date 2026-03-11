"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { getBalance } from "@/repostiory/balance";

export function AccountSidebar() {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isConnected) return null;

  const handleCheckBalance = async () => {
    if (!address) return;

    setIsLoading(true);
    setError("");

    const result = await getBalance({ address });

    if (result.success) {
      setBalance(result.walletBalance || "0");
    } else {
      setError(result.message || "Failed to fetch balance");
    }

    setIsLoading(false);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-title">Account</div>

      <div className="sidebar-section">
        <label className="sidebar-label">Wallet Address</label>
        <div className="sidebar-address">
          {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "-"}
        </div>
      </div>

      <div className="sidebar-section">
        <label className="sidebar-label">Balance (ETH)</label>
        <div className="sidebar-balance">{balance || "0.000000"}</div>
      </div>

      <button
        className="sidebar-btn"
        onClick={handleCheckBalance}
        disabled={isLoading}
      >
        {isLoading ? "Checking..." : "Check Balance"}
      </button>

      {error && <div className="sidebar-error">{error}</div>}
    </aside>
  );
}
