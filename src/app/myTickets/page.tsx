"use client";
import "@rainbow-me/rainbowkit/styles.css";
import MyTicketCard from "@/components/myTicketCard";
import { eventCount } from "@/service/contractService";
import { useEffect, useState } from "react";

function Page() {

  useEffect(() => {
    eventCount().then((data) => {
      console.log(data);
    });
  }, []);

  return (
    <div className="mt-10 mb-4">
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-x-10 gap-y-10 mt-10 justify-items-center items-center">
        <MyTicketCard />
        <MyTicketCard />
        <MyTicketCard />
        <MyTicketCard />
      </div>
    </div>
  );
}

export default Page;
