import {
  RequestNetwork,
  Types,
  Utils,
} from "@requestnetwork/request-client.js";
import { currencies } from "@/config/currency";
import { parseUnits, WalletClient, zeroAddress } from "viem";
import { storageChains } from "@/config/storageChains";
import { Web3SignatureProvider } from "@requestnetwork/web3-signature";

export async function createRequest(
  payeeIdentity: `0x${string}`,
  payerIdentity: `0x${string}`,
  gatewayChain: string,
  currencyName: string,
  txContent: object,
  walletClient: WalletClient
) {
  const web3SignatureProvider = new Web3SignatureProvider(walletClient)
  const requestClient = new RequestNetwork({
    nodeConnectionConfig: {
      baseURL: storageChains.get(gatewayChain)!.gateway,
    },
    signatureProvider: web3SignatureProvider,
  });
  const requestCreateParameters: Types.ICreateRequestParameters = {
    requestInfo: {
      currency: {
        type: currencies.get(currencyName)!.type,
        value: currencies.get(currencyName)!.value,
        network: currencies.get(currencyName)!.network,
      },
      expectedAmount: parseUnits(
        "100",
        currencies.get(currencyName)!.decimals
      ).toString(),
      payee: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payeeIdentity
      },
      payer: {
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: payerIdentity
      },
      timestamp: Utils.getCurrentTimestampInSecond(),
    },
    paymentNetwork: {
      id: Types.Extension.PAYMENT_NETWORK_ID.ERC20_FEE_PROXY_CONTRACT,
      parameters: {
        paymentNetworkName: currencies.get(currencyName)!.network,
        paymentAddress: payeeIdentity, // paymentRecipient
        feeAddress: zeroAddress,
        feeAmount: "0",
      },
    },
    contentData: txContent,
    // {
    //   // Tip: Consider using rnf_invoice v0.0.3 format from @requestnetwork/data-format
    //   reason: "Payment for goods",
    //   dueDate: "2020-01-01",
    //   builderId: "request-network",
    //   createdWith: "CodeSandBox",
    // },
    signer: {
      type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
      value: payeeIdentity, // payeeIdentity
    },
  };

  const request = await requestClient.createRequest(requestCreateParameters);
  console.log(request);
}
