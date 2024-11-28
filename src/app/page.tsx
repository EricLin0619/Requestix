"use client";

import {
  useWalletClient,
  useAccount,
} from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { WalletClient } from "viem";
import { createRequest } from "@/requestModule/createRequest";

export default function Home() {
  const { data: walletClient, isError, isLoading } = useWalletClient();
  const { address } = useAccount();
  const payeeIdentity = address;
  const payerIdentity = "0x519145B771a6e450461af89980e5C17Ff6Fd8A92";

  return (
    <div>
      <button
        onClick={() =>
          createRequest(
            payeeIdentity as `0x${string}`,
            payerIdentity as `0x${string}`,
            "gnosis",
            "11155111_FAU",
            {
              reason: "Payment for goods",
              dueDate: "2020-01-01",
              builderId: "request-network",
              createdWith: "CodeSandBox",
            },
            walletClient as WalletClient
          )
        }
      >
        Create Request
      </button>
    </div>
  );
}
