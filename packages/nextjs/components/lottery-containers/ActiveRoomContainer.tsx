import { LotteryData } from "~~/hooks/useLotteryData";

type ActiveRoomContainerProps = {
  lotteryData: LotteryData;
};

const maxDisplayRoom = BigInt(99);

export const ActiveRoomContainer = ({ lotteryData }: ActiveRoomContainerProps) => {
  const contractData = lotteryData.contractData;
  const activePlayer = lotteryData.buyCount;
  const maxPlayer =
    contractData.lotteryMaxNumber && contractData.lotteryMinNumber
      ? contractData.lotteryMaxNumber - contractData.lotteryMinNumber + BigInt(1)
      : BigInt(0);

  const activeRoom = typeof contractData.roomActive === "bigint" ? contractData.roomActive : BigInt(0);
  const isRoomExceeds = activeRoom >= maxDisplayRoom;

  return (
    <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
      <div className="flex flex-col">
        <span className="countdown font-mono text-3xl">
          <span
            className="mx-auto"
            style={{ "--value": (isRoomExceeds ? maxDisplayRoom : activeRoom).toString() }}
          ></span>
          {isRoomExceeds ? "+" : ""}
        </span>
        rooms
      </div>
      <div className="flex flex-col">
        <span className="countdown font-mono text-3xl">
          <span style={{ "--value": activePlayer.toString() }}></span>/
          <span style={{ "--value": maxPlayer.toString() }}></span>
        </span>
        players
      </div>
    </div>
  );
};

export const ActivePlayerContainer = ({ lotteryData }: ActiveRoomContainerProps) => {
  const contractData = lotteryData.contractData;
  const activePlayer = lotteryData.buyCount;
  const maxPlayer =
    contractData.lotteryMaxNumber && contractData.lotteryMinNumber
      ? contractData.lotteryMaxNumber - contractData.lotteryMinNumber + BigInt(1)
      : BigInt(0);

  return (
    <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
      <div className="flex flex-col">
        <span className="countdown font-mono text-3xl">
          <span style={{ "--value": activePlayer.toString() }}></span>/
          <span style={{ "--value": maxPlayer.toString() }}></span>
        </span>
        players
      </div>
    </div>
  );
};
