import { FlipperContainer } from "~~/components/FlipperContainer";
import { LotteryData, LotteryState } from "~~/hooks/useLotteryData";

type LotteryStatusContainerProp = {
  lotteryData: LotteryData;
};

export const LotteryStatusContainer = ({ lotteryData }: LotteryStatusContainerProp) => {
  let statusText = "Waiting...";
  if (lotteryData.state == LotteryState.DRAWED) {
    statusText = lotteryData.drawNumber || "Drawed";
  } else if (lotteryData.state == LotteryState.EXPIRED) {
    statusText = "Drawing...";
  }

  return (
    <div className="font-mono text-3xl whitespace-nowrap">
      <FlipperContainer value={statusText}>{statusText}</FlipperContainer>
    </div>
  );
};
