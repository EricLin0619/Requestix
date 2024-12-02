"use client";

import { useWalletClient, useAccount } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";
import { WalletClient } from "viem";
import TicketCard from "@/components/ticketCard";
import retriveRequest from "@/requestModule/retriveRequest";
import PayButton from "@/components/button/payButton";
import { useEffect, useState } from "react";
import { Types } from "@requestnetwork/request-client.js";

export default function Home() {
  const { data: walletClient, isError, isLoading } = useWalletClient();
  const { address } = useAccount();
  const payeeIdentity = address;
  const payerIdentity = "0x519145B771a6e450461af89980e5C17Ff6Fd8A92";
  const [requestDatas, setRequestDatas] = useState<Types.IRequestData[]>([]);

  useEffect(() => {
    retriveRequest("sepolia", payeeIdentity as `0x${string}`).then((data) => {
      console.log(data);
      setRequestDatas(data);
    });
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-x-10 gap-y-10 mt-10 justify-items-center items-center">
        <TicketCard />
        <TicketCard />
        <TicketCard />
        <TicketCard />
        <TicketCard />
        <TicketCard />
      </div>
      <PayButton
        requestData={requestDatas[5]}
        payerAddress={payerIdentity}
        gatewayChain="sepolia"
      />
      {/* <button
        className="btn btn-primary"
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
      </button> */}
    </div>
  );
}
