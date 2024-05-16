import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Buy Lottery (2 Digits)",
  description: "Buy 2 Digits Lottery",
});

const BuyLotteryLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default BuyLotteryLayout;
