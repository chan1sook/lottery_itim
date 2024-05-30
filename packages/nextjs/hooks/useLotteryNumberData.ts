import { useScaffoldReadContract } from "./scaffold-eth";
import { LotteryData, LotteryState, useLotteryData } from "./useLotteryData";
import { LotteryBasicContractName, lottery2DigitsContractName } from "~~/utils/extra";

export type LotteryNumberData = {
  lotteryData: LotteryData;
  id: bigint;
  owner?: string;
  lotteryNumber: bigint;
  valid: boolean;
  owned: boolean;
  claimed: boolean;
  reward?: bigint;
};

type LotteryNumberDataProp = {
  id: bigint;
  lotteryNumber: bigint;
  contractName?: LotteryBasicContractName;
};

export const useLotteryNumberData = ({
  id,
  lotteryNumber,
  contractName = lottery2DigitsContractName,
}: LotteryNumberDataProp) => {
  const { data: isNumberValid } = useScaffoldReadContract({
    contractName: contractName,
    functionName: "isValidNumber",
    args: [lotteryNumber],
  });

  const { data: numberInfo } = useScaffoldReadContract({
    contractName: contractName,
    functionName: "lotteryBuyData",
    args: [id, lotteryNumber],
  });

  const { data: reward } = useScaffoldReadContract({
    contractName: contractName,
    functionName: "getRewardOfLottery",
    args: [id, lotteryNumber],
  });

  const isOwned = Array.isArray(numberInfo) && typeof numberInfo[0] === "boolean" ? numberInfo[0] : false;
  const owner = Array.isArray(numberInfo) && typeof numberInfo[1] === "string" ? numberInfo[1] : undefined;
  const isClaimed = Array.isArray(numberInfo) && typeof numberInfo[3] === "boolean" ? numberInfo[3] : false;
  const response: LotteryNumberData = {
    lotteryData: useLotteryData({ id, contractName }),
    id: id,
    lotteryNumber: lotteryNumber,
    owner: owner,
    valid: isNumberValid || false,
    owned: isOwned,
    claimed: isClaimed,
    reward: undefined,
  };

  if (typeof reward === "bigint" && response.lotteryData.state === LotteryState.DRAWED) {
    response.reward = reward;
  }

  return response;
};
