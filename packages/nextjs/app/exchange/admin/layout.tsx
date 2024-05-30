import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Exchange Admin Page",
  description: "Exchange Admin Page",
});

const ExchangeAdminLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default ExchangeAdminLayout;
