import "./lib/env";
import { EventFilter } from "@ethersproject/contracts";
import { db } from "./lib/db";
import { queryChain } from "./lib/query-bc";
import { connect } from "./lib/network";
import { nwProtocols, dataFiles } from "./lib/config";
import { parseTransactions, extractAccountsFromTxs } from "./helpers/parser";

const start = async (
  network: Network,
  protocol: Protocol,
  mode: RunMode = "replace"
) => {
  const nwProtocol = nwProtocols[network][protocol];
  const { provider, contract } = await connect(
    nwProtocols[network].rpcUrl,
    nwProtocol.proxyAddress,
    nwProtocol.proxyAbi
  );
  const accountActivityFilter: EventFilter = {
    address: nwProtocol.proxyAddress,
    topics: nwProtocol.topicFilters.accountActivity,
  };

  if (mode == "replace") {
    // Query chain and update txs-db file
    queryChain(contract, accountActivityFilter, dataFiles.transactions, -100);
    // Update parsed transactions
    parseTransactions();
    // Update extract account from txs-db file
    extractAccountsFromTxs();
  }

  // Listen for account activity and add new accounts to db
  const txsDb = db(dataFiles.transactions);
  contract.on(accountActivityFilter, (tx) => {
    console.log(tx);
    txsDb.push("/transactions", tx);
  });

  // TODO - STOPPED HERE
  // accountsHealthManager.start(updateFreqFormula)
};

// Example Usage
start("ethereum", "aave");
