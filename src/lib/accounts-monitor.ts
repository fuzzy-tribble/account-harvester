import "./env";
import { TransactionRequest } from "@ethersproject/abstract-provider";
import { Interface } from "@ethersproject/abi";
import { JsonRpcProvider } from "@ethersproject/providers";

// TODO - get total account transaciotns from network provider.getTotalTransactionCount()

// HealFactor Formula Info:
// Note to self - if use has collateral in more unstable markets I should prob check his/her health factor more frequencly
const collateralStabilityRank = 0.30498; // percentile ranking of collateral stability
const accountActivityRank = 0.23; // percentile ranking of account activity
const baseUpdateFreq = 1;
const hfLiquidationTrigger = 1;

const currentHf = 3;
const updateFreq =
  baseUpdateFreq *
  (1 / (currentHf - hfLiquidationTrigger)) *
  accountActivityRank;

const iface: Interface = new Interface(aave.ethereum.lendingPoolAbi);

const getAccountInfo = async (provider: JsonRpcProvider, account: string) => {
  const txReq: TransactionRequest = {
    to: aave.ethereum.proxyAddress,
    data: iface.encodeFunctionData("getUserAccountData", [account]),
  };
  const res = await provider.call(txReq);
  const decodedResult = iface.decodeFunctionResult("getUserAccountData", res);
  return decodedResult;
};

const monitor = async () => {
  // check db for accounts ready to be updated
  // provider.on("pending", (tx) => {
  //   // Emitted when any new pending transaction is noticed
  // });
};
