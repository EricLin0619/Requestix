import { writeContract, prepareWriteContract } from "wagmi/actions";
import ABI from "../contracts/ABI.json";

export async function createEventOnChain(metaDataCid: string, maxRegistrations: number) {
  const config = await prepareWriteContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    abi: ABI,
    chainId: 11155111, //sepolia
    functionName: "createEvent",
    args: [metaDataCid, maxRegistrations],
  })

  await writeContract(config);
}
