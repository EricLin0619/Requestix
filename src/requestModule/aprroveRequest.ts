import { useEthersV5Provider } from "@/hooks/ethers-v5-provider";
import { useEthersV5Signer } from "@/hooks/ethers-v5-signer";
import { storageChains } from "@/config/storageChains";
import { Types, RequestNetwork } from "@requestnetwork/request-client.js";
import { hasSufficientFunds } from "@requestnetwork/payment-processor";
import { approveErc20, hasErc20Approval } from "@requestnetwork/payment-processor";
import { getPaymentNetworkExtension } from "@requestnetwork/payment-detection";

async function approveRequest(requestData: Types.IRequestData, payerAddress: `0x${string}`, storageChain: string) {
  const requestClient = new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: storageChains.get(storageChain)!.gateway,
    },
  });
  const provider = useEthersV5Provider();
  const signer = useEthersV5Signer();

  try {
    const _request = await requestClient.fromRequestId(requestData!.requestId);
    const _requestData = _request.getData();
    alert(`Checking if payer has sufficient funds...`);
    const _hasSufficientFunds = await hasSufficientFunds({
      request: _requestData,
      address: payerAddress as string,
      providerOptions: { provider: provider },
    });
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

export default approveRequest;
