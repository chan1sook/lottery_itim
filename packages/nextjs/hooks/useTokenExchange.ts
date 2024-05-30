import { useScaffoldContract, useScaffoldReadContract } from "./scaffold-eth";
import { useBalance } from "wagmi";
import { tokenExchangeContractName } from "~~/utils/extra";

export const useTokenExchangeIsAdmin = (address?: string) => {
  const { data: ADMIN_ROLE } = useScaffoldReadContract({
    contractName: tokenExchangeContractName,
    functionName: "ADMIN_ROLE",
  });

  const { data: isAdmin } = useScaffoldReadContract({
    contractName: tokenExchangeContractName,
    functionName: "hasRole",
    args: [ADMIN_ROLE, address],
  });

  return address && typeof isAdmin === "boolean" ? isAdmin : false;
};

export const useTokenExchangeBalance = () => {
  const { data: contractData } = useScaffoldContract({ contractName: tokenExchangeContractName });
  const { data: balanceData } = useBalance({ address: contractData ? contractData.address : undefined });
  return balanceData ? balanceData.value : undefined;
};

export const useTokenExchangeConfig = () => {
  const rate = useExchangeRate();
  const feeExchangeTo = useFeeExchangeToRate();
  const feeExchangeBack = useFeeExchangeBackRate();
  const result = {
    rate: rate,
    feeExchangeTo: feeExchangeTo,
    feeExchangeBack: feeExchangeBack,
    ready: false,
  };

  result.ready = typeof rate === "bigint" && typeof feeExchangeTo === "bigint" && typeof feeExchangeBack === "bigint";
  return result;
};

export const useExchangeRate = () => {
  const { data: rate } = useScaffoldReadContract({
    contractName: tokenExchangeContractName,
    functionName: "exchangeToRatePerEther",
  });

  return typeof rate === "bigint" ? rate : undefined;
};

export const useFeeExchangeToRate = () => {
  const { data: rate } = useScaffoldReadContract({
    contractName: tokenExchangeContractName,
    functionName: "exchangeToFeeRatePerEther",
  });

  return typeof rate === "bigint" ? rate : undefined;
};

export const useFeeExchangeBackRate = () => {
  const { data: rate } = useScaffoldReadContract({
    contractName: tokenExchangeContractName,
    functionName: "exchangeBackFeePerEther",
  });

  return typeof rate === "bigint" ? rate : undefined;
};

export const useEtherToTokenPreditcate = (value: bigint) => {
  const { data: result } = useScaffoldReadContract({
    contractName: tokenExchangeContractName,
    functionName: "computeEtherToTokenExchange",
    args: [value],
  });
  return typeof result === "bigint" ? result : undefined;
};

export const useTokenToEtherPreditcate = (value: bigint) => {
  const { data: result } = useScaffoldReadContract({
    contractName: tokenExchangeContractName,
    functionName: "computeTokenToEtherExchange",
    args: [value],
  });
  return typeof result === "bigint" ? result : undefined;
};
