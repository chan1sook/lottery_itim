type BuyLotteryContainerProp = {
  buyLabel?: string;
};

export const BuyLotteryContainer = ({ buyLabel }: BuyLotteryContainerProp) => {
  return (
    <div className="self-center w-full max-w-sm join rounded">
      <div className="flex-1 join-item btn btn-secondary">{buyLabel || "Buy"}</div>
      <div className="flex-1 join-item btn">Check</div>
    </div>
  );
};
