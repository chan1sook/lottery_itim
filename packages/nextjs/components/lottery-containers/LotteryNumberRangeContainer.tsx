import { FlipperContainer } from "../FlipperContainer";
import { LotteryContractData } from "~~/hooks/useLotteryContractData";

export const LotteryNumberRangeContainer = ({ contractData }: { contractData: LotteryContractData }) => {
  const lotteryNumberRangeStr = contractData.ready
    ? `${contractData.lotteryMinNumber?.toString()}-${contractData.lotteryMaxNumber?.toString()}`
    : "???-???";

  return (
    <div>
      Number Range:{" "}
      <span className="font-mono">
        <FlipperContainer value={lotteryNumberRangeStr}>{lotteryNumberRangeStr}</FlipperContainer>
      </span>
    </div>
  );
};
