"use client";
import { useWalletClient, useAccount } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";
import { WalletClient } from "viem";
import TicketCard from "@/components/ticketCard";
import retriveRequest from "@/requestModule/retriveRequest";
import PayButton from "@/components/button/payButton";
import { useState } from "react";
import { Types } from "@requestnetwork/request-client.js";
import { getAllEvents } from "@/service/contractService";
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const { address } = useAccount();
  const payeeIdentity = address;
  const payerIdentity = "0x519145B771a6e450461af89980e5C17Ff6Fd8A92";
  const [requestDatas, setRequestDatas] = useState<Types.IRequestData[]>([]);

  const { data: events = [], isLoading } = useQuery<any[]>({
    queryKey: ['events'],
    queryFn: getAllEvents,
    staleTime: 5 * 60 * 1000, // 數據在 5 分鐘內被認為是新鮮的
    cacheTime: 30 * 60 * 1000, // 緩存保留 30 分鐘
  });

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <span className="loading loading-ring text-black w-[100px] h-[100px]"></span>
    </div>
  )

  return (
    <div>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-x-10 gap-y-10 mt-10 justify-items-center items-center">
        {events.map((event, index) => {
          const ipfsUrl = event[0];
          const organizer = event[1];
          const maxRegistrations = event[2];
          const registeredCount = event[3];
          const isActive = event[4];
          const eventId = index + 1;
          return (
            <TicketCard
              key={index}
              metadataUrl={ipfsUrl}
              organizer={organizer}
              maxRegistrations={maxRegistrations}
              registeredCount={registeredCount}
              isActive={isActive}
              eventId={eventId}
            />
          );
        })}
      </div>
      {/* <PayButton
        requestData={requestDatas[5]}
        payerAddress={payerIdentity}
        gatewayChain="sepolia"
      /> */}
    </div>
  );
}
