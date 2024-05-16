import { useScaffoldReadContract } from "./scaffold-eth";
import { LotteryBasicContractName, LotteryContractData, useLotteryContractData } from "./useLotteryContractData";

export enum LotteryState {
  NOT_STARTED,
  DECLARED,
  OPENING,
  EXPIRED,
  DRAWED,
}

export type LotteryData = {
  contractData: LotteryContractData;
  id: bigint;
  state: LotteryState;
  expired?: Date;
  drawNumber?: string;
};

export function getPrettyLotteryState(state: LotteryState) {
  switch (state) {
    case LotteryState.NOT_STARTED:
      return "Not Started";
    case LotteryState.DECLARED:
      return "Declared";
    case LotteryState.OPENING:
      return "Opening";
    case LotteryState.EXPIRED:
      return "Expired";
    case LotteryState.DRAWED:
      return "Drawed";
    default:
      return "???";
  }
}

type LotteryDataProp = {
  id: bigint;
  contractName?: LotteryBasicContractName;
};
export const useLotteryData = ({ id, contractName = "ItimLottery2Digits" }: LotteryDataProp) => {
  const { data: lotteryData } = useScaffoldReadContract({
    contractName: contractName,
    functionName: "lotteryData",
    args: [id],
  });

  const lotteryState: LotteryState =
    Array.isArray(lotteryData) && typeof lotteryData[0] === "number" ? lotteryData[0] : LotteryState.NOT_STARTED;
  const expiredTime =
    Array.isArray(lotteryData) &&
    typeof lotteryData[1] === "bigint" &&
    ![LotteryState.NOT_STARTED, LotteryState.DECLARED].includes(lotteryState)
      ? new Date(Number(lotteryData[1].toString()) * 1000)
      : undefined;
  const drawNumber =
    Array.isArray(lotteryData) && typeof lotteryData[3] === "bigint" && lotteryState == LotteryState.DRAWED
      ? lotteryData[3].toString()
      : undefined;

  const response: LotteryData = {
    contractData: useLotteryContractData(contractName),
    id: typeof id === "bigint" ? id : BigInt(0),
    state: lotteryState,
    expired: expiredTime,
    drawNumber: drawNumber,
  };

  return response;
};

export const useLastestLotteryData = (contractName: LotteryBasicContractName = "ItimLottery2Digits") => {
  const { data: id } = useScaffoldReadContract({
    contractName: contractName,
    functionName: "lastestLotteryId",
  });

  const _id = typeof id === "bigint" ? id : BigInt(0);

  return useLotteryData({ id: _id, contractName });
};
