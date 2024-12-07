import Countdown from "./countDown";
import { convertIpfsUrl, calculateDaysLeft } from "../util";
import { useState, useEffect } from "react";
import { createRequest } from "../requestModule/createRequest";
import { useAccount, useWalletClient } from "wagmi";
import { WalletClient } from "viem";
import { checkRegistered } from "@/service/contractService";
import toast from "react-hot-toast";

// ticket status: for sale, end, open for registration
function TicketCard({
  metadataUrl,
  organizer,
  maxRegistrations,
  registeredCount,
  isActive,
  eventId,
}: {
  metadataUrl: string;
  organizer: string;
  maxRegistrations: number;
  registeredCount: number;
  isActive: boolean;
  eventId: number;
}) {
  const { address } = useAccount();
  const { data: walletClient, isError, isLoading } = useWalletClient();

  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState(0);
  const [startDate, setStartDate] = useState(0);
  const [endDate, setEndDate] = useState(0);
  const [saleStartDate, setSaleStartDate] = useState(0);
  const [saleEndDate, setSaleEndDate] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  async function fetchIpfsData(metadataUrl: string) {
    try {
      const response = await fetch(convertIpfsUrl(metadataUrl));
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching IPFS data:", error);
      throw error;
    }
  }

  useEffect(() => {
    console.log(metadataUrl);
    fetchIpfsData(metadataUrl).then((data) => {
      setEventName(data.eventName);
      setLocation(data.location);
      setPrice(data.price);
      setStartDate(data.startDate);
      setEndDate(data.endDate);
      setSaleStartDate(data.saleStartDate);
      setSaleEndDate(data.saleEndDate);
      setImageUrl(data?.image);
    });

    if (address && eventId) {
      checkRegistered(eventId, address as `0x${string}`).then((registered) => {
        setIsRegistered(registered as any);
      });
    }
  }, [address, eventId]);

  function formatUnixTimestamp(timestamp: number): string {
    const date = new Date(timestamp * 1000); // 將秒轉換為毫秒
    return date.toLocaleDateString(); // 使用本地日期格式
  }

  function getEventStatus(): { status: string; color: string } {
    const now = Math.floor(Date.now() / 1000); // 當前時間（秒）

    if (isRegistered) {
      return {
        status: "Registered",
        color: "#808080", // 灰色
      };
    } else if (now < saleStartDate) {
      return {
        status: "Upcoming",
        color: "#FF9900", // 橙色
      };
    } else if (now >= saleStartDate && now <= saleEndDate) {
      return {
        status: "For Sale",
        color: "#2bae0a", // 綠色
      };
    } else {
      return {
        status: "Ended",
        color: "#FF0000", // 紅色
      };
    }
  }

  const eventStatus = getEventStatus();

  return (
    <div className="w-[100%] h-[380px] rounded-[8px] shadow-[0px_4px_12px_9px_rgba(0,_0,_0,_0.1)]">
      <div className="w-full h-[36px] flex items-center pl-4">
        <div
          className="px-2 h-[20px] flex items-center justify-center rounded-[4px] text-sm mr-1 text-white"
          style={{ backgroundColor: eventStatus.color }}
        >
          {isRegistered ? "Registered" : eventStatus.status}
        </div>
        {!isRegistered && eventStatus.status === "For Sale" && (
          <div
            className="text-sm bg-opacity-15 rounded-[4px] px-2"
            style={{ backgroundColor: `${eventStatus.color}20` }}
          >
            <span style={{ color: eventStatus.color }}>
              {calculateDaysLeft(saleEndDate) === 0
                ? `${Math.ceil((saleEndDate * 1000 - Date.now()) / (1000 * 60 * 60))} hours left`
                : calculateDaysLeft(saleEndDate) === 1
                ? "1 day left"
                : `${calculateDaysLeft(saleEndDate)} Days left`}
            </span>
          </div>
        )}
        {eventStatus.status === "Upcoming" && (
          <div
            className="text-sm bg-opacity-15 rounded-[4px] px-2"
            style={{ backgroundColor: `${eventStatus.color}20` }}
          >
            <span style={{ color: eventStatus.color }}>
              {calculateDaysLeft(saleStartDate) === 0
                ? `${Math.ceil((saleStartDate * 1000 - Date.now()) / (1000 * 60 * 60))} hours until sale`
                : calculateDaysLeft(saleStartDate) === 1
                ? "1 day until sale"
                : `${calculateDaysLeft(saleStartDate)} Days until sale`}
            </span>
          </div>
        )}
      </div>
      <img
        src={imageUrl ? convertIpfsUrl(imageUrl) : "./event.jpg"}
        alt="yoasobi"
        className="w-[100%] h-[150px] object-cover"
      />
      <div className="p-4 text-black">
        <p className="text-xl font-bold mb-3">{eventName}</p>
        <p>
          Date: {formatUnixTimestamp(startDate)} -{" "}
          {formatUnixTimestamp(endDate)}
        </p>
        <p>Location: {location}</p>
        <p>price: {price} FAU</p>
      </div>
      <div className="w-full h-[36px] flex items-center px-4 pb-2">
        {eventStatus.status === "For Sale" && saleEndDate > 0 && (
          <Countdown endTime={saleEndDate} />
        )}
        {eventStatus.status === "Upcoming" && saleStartDate > 0 && (
          <Countdown endTime={saleStartDate} />
        )}
        <button
          onClick={async () => {
            console.log("creating request");
            await createRequest(
              organizer as `0x${string}`,
              address as `0x${string}`,
              price,
              "sepolia",
              "11155111_FAU",
              {
                contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
                eventId: eventId,
                eventName: eventName,
                organizer: organizer,
                location: location,
                price: `${price} FAU`,
                startDate: startDate,
                endDate: endDate,
                buyerAddress: address as `0x${string}`,
                registerDate: Math.floor(Date.now() / 1000),
                env: "test",
                imageUrl: imageUrl
              },
              walletClient as WalletClient
            )
            toast.success("Request created successfully", {
              position: 'bottom-right',
            });
            toast('Please pay in the next 48 hours!', {
              icon: '💵',
              position: 'bottom-right',
            });
            console.log("request created");
          }}
          className={`ml-auto w-[100px] h-[33px] text-white rounded-[4px] 
          transition-all duration-200 ease-in-out
          ${
            eventStatus.status === "For Sale" && !isRegistered
              ? "bg-[#2bae0a] hover:bg-[#239108] active:bg-[#1c7206] active:transform active:scale-95"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={eventStatus.status !== "For Sale" || isRegistered}
        >
          {isRegistered ? "Registered" : "Buy now"}
        </button>
      </div>
    </div>
  );
}

export default TicketCard;
