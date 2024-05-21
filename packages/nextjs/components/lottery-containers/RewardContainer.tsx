import { ReactNode } from "react";
import { formatEther } from "viem";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { LotteryContractData } from "~~/hooks/useLotteryContractData";
import { tokenContractName } from "~~/utils/extra";

type RewardRow = {
  title: ReactNode;
  reward?: ReactNode;
};

const RewardTableContainer = ({ rows = [] }: { rows: RewardRow[] }) => {
  if (rows.length === 0) {
    return null;
  }

  return (
    <div className="transistion-all duration-100 w-full max-w-xs relative bg-base-100 rounded-3xl">
      <div className="h-full flex flex-col gap-x-6 gap-y-4 px-6 py-6">
        <table className="table table-zebra table-sm">
          <thead>
            <tr>
              <th></th>
              <th className="text-right">Reward</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((ele, i) => (
              <tr className="hover" key={i}>
                <th>{ele.title}</th>
                <td className="text-right">{ele.reward || <span className="skeleton w-16"></span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const Digit2LotteryRewardContainer = ({ contractData }: { contractData: LotteryContractData }) => {
  const { data: itimSymbol } = useScaffoldReadContract({
    contractName: tokenContractName,
    functionName: "symbol",
  });

  const contents: RewardRow[] = [
    {
      title: "Exact",
      reward: contractData.lotteryReward && (
        <>
          {formatEther(contractData.lotteryReward)} {itimSymbol || "Ξ"}
        </>
      ),
    },
  ];

  return <RewardTableContainer rows={contents} />;
};

export const Digit3LotteryRewardContainer = ({ contractData }: { contractData: LotteryContractData }) => {
  const { data: itimSymbol } = useScaffoldReadContract({
    contractName: tokenContractName,
    functionName: "symbol",
  });

  const contents: RewardRow[] = [
    {
      title: "Exact",
      reward: contractData.lotteryReward && (
        <>
          {formatEther(contractData.lotteryReward)} {itimSymbol || "Ξ"}
        </>
      ),
    },
    {
      title: "Symbol Match",
      reward: contractData.lotteryReward2nd && (
        <>
          {formatEther(contractData.lotteryReward2nd)} {itimSymbol || "Ξ"}
        </>
      ),
    },
  ];

  return <RewardTableContainer rows={contents} />;
};

export const Digit4LotteryRewardContainer = ({ contractData }: { contractData: LotteryContractData }) => {
  const { data: itimSymbol } = useScaffoldReadContract({
    contractName: tokenContractName,
    functionName: "symbol",
  });

  const contents: RewardRow[] = [
    {
      title: "Exact",
      reward: contractData.lotteryReward && (
        <>
          {formatEther(contractData.lotteryReward)} {itimSymbol || "Ξ"}
        </>
      ),
    },
    {
      title: "Match Last 3",
      reward: contractData.lotteryReward2nd && (
        <>
          {formatEther(contractData.lotteryReward2nd)} {itimSymbol || "Ξ"}
        </>
      ),
    },
    {
      title: "Match Last 2",
      reward: contractData.lotteryReward3rd && (
        <>
          {formatEther(contractData.lotteryReward3rd)} {itimSymbol || "Ξ"}
        </>
      ),
    },
  ];

  return <RewardTableContainer rows={contents} />;
};

export const TwelveNumberLotteryRewardContainer = ({ contractData }: { contractData: LotteryContractData }) => {
  const { data: itimSymbol } = useScaffoldReadContract({
    contractName: tokenContractName,
    functionName: "symbol",
  });

  const contents: RewardRow[] = [
    {
      title: "Exact",
      reward: contractData.lotteryReward && (
        <>
          {formatEther(contractData.lotteryReward)} {itimSymbol || "Ξ"}
        </>
      ),
    },
  ];

  return <RewardTableContainer rows={contents} />;
};

export const OddEvenLotteryRewardContainer = ({ contractData }: { contractData: LotteryContractData }) => {
  const { data: itimSymbol } = useScaffoldReadContract({
    contractName: tokenContractName,
    functionName: "symbol",
  });

  const contents: RewardRow[] = [
    {
      title: "Match Odd/Even",
      reward: contractData.lotteryReward && (
        <>
          {formatEther(contractData.lotteryReward)} {itimSymbol || "Ξ"}
        </>
      ),
    },
  ];

  return <RewardTableContainer rows={contents} />;
};
