import Link from "next/link";
import { LotteryData, LotteryState } from "~~/hooks/useLotteryData";

type BuyLotteryContainerProp = {
  id: string;
  buyLabel?: string;
  gameName?: string;
  lotteryData: LotteryData;
  adminMode?: boolean;
};

export const BuyLotteryContainer = ({ id, buyLabel, gameName, lotteryData, adminMode }: BuyLotteryContainerProp) => {
  let linkInfix = id;
  if (gameName) {
    linkInfix = `${gameName}/${linkInfix}`;
  }

  const isCheckMode = lotteryData.state === LotteryState.DRAWED;
  const isMultipleRoom = (lotteryData.contractData.roomCapacity || BigInt(1)) > BigInt(1);

  return (
    <div className="self-center w-full max-w-sm join rounded">
      {isCheckMode ? (
        <Link className="flex-1 join-item btn btn-secondary" href={`/lottery/${linkInfix}/claim`}>
          Claim
        </Link>
      ) : isMultipleRoom ? (
        <Link className="flex-1 join-item btn btn-secondary" href={`/lottery/${gameName}/buy`}>
          {buyLabel || "Buy"}
        </Link>
      ) : (
        <Link className="flex-1 join-item btn btn-secondary" href={`/lottery/${linkInfix}/buy`}>
          {buyLabel || "Buy"}
        </Link>
      )}
      <Link className="flex-1 join-item btn" href={`/lottery/${gameName}/claim`}>
        Check
      </Link>
      {adminMode && (
        <Link
          className="flex-1 join-item btn btn-accent"
          href={gameName ? `/lottery/${gameName}/manage` : `/lottery/manage`}
        >
          Manage
        </Link>
      )}
    </div>
  );
};
