"use client";

import { useState } from "react";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { Digit3LotteryContainer } from "~~/components/lottery-containers/DetailGameContainer";
import { LotteryCowndownContainer } from "~~/components/lottery-containers/LotteryCountdownContainer";
import { Digit3LotteryRewardContainer } from "~~/components/lottery-containers/RewardContainer";
import { BuyMultiplePageContainer } from "~~/components/subpage/BuyMultiplePageContainer";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useLotteryActiveRoomAt } from "~~/hooks/useLotteryActiveRoomAt";
import { LotteryBasicContractName } from "~~/hooks/useLotteryContractData";
import { useLotteryNumberData } from "~~/hooks/useLotteryNumberData";

const BuyLottery: NextPage = () => {
  const [roomNth, setRoomNth] = useState(BigInt(0));
  const [lotteryNumber, setLotteryNumber] = useState(BigInt(0));

  const contractName: LotteryBasicContractName = "ItimLottery3Digits";
  const { isPending, isMining, writeContractAsync2: writeContractAsync } = useScaffoldWriteContract(contractName);
  const { address } = useAccount();

  const roomId = useLotteryActiveRoomAt({ contractName: contractName, nth: roomNth }) || BigInt(0);
  const lotteryNumberData = useLotteryNumberData({
    id: roomId,
    contractName: contractName,
    lotteryNumber: lotteryNumber,
  });
  const lotteryData = lotteryNumberData.lotteryData;

  async function buyLottery() {
    await writeContractAsync({
      functionName: "buyLottery",
      args: [roomId, lotteryNumber],
    });
  }

  return (
    <>
      <BuyMultiplePageContainer
        buyerAccount={address}
        lotteryNumber={lotteryNumber}
        roomNth={roomNth}
        setLotteryNumber={setLotteryNumber}
        setRoomNth={setRoomNth}
        isBusy={isPending || isMining}
        lotteryNumberData={lotteryNumberData}
        doBuyLottery={buyLottery}
      >
        <div className="my-8 w-full px-8 py-8 bg-base-300 flex flex-col flex-wrap md:flex-row gap-2 items-center justify-center">
          <Digit3LotteryContainer>
            <LotteryCowndownContainer lotteryData={lotteryData} />
          </Digit3LotteryContainer>
          <Digit3LotteryRewardContainer contractData={lotteryData.contractData} />
        </div>
      </BuyMultiplePageContainer>
    </>
  );
};

export default BuyLottery;
