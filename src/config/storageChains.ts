interface StorageChain {
    name: string;
    type: "mainnet" | "testnet";
    gateway: string;
  }
  
  // key: {chainId}
  export const storageChains = new Map<string, StorageChain>([
    [
      "sepolia",
      {
        name: "Sepolia",
        type: "testnet",
        gateway: "https://sepolia.gateway.request.network/",
      },
    ],
    [
      "gnosis",
      {
        name: "Gnosis",
        type: "mainnet",
        gateway: "https://gnosis.gateway.request.network/",
      },
    ],
  ]);
  