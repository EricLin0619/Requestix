import { useEthersV5Provider } from "@/hooks/ethers-v5-provider";
import { useEthersV5Signer } from "@/hooks/ethers-v5-signer";
import { storageChains } from "@/config/storageChains";
import { Types, RequestNetwork } from "@requestnetwork/request-client.js";
import {
  hasSufficientFunds,
  payRequest,
} from "@requestnetwork/payment-processor";
import {
  approveErc20,
  hasErc20Approval,
} from "@requestnetwork/payment-processor";
import { getPaymentNetworkExtension } from "@requestnetwork/payment-detection";
import { registerEvent } from "@/service/contractService";
import toast from 'react-hot-toast';

function PayButton({
  requestData,
  payerAddress,
  gatewayChain,
  eventId,
  setIsProcessing,
}: {
  requestData: Types.IRequestData;
  payerAddress: `0x${string}`;
  gatewayChain: string;
  eventId: number;
  setIsProcessing: (isProcessing: boolean) => void;
}) {
  const provider = useEthersV5Provider();
  const signer = useEthersV5Signer();
  const requestClient = new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: storageChains.get(gatewayChain)!.gateway,
    },
  });

  async function approveRequest() {
    console.log(requestData);
    try {
      console.log("test");
      const _request = await requestClient.fromRequestId(
        requestData!.requestId
      );
      const _requestData = _request.getData();
      const toastId = toast.loading(`Checking if payer has sufficient funds...`, {
        position: 'bottom-right',
      });
      const _hasSufficientFunds = await hasSufficientFunds({
        request: _requestData,
        address: payerAddress as string,
        providerOptions: { provider: provider },
      });
      // check if the payer has enough balance to pay the request
      console.log(`_hasSufficientFunds = ${_hasSufficientFunds}`);
      if (!_hasSufficientFunds) {
        toast.error("You don't have enough balance to pay the request", {
          id: toastId,
        });
        return;
      } else {
        toast.success("You have enough balance to pay the request", {
          id: toastId,
        });
      }

      // check if the request is ERC20
      if (
        getPaymentNetworkExtension(requestData)?.id ===
        Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT
      ) {
        const erc20ToastId = toast.loading(`ERC20 Request detected. Checking approval...`, {
          position: 'bottom-right',
        });
        const _hasErc20Approval = await hasErc20Approval(
          _requestData,
          payerAddress as string,
          provider
        );

        // check if the payer has enough approval to pay the request
        console.log(`_hasErc20Approval = ${_hasErc20Approval}`);
        if (_hasErc20Approval) {
          toast.success("You have enough approval to pay the request", {
            id: erc20ToastId,
          });
        } else {
          toast.error("You don't have enough approval to pay the request", {
            id: erc20ToastId,
          });
        }
        
        if (!_hasErc20Approval) {
          const approvalTx = await approveErc20(_requestData, signer);
          await approvalTx.wait(2);
        }
      }
      // setStatus(APP_STATUS.APPROVED);
    } catch (err) {
      // setStatus(APP_STATUS.REQUEST_CONFIRMED);
      toast.error(JSON.stringify(err), {
        position: 'bottom-right',
      });
    }
  }

  async function payTheRequest() {
    try {
      const toastId = toast.loading('Processing payment...', {
        position: 'bottom-right',
      });
      
      const _request = await requestClient.fromRequestId(requestData!.requestId);
      let _requestData = _request.getData();
      const paymentTx = await payRequest(_requestData, signer);
      await paymentTx.wait(2);

      // 設置超時時間（例如：60秒）
      const timeout = Date.now() + 60000;
      
      while (_requestData.balance?.balance! < _requestData.expectedAmount) {
        if (Date.now() > timeout) {
          toast.error('Payment verification timeout', { id: toastId });
          throw new Error('Payment verification timeout');
        }

        _requestData = await _request.refresh();
        // 更新 toast 顯示進度
        toast.loading(
          `Payment processing: ${_requestData.balance?.balance} / ${_requestData.expectedAmount}`, 
          { id: toastId }
        );
        
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      toast.success('Payment completed successfully!', { id: toastId });
    } catch (err) {
      toast.error(`Payment failed`);
      console.error(err);
    }
  }

  return (
    <button
      className="ml-auto w-[100px] h-[33px] bg-[#9B59B6] text-white rounded-[4px] 
          hover:bg-[#8E44AD] active:bg-[#6C3483] active:transform active:scale-95 
          transition-all duration-200 ease-in-out"
      onClick={async () => {
        setIsProcessing(true);
        await approveRequest();
        await payTheRequest();
        await registerEvent(eventId, payerAddress);
        setIsProcessing(false);
      }}
    >
      Pay now
    </button>
  );
}

export default PayButton;
