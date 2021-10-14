import { Transaction } from "@ethersproject/transactions";
import { Interface, LogDescription } from "@ethersproject/abi/lib/interface";
import * as transactionData from "../data/transactions.json";
import { db } from "../lib/db";
import { aave, dataFile } from "../lib/config";
import { Log } from "@ethersproject/abstract-provider";

const iface = new Interface(aave.ethereum.lendingPoolAbi);

// Parse single transaction, list of transactions, or jsonfile if empty
export const parseTransactions = (
  txs: Log[] = transactionData.transactions,
  dbFileName: string = dataFile.parsedTransactions
) => {
  let parsedTxs: LogDescription[] = [];
  txs.map((tx) => {
    parsedTxs.push(iface.parseLog(tx));
  });
  const parsedTxsDb = db(dbFileName);
  parsedTxsDb.push("/parsedTxs", parsedTxs);
};

// // Example usage
// parseTransactions(); // OR
// parseTransactions(transactionData.transactions.slice(1, 3)); // OR
// parseTransactions([transactionData.transactions[0]]);

export const extractAccountsFromTxs = (
  txs: Log[] = transactionData.transactions,
  dbFileName: string = dataFile.accounts,
  initiatorArgIdx: number = 1
) => {
  let accounts: any[] = [];
  txs.map((tx) => {
    let parsedTx: LogDescription = iface.parseLog(tx);
    accounts.push({
      address: parsedTx.args[initiatorArgIdx],
      transactions: [tx.transactionHash],
    });
  });
  const accountsDb = db(dbFileName);
  accountsDb.push("/accounts", accounts);
};

// // Example Usage
// extractAccountsFromTxs();
