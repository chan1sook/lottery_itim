import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { getContracts } from "../contracts";
import { states } from "./shared";
import { toTimestampSec } from "../utils";

dayjs.extend(tz);
dayjs.extend(utc);

export async function lottery4DigitsGetLastestData() {
  const { ItimLottery4Digits } = getContracts();

  const lastestId = await ItimLottery4Digits.read.lastestLotteryId();
  const lotteryData = await ItimLottery4Digits.read.lotteryData([lastestId]);
  return {
    id: lastestId,
    state: states[parseInt(lotteryData[0].toString(), 10)],
  };
}

export async function lottery4DigitsFastRestartWithResult(cb = () => {}) {
  const rollTime = lottery4DigitsPreditNextRoll();
  const { ItimLottery4Digits } = getContracts();
  const lotteryData = await lottery4DigitsGetLastestData();
  const rollTimeTs = BigInt(toTimestampSec(rollTime));
  if (lotteryData.state === "OPENING") {
    const randomNumber = BigInt(Math.floor(Math.random() * 10000));
    await ItimLottery4Digits.write.fastStopLotteryWithResultAndRestart([
      lotteryData.id,
      randomNumber,
      rollTimeTs,
    ]);

    console.log("Lottery 4 Roll:", [lotteryData.id, randomNumber, rollTime]);
  } else {
    await ItimLottery4Digits.write.fastStartLottery([
      lotteryData.id,
      rollTimeTs,
    ]);
    console.log("Lottery 4 New:", [lotteryData.id, rollTime]);
  }

  cb();
}

export function lottery4DigitsPreditNextRoll(current = new Date()) {
  let dayObj = dayjs(current)
    .tz("Asia/Bangkok")
    .millisecond(0)
    .second(0)
    .minute(0)
    .hour(0)
    .day(5);
  if (dayObj.valueOf() <= current.getTime()) {
    dayObj = dayObj.add(1, "month").day(5);
  }
  return dayObj.toDate();
}
