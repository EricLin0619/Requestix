"use client";

import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { chains, demoAppInfo, wagmiConfig } from "../config/rainbowKit";
import { ThirdwebProvider } from "@thirdweb-dev/react";

const queryClient = new QueryClient();

interface RootProviderProps {
  children: React.ReactNode;
}

export default function RootProvider({ children }: RootProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider
        clientId={"482b934d10599d46f13e52972ea433e8"}
        activeChain="sepolia"
      >
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider appInfo={demoAppInfo} chains={chains} locale="en">
            {children}
          </RainbowKitProvider>
        </WagmiConfig>
      </ThirdwebProvider>
    </QueryClientProvider>
  );
  // 3W9kBFInN2krrginMmFu5XTZur2r4uTMQWj6zx5xtZtgEm10oE6BI6VuV34Z7jj5FQDa9QExyNdNmBp8Kxebcw
  // 482b934d10599d46f13e52972ea433e8
  // https://ipfs.io/ipfs/QmNpqxuDv6XueLi7HTDT2EqkxiQ9Us3KM7X8HUyCsDnUdC/0
  // https://ipfs.io/ipfs/QmZcH4YvBVVRJtdn4RdbaqgspFU8gH6P9vomDpBVpAL3u4/997
  // https://ipfs.io/ipfs/QmeFYxu1eK4TfzDmrBt9JY1cXuDhMgEQ8PSR8RBswFLjnv/yoasobi.jpg
}
