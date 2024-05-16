"use client";

import { useState } from "react";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { Digit4LotteryContainer } from "~~/components/lottery-containers/DetailGameContainer";
import { LotteryCowndownContainer } from "~~/components/lottery-containers/LotteryCountdownContainer";
import { Digit4LotteryRewardContainer } from "~~/components/lottery-containers/RewardContainer";
import { IntegerVariant, isValidInteger } from "~~/components/scaffold-eth";
import { ClaimPageContainer } from "~~/components/subpage/ClaimPageContainer";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { LotteryBasicContractName } from "~~/hooks/useLotteryContractData";
import { useLotteryNumberData } from "~~/hooks/useLotteryNumberData";

type PageProps = {
  params: { id?: string };
};
const ClaimLottery: NextPage<PageProps> = ({ params }: PageProps) => {
  const id = typeof params.id === "string" ? params.id : "0";
  const [lotteryNumber, setLotteryNumber] = useState("");

  const contractName: LotteryBasicContractName = "ItimLottery4Digits";
  const { isPending, isMining, writeContractAsync2: writeContractAsync } = useScaffoldWriteContract(contractName);
  const { address } = useAccount();

  const lotteryNumberData = useLotteryNumberData({
    id: BigInt(id),
    contractName: contractName,
    lotteryNumber: isValidInteger(IntegerVariant.UINT256, lotteryNumber) ? BigInt(lotteryNumber) : BigInt(0),
  });
  const lotteryData = lotteryNumberData.lotteryData;

  async function claimLottery() {
    await writeContractAsync({
      functionName: "claimLottery",
      args: [BigInt(id), BigInt(lotteryNumber)],
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
          <Digit4LotteryContainer>
            <LotteryCowndownContainer lotteryData={lotteryData} />
          </Digit4LotteryContainer>
          <Digit4LotteryRewardContainer contractData={lotteryData.contractData} />
        </div>
      </ClaimPageContainer>
    </>
  );
};

export default ClaimLottery;