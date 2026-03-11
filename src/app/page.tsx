"use client";

import dynamic from "next/dynamic";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { WalletInfo } from "@/components/WalletInfo";
import { SignMessage } from "@/components/SignMessage";
import { SendPayment } from "@/components/SendPayment";
import { AccountSidebar } from "@/components/AccountSidebar";
import { Deposit } from "@/components/Deposit";
import "@rainbow-me/rainbowkit/styles.css";

const Providers = dynamic(
  () => import("@/components/Providers").then((mod) => mod.Providers),
  { ssr: false }
);

export default function Home() {
  return (
    <Providers>
      <HomeContent />
    </Providers>
  );
}

function HomeContent() {
  const { isConnected } = useAccount();

  return (
    <main className="main">
      <div className="bg-grid" />
      <div className="bg-glow" />

      <header className="header">
        <div className="logo">
          <span className="logo-icon">₿</span>
          <span className="logo-text">
            MEZO<span className="logo-accent">PASSPORT</span>
          </span>
        </div>
        <div className="connect-wrapper">
          <ConnectButton
            showBalance={false}
            chainStatus="icon"
            accountStatus="address"
          />
        </div>
      </header>

      <section className="hero">
        <div className="hero-badge">BITCOIN-NATIVE dAPP</div>
        <h1 className="hero-title">
          Connect Your
          <br />
          <span className="hero-title-accent">Bitcoin Wallet</span>
        </h1>
        <p className="hero-subtitle">
          Powered by Mezo Passport — bridge Bitcoin and EVM wallets seamlessly
          on the Matsnet testnet.
        </p>

        {!isConnected && (
          <div className="hero-cta">
            <ConnectButton label="Connect Wallet" />
            <p className="cta-hint">Supports Xverse, Unisat, MetaMask & more</p>
          </div>
        )}
      </section>

      {isConnected && (
        <div style={{ display: "flex", gap: "24px", width: "100%", maxWidth: "1100px", position: "relative", zIndex: 10 }}>
          <section className="dashboard" style={{ flex: 1 }}>
            <WalletInfo />
            <SendPayment />
            <Deposit />
            <SignMessage />
          </section>
          <AccountSidebar />
        </div>
      )}

      {!isConnected && (
        <section className="features">
          {[
            {
              icon: "🔐",
              title: "Bitcoin Wallets",
              desc: "Connect Xverse, Unisat and other native BTC wallets directly.",
            },
            {
              icon: "⚡",
              title: "EVM Compatible",
              desc: "Your BTC wallet becomes a full EVM smart account on Matsnet.",
            },
            {
              icon: "🔗",
              title: "Multi-chain",
              desc: "Unified interface for both Bitcoin and Ethereum ecosystems.",
            },
            {
              icon: "✍️",
              title: "Sign Messages",
              desc: "Sign and verify messages using your connected wallet.",
            },
          ].map((f) => (
            <div key={f.title} className="feature-card">
              <span className="feature-icon">{f.icon}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </section>
      )}

      <footer className="footer">
        <p>
          Built with <strong>@mezo-org/passport</strong> · Mezo Matsnet Testnet
        </p>
      </footer>
    </main>
  );
}
