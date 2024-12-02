"use client";

import Countdown from "@/components/countDown";

function MyTicketCard() {
    return ( 
        <div className="w-[100%] h-[380px] rounded-[8px] shadow-[0px_4px_12px_9px_rgba(0,_0,_0,_0.1)]">
      <div className="w-full h-[36px] flex items-center pl-4">
        <div className="px-2 h-[20px] bg-[#8E44AD] flex items-center justify-center rounded-[4px] text-sm mr-1">Pay before 2024-11-28</div>
      </div>
      <img
        src="/yoasobi.jpg"
        alt="yoasobi"
        className="w-[100%] h-[150px] object-cover"
      />
      <div className="p-4 text-black">
        <p className="text-xl font-bold mb-3">Yoasobi 2024 Concert</p>
        <p>Date: 2024-11-28</p>
        <p>Location: Tokyo Dome</p>
        <p>price: 10000</p>
      </div>
      <div className="w-full h-[36px] flex items-center px-4 pb-2">
        <Countdown endTime={1734127074} />
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