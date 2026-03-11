"use client";

import { useState } from "react";
import { useAccount } from "wagmi";

export function AccountSidebar() {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isConnected) return null;

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
        onClick={checkBalance}
        disabled={isLoading}
      >
        {isLoading ? "Checking..." : "Check Balance"}
      </button>

      {error && <div className="sidebar-error">{error}</div>}
    </aside>
  );
}
