import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { getContracts } from "../contracts";
import { states } from "./shared";
import { toTimestampSec } from "../utils";

dayjs.extend(tz);
dayjs.extend(utc);

export async function lottery12NumbersRoom500DigitsGetDataOf(id: bigint) {
  const { ItimLottery12NumbersRoom500 } = getContracts();

  const lotteryData = await ItimLottery12NumbersRoom500.read.lotteryData([id]);
  return {
    id: id,
    state: states[parseInt(lotteryData[0].toString(), 10)],
    buyCount: lotteryData[3],
  };
}

export async function lottery12NumbersRoom500GetContractData() {
  const { ItimLottery12NumbersRoom500 } = getContracts();

  const [capacity, lastestId, avaliable] = await Promise.all([
    ItimLottery12NumbersRoom500.read.lotteryRoomCapacity(),
    ItimLottery12NumbersRoom500.read.lastestLotteryId(),
    ItimLottery12NumbersRoom500.read.lotteryRoomActivesLength(),
  ]);

  const rooms: Awaited<
    ReturnType<typeof lottery12NumbersRoom500DigitsGetDataOf>
  >[] = [];
  if (typeof avaliable === "bigint") {
    for (let i = 0; i < parseInt(avaliable.toString(), 10); i++) {
      const id = await ItimLottery12NumbersRoom500.read.lotteryRoomActives([
        BigInt(i),
      ]);
      rooms.push(await lottery12NumbersRoom500DigitsGetDataOf(id));
    }
  }
  return {
    lastestId: lastestId,
    capacity: capacity,
    rooms: rooms,
  };
}

export async function lottery12NumbersRoom500Worker(cb = () => {}) {
  const { ItimLottery12NumbersRoom500 } = getContracts();
  const contractData = await lottery12NumbersRoom500GetContractData();
  const rollTime = dayjs().add(5, "minutes").toDate();
  const rollTimeTs = BigInt(toTimestampSec(rollTime));
  if (contractData.rooms.length < contractData.capacity) {
    // new room
    const lastRoomId = await lottery12NumbersRoom500DigitsGetDataOf(
      contractData.lastestId
    );
    let roomId = contractData.lastestId;
    if (lastRoomId.state !== "NOT_READY") {
      roomId += BigInt(1);
    }

    await ItimLottery12NumbersRoom500.write.fastStartLottery([
      roomId,
      BigInt(toTimestampSec(rollTime)),
    ]);
    console.log("Lottery 12NumbersRoom500 New:", [roomId, rollTime]);
    cb();
  } else {
    // check if fullness
    for (const room of contractData.rooms) {
      if (room.buyCount >= BigInt(12)) {
        const randomNumber = BigInt(1 + Math.floor(Math.random() * 12));
        await ItimLottery12NumbersRoom500.write.fastStopLotteryWithResultAndRestart(
          [room.id, randomNumber, rollTimeTs]
        );

        console.log("Lottery 12NumbersRoom500 Roll:", [
          room.id,
          randomNumber,
          rollTime,
        ]);

        cb();
        return;
      }
    }
  }
}
