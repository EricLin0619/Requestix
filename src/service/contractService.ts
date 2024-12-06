import { writeContract, prepareWriteContract, waitForTransaction, readContract } from "@wagmi/core";
import ABI from "../contracts/ABI.json";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { BytesLike, ethers } from "ethers";
import Web3 from "web3";

const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc.sepolia.org"
);
const signer = new ethers.Wallet(
  process.env.NEXT_PUBLIC_PRIVATE_KEY as BytesLike,
  provider
);
const contract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`, ABI, signer);

// web3
const web3 = new Web3(new Web3.providers.HttpProvider("https://ethereum-sepolia-rpc.publicnode.com"));
const web3Contract = new web3.eth.Contract(ABI, process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`);

export async function createEventOnChain(metaDataCid: string, maxRegistrations: number, saleStartDate: number, saleEndDate: number) {
  console.log(metaDataCid, maxRegistrations, saleStartDate, saleEndDate)
  const config = await prepareWriteContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: ABI,
    chainId: 11155111, //sepolia
    functionName: "createEvent",
    args: [metaDataCid, maxRegistrations, saleStartDate, saleEndDate],
  })

  const { hash } = await writeContract(config);
  console.log("txHash is",hash)
  // 等待交易被確認
  // const receipt = await waitForTransaction({
  //   hash,
  // });
  // console.log("receipt is",receipt)
  return hash;
}

export async function eventCount() {
  const sdk = new ThirdwebSDK("sepolia", {
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string,
  });
  const contract = await sdk.getContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`);
  const count = await contract.call("eventCount");
  return count;
}

// export async function getAllEvents() {
//   const sdk = new ThirdwebSDK("sepolia", {
//     clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string,
//   });
//   const contract = await sdk.getContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`);
//   const events = []

//   const count = await contract.call("eventCount");
  
//   for (let i = 1; i <= count; i++) {
//     const data = await contract.call("events", [i]);
//     events.push(data);
//   }
//   return events;
// }

// export async function getAllEvents() {
//   const count = await readContract({
//     address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
//     abi: ABI,
//     functionName: "eventCount",
//   }) as number;
//   console.log(count)
//   const events: any[] = []
//   for (let i = 1; i <= count; i++) {
//     const data = await readContract({
//       address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
//       abi: ABI,
//       functionName: "events",
//       args: [i],
//     });
//     events.push(data);
//   }
//   return events;
// }

export async function getAllEvents() {
  const count = await web3Contract.methods.eventCount().call() as number;
  console.log(count)
  const events = []
  for (let i = 1; i <= count; i++) {
    const data = await web3Contract.methods.getEvent(i).call();
    events.push(data);
  }
  console.log(events)
  return events;
}

export async function checkRegistered(eventId: number, payerAddress: `0x${string}`) {
  const data = await web3Contract.methods.isRegistered(eventId, payerAddress).call();
  return data;
}

export async function registerEvent(eventId: number, payerAddress: `0x${string}`) {
  console.log(eventId, payerAddress)
  const data = await contract.registerForEvent(eventId, payerAddress);
}