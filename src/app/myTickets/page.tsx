"use client";
import "@rainbow-me/rainbowkit/styles.css";
import MyTicketCard from "@/components/myTicketCard";
import { useEffect, useState } from "react";
import retriveRequest from "@/requestModule/retriveRequest";
import { useAccount } from "wagmi";
import { useQuery } from '@tanstack/react-query';

function Page() {
  const { address } = useAccount();
  // const [requestDatas, setRequestDatas] = useState<any[]>([]);

  const { data: requestDatas = [], isLoading } = useQuery<any[]>({
    queryKey: ['requestDatas'],
    queryFn: () => retriveRequest("sepolia", address as `0x${string}`),
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000, 
  });

  // useEffect(() => {
  //   retriveRequest("sepolia", address as `0x${string}`).then((data) => {
  //     setRequestDatas(data);
  //   });
  // }, []);

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <span className="loading loading-ring text-black w-[100px] h-[100px]"></span>
    </div>
  )

  return (
    <div className="mt-10 mb-4">
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-x-10 gap-y-10 mt-10 justify-items-center items-center">
        {requestDatas.map((requestData, index) => {
          const {
            env,
            eventId,
            eventName,
            startDate,
            endDate,
            location,
            price,
            registerDate,
            imageUrl,
          } = requestData.contentData;
          if (env === "test") {
            return (
              <MyTicketCard
              key={index}
              eventId={eventId}
              eventName={eventName}
              startDate={startDate}
              endDate={endDate}
              location={location}
              price={price}
              registerDate={registerDate}
              imageUrl={imageUrl}
              requestData={requestData}
            />
            );
          }
        })}
      </div>
    </div>
  );
}

export default Page;
