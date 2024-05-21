"use client";

import { useState } from "react";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { ActiveRoomContainer } from "~~/components/lottery-containers/ActiveRoomContainer";
import { OddEvenLotteryContainer } from "~~/components/lottery-containers/DetailGameContainer";
import { OddEvenLotteryRewardContainer } from "~~/components/lottery-containers/RewardContainer";
import { ClaimPageContainer } from "~~/components/subpage/ClaimPageContainer";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { LotteryBasicContractName } from "~~/hooks/useLotteryContractData";
import { useLotteryNumberData } from "~~/hooks/useLotteryNumberData";

type PageProps = {
  params: { id?: string };
};
const ClaimLottery: NextPage<PageProps> = ({ params }: PageProps) => {
  const id = BigInt(typeof params.id === "string" ? params.id : "0");
  const [lotteryNumber, setLotteryNumber] = useState(BigInt(0));

  const contractName: LotteryBasicContractName = "ItimLotteryOddEven";
  const { isPending, isMining, writeContractAsync2: writeContractAsync } = useScaffoldWriteContract(contractName);
  const { address } = useAccount();

  const lotteryNumberData = useLotteryNumberData({
    id: id,
    contractName: contractName,
    lotteryNumber: lotteryNumber,
  });
  const lotteryData = lotteryNumberData.lotteryData;

  async function claimLottery() {
    await writeContractAsync({
      functionName: "claimLottery",
      args: [id, lotteryNumber],
    });
  }

  return (
    <>
      <ClaimPageContainer
        claimerAccount={address}
        lotteryNumber={lotteryNumber}
        setLotteryNumber={setLotteryNumber}
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
      </ClaimPageContainer>
    </>
  );
};

export default ClaimLottery;