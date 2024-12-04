import { RequestNetwork, Types } from "@requestnetwork/request-client.js";
import { storageChains } from "@/config/storageChains";
import { useEthersV5Signer } from "@/hooks/ethers-v5-signer";

export default async function cancelRequest(
  gatewayChain: string,
  identityAddress: string
) {

  const signer = useEthersV5Signer();
  const requestClient = new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: storageChains.get(gatewayChain)!.gateway,
    },
  }); // use once

  const requests = await requestClient.fromIdentity(
    {
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: identityAddress,
    },
    {
      from: 0,
      to: 0,
    },
    {
      page: 1,
      pageSize: 100,
    }
  );

  const requestDatas = requests.map((request) => {
    const requestData = request.cancel(
      {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: identityAddress,
      },
      signer
    );
    console.log(requestData);
    return requestData;
  });
}
