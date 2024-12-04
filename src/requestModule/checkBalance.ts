import { formatUnits } from "viem";
import { RequestNetwork, Types } from "@requestnetwork/request-client.js";
import { storageChains } from "@/config/storageChains";

export async function checkBalance(gatewayChain: string, identityAddress: string) {
    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: storageChains.get(gatewayChain)!.gateway,
      },
    });
  
    const requests = await requestClient.fromIdentity({
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: identityAddress,
    });
    
    const requestDatas = requests.map((request) => request.getData());
    console.log(requestDatas);
    return requestDatas;
  }