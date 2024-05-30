import { useScaffoldReadContract } from "./scaffold-eth";
import { useTargetNetwork } from "./scaffold-eth/useTargetNetwork";
import { tokenContractName } from "~~/utils/extra";

export const useTokenTotalSupply = () => {
  const { data: supply } = useScaffoldReadContract({
    contractName: tokenContractName,
    functionName: "totalSupply",
  });

  return typeof supply === "bigint" ? supply : undefined;
};

export const useNativeTokenSymbol = () => {
  const { targetNetwork } = useTargetNetwork();
  return targetNetwork.nativeCurrency.symbol;
};

export const useTokenSymbol = () => {
  const { data: tokenSymbol } = useScaffoldReadContract({
    contractName: tokenContractName,
    functionName: "symbol",
  });

  return tokenSymbol || "";
};
