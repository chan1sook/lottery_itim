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

type ClaimPageContainerProp = {
  children?: ReactNode;
  claimerAccount?: string;
  lotteryNumberData: LotteryNumberData;
  lotteryNumber: string;
  isBusy?: boolean;
  setLotteryNumber: Dispatch<SetStateAction<string>>;
  doClaimLottery: () => void;
};

export const ClaimPageContainer = ({
  children,
  claimerAccount,
  lotteryNumberData,
  lotteryNumber,
  isBusy,
  setLotteryNumber,
  doClaimLottery,
}: ClaimPageContainerProp) => {
  const lotteryData = lotteryNumberData.lotteryData;
  const contractData = lotteryData.contractData;

  const isNumberInvalid = !(isValidInteger(IntegerVariant.UINT256, lotteryNumber) && lotteryNumberData.valid);
  const isCanClaim = lotteryData.state === LotteryState.DRAWED;
  const isOwned = lotteryNumberData.owner === claimerAccount;
  const isError = !claimerAccount || !isOwned || lotteryNumberData.claimed || isNumberInvalid || !isCanClaim;

  function setLotteryNumberValue(val: bigint | string) {
    setLotteryNumber(val.toString());
  }

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5">
        <h1 className="text-center">
          <span className="block text-4xl font-bold">Claim Lottery</span>
        </h1>
        <h3 className="text-center text-xl">
          <span className="font-mono">#{lotteryNumberData.id.toString()}</span>
        </h3>
        <ConnectAddressContainer />
      </div>
      {children}
      <div className="w-full px-6 max-w-screen-md flex flex-col gap-y-2 items-stretch">
        <LotteryNumberRangeContainer contractData={contractData} />
        <div>Enter Number:</div>
        <div>
          <IntegerInput
            value={lotteryNumber}
            disabled={!isCanClaim}
            disableMultiplyBy1e18={true}
            onChange={setLotteryNumberValue}
          />
        </div>
        <div>Reward:</div>
        <div>
          <ItimTokenInput
            value={lotteryNumberData.reward ? formatEther(lotteryNumberData.reward) : "0"}
            onChange={noOp}
          ></ItimTokenInput>
        </div>
        <div className="flex flex-row justify-center">
          <div className="w-full max-w-52">
            <LotteryButton
              label={
                !claimerAccount
                  ? "Not Connected"
                  : !isCanClaim
                  ? "Not Ready"
                  : !isOwned
                  ? "Not Owned"
                  : isNumberInvalid
                  ? "Invalid Number"
                  : lotteryNumberData.claimed
                  ? "Claimed"
                  : "Claim"
              }
              warning={!!claimerAccount && !isOwned}
              isError={isError}
              loading={isBusy}
              disabled={isError}
              onClick={doClaimLottery}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
