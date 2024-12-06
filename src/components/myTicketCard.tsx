"use client";

import Countdown from "@/components/countDown";
import { useAccount } from "wagmi";
import { convertIpfsUrl } from "../util";
import PayButton from "@/components/button/payButton";
import { Types } from "@requestnetwork/request-client.js";
import { useState } from "react";

function MyTicketCard({
  eventId,
  eventName,
  startDate,
  endDate,
  location,
  price,
  registerDate,
  imageUrl,
  requestData,
}: {
  eventId: number;
  eventName: string;
  startDate: number;
  endDate: number;
  location: string;
  price: number;
  registerDate: number;
  imageUrl: string;
  requestData: Types.IRequestData;
}) {
  const { address } = useAccount();
  const [isProcessing, setIsProcessing] = useState(false);
  const isPaid = requestData.expectedAmount === requestData.balance?.balance;
  const paymentDeadline = (registerDate + 60 * 60 * 24 * 2) * 1000;
  const isExpired = Date.now() > paymentDeadline;

  return (
    <div className="w-[100%] h-[380px] rounded-[8px] shadow-[0px_4px_12px_9px_rgba(0,_0,_0,_0.1)]">
      {isProcessing && (
        <div className="fixed inset-0 bg-gray-800/75 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3 p-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-white font-medium">Processing...</p>
          </div>
        </div>
      )}
      <div className="w-full h-[36px] flex items-center pl-4">
        <div className={`px-2 h-[20px] ${
          isPaid 
            ? 'bg-[#27AE60]' 
            : isExpired 
              ? 'bg-[#E74C3C]' 
              : 'bg-[#8E44AD]'
        } flex items-center justify-center rounded-[4px] text-sm mr-1 text-white`}>
          {isPaid 
            ? "Payment completed" 
            : isExpired 
              ? "Payment expired"
              : `Pay before ${new Date(paymentDeadline).toLocaleDateString()}`
          }
        </div>
      </div>
      <img
        src={imageUrl ? convertIpfsUrl(imageUrl) : "event.jpg"}
        alt="yoasobi"
        className="w-[100%] h-[150px] object-cover"
      />
      <div className="p-4 text-black">
        <p className="text-xl font-bold mb-3">{eventName}</p>
        <p>
          Date: {new Date(startDate * 1000).toLocaleDateString()} -{" "}
          {new Date(endDate * 1000).toLocaleDateString()}
        </p>
        <p>Location: {location}</p>
        <p>price: {price}</p>
      </div>
      <div className="w-full h-[36px] flex items-center px-4 pb-2">
        {!isPaid && !isExpired && (
          <>
            <Countdown endTime={registerDate + 60 * 60 * 24 * 2} />
            <PayButton requestData={requestData} payerAddress={address as `0x${string}`} gatewayChain="sepolia" eventId={eventId} setIsProcessing={setIsProcessing} />
          </>
        )}
      </div>
    </div>
  );
}

export default MyTicketCard;
