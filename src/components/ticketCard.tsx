import Countdown from "./countDown";
import { convertIpfsUrl } from "../util";
import { useState, useEffect } from "react";

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
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState(0);
  const [startDate, setStartDate] = useState(0);
  const [endDate, setEndDate] = useState(0);
  const [saleStartDate, setSaleStartDate] = useState(0);
  const [saleEndDate, setSaleEndDate] = useState(0);
  const [imageUrl, setImageUrl] = useState("");

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
  }, []);

  function formatUnixTimestamp(timestamp: number): string {
    const date = new Date(timestamp * 1000); // 將秒轉換為毫秒
    return date.toLocaleDateString(); // 使用本地日期格式
  }

  return (
    <div className="w-[100%] h-[380px] rounded-[8px] shadow-[0px_4px_12px_9px_rgba(0,_0,_0,_0.1)]">
      <div className="w-full h-[36px] flex items-center pl-4">
        <div className="w-[25%] h-[20px] bg-[#2bae0a] flex items-center justify-center rounded-[4px] text-sm mr-1">
          For Sale
        </div>
        <div className="text-sm bg-[#2bae0a] bg-opacity-15 rounded-[4px] px-2">
          <span className="text-[#2bae0a]">Three Days left</span>
        </div>
      </div>
      <img
        src={imageUrl ? convertIpfsUrl(imageUrl) : "/event.jpg"}
        alt="yoasobi"
        className="w-[100%] h-[150px] object-cover"
      />
      <div className="p-4 text-black">
        <p className="text-xl font-bold mb-3">{eventName}</p>
        <p>Date: {formatUnixTimestamp(startDate)} - {formatUnixTimestamp(endDate)}</p>
        <p>Location: {location}</p>
        <p>price: {price}</p>
      </div>
      <div className="w-full h-[36px] flex items-center px-4 pb-2">
        <Countdown endTime={1734127074} />
        <button
          className="ml-auto w-[100px] h-[33px] bg-[#2bae0a] text-white rounded-[4px] 
          hover:bg-[#239108] active:bg-[#1c7206] active:transform active:scale-95 
          transition-all duration-200 ease-in-out"
        >
          Buy now
        </button>
      </div>
    </div>
  );
}

export default TicketCard;
