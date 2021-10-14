import "./env";
import { Contract, EventFilter, utils } from "ethers";
import { ethers } from "ethers";
import { db } from "./db";
import { aave, dataFiles } from "./config";

// Uncomment to run example
import { JsonRpcProvider } from "@ethersproject/providers";

export const queryChain = async (
  contract: Contract,
  filter: EventFilter = aave.topicFilters.all as EventFilter,
  dbFileName: string = dataFiles.temp,
  blocks: number = -100
) => {
  const txsDb = db(dbFileName);
  contract.queryFilter(filter, blocks).then((res) => {
    console.log(`Events found...${res}`);
    txsDb.push("/transactions", res);
  });
};

// Example usage
const provider: JsonRpcProvider = new ethers.providers.JsonRpcProvider(
  process.env.ETHEREUM_NODE_URL || ""
);
const contract = new ethers.Contract(
  aave.ethereum.proxyAddress,
  aave.ethereum.proxyAbi,
  provider
);
const filter: EventFilter = {
  address: aave.ethereum.proxyAddress,
  topics: aave.topicFilters.all,
};
queryChain(contract, filter);
