import "../src/lib/env";

import { EventFilter, utils } from "ethers";
import { ethers } from "ethers";
import {
  aaveTopics,
  aaveContractAddresses as addr,
  aaveContractAddresses,
} from "../src/lib/config";
import { db } from "../src/lib/db";
import { Interface } from "@ethersproject/abi";

const url: string = process.env.ETHEREUM_NODE_URL || "";
const proxyAddress: string = "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9";
const proxyAbi = [
  {
    inputs: [{ internalType: "address", name: "admin", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  { stateMutability: "payable", type: "fallback" },
  {
    inputs: [],
    name: "admin",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "implementation",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_logic", type: "address" },
      { internalType: "bytes", name: "_data", type: "bytes" },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "newImplementation", type: "address" },
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "newImplementation", type: "address" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];
const LendingPoolAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "reserve",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "borrowRateMode",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "borrowRate",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint16",
        name: "referral",
        type: "uint16",
      },
    ],
    name: "Borrow",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "reserve",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "onBehalfOf",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "uint16",
        name: "referral",
        type: "uint16",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "initiator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "asset",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "premium",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "referralCode",
        type: "uint16",
      },
    ],
    name: "FlashLoan",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "collateralAsset",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "debtAsset",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "debtToCover",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "liquidatedCollateralAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "liquidator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "receiveAToken",
        type: "bool",
      },
    ],
    name: "LiquidationCall",
    type: "event",
  },
  { anonymous: false, inputs: [], name: "Paused", type: "event" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "reserve",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
    ],
    name: "RebalanceStableBorrowRate",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "reserve",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: true,
        internalType: "address",
        name: "repayer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Repay",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "reserve",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "liquidityRate",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "stableBorrowRate",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "variableBorrowRate",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "liquidityIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "variableBorrowIndex",
        type: "uint256",
      },
    ],
    name: "ReserveDataUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "reserve",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
    ],
    name: "ReserveUsedAsCollateralDisabled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "reserve",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
    ],
    name: "ReserveUsedAsCollateralEnabled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "reserve",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "rateMode",
        type: "uint256",
      },
    ],
    name: "Swap",
    type: "event",
  },
  { anonymous: false, inputs: [], name: "Unpaused", type: "event" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "reserve",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [],
    name: "FLASHLOAN_PREMIUM_TOTAL",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "LENDINGPOOL_REVISION",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_NUMBER_RESERVES",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_STABLE_RATE_BORROW_SIZE_PERCENT",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "interestRateMode", type: "uint256" },
      { internalType: "uint16", name: "referralCode", type: "uint16" },
      { internalType: "address", name: "onBehalfOf", type: "address" },
    ],
    name: "borrow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "address", name: "onBehalfOf", type: "address" },
      { internalType: "uint16", name: "referralCode", type: "uint16" },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "balanceFromBefore", type: "uint256" },
      { internalType: "uint256", name: "balanceToBefore", type: "uint256" },
    ],
    name: "finalizeTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "receiverAddress", type: "address" },
      { internalType: "address[]", name: "assets", type: "address[]" },
      { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
      { internalType: "uint256[]", name: "modes", type: "uint256[]" },
      { internalType: "address", name: "onBehalfOf", type: "address" },
      { internalType: "bytes", name: "params", type: "bytes" },
      { internalType: "uint16", name: "referralCode", type: "uint16" },
    ],
    name: "flashLoan",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAddressesProvider",
    outputs: [
      {
        internalType: "contract ILendingPoolAddressesProvider",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "asset", type: "address" }],
    name: "getConfiguration",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "data", type: "uint256" },
        ],
        internalType: "struct DataTypes.ReserveConfigurationMap",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "asset", type: "address" }],
    name: "getReserveData",
    outputs: [
      {
        components: [
          {
            components: [
              { internalType: "uint256", name: "data", type: "uint256" },
            ],
            internalType: "struct DataTypes.ReserveConfigurationMap",
            name: "configuration",
            type: "tuple",
          },
          { internalType: "uint128", name: "liquidityIndex", type: "uint128" },
          {
            internalType: "uint128",
            name: "variableBorrowIndex",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "currentLiquidityRate",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "currentVariableBorrowRate",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "currentStableBorrowRate",
            type: "uint128",
          },
          {
            internalType: "uint40",
            name: "lastUpdateTimestamp",
            type: "uint40",
          },
          { internalType: "address", name: "aTokenAddress", type: "address" },
          {
            internalType: "address",
            name: "stableDebtTokenAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "variableDebtTokenAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "interestRateStrategyAddress",
            type: "address",
          },
          { internalType: "uint8", name: "id", type: "uint8" },
        ],
        internalType: "struct DataTypes.ReserveData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "asset", type: "address" }],
    name: "getReserveNormalizedIncome",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "asset", type: "address" }],
    name: "getReserveNormalizedVariableDebt",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getReservesList",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserAccountData",
    outputs: [
      { internalType: "uint256", name: "totalCollateralETH", type: "uint256" },
      { internalType: "uint256", name: "totalDebtETH", type: "uint256" },
      { internalType: "uint256", name: "availableBorrowsETH", type: "uint256" },
      {
        internalType: "uint256",
        name: "currentLiquidationThreshold",
        type: "uint256",
      },
      { internalType: "uint256", name: "ltv", type: "uint256" },
      { internalType: "uint256", name: "healthFactor", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserConfiguration",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "data", type: "uint256" },
        ],
        internalType: "struct DataTypes.UserConfigurationMap",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "address", name: "aTokenAddress", type: "address" },
      { internalType: "address", name: "stableDebtAddress", type: "address" },
      { internalType: "address", name: "variableDebtAddress", type: "address" },
      {
        internalType: "address",
        name: "interestRateStrategyAddress",
        type: "address",
      },
    ],
    name: "initReserve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract ILendingPoolAddressesProvider",
        name: "provider",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "collateralAsset", type: "address" },
      { internalType: "address", name: "debtAsset", type: "address" },
      { internalType: "address", name: "user", type: "address" },
      { internalType: "uint256", name: "debtToCover", type: "uint256" },
      { internalType: "bool", name: "receiveAToken", type: "bool" },
    ],
    name: "liquidationCall",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "address", name: "user", type: "address" },
    ],
    name: "rebalanceStableBorrowRate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "rateMode", type: "uint256" },
      { internalType: "address", name: "onBehalfOf", type: "address" },
    ],
    name: "repay",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "configuration", type: "uint256" },
    ],
    name: "setConfiguration",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bool", name: "val", type: "bool" }],
    name: "setPause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "address", name: "rateStrategyAddress", type: "address" },
    ],
    name: "setReserveInterestRateStrategyAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "bool", name: "useAsCollateral", type: "bool" },
    ],
    name: "setUserUseReserveAsCollateral",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "rateMode", type: "uint256" },
    ],
    name: "swapBorrowRateMode",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "asset", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "address", name: "to", type: "address" },
    ],
    name: "withdraw",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

