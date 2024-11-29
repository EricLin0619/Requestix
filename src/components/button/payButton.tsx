import { useEthersV5Provider } from "@/hooks/ethers-v5-provider";
import { useEthersV5Signer } from "@/hooks/ethers-v5-signer";
import { storageChains } from "@/config/storageChains";
import { Types, RequestNetwork } from "@requestnetwork/request-client.js";
import { hasSufficientFunds, payRequest } from "@requestnetwork/payment-processor";
import {
  approveErc20,
  hasErc20Approval,
} from "@requestnetwork/payment-processor";
import { getPaymentNetworkExtension } from "@requestnetwork/payment-detection";

function PayButton({
  requestData,
  payerAddress,
  gatewayChain,
}: {
  requestData: Types.IRequestData;
  payerAddress: `0x${string}`;
  gatewayChain: string;
}) {
  const provider = useEthersV5Provider();
  const signer = useEthersV5Signer();
  const requestClient = new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: storageChains.get(gatewayChain)!.gateway,
    },
  });

  async function approveRequest() {
    try {
      console.log("test")
      const _request = await requestClient.fromRequestId(
        requestData!.requestId
      );
      const _requestData = _request.getData();
      alert(`Checking if payer has sufficient funds...`);
      const _hasSufficientFunds = await hasSufficientFunds({
        request: _requestData,
        address: payerAddress as string,
        providerOptions: { provider: provider },
      });
      console.log(`_hasSufficientFunds = ${_hasSufficientFunds}`);
      alert(`_hasSufficientFunds = ${_hasSufficientFunds}`);
      // if (!_hasSufficientFunds) {
      //   setStatus(APP_STATUS.REQUEST_CONFIRMED);
      //   return;
      // }
      if (
        getPaymentNetworkExtension(requestData)?.id ===
        Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT
      ) {
        alert(`ERC20 Request detected. Checking approval...`);
        const _hasErc20Approval = await hasErc20Approval(
          _requestData,
          payerAddress as string,
          provider
        );
        console.log(`_hasErc20Approval = ${_hasErc20Approval}`);
        alert(`_hasErc20Approval = ${_hasErc20Approval}`);
        if (!_hasErc20Approval) {
          const approvalTx = await approveErc20(_requestData, signer);
          await approvalTx.wait(2);
        }
      }
      // setStatus(APP_STATUS.APPROVED);
    } catch (err) {
      // setStatus(APP_STATUS.REQUEST_CONFIRMED);
      alert(JSON.stringify(err));
    }
  }

  async function payTheRequest() {
    try {
      console.log(requestData)
      console.log(requestData.requestId);
      const _request = await requestClient.fromRequestId(requestData!.requestId);
      console.log(_request)
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

  return <button 
  className="btn btn-primary"
  onClick={async () => {
    await approveRequest();
    payTheRequest();
  }
  }>Pay Request</button>;
}

export default PayButton;
