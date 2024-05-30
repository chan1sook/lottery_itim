import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Manage Lottery (12 Numbers | Room 50)",
  description: "Manage 12 Numbers Lottery (Room 50)",
});

const ManageLotteryLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default ManageLotteryLayout;
