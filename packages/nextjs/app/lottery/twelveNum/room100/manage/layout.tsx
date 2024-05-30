import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Manage Lottery (12 Numbers | Room 100)",
  description: "Manage 12 Numbers Lottery (Room 100)",
});

const ManageLotteryLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default ManageLotteryLayout;
