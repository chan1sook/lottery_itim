"use client";

import { useState } from "react";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { ActiveRoomContainer } from "~~/components/lottery-containers/ActiveRoomContainer";
import { OddEvenLotteryContainer } from "~~/components/lottery-containers/DetailGameContainer";
import { OddEvenLotteryRewardContainer } from "~~/components/lottery-containers/RewardContainer";
import { ClaimPageWithIdContainer } from "~~/components/subpage/ClaimPageWithIdContainer";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useLotteryNumberData } from "~~/hooks/useLotteryNumberData";
import { lotteryOddEvenContractName } from "~~/utils/extra";

const ClaimLottery: NextPage = () => {
  const [gameId, setGameId] = useState(BigInt(0));
  const [lotteryNumber, setLotteryNumber] = useState(BigInt(0));
  const [contractReady, setContractReady] = useState(false);

  const contractName = lotteryOddEvenContractName;
  const { isPending, isMining, writeContractAsync2: writeContractAsync } = useScaffoldWriteContract(contractName);
  const { address } = useAccount();

  const lotteryNumberData = useLotteryNumberData({
    id: BigInt(gameId),
    contractName: contractName,
    lotteryNumber: lotteryNumber,
  });
  const lotteryData = lotteryNumberData.lotteryData;
  const contractData = lotteryData.contractData;

  if (contractData.ready && !contractReady) {
    setGameId(contractData.lastestId || BigInt(0));
    setContractReady(true);
  }

  async function claimLottery() {
    await writeContractAsync({
      functionName: "claimLottery",
      args: [gameId, lotteryNumber],
    });
  }

  return (
    <>
      <ClaimPageWithIdContainer
        claimerAccount={address}
        lotteryNumber={lotteryNumber}
        gameId={gameId}
        setLotteryNumber={setLotteryNumber}
        setGameId={setGameId}
        isBusy={isPending || isMining}
        lotteryNumberData={lotteryNumberData}
        doClaimLottery={claimLottery}
      >
        <div className="my-8 w-full px-8 py-8 bg-base-300 flex flex-col flex-wrap md:flex-row gap-2 items-center justify-center">
          <OddEvenLotteryContainer>
            <ActiveRoomContainer lotteryData={lotteryData} />
          </OddEvenLotteryContainer>
          <OddEvenLotteryRewardContainer contractData={lotteryData.contractData} />
        </div>
      </ClaimPageWithIdContainer>
    </>
  );
};

export default ClaimLottery;