console.log(`Connecting to network: ${url}`);
const provider = new ethers.providers.JsonRpcProvider(url);
provider
  .getNetwork()
  .then((res) => {
    console.log(`Connected to network: ${res.name}`);
  })
  .catch((err) => {
    throw new Error(`Couldn't connect to network at: ${url}\n${err}`);
  });

const aaveContract = new ethers.Contract(proxyAddress, proxyAbi, provider);
const iface = new Interface(LendingPoolAbi);
console.log(iface.events);

// List all transfers sent in the last 10k blocks
const allEventsFilter: EventFilter = {
  address: proxyAddress,
  // INFURA limits to 4 topics maximum
  topics: [
    [
      utils.id(
        "Borrow(address,address,address,uint256,uint256,uint256,uint16)"
      ),
      utils.id("Deposit(address,address,address,uint256,uint16)"),
      // utils.id("FlashLoan(address,address,address,uint256,uint256,uint16)"),
      // utils.id(
      //   "LiquidationCall(address,address,address,uint256,uint256,address,bool)"
      // ),
      utils.id("Swap(address,address,uint256)"),
      utils.id("Withdraw(address,address,address,uint256)"),
    ],
  ],
};

console.log(utils.id("Withdraw(address,address,address,uint256)"));

console.log(`Filtering by: ${JSON.stringify(allEventsFilter)}`);
const testDb = db("test.json");

aaveContract.queryFilter(allEventsFilter, -100).then((res) => {
  testDb.push("/aave/ethereum/transactions", res);
  console.log(res);
});

// // aaveContract.on(allEventsFilter, (res) => {
// //   console.log(res);
// // });
