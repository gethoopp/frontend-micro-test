"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { getDepositEstimate, deposit } from "@/repostiory/deposit";

interface GasEstimate {
  gasLimit: number;
  gasPrice: string;
  gasFee: string;
}

interface EstimateData {
  amount: string;
  balanceBefore: string;
  balanceAfter: string;
  gasEstimate: GasEstimate;
}

export function Deposit() {
  const { isConnected } = useAccount();
  const [amount, setAmount] = useState("");
  const [estimate, setEstimate] = useState<EstimateData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");

  const toWei = (ethAmount: string): string => {
    const parsed = parseFloat(ethAmount);
    if (isNaN(parsed) || parsed <= 0) return "0";
    const wei = BigInt(Math.floor(parsed * 1e18));
    return wei.toString();
  };

  const formatEth = (wei: string): string => {
    return (parseFloat(wei) / 1e18).toFixed(8);
  };

  const handleEstimate = async () => {
    if (!amount) {
      setError("Please enter amount");
      return;
    }

    const amountInWei = toWei(amount);
    setIsEstimating(true);
    setError("");
    setEstimate(null);

    const result = await getDepositEstimate({ amount: amountInWei });

    if (result.success && result.gasEstimate) {
      setEstimate({
        amount: result.amount || "",
        balanceBefore: result.balanceBefore || "0",
        balanceAfter: result.balanceAfter || "0",
        gasEstimate: result.gasEstimate,
      });
    } else {
      setError(result.message || "Failed to get estimate");
    }

    setIsEstimating(false);
  };

  const handleDeposit = async () => {
    if (!estimate) return;

    setIsLoading(true);
    setError("");
    setTxHash("");

    const result = await deposit({ amount: estimate.amount });

    if (result.success) {
      setTxHash(result.txHash || "");
      setAmount("");
      setEstimate(null);
    } else {
      setError(result.message || "Deposit failed");
    }

    setIsLoading(false);
  };

  if (!isConnected) return null;

  return (
    <div className="sign-card">
      <h3 className="card-title">Deposit</h3>

      <div className="input-group">
        <label className="input-label">Amount (ETH)</label>
        <input
          type="text"
          className="text-input"
          placeholder="0.0"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setEstimate(null);
          }}
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
        onClick={handleEstimate}
        disabled={isEstimating || !amount}
      >
        {isEstimating ? "Estimating..." : "Get Estimate"}
      </button>

      {estimate && (
        <div className="result-box">
          <div className="result-row">
            <span className="result-label">Amount</span>
            <span className="result-value">{formatEth(estimate.amount)} ETH</span>
          </div>
          <div className="result-row">
            <span className="result-label">Balance Before</span>
            <span className="result-value">{formatEth(estimate.balanceBefore)} ETH</span>
          </div>
          <div className="result-row">
            <span className="result-label">Balance After</span>
            <span className="result-value">{formatEth(estimate.balanceAfter)} ETH</span>
          </div>
          <div className="result-row">
            <span className="result-label">Gas Limit</span>
            <span className="result-value">{estimate.gasEstimate.gasLimit}</span>
          </div>
          <div className="result-row">
            <span className="result-label">Gas Price</span>
            <span className="result-value">{estimate.gasEstimate.gasPrice} gwei</span>
          </div>
          <div className="result-row">
            <span className="result-label">Gas Fee</span>
            <span className="result-value">{formatEth(estimate.gasEstimate.gasFee)} ETH</span>
          </div>

          <button
            className="action-btn"
            onClick={handleDeposit}
            disabled={isLoading}
            style={{ marginTop: "12px" }}
          >
            {isLoading ? "Depositing..." : "Confirm Deposit"}
          </button>
        </div>
      )}

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
