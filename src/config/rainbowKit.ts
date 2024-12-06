import {
    getDefaultWallets,
    connectorsForWallets,
  } from "@rainbow-me/rainbowkit";
  import {
    argentWallet,
    trustWallet,
    ledgerWallet,
  } from "@rainbow-me/rainbowkit/wallets";
  import { configureChains, createConfig } from "wagmi";
  import {
    mainnet,
    sepolia,
    gnosis,
    polygon,
    celo,
    bsc,
    fantom,
    arbitrum,
    avalanche,
    optimism,
    moonbeam,
  } from "wagmi/chains";
  import { publicProvider } from "wagmi/providers/public";
  
  export const { chains, publicClient, webSocketPublicClient } = configureChains(
    [
      mainnet,
      {
        ...sepolia,
        transports: {
          http: ['https://ethereum-sepolia-rpc.publicnode.com']
        }
      },
      {
        ...gnosis,
        iconUrl: "https://raw.githubusercontent.com/gnosischain/media-kit/main/Logos/Owl_Logo%20-%20Mark.svg",
      },
      polygon,
      optimism,
      arbitrum,
      avalanche,
      bsc,
      celo,
      fantom,
      moonbeam,
    ],
    [publicProvider()]
  );
  
  // For details about Wallet Connect Project ID: https://docs.walletconnect.com/cloud/relay#project-id
  const projectId = "50cca87b3fb2bfa74e0e1eac5658954d";
  
  const appName = "Request Network Quickstart: Create a request";
  
  const { wallets } = getDefaultWallets({
    appName,
    projectId,
    chains,
  });
  
  export const demoAppInfo = {
    appName,
  };
  
  const connectors = connectorsForWallets([
    ...wallets,
    {
      groupName: "Other",
      wallets: [
        argentWallet({ projectId, chains }),
        trustWallet({ projectId, chains }),
        ledgerWallet({ projectId, chains }),
      ],
    },
  ]);
  
  export const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
  });
  