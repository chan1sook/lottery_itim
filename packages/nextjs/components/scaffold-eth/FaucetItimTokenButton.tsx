"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { parseEther } from "viem";
import { useAccount, useBlockNumber } from "wagmi";
import { useBalance } from "wagmi";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { tokenContractName } from "~~/utils/extra";

/**
 * ItimTokenFaucetButton button which lets you grab ITIM Token.
 */
export const ItimTokenFaucetButton = () => {
  const { address, chain: ConnectedChain } = useAccount();
  const { targetNetwork } = useTargetNetwork();

  const { data: itimSymbol } = useScaffoldReadContract({
    contractName: tokenContractName,
    functionName: "symbol",
  });
  const { isPending, isMining, writeContractAsync2: writeContractAsync } = useScaffoldWriteContract(tokenContractName);

  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true, chainId: targetNetwork.id });
  const { queryKey } = useBalance({
    address,
  });

  const tokenSymbolName = typeof itimSymbol === "string" ? itimSymbol : "funds";

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber]);

  const sendETH = async () => {
    if (isPending || isMining) {
      return;
    }

    await writeContractAsync({
      functionName: "tapFaucet",
      args: [parseEther("100000")],
    });
  };

  // Render only on ItimLotteryTestToken contract
  if (!ConnectedChain || tokenContractName !== "ItimLotteryTestToken") {
    return null;
  }
  return (
    <div className="ml-1">
      <button className="btn btn-secondary btn-sm px-2 rounded-full" onClick={sendETH} disabled={isPending || isMining}>
        {!(isPending && isMining) ? (
          <BanknotesIcon className="h-4 w-4" />
        ) : (
          <span className="loading loading-spinner loading-xs"></span>
        )}
        <span>Grab {typeof itimSymbol === "string" ? tokenSymbolName : "Tokens"}</span>
      </button>
    </div>
  );
};
