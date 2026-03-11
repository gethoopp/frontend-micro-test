"use client";

import React, { useEffect, useState } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { mainnet } from "viem/chains";
import "@rainbow-me/rainbowkit/styles.css";

//tes deploy
const mezoMainnet = {
  ...mainnet,
  id: 420420421,
  name: "Mezo Mainnet",
  nativeCurrency: { name: "Bitcoin", symbol: "BTC", decimals: 8 },
  rpcUrls: {
    default: { http: ["https://rpc.mezo.org"] },
  },
} as const;

const mezoTestnet = {
  ...mainnet,
  id: 408193,
  name: "Mezo Testnet",
  nativeCurrency: { name: "Bitcoin", symbol: "tBTC", decimals: 8 },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.mezo.org"] },
  },
} as const;

const config = getDefaultConfig({
  appName: "Mezo Passport App",
  projectId: "YOUR_WALLETCONNECT_PROJECT_ID",
  chains: [mezoTestnet],
  transports: {
    [mezoTestnet.id]: http(),
  },
});

//tes deplo

export function Providers({ children }: { children: React.ReactNode }) {
  const [isReady] = useState(true);

  if (!isReady) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={mezoTestnet}
          theme={darkTheme({
            accentColor: "#F7931A",
            accentColorForeground: "white",
            borderRadius: "medium",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
