import { Dispatch, ReactNode, SetStateAction } from "react";
import { LotteryNumberRangeContainer } from "../lottery-containers/LotteryNumberRangeContainer";
import { ItimTokenInput } from "../scaffold-eth/Input/ItimTokenInput";
import { formatEther } from "viem";
import { ConnectAddressContainer } from "~~/components/ConnectAddressContainer";
import { LotteryButton } from "~~/components/LotteryButton";
import { IntegerInput, IntegerVariant, isValidInteger } from "~~/components/scaffold-eth";
import { LotteryState } from "~~/hooks/useLotteryData";
import { LotteryNumberData } from "~~/hooks/useLotteryNumberData";
import { noOp } from "~~/utils/extra";

type BuyPageContainerProp = {
  children?: ReactNode;
  buyerAccount?: string;
  lotteryNumberData: LotteryNumberData;
  lotteryNumber: bigint;
  isBusy?: boolean;
  setLotteryNumber: Dispatch<SetStateAction<bigint>>;
  doBuyLottery: () => void;
};

export const BuyPageContainer = ({
  children,
  buyerAccount,
  lotteryNumberData,
  lotteryNumber,
  isBusy,
  setLotteryNumber,
  doBuyLottery,
}: BuyPageContainerProp) => {
  const lotteryData = lotteryNumberData.lotteryData;
  const contractData = lotteryData.contractData;
  const isNumberInvalid = !(isValidInteger(IntegerVariant.UINT256, lotteryNumber) && lotteryNumberData.valid);
  const isCanBuy = lotteryData.state === LotteryState.OPENING;
  const isNotReady = [LotteryState.NOT_STARTED, LotteryState.DECLARED].includes(lotteryData.state);
  const stateErrorStr = isNotReady ? "Not Ready" : "Expired";
  const isError = !buyerAccount || lotteryNumberData.owned || isNumberInvalid || !isCanBuy;

  function setLotteryNumberValue(val: bigint | string) {
    setLotteryNumber(typeof val === "bigint" ? val : BigInt(val));
  }

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5">
        <h1 className="text-center">
          <span className="block text-4xl font-bold">Buy Lottery</span>
        </h1>
        <ConnectAddressContainer />
      </div>
      {children}
      <div className="w-full px-6 max-w-screen-md flex flex-col gap-y-2 items-stretch">
        <div>Lottery Cost:</div>
        <div>
          <ItimTokenInput
            value={contractData.lotteryCost ? formatEther(contractData.lotteryCost) : "1.0"}
            onChange={noOp}
          ></ItimTokenInput>
        </div>

        <LotteryNumberRangeContainer contractData={contractData} />
        <div>Enter Number:</div>
        <div>
          <IntegerInput
            value={lotteryNumber}
            disabled={!isCanBuy}
            disableMultiplyBy1e18={true}
            onChange={setLotteryNumberValue}
          />
        </div>
        <div className="flex flex-row justify-center">
          <div className="w-full max-w-52">
            <LotteryButton
              label={
                !buyerAccount
                  ? "Not Connected"
                  : lotteryNumberData.owned
                  ? "Already Owned"
                  : !isCanBuy
                  ? stateErrorStr
                  : isNumberInvalid
                  ? "Invalid Number"
                  : "Buy"
              }
              warning={lotteryNumberData.owned}
              isError={isError}
              loading={isBusy}
              disabled={isError}
              onClick={doBuyLottery}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
