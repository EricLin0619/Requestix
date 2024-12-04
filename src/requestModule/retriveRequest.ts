import { RequestNetwork, Types } from "@requestnetwork/request-client.js";
import { storageChains } from "@/config/storageChains";
import { formatUnits } from "viem";

async function retriveRequest(gatewayChain: string, identityAddress: string) {
  const requestClient = new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: storageChains.get(gatewayChain)!.gateway,
    },
  }); // use once

  const requests = await requestClient.fromIdentity({
    type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
    value: identityAddress,
  });

  const requestDatas = requests.map((request) => {
    const requestData = request.getData()
    return requestData
  });
  console.log(requestDatas);
  return requestDatas;
}

export default retriveRequest;