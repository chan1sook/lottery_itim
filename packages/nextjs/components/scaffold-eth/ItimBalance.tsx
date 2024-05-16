"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Address, formatEther } from "viem";
import { useBalance, useBlockNumber } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { tokenContractName } from "~~/utils/extra";

type ItimBalanceProps = {
  address?: Address;
  className?: string;
  ethMode?: boolean;
};

/**
 * Display (ITIM & ETH) balance of an ETH address.
 */
export const ItimBalance = ({ address, className = "", ethMode }: ItimBalanceProps) => {
  const { targetNetwork } = useTargetNetwork();

  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true, chainId: targetNetwork.id });

  const { data: itimBalance } = useScaffoldReadContract({
    contractName: tokenContractName,
    functionName: "balanceOf",
    args: [address],
  });

  const { data: itimSymbol } = useScaffoldReadContract({
    contractName: tokenContractName,
    functionName: "symbol",
  });

  const {
    data: balance,
    isError,
    isLoading,
    queryKey,
  } = useBalance({
    address,
  });

  const [displayEthMode, setDisplayEthMode] = useState(Boolean(ethMode));
  const toggleBalanceMode = () => {
    setDisplayEthMode(prevMode => !prevMode);
  };

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber]);

  if (!address || isLoading || balance === null) {
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-md bg-slate-300 h-6 w-6"></div>
        <div className="flex items-center space-y-6">
          <div className="h-2 w-28 bg-slate-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`border-2 border-gray-400 rounded-md px-2 flex flex-col items-center max-w-fit cursor-pointer`}>
        <div className="text-warning">Error</div>
      </div>
    );
  }

  const formattedBalance = balance ? Number(formatEther(balance.value)) : 0;
  const formattedItimBalance = typeof itimBalance === "bigint" ? Number(formatEther(itimBalance)) : 0;

  return (
    <button
      className={`btn btn-sm btn-ghost flex flex-col font-normal items-center hover:bg-transparent ${className}`}
      onClick={toggleBalanceMode}
    >
      <div className="w-full flex items-center justify-center">
        {displayEthMode ? (
          <>
            <span>{formattedBalance.toFixed(4)}</span>
            <span className="text-[0.8em] font-bold ml-1">{targetNetwork.nativeCurrency.symbol}</span>
          </>
        ) : (
          <>
            <span>{formattedItimBalance.toFixed(4)}</span>
            <span className="text-[0.8em] font-bold ml-1">{itimSymbol}</span>
          </>
        )}
      </div>
    </button>
  );
};
