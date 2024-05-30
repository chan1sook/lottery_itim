"use client";

import { useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";
import { ArrowDownIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { ConnectAddressContainer } from "~~/components/ConnectAddressContainer";
import {
  ExchangeBackInfoContainer,
  ExchangeToTokenInfoContainer,
} from "~~/components/lottery-containers/ExchangeRateContainer";
import { ItimTokenInput } from "~~/components/scaffold-eth/Input/ItimTokenInput";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useNativeTokenSymbol, useTokenSymbol } from "~~/hooks/useTokenData";
import {
  useEtherToTokenPreditcate,
  useTokenExchangeIsAdmin,
  useTokenToEtherPreditcate,
} from "~~/hooks/useTokenExchange";
import { noOp, tokenExchangeContractName } from "~~/utils/extra";

const ExchangeItim: NextPage = () => {
  const { address: account } = useAccount();
  const tokenSymbol = useTokenSymbol();
  const etherSymbol = useNativeTokenSymbol();

  const isExchangeAdmin = useTokenExchangeIsAdmin(account);
  const [exchangeValue, setExchangeValue] = useState(BigInt(0));
  const [swapBack, setSwapBack] = useState(false);
  const exchangeToValue = useEtherToTokenPreditcate(exchangeValue) || BigInt(0);
  const exchangeBackValue = useTokenToEtherPreditcate(exchangeValue) || BigInt(0);

  const {
    isPending,
    isMining,
    writeContractAsync2: writeContractAsync,
  } = useScaffoldWriteContract(tokenExchangeContractName);

  function setExchangeValueInput(val: string | bigint) {
    if (typeof val === "string") {
      setExchangeValue(parseEther(val));
    } else {
      setExchangeValue(val);
    }
  }

  async function swapToToken(value: bigint) {
    await writeContractAsync({
      functionName: "exchangeEtherToToken",
      value: value,
    });
  }

  async function swapBackToEther(value: bigint) {
    await writeContractAsync({
      functionName: "exchangeTokenBackToEther",
      args: [value],
    });
  }

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">Exchange</span>
          </h1>
          <ConnectAddressContainer />
        </div>
        <div className="bg-base-300 w-full mt-12 px-4 py-6 flex flex-col items-center">
          <div className="w-full max-w-md flex flex-col gap-y-4">
            {isExchangeAdmin && (
              <Link className="flex-1 join-item btn btn-primary rounded-sm" href="/exchange/admin">
                Admin Page
              </Link>
            )}
            <div className="flex flex-col gap-2 border shadow bg-base-100 rounded-3xl px-4 py-4">
              <div className="flex flex-row gap-2 items-center mb-6">
                <div className="flex-1 text-lg">
                  {swapBack ? (
                    <>
                      {tokenSymbol} to {etherSymbol}
                    </>
                  ) : (
                    <>
                      {etherSymbol} to {tokenSymbol}
                    </>
                  )}
                </div>
                <button className="btn btn-primary h-[2.2rem] min-h-[2.2rem]" onClick={() => setSwapBack(e => !e)}>
                  <ArrowsRightLeftIcon className="h-3 w-3 cursor-pointer" aria-hidden="true" />
                </button>
              </div>
              {swapBack ? (
                <>
                  <ItimTokenInput value={formatEther(exchangeValue)} onChange={setExchangeValueInput} />
                  <div className="flex flex-row justify-center">
                    <ArrowDownIcon height={24} />
                  </div>
                  <ItimTokenInput value={formatEther(exchangeBackValue)} onChange={noOp} unit={etherSymbol} />
                </>
              ) : (
                <>
                  <ItimTokenInput
                    value={formatEther(exchangeValue)}
                    onChange={setExchangeValueInput}
                    unit={etherSymbol}
                  />
                  <div className="flex flex-row justify-center">
                    <ArrowDownIcon height={24} />
                  </div>
                  <ItimTokenInput value={formatEther(exchangeToValue)} onChange={noOp} />
                </>
              )}
            </div>
            {swapBack ? (
              <>
                <div className="border shadow bg-base-100 rounded-3xl px-4 py-4">
                  <ExchangeBackInfoContainer />
                </div>
                <button
                  className="flex-1 join-item btn btn-secondary rounded-sm"
                  disabled={isPending || isMining}
                  onClick={() => swapBackToEther(exchangeValue)}
                >
                  Swap
                </button>
              </>
            ) : (
              <>
                <div className="border shadow bg-base-100 rounded-3xl px-4 py-4">
                  <ExchangeToTokenInfoContainer />
                </div>
                <button
                  className="flex-1 join-item btn btn-primary rounded-sm"
                  disabled={isPending || isMining}
                  onClick={() => swapToToken(exchangeValue)}
                >
                  Swap
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExchangeItim;
