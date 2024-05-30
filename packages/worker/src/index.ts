import { config as configEnv } from "dotenv";
import nodeCron from "node-cron";
import {
  lottery2DigitsFastRestartWithResult,
  lottery2DigitsGetLastestData,
} from "./lottery/digits2";
import {
  lottery3DigitsFastRestartWithResult,
  lottery3DigitsGetLastestData,
} from "./lottery/digits3";
import {
  lottery4DigitsFastRestartWithResult,
  lottery4DigitsGetLastestData,
} from "./lottery/digits4";
import {
  lotteryOddEvenWorker,
  lotteryOddEvenGetContractData,
} from "./lottery/oddeven";
import { getAccount, getClient } from "./account";
import { formatEther } from "viem";
import {
  lottery12NumbersRoom10Worker,
  lottery12NumbersRoom10GetContractData,
} from "./lottery/twelveRoom10";
import {
  lottery12NumbersRoom20Worker,
  lottery12NumbersRoom20GetContractData,
} from "./lottery/twelveRoom20";
import {
  lottery12NumbersRoom50Worker,
  lottery12NumbersRoom50GetContractData,
} from "./lottery/twelveRoom50";
import {
  lottery12NumbersRoom100Worker,
  lottery12NumbersRoom100GetContractData,
} from "./lottery/twelveRoom100";
import {
  lottery12NumbersRoom500Worker,
  lottery12NumbersRoom500GetContractData,
} from "./lottery/twelveRoom500";

configEnv();

if (!process.env.WORKER_ACCOUNT_PRIVATE_KEY) {
  console.error("Required WORKER_ACCOUNT_PRIVATE_KEY");
  process.exit(1);
}

let waitChainCounter = 0;
const queueActions: (() => void)[] = [];

function setWaitChain() {
  waitChainCounter = 3;
}

function afterTxAction() {
  const client = getClient();
  const account = getAccount();

  client
    .getBalance({
      address: account.address,
    })
    .then((balance) => {
      console.log("Remain Balance:", formatEther(balance));
    })
    .catch(console.error);

  setWaitChain();
}

const routine2Digits = () => lottery2DigitsFastRestartWithResult(afterTxAction);
const routine3Digits = () => lottery3DigitsFastRestartWithResult(afterTxAction);
const routine4Digits = () => lottery4DigitsFastRestartWithResult(afterTxAction);
const routine12Room10 = () => lottery12NumbersRoom10Worker(afterTxAction);
const routine12Room20 = () => lottery12NumbersRoom20Worker(afterTxAction);
const routine12Room50 = () => lottery12NumbersRoom50Worker(afterTxAction);
const routine12Room100 = () => lottery12NumbersRoom100Worker(afterTxAction);
const routine12Room500 = () => lottery12NumbersRoom500Worker(afterTxAction);
const routineOddEven = () => lotteryOddEvenWorker(afterTxAction);

const workerFunctions = [
  routine12Room10,
  routine12Room20,
  routine12Room50,
  routine12Room100,
  routine12Room500,
  routineOddEven,
];

nodeCron.schedule(
  "5 */12 * * *",
  () => {
    console.log("Lottery 2 Digits: Trigged");
    if (!queueActions.includes(routine2Digits)) {
      queueActions.push(routine2Digits);
    }
  },
  {
    timezone: "Asia/Bangkok",
  }
);
nodeCron.schedule(
  "0 0 * * 1",
  () => {
    console.log("Lottery 3 Digits: Trigged");
    if (!queueActions.includes(routine3Digits)) {
      queueActions.push(routine3Digits);
    }
  },
  {
    timezone: "Asia/Bangkok",
  }
);
nodeCron.schedule(
  "0 0 5 * *",
  () => {
    console.log("Lottery 4 Digits: Trigged");
    if (!queueActions.includes(routine4Digits)) {
      queueActions.push(routine4Digits);
    }
  },
  {
    timezone: "Asia/Bangkok",
  }
);

nodeCron.schedule(
  "*/15 * * * * *",
  () => {
    // basis routine
    for (const worker of workerFunctions) {
      if (!queueActions.includes(worker)) {
        queueActions.push(worker);
      }
    }

    if (waitChainCounter > 0) {
      console.log("waitChainCounter: ", waitChainCounter);
      waitChainCounter -= 1;
    } else {
      const action = queueActions.shift();
      if (typeof action === "function") {
        action();
      }
    }
  },
  {
    timezone: "Asia/Bangkok",
  }
);

console.log("Worker Ready");

const displayArr: Record<string, () => any> = {
  lottery2DigitsGetLastestData,
  lottery3DigitsGetLastestData,
  lottery4DigitsGetLastestData,
  lottery12NumbersRoom10GetContractData,
  lottery12NumbersRoom20GetContractData,
  lottery12NumbersRoom50GetContractData,
  lottery12NumbersRoom100GetContractData,
  lottery12NumbersRoom500GetContractData,
  lotteryOddEvenGetContractData,
};

(async () => {
  if ((await lottery2DigitsGetLastestData()).state === "NOT_READY") {
    if (!queueActions.includes(routine2Digits)) {
      queueActions.push(routine2Digits);
    }
  }
  if ((await lottery3DigitsGetLastestData()).state === "NOT_READY") {
    if (!queueActions.includes(routine3Digits)) {
      queueActions.push(routine3Digits);
    }
  }
  if ((await lottery4DigitsGetLastestData()).state === "NOT_READY") {
    if (!queueActions.includes(routine4Digits)) {
      queueActions.push(routine4Digits);
    }
  }

  for (const key of Object.keys(displayArr)) {
    const output = await displayArr[key]();
    console.log(key, output);
  }
})();
