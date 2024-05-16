import { LotteryState, getPrettyLotteryState } from "~~/hooks/useLotteryData";

export const StatusBadge = ({ state }: { state: LotteryState }) => {
  let color = "badge-info";
  switch (state) {
    case LotteryState.NOT_STARTED:
      color = "badge-error";
      break;
    case LotteryState.OPENING:
      color = "badge-success";
      break;
    case LotteryState.EXPIRED:
      color = "badge-secondary";
      break;
    case LotteryState.DRAWED:
      color = "badge-primary";
      break;
  }
  return (
    <div className={`font-mono badge ${color} badge-accent badge-lg whitespace-nowrap`}>
      {getPrettyLotteryState(state)}
    </div>
  );
};
