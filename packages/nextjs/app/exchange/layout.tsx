import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Exchange ITIM",
  description: "Exchange ITIM Token",
});

const ExchangeLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default ExchangeLayout;
