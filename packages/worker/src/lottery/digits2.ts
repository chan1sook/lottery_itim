import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { getContracts } from "../contracts";
import { states } from "./shared";
import { toTimestampSec } from "../utils";

dayjs.extend(tz);
dayjs.extend(utc);

export async function lottery2DigitsGetLastestData() {
  const { ItimLottery2Digits } = getContracts();

  const lastestId = await ItimLottery2Digits.read.lastestLotteryId();
  const lotteryData = await ItimLottery2Digits.read.lotteryData([lastestId]);
  return {
    id: lastestId,
    state: states[parseInt(lotteryData[0].toString(), 10)],
  };
}

export async function lottery2DigitsFastRestartWithResult(cb = () => {}) {
  const rollTime = lottery2DigitsPreditNextRoll();
  const { ItimLottery2Digits } = getContracts();
  const lotteryData = await lottery2DigitsGetLastestData();
  const rollTimeTs = BigInt(toTimestampSec(rollTime));
  if (lotteryData.state === "OPENING") {
    const randomNumber = BigInt(Math.floor(Math.random() * 100));
    await ItimLottery2Digits.write.fastStopLotteryWithResultAndRestart([
      lotteryData.id,
      randomNumber,
      rollTimeTs,
    ]);

    console.log("Lottery 2 Roll:", [lotteryData.id, randomNumber, rollTime]);
  } else {
    await ItimLottery2Digits.write.fastStartLottery([
      lotteryData.id,
      rollTimeTs,
    ]);
    console.log("Lottery 2 New:", [lotteryData.id, rollTime]);
  }

  cb();
}

export function lottery2DigitsPreditNextRoll(current = new Date()) {
  let dayObj = dayjs(current)
    .tz("Asia/Bangkok")
    .millisecond(0)
    .second(0)
    .minute(5);
  if (dayObj.hour() < 12) {
    dayObj = dayObj.hour(12);
  } else {
    dayObj = dayObj.add(1, "day").hour(0);
  }

  return dayObj.toDate();
}
