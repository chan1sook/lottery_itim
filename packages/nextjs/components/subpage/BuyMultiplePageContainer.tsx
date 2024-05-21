import { Dispatch, ReactNode, SetStateAction } from "react";
import { LotteryNumberRangeContainer } from "../lottery-containers/LotteryNumberRangeContainer";
import { ItimTokenInput } from "../scaffold-eth/Input/ItimTokenInput";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { formatEther } from "viem";
import { ConnectAddressContainer } from "~~/components/ConnectAddressContainer";
import { LotteryButton } from "~~/components/LotteryButton";
import { IntegerInput, IntegerVariant, isValidInteger } from "~~/components/scaffold-eth";
import { useLotteryActiveRoomAt } from "~~/hooks/useLotteryActiveRoomAt";
import { LotteryState } from "~~/hooks/useLotteryData";
import { LotteryNumberData } from "~~/hooks/useLotteryNumberData";
import { noOp } from "~~/utils/extra";

type BuyMultiplePageContainerProp = {
  children?: ReactNode;
  buyerAccount?: string;
  lotteryNumberData: LotteryNumberData;
  lotteryNumber: bigint;
  roomNth: bigint;
  isBusy?: boolean;
  setLotteryNumber: Dispatch<SetStateAction<bigint>>;
  setRoomNth: Dispatch<SetStateAction<bigint>>;
  doBuyLottery: () => void;
};

export const BuyMultiplePageContainer = ({
  children,
  buyerAccount,
  lotteryNumberData,
  lotteryNumber,
  roomNth,
  isBusy,
  setLotteryNumber,
  setRoomNth,
  doBuyLottery,
}: BuyMultiplePageContainerProp) => {
  const lotteryData = lotteryNumberData.lotteryData;
  const contractData = lotteryData.contractData;
  const isNumberInvalid = !(isValidInteger(IntegerVariant.UINT256, lotteryNumber) && lotteryNumberData.valid);
  const isCanBuy = lotteryData.state === LotteryState.OPENING;
  const isNotReady = [LotteryState.NOT_STARTED, LotteryState.DECLARED].includes(lotteryData.state);
  const stateErrorStr = isNotReady ? "Not Ready" : "Expired";
  const isError = !buyerAccount || lotteryNumberData.owned || isNumberInvalid || !isCanBuy;

  const roomId = useLotteryActiveRoomAt({ contractName: contractData.contractName, nth: roomNth });
  const roomActive = contractData.roomActive || BigInt(0);
  if (roomActive < roomNth && roomActive != BigInt(0)) {
    setRoomNth(roomActive - BigInt(1));
  }

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
        <div className="flex flex-row items-center join rounded-sm">
          <button
            className="btn btn-md btn-primary join-item"
            disabled={isBusy || roomNth <= BigInt(0)}
            onClick={() => setRoomNth(n => n - BigInt(1))}
          >
            <FaChevronLeft />
          </button>
          <div className="flex-1 bg-white min-w-36 px-4 py-3 text-center join-item select-none">
            #{typeof roomId === "bigint" ? roomId.toString() : "?"}
          </div>
          <button
            className="btn btn-md btn-primary join-item"
            disabled={isBusy || roomNth > roomActive - BigInt(2)}
            onClick={() => setRoomNth(n => n + BigInt(1))}
          >
            <FaChevronRight />
          </button>
        </div>
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
