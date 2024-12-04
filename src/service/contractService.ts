import { writeContract, prepareWriteContract, waitForTransaction, readContract } from "@wagmi/core";
import ABI from "../contracts/ABI.json";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

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

// export async function eventCount(): Promise<number> {
//   const data = await readContract({
//     address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
//     abi: ABI,
//     functionName: "eventCount",
//     blockTag: "latest",
//   });
//   console.log(data)
//   return data as number;
// }

export async function eventCount() {
  const sdk = new ThirdwebSDK("sepolia", {
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string,
  });
  const contract = await sdk.getContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`);
  const count = await contract.call("eventCount");
  return count;
}

export async function getAllEvents() {
  const sdk = new ThirdwebSDK("sepolia", {
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string,
  });
  const contract = await sdk.getContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`);
  const events = []

  const count = await contract.call("eventCount");
  console.log(count)
  
  for (let i = 1; i <= count; i++) {
    const data = await contract.call("events", [i]);
    console.log(data)
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
  console.log(data)
  return data;
}