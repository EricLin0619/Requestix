import { writeContract, prepareWriteContract, waitForTransaction, readContract } from "wagmi/actions";
import ABI from "../contracts/ABI.json";

export async function createEventOnChain(metaDataCid: string, maxRegistrations: number) {
  const config = await prepareWriteContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: ABI,
    chainId: 11155111, //sepolia
    functionName: "createEvent",
    args: [metaDataCid, maxRegistrations],
  })

  const { hash } = await writeContract(config);
  // 等待交易被確認
  const receipt = await waitForTransaction({
    hash,
  });
  
  return receipt;
}

export async function eventCount(): Promise<number> {
  const data = await readContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: ABI,
    functionName: "eventCount",
    blockTag: "latest",
  });
  console.log(data)
  return data as number;
}

export async function getAllEvents() {
  const events = []
  const count = await eventCount();
  for (let i = 1; i <= count; i++) {
    const data = await readContract({
      address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
      abi: ABI,
      functionName: "getEvent",
      args: [i],
    });
    events.push(data);
  }
  return events;
}

export async function getEvent(eventId: number) {
  const data = await readContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: ABI,
    functionName: "getEvent",
    args: [eventId],
  });
  return data;
}