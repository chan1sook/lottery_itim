import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Buy Lottery (12 Numbers | Room 20)",
  description: "Buy 12 Numbers Lottery (Room 20)",
});

const BuyLotteryLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default BuyLotteryLayout;
