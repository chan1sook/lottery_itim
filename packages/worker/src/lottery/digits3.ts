import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";

import { getContracts } from "../contracts";
import { states } from "./shared";
import { toTimestampSec } from "../utils";

dayjs.extend(tz);
dayjs.extend(utc);
dayjs.extend(weekday);

export async function lottery3DigitsGetLastestData() {
  const { ItimLottery3Digits } = getContracts();

  const lastestId = await ItimLottery3Digits.read.lastestLotteryId();
  const lotteryData = await ItimLottery3Digits.read.lotteryData([lastestId]);
  return {
    id: lastestId,
    state: states[parseInt(lotteryData[0].toString(), 10)],
  };
}

export async function lottery3DigitsFastRestartWithResult(cb = () => {}) {
  const rollTime = lottery3DigitsPreditNextRoll();
  console.log("Next Roll:", rollTime);

  const { ItimLottery3Digits } = getContracts();
  const lotteryData = await lottery3DigitsGetLastestData();
  const rollTimeTs = BigInt(toTimestampSec(rollTime));
  if (lotteryData.state === "OPENING") {
    const randomNumber = BigInt(Math.floor(Math.random() * 100));
    await ItimLottery3Digits.write.fastStopLotteryWithResultAndRestart([
      lotteryData.id,
      randomNumber,
      rollTimeTs,
    ]);

    console.log("Lottery 3 Roll:", [lotteryData.id, randomNumber, rollTime]);
  } else {
    await ItimLottery3Digits.write.fastStartLottery([
      lotteryData.id,
      rollTimeTs,
    ]);
    console.log("Lottery 3 New:", [lotteryData.id, rollTime]);
  }

  cb();
}

export function lottery3DigitsPreditNextRoll(current = new Date()) {
  let dayObj = dayjs(current)
    .tz("Asia/Bangkok")
    .millisecond(0)
    .second(0)
    .minute(0)
    .hour(0)
    .weekday(0);
  if (dayObj.valueOf() <= current.getTime()) {
    dayObj = dayObj.add(7, "day");
  }
  return dayObj.toDate();
}
