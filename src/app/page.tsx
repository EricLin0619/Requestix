"use client";
import "@rainbow-me/rainbowkit/styles.css";
import TicketCard from "@/components/ticketCard";
import { getAllEvents } from "@/service/contractService";
import { useQuery } from "@tanstack/react-query";
import { MediaRenderer } from "@thirdweb-dev/react";
import { useState, useEffect } from "react";

type FilterType = "all" | "onGoing" | "upComing" | "ended";
export default function Home() {
  const { data: events = [], isLoading } = useQuery<any[]>({
    queryKey: ["events"],
    queryFn: getAllEvents,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });
  const [filter, setFilter] = useState<FilterType>("all");

  const tabs: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "On Going", value: "onGoing" },
    { label: "Up Coming", value: "upComing" },
    { label: "Ended", value: "ended" },
  ];

  const filterEvents = (event: any, filter: string) => {
    const now = Math.floor(Date.now() / 1000);
    const saleStartDate = parseInt(event[5]._hex);
    const saleEndDate = parseInt(event[6]._hex);

    switch (filter) {
      case "onGoing":
        return saleStartDate <= now && saleEndDate >= now;
      case "upComing":
        return saleStartDate > now;
      case "ended":
        return saleEndDate < now;
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
      <div role="tablist" className="tabs tabs-bordered w-[40%]">
        {tabs.map((tab) => (
          <a
            key={tab.value}
            role="tab"
            className={`tab transition-all duration-300 ease-in-out hover:bg-gray-100 text-black 
              ${filter === tab.value ? "tab-active after:transition-all" : ""}`}
            onClick={() => setFilter(tab.value)}
          >
            {tab.label}
          </a>
        ))}
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-x-10 gap-y-10 mt-10 justify-items-center items-center">
        {events.map((event, index) => {
          const ipfsUrl = event[0];
          const organizer = event[1];
          const maxRegistrations = event[2];
          const registeredCount = event[3];
          const isActive = event[4];
          const eventId = index + 1;
          if (filterEvents(event, filter)) {
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
          }
        })}
      </div>
      {/* <MediaRenderer src="ipfs://QmcqtH1hCvA2jbveNHnaSpj79KT5UdnHCVeGSCy6YLtMav/0" />
      <MediaRenderer src="ipfs://QmTn17XVX7AtRufh68USVedsBY8mAstZ6smYWCaBYkHAx7/0" /> */}
    </div>
  );
}
