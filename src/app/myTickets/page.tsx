"use client";
import "@rainbow-me/rainbowkit/styles.css";
import MyTicketCard from "@/components/myTicketCard";
import { useEffect, useState } from "react";
import retriveRequest from "@/requestModule/retriveRequest";
import { useAccount } from "wagmi";
import { Types } from "@requestnetwork/request-client.js";

function Page() {
  const { address } = useAccount();
  const [requestDatas, setRequestDatas] = useState<any[]>([]);

  useEffect(() => {
    retriveRequest("sepolia", address as `0x${string}`).then((data) => {
      setRequestDatas(data);
    });
  }, []);

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
            />
            );
          }
        })}
      </div>
    </div>
  );
}

export default Page;
