"use client";
import { useAccount } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";
import TicketCard from "@/components/ticketCard";
import { useState, useEffect } from "react";
import { Types } from "@requestnetwork/request-client.js";
import { getAllEvents } from "@/service/contractService";
import { useQuery } from '@tanstack/react-query';
import { MediaRenderer } from "@thirdweb-dev/react";

export default function Home() {
  const { address } = useAccount();
  const [requestDatas, setRequestDatas] = useState<Types.IRequestData[]>([]);

  const { data: events = [], isLoading } = useQuery<any[]>({
    queryKey: ['events'],
    queryFn: getAllEvents,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000, 
  });

  // useEffect(() => {
  //   retriveRequest("sepolia", address as `0x${string}`).then((data) => {
  //     console.log(data);
  //     setRequestDatas(data);
  //   });
  // }, []);

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <span className="loading loading-ring text-black w-[100px] h-[100px]"></span>
    </div>
  )

  return (
    <div>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-x-10 gap-y-10 mt-10 mb-4 justify-items-center items-center">
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
      {/* <MediaRenderer src="ipfs://QmcqtH1hCvA2jbveNHnaSpj79KT5UdnHCVeGSCy6YLtMav/0" />
      <MediaRenderer src="ipfs://QmTn17XVX7AtRufh68USVedsBY8mAstZ6smYWCaBYkHAx7/0" /> */}
      {/* <PayButton
        requestData={requestDatas[8]}
        payerAddress={address as `0x${string}`}
        gatewayChain="sepolia"
      /> */}
    </div>
  );
}
