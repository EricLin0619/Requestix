"use client";

import Countdown from "@/components/countDown";
import { useAccount } from "wagmi";

function MyTicketCard(
  {
    eventId,
    eventName,
    startDate,
    endDate,
    location,
    price,
    registerDate
  }: {
    eventId: number,
    eventName: string,
    startDate: number,
    endDate: number,
    location: string,
    price: number,
    registerDate: number
  }
) {
  const { address } = useAccount();
    return ( 
        <div className="w-[100%] h-[380px] rounded-[8px] shadow-[0px_4px_12px_9px_rgba(0,_0,_0,_0.1)]">
      <div className="w-full h-[36px] flex items-center pl-4">
        <div className="px-2 h-[20px] bg-[#8E44AD] flex items-center justify-center rounded-[4px] text-sm mr-1">Pay before 2024-11-28</div>
      </div>
      <img
        src="/event.jpg"
        alt="yoasobi"
        className="w-[100%] h-[150px] object-cover"
      />
      <div className="p-4 text-black">
        <p className="text-xl font-bold mb-3">{eventName}</p>
        <p>Date: {new Date(startDate * 1000).toLocaleDateString()} - {new Date(endDate * 1000).toLocaleDateString()}</p>
        <p>Location: {location}</p>
        <p>price: {price}</p>
      </div>
      <div className="w-full h-[36px] flex items-center px-4 pb-2">
        <Countdown endTime={registerDate + 60 * 60 * 24 * 2} />
        <button className="ml-auto w-[100px] h-[33px] bg-[#9B59B6] text-white rounded-[4px] 
          hover:bg-[#8E44AD] active:bg-[#6C3483] active:transform active:scale-95 
          transition-all duration-200 ease-in-out">
          Pay Now
        </button>
      </div>
    </div>
     );
}

export default MyTicketCard;