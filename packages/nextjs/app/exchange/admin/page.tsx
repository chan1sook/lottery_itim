"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { formatEther, parseEther } from "viem";
import { useAccount, useWalletClient } from "wagmi";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { ConnectAddressContainer } from "~~/components/ConnectAddressContainer";
import { LotteryButton } from "~~/components/LotteryButton";
import {
  ExchangeBackInfoContainer,
  ExchangeToTokenInfoContainer,
} from "~~/components/lottery-containers/ExchangeRateContainer";
import { EtherInput } from "~~/components/scaffold-eth";
import { ItimTokenInput } from "~~/components/scaffold-eth/Input/ItimTokenInput";
import { useScaffoldContract, useScaffoldWriteContract, useTransactor } from "~~/hooks/scaffold-eth";
import { useNativeTokenSymbol, useTokenSymbol } from "~~/hooks/useTokenData";
import { useTokenExchangeConfig, useTokenExchangeIsAdmin } from "~~/hooks/useTokenExchange";
import { tokenExchangeContractName } from "~~/utils/extra";

type LabelFromAdminModifierProp = {
  admin?: string;
  isAdmin: boolean;
  label: string;
};

function labelFromAdminModifier({ admin, isAdmin, label }: LabelFromAdminModifierProp) {
  return !admin ? "Not Connected" : !isAdmin ? "Not Admin" : label;
}

const ExchangeAdmin: NextPage = () => {
  const { address: adminAccount, chain } = useAccount();

  const { data: contractData } = useScaffoldContract({
    contractName: tokenExchangeContractName,
  });
  const {
    isPending,
    isMining,
    writeContractAsync2: writeContractAsync,
  } = useScaffoldWriteContract(tokenExchangeContractName);

  const [swapBack, setSwapBack] = useState(false);
  const [fillEther, setFillEther] = useState("1.0");
  const [tapEther, setTapEther] = useState("1.0");
  const [exchangeRate, setExchangeRate] = useState("1.0");
  const [feeExchangeToRate, setFeeExchangeToRate] = useState("0.05");
  const [feeExchangeBackRate, setFeeExchangeBackRate] = useState("0.01");

  const [waitContactData, setWaitContractData] = useState(false);

  const oldConfig = useTokenExchangeConfig();
  if (!waitContactData && oldConfig.ready) {
    setWaitContractData(true);
    setExchangeRate(formatEther(oldConfig.rate || BigInt(0)));
    setFeeExchangeToRate(formatEther(oldConfig.feeExchangeTo || BigInt(0)));
    setFeeExchangeBackRate(formatEther(oldConfig.feeExchangeBack || BigInt(0)));
  }

  const isAdmin = useTokenExchangeIsAdmin(adminAccount);
  const itimSymbol = useTokenSymbol();
  const etherSymbol = useNativeTokenSymbol();
  const isWaitWriting = !oldConfig.ready || isPending || isMining;

  const { data: signer } = useWalletClient();
  const sendTxn = useTransactor(signer);

  function _getLabel(label: string) {
    return labelFromAdminModifier({ admin: adminAccount, isAdmin, label });
  }

  async function fillEtherAction(value: bigint) {
    if (!contractData?.address || !adminAccount) {
      return;
    }

    await sendTxn({
      to: contractData?.address,
      value: value,
      account: adminAccount,
      chain: chain,
    });
  }

  async function tapEtherAction(value: bigint) {
    await writeContractAsync({
      functionName: "tapEther",
      args: [value],
    });
  }

  async function updateExchangeRate(value: bigint) {
    await writeContractAsync({
      functionName: "setExchangeTokenRate",
      args: [value],
    });
  }

  async function updateFeeRate(toRate: bigint, backRate: bigint) {
    await writeContractAsync({
      functionName: "setExchangeFeeRate",
      args: [toRate, backRate],
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
        <div className="bg-base-300 w-full mt-8 px-4 py-6 flex flex-col items-center">
          <div className="w-full max-w-md flex flex-col gap-y-4">
            <div className="flex flex-col gap-2 border shadow bg-base-100 rounded-3xl px-4 py-4">
              <div className="flex flex-row gap-2 items-center mb-6">
                <div className="flex-1 text-lg">
                  {swapBack ? (
                    <>
                      {itimSymbol} to {etherSymbol}
                    </>
                  ) : (
                    <>
                      {etherSymbol} to {itimSymbol}
                    </>
                  )}
                </div>
                <button className="btn btn-primary h-[2.2rem] min-h-[2.2rem]" onClick={() => setSwapBack(e => !e)}>
                  <ArrowsRightLeftIcon className="h-3 w-3 cursor-pointer" aria-hidden="true" />
                </button>
              </div>
              {swapBack ? <ExchangeBackInfoContainer /> : <ExchangeToTokenInfoContainer />}
            </div>
          </div>
        </div>
        <div className="w-full mt-8 px-6 max-w-screen-md flex flex-col gap-y-2 items-stretch">
          <div>Fill Ether (from admin):</div>
          <div>
            <EtherInput value={fillEther} onChange={setFillEther} />
          </div>
          <div className="flex flex-row justify-center">
            <div className="w-full max-w-52">
              <LotteryButton
                label={_getLabel("Fill")}
                loading={isWaitWriting}
                isError={!isAdmin}
                disabled={!isAdmin}
                onClick={() => fillEtherAction(parseEther(fillEther))}
              />
            </div>
          </div>
          <div>Tap Ether (to admin):</div>
          <div>
            <EtherInput value={tapEther} onChange={setTapEther} />
          </div>
          <div className="flex flex-row justify-center">
            <div className="w-full max-w-52">
              <LotteryButton
                label={_getLabel("Tap")}
                loading={isWaitWriting}
                isError={!isAdmin}
                disabled={!isAdmin}
                onClick={() => tapEtherAction(parseEther(tapEther))}
              />
            </div>
          </div>

          <div>Exchange Rate (per 1 {etherSymbol}):</div>
          <div>
            <ItimTokenInput
              value={exchangeRate}
              onChange={setExchangeRate}
              unit={`${itimSymbol}/${etherSymbol}`}
            ></ItimTokenInput>
          </div>
          <div className="flex flex-row justify-center">
            <div className="w-full max-w-52">
              <LotteryButton
                label={_getLabel("Set Rate")}
                loading={isWaitWriting}
                isError={!isAdmin}
                disabled={!isAdmin}
                onClick={() => updateExchangeRate(parseEther(exchangeRate))}
              />
            </div>
          </div>
          <div>Fee Exchange To Rate (per 1 {itimSymbol}):</div>
          <div>
            <ItimTokenInput
              value={feeExchangeToRate}
              onChange={setFeeExchangeToRate}
              unit={`${itimSymbol}/1 ${itimSymbol}`}
            ></ItimTokenInput>
          </div>
          <div>Fee Exchange Back Rate (per 1 {itimSymbol}):</div>
          <div>
            <ItimTokenInput
              value={feeExchangeBackRate}
              onChange={setFeeExchangeBackRate}
              unit={`${itimSymbol}/1 ${itimSymbol}`}
            ></ItimTokenInput>
          </div>
          <div className="flex flex-row justify-center">
            <div className="w-full max-w-52">
              <LotteryButton
                label={_getLabel("Set Rate")}
                loading={isWaitWriting}
                isError={!isAdmin}
                disabled={!isAdmin}
                onClick={() => updateFeeRate(parseEther(feeExchangeToRate), parseEther(feeExchangeBackRate))}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExchangeAdmin;
