import Countdown from "./countDown";


// ticket status: for sale, end, open for registration
function TicketCard() {
  return (
    <div className="w-[100%] h-[380px] rounded-[8px] shadow-[0px_4px_12px_9px_rgba(0,_0,_0,_0.1)]">
      <div className="w-full h-[36px] flex items-center pl-4">
        <div className="w-[25%] h-[20px] bg-[#2bae0a] flex items-center justify-center rounded-[4px] text-sm mr-1">For Sale</div>
        <div className="text-sm bg-[#2bae0a] bg-opacity-15 rounded-[4px] px-2">
            <span className="text-[#2bae0a]">Three Days left</span>
        </div>
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
        <Countdown endTime={1733127074} />
        <button className="ml-auto w-[100px] h-[33px] bg-[#2bae0a] text-white rounded-[4px] 
          hover:bg-[#239108] active:bg-[#1c7206] active:transform active:scale-95 
          transition-all duration-200 ease-in-out">
          Buy now
        </button>
      </div>
    </div>
  );
}

export default TicketCard;
