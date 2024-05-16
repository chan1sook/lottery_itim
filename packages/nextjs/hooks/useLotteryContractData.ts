import { useScaffoldReadContract } from "./scaffold-eth";

export type LotteryBasicContractName = "ItimLottery2Digits" | "ItimLottery3Digits" | "ItimLottery4Digits";

export type LotteryContractData = {
  contractName: LotteryBasicContractName;
  ready: boolean;
  lastestId?: bigint;
  owner?: string;
  lotteryMinNumber?: bigint;
  lotteryMaxNumber?: bigint;
  lotteryCost?: bigint;
  lotteryReward?: bigint;
  lotteryReward2nd?: bigint;
  lotteryReward3rd?: bigint;
  tokenContractAccount?: string;
  treasuryAccount?: string;
};

export const useLotteryContractData = (contractName: LotteryBasicContractName = "ItimLottery2Digits") => {
  const { data: lastestId } = useScaffoldReadContract({
    contractName: contractName,
    functionName: "lastestLotteryId",
  });

  const { data: owner } = useScaffoldReadContract({
    contractName: contractName,
    functionName: "owner",
  });

  const { data: lotteryMinNumber } = useScaffoldReadContract({
    contractName: contractName,
    functionName: "lotteryMinNumber",
  });

  const { data: lotteryMaxNumber } = useScaffoldReadContract({
    contractName: contractName,
    functionName: "lotteryMaxNumber",
  });

  const { data: lotteryCost } = useScaffoldReadContract({
    contractName: contractName,
    functionName: "lotteryCost",
  });

  const { data: lotteryReward } = useScaffoldReadContract({
    contractName: contractName,
    functionName: "lotteryReward",
  });

  const { data: tokenContractAccount } = useScaffoldReadContract({
    contractName: contractName,
    functionName: "tokenContractAccount",
  });

  const { data: treasuryAccount } = useScaffoldReadContract({
    contractName: contractName,
    functionName: "treasuryAccount",
  });

  const { data: lotteryReward2nd } = useScaffoldReadContract({
    contractName: contractName,
    functionName: "lotteryReward2nd",
  });

  const { data: lotteryReward3rd } = useScaffoldReadContract({
    contractName: contractName,
    functionName: "lotteryReward3rd",
  });

  const response: LotteryContractData = {
    contractName: contractName,
    ready: false,
    lastestId: typeof lastestId === "bigint" ? lastestId : undefined,
    owner: typeof owner === "string" ? owner : undefined,
    lotteryMinNumber: typeof lotteryMinNumber === "bigint" ? lotteryMinNumber : undefined,
    lotteryMaxNumber: typeof lotteryMaxNumber === "bigint" ? lotteryMaxNumber : undefined,
    lotteryCost: typeof lotteryCost === "bigint" ? lotteryCost : undefined,
    lotteryReward: typeof lotteryReward === "bigint" ? lotteryReward : undefined,
    lotteryReward2nd: typeof lotteryReward2nd === "bigint" ? lotteryReward2nd : undefined,
    lotteryReward3rd: typeof lotteryReward3rd === "bigint" ? lotteryReward3rd : undefined,
    tokenContractAccount: typeof tokenContractAccount === "string" ? tokenContractAccount : undefined,
    treasuryAccount: typeof treasuryAccount === "string" ? treasuryAccount : undefined,
  };

  response.ready =
    typeof response.lastestId === "bigint" &&
    typeof owner === "string" &&
    typeof lotteryMinNumber === "bigint" &&
    typeof lotteryMaxNumber === "bigint" &&
    typeof lotteryCost === "bigint" &&
    typeof lotteryReward === "bigint" &&
    typeof tokenContractAccount === "string" &&
    typeof treasuryAccount === "string";

  if (contractName === "ItimLottery3Digits") {
    response.ready = response.ready && typeof lotteryReward2nd === "bigint";
  }

  if (contractName === "ItimLottery4Digits") {
    response.ready = response.ready && typeof lotteryReward2nd === "bigint" && typeof lotteryReward3rd === "bigint";
  }

  return response;
};

export const useIsLotteryContractAdmin = (
  contractName: LotteryBasicContractName = "ItimLottery2Digits",
  address?: string,
) => {
  const { data: ADMIN_ROLE } = useScaffoldReadContract({
    contractName: contractName,
    functionName: "ADMIN_ROLE",
  });

  const { data: isAdmin } = useScaffoldReadContract({
    contractName: contractName,
    functionName: "hasRole",
    args: [ADMIN_ROLE, address],
  });

  return typeof isAdmin === "boolean" && !!address ? isAdmin : false;
};
