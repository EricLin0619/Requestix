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
        clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
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
  // api_key: 3W9kBFInN2krrginMmFu5XTZur2r4uTMQWj6zx5xtZtgEm10oE6BI6VuV34Z7jj5FQDa9QExyNdNmBp8Kxebcw
  // https://ipfs.io/ipfs/QmRnrqzZ1hPqo9T6YH3TYMypX9CCHH2NapcRJrXnnt1dY1/0
  // https://ipfs.io/ipfs/QmaxbTD2rT8Dbg3MpUog5pcksSGC49fifC1mrEHLPeh6iK/0
  // https://ipfs.io/ipfs/QmeFYxu1eK4TfzDmrBt9JY1cXuDhMgEQ8PSR8RBswFLjnv/yoasobi.jpg
}
