import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { getContracts } from "../contracts";
import { states } from "./shared";
import { toTimestampSec } from "../utils";

dayjs.extend(tz);
dayjs.extend(utc);

export async function lottery12NumbersRoom10DigitsGetDataOf(id: bigint) {
  const { ItimLottery12NumbersRoom10 } = getContracts();

  const lotteryData = await ItimLottery12NumbersRoom10.read.lotteryData([id]);
  return {
    id: id,
    state: states[parseInt(lotteryData[0].toString(), 10)],
    buyCount: lotteryData[3],
  };
}

export async function lottery12NumbersRoom10GetContractData() {
  const { ItimLottery12NumbersRoom10 } = getContracts();

  const [capacity, lastestId, avaliable] = await Promise.all([
    ItimLottery12NumbersRoom10.read.lotteryRoomCapacity(),
    ItimLottery12NumbersRoom10.read.lastestLotteryId(),
    ItimLottery12NumbersRoom10.read.lotteryRoomActivesLength(),
  ]);
  const rooms: Awaited<
    ReturnType<typeof lottery12NumbersRoom10DigitsGetDataOf>
  >[] = [];
  if (typeof avaliable === "bigint") {
    for (let i = 0; i < parseInt(avaliable.toString(), 10); i++) {
      const id = await ItimLottery12NumbersRoom10.read.lotteryRoomActives([
        BigInt(i),
      ]);
      rooms.push(await lottery12NumbersRoom10DigitsGetDataOf(id));
    }
  }
  return {
    lastestId: lastestId,
    capacity: capacity,
    rooms: rooms,
  };
}

export async function lottery12NumbersRoom10Worker(cb = () => {}) {
  const { ItimLottery12NumbersRoom10 } = getContracts();
  const contractData = await lottery12NumbersRoom10GetContractData();
  const rollTime = dayjs().add(5, "minutes").toDate();
  const rollTimeTs = BigInt(toTimestampSec(rollTime));
  if (contractData.rooms.length < contractData.capacity) {
    // new room
    const lastRoomId = await lottery12NumbersRoom10DigitsGetDataOf(
      contractData.lastestId
    );
    let roomId = contractData.lastestId;
    if (lastRoomId.state !== "NOT_READY") {
      roomId += BigInt(1);
    }

    await ItimLottery12NumbersRoom10.write.fastStartLottery([
      roomId,
      BigInt(toTimestampSec(rollTime)),
    ]);
    console.log("Lottery 12NumbersRoom10 New:", [roomId, rollTime]);
    cb();
  } else {
    // check if fullness
    for (const room of contractData.rooms) {
      if (room.buyCount >= BigInt(12)) {
        const randomNumber = BigInt(1 + Math.floor(Math.random() * 12));
        await ItimLottery12NumbersRoom10.write.fastStopLotteryWithResultAndRestart(
          [room.id, randomNumber, rollTimeTs]
        );

        console.log("Lottery 12NumbersRoom10 Roll:", [
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
