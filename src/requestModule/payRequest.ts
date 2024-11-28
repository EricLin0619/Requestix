import { storageChains } from "@/config/storageChains";
import { Types, RequestNetwork } from "@requestnetwork/request-client.js";
import {
  approveErc20,
  hasErc20Approval,
  hasSufficientFunds,
  payRequest,
} from "@requestnetwork/payment-processor";
import { useEthersV5Signer } from "@/hooks/ethers-v5-signer";

async function payTheRequest(
  requestData: Types.IRequestData,
  gatewayChain: string
) {
  const requestClient = new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: storageChains.get(gatewayChain)!.gateway,
    },
  });

  const signer = useEthersV5Signer();

  try {
    const _request = await requestClient.fromRequestId(requestData!.requestId);
    let _requestData = _request.getData();
    const paymentTx = await payRequest(_requestData, signer);
    await paymentTx.wait(2);

    // Poll the request balance once every second until payment is detected
    // TODO Add a timeout
    while (_requestData.balance?.balance! < _requestData.expectedAmount) {
      _requestData = await _request.refresh();
      alert(`balance = ${_requestData.balance?.balance}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    alert(`payment detected!`);
    // setRequestData(_requestData);
    // setStatus(APP_STATUS.REQUEST_PAID);
  } 
  catch (err) {
    // setStatus(APP_STATUS.APPROVED);
    console.log(err);
  }
}

export default payTheRequest;