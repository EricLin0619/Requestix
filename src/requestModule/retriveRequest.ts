import { RequestNetwork, Types } from "@requestnetwork/request-client.js";

async function retriveRequest(chainName: string, identityAddress: string) {
  const requestClient = new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: "https://sepolia.gateway.request.network/",
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

export default retriveRequest;