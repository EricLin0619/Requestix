import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { useStorageUpload } from "@thirdweb-dev/react";
import ABI from "@/contracts/ABI.json";
import { useState } from "react";
import { createEventOnChain } from "@/service/contractService";
import toast from "react-hot-toast";

function CreateEventButton({
  inputCheck,
  setLoading,
  eventName,
  location,
  price,
  maxRegistrations,
  startDate,
  endDate,
  saleStartDate,
  saleEndDate,
  image,
}: {
  inputCheck: () => boolean;
  setLoading: (loading: boolean) => void;
  eventName: string;
  location: string;
  price: string;
  maxRegistrations: number;
  startDate: number;
  endDate: number;
  saleStartDate: number;
  saleEndDate: number;
  image: File | null;
}) {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const { mutateAsync: upload } = useStorageUpload();
  const [status, setStatus] = useState<'idle' | 'uploading' | 'creating' | 'confirming'>('idle');

  async function upLoadMetaData() {
    let imageCid: string[] | null = null;
    // upload image to IPFS
    if (image) {
      imageCid = await upload({ data: [image] });
      console.log("Uploaded event image to IPFS with CID:", imageCid);
    }

    // upload metadata to IPFS
    const metaData = [
      {
        eventName: eventName,
        location: location,
        price: price,
        startDate: startDate,
        endDate: endDate,
        saleStartDate: saleStartDate,
        saleEndDate: saleEndDate,
        image: imageCid?.[0],
      },
    ];
    const metaDataCid = await upload({ data: metaData });
    console.log("Uploaded metadata to IPFS with CID:", metaDataCid);
    return metaDataCid;
  }

  async function handleCreateEvent() {
    if (!inputCheck()) {
      return;
    }
    try {
      setLoading(true);
      setStatus('uploading');
      const cid = await upLoadMetaData();
      
      setStatus('creating');
      await createEventOnChain(cid[0], maxRegistrations, saleStartDate, saleEndDate);
      
      setStatus('confirming');
      // 交易確認完成後
      setStatus('idle');
      toast.success("Event created successfully");
      setLoading(false);
    } catch (error) {
      toast.error("Error creating event");
      setStatus('idle');
      setLoading(false);
    } finally {
      // 確保無論成功或失敗，都會重置 loading 狀態
      setLoading(false);
    }
  }

  return (
    <button className="btn btn-primary" onClick={handleCreateEvent} disabled={status !== 'idle'}>
      {status === 'uploading' && "Uploading to IPFS..."}
      {status === 'creating' && "Creating Event..."}
      {status === 'confirming' && "Confirming Transaction..."}
      {status === 'idle' && "Create Event"}
    </button>
  );
}

export default CreateEventButton;
