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
  ready: boolean;
  contractData: LotteryContractData;
  id: bigint;
  state: LotteryState;
  expired?: Date;
  drawNumber?: string;
  buyCount: bigint;
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
  const buyCount = Array.isArray(lotteryData) && typeof lotteryData[4] === "bigint" ? lotteryData[4] : BigInt(0);

  const response: LotteryData = {
    ready: false,
    contractData: useLotteryContractData(contractName),
    id: id,
    state: lotteryState,
    expired: expiredTime,
    drawNumber: drawNumber,
    buyCount: buyCount,
  };

  response.ready = Array.isArray(lotteryData);

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
