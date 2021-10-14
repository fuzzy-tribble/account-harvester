import "./env";
import { Contract, ContractInterface, ethers } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";

// // Uncomment to run example
// import { aave } from "./config";
// const ethInfuraRpc: string = process.env.ETHEREUM_NODE_URL || "";

export const connect = async (
  rpcUrl: string,
  address: string,
  abi: ContractInterface
) => {
  console.log(`Connecting to network at: ${rpcUrl}`);
  const provider: JsonRpcProvider = new ethers.providers.JsonRpcProvider(
    rpcUrl
  );
  const contract: Contract = new ethers.Contract(address, abi, provider);
  provider.getNetwork().then((res) => {
    console.log(`Connected to network: ${res.name}`);
  });
  return { provider, contract };
};

// // Example
// connect(ethInfuraRpc, aave.ethereum.proxyAddress, aave.ethereum.proxyAbi);
