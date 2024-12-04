"use client";
import "@rainbow-me/rainbowkit/styles.css";
import MyTicketCard from "@/components/myTicketCard";
import { useEffect, useState } from "react";
import retriveRequest from "@/requestModule/retriveRequest";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";

type FilterType = "all" | "paid" | "expired" | "pending";

function Page() {
  const { address } = useAccount();
  const [filter, setFilter] = useState<FilterType>("all");

  const tabs: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Paid", value: "paid" },
    { label: "Expired", value: "expired" }
  ];

  const { data: requestDatas = [], isLoading } = useQuery<any[]>({
    queryKey: ["requestDatas"],
    queryFn: () => retriveRequest("sepolia", address as `0x${string}`),
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });

  const filterTickets = (requestData: any) => {
    const isPaid = requestData.expectedAmount === requestData.balance?.balance;
    const paymentDeadline =
      (requestData.contentData.registerDate + 60 * 60 * 24 * 2) * 1000;
    const isExpired = Date.now() > paymentDeadline;

    switch (filter) {
      case "paid":
        return isPaid;
      case "expired":
        return !isPaid && isExpired;
      case "pending":
        return !isPaid && !isExpired;
      default:
        return true;
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-ring text-black w-[100px] h-[100px]"></span>
      </div>
    );

  return (
    <div className="mt-10 mb-4">
      <div role="tablist" className="tabs tabs-bordered w-[30%]">
        {tabs.map((tab) => (
          <a
            key={tab.value}
            role="tab"
            className={`tab transition-all duration-300 ease-in-out hover:bg-gray-100 text-black 
              ${filter === tab.value ? 'tab-active after:transition-all' : ''}`}
            onClick={() => setFilter(tab.value)}
          >
            {tab.label}
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-x-10 gap-y-10 mt-10 justify-items-center items-center">
        {requestDatas
          .filter((requestData) => requestData.contentData.env === "test")
          .filter(filterTickets)
          .map((requestData, index) => {
            const {
              eventId,
              eventName,
              startDate,
              endDate,
              location,
              price,
              registerDate,
              imageUrl,
            } = requestData.contentData;

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
          })}
      </div>
    </div>
  );
}

export default Page;
