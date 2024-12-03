import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { useStorageUpload } from "@thirdweb-dev/react";
import ABI from "@/contracts/ABI.json";
import { useState } from "react";
import { createEventOnChain } from "@/service/createEvent";

function CreateEventButton({
  handleSubmit,
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
  handleSubmit: () => boolean;
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
    if(!handleSubmit()) {
      return
    }
    try {
      const cid = await upLoadMetaData();
      await createEventOnChain(cid[0], maxRegistrations);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  }

  return (
    <button className="btn btn-primary" onClick={handleCreateEvent}>
      Create Event
    </button>
  );
}

export default CreateEventButton;
