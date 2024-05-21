import { useScaffoldReadContract } from "./scaffold-eth";
import { LotteryBasicContractName } from "./useLotteryContractData";

type LotteryActiveRoomAtProps = {
  contractName: LotteryBasicContractName;
  nth: bigint;
};
export const useLotteryActiveRoomAt = ({ contractName, nth }: LotteryActiveRoomAtProps) => {
  const { data: roomId } = useScaffoldReadContract({
    contractName: contractName,
    functionName: "lotteryRoomActives",
    args: [nth],
  });

  return typeof roomId === "bigint" ? roomId : undefined;
};
