import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { getContracts } from "../contracts";
import { states } from "./shared";
import { toTimestampSec } from "../utils";

dayjs.extend(tz);
dayjs.extend(utc);

export async function lotteryOddEvenDigitsGetDataOf(id: bigint) {
  const { ItimLotteryOddEven } = getContracts();

  const lotteryData = await ItimLotteryOddEven.read.lotteryData([id]);
  return {
    id: id,
    state: states[parseInt(lotteryData[0].toString(), 10)],
    buyCount: lotteryData[3],
  };
}

export async function lotteryOddEvenGetContractData() {
  const { ItimLotteryOddEven } = getContracts();

  const [capacity, lastestId, avaliable] = await Promise.all([
    ItimLotteryOddEven.read.lotteryRoomCapacity(),
    ItimLotteryOddEven.read.lastestLotteryId(),
    ItimLotteryOddEven.read.lotteryRoomActivesLength(),
  ]);

  const rooms: Awaited<ReturnType<typeof lotteryOddEvenDigitsGetDataOf>>[] = [];
  if (typeof avaliable === "bigint") {
    for (let i = 0; i < parseInt(avaliable.toString(), 10); i++) {
      const id = await ItimLotteryOddEven.read.lotteryRoomActives([BigInt(i)]);
      rooms.push(await lotteryOddEvenDigitsGetDataOf(id));
    }
  }
  return {
    lastestId: lastestId,
    capacity: capacity,
    rooms: rooms,
  };
}

export async function lotteryOddEvenWorker(cb = () => {}) {
  const { ItimLotteryOddEven } = getContracts();
  const contractData = await lotteryOddEvenGetContractData();
  const rollTime = dayjs().add(5, "minutes").toDate();
  const rollTimeTs = BigInt(toTimestampSec(rollTime));
  if (contractData.rooms.length < contractData.capacity) {
    // new room
    const lastRoomId = await lotteryOddEvenDigitsGetDataOf(
      contractData.lastestId
    );
    let roomId = contractData.lastestId;
    if (lastRoomId.state !== "NOT_READY") {
      roomId += BigInt(1);
    }

    await ItimLotteryOddEven.write.fastStartLottery([
      roomId,
      BigInt(toTimestampSec(rollTime)),
    ]);
    console.log("Lottery OddEven New:", [roomId, rollTime]);
    cb();
  } else {
    // check if fullness
    for (const room of contractData.rooms) {
      if (room.buyCount >= BigInt(12)) {
        const randomNumber = BigInt(1 + Math.floor(Math.random() * 12));
        await ItimLotteryOddEven.write.fastStopLotteryWithResultAndRestart([
          room.id,
          randomNumber,
          rollTimeTs,
        ]);

        console.log("Lottery OddEven Roll:", [room.id, randomNumber, rollTime]);

        cb();
        return;
      }
    }
  }
}
