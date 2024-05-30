import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Claim Lottery (12 Numbers | Room 10)",
  description: "Claim 12 Numbers Lottery (Room 10)",
});

const ClaimLotteryLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default ClaimLotteryLayout;
