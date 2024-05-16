"use client";

import { useState } from "react";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { Digit2LotteryContainer } from "~~/components/lottery-containers/DetailGameContainer";
import { LotteryCowndownContainer } from "~~/components/lottery-containers/LotteryCountdownContainer";
import { Digit2LotteryRewardContainer } from "~~/components/lottery-containers/RewardContainer";
import { IntegerVariant, isValidInteger } from "~~/components/scaffold-eth";
import { BuyPageContainer } from "~~/components/subpage/BuyPageContainer";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { LotteryBasicContractName } from "~~/hooks/useLotteryContractData";
import { useLotteryNumberData } from "~~/hooks/useLotteryNumberData";

type PageProps = {
  params: { id?: string };
};
const BuyLottery: NextPage<PageProps> = ({ params }: PageProps) => {
  const id = typeof params.id === "string" ? params.id : "0";
  const [lotteryNumber, setLotteryNumber] = useState("");

  const contractName: LotteryBasicContractName = "ItimLottery2Digits";
  const { isPending, isMining, writeContractAsync2: writeContractAsync } = useScaffoldWriteContract(contractName);
  const { address } = useAccount();

  const lotteryNumberData = useLotteryNumberData({
    id: BigInt(id),
    contractName: contractName,
    lotteryNumber: isValidInteger(IntegerVariant.UINT256, lotteryNumber) ? BigInt(lotteryNumber) : BigInt(0),
  });
  const lotteryData = lotteryNumberData.lotteryData;

  async function buyLottery() {
    await writeContractAsync({
      functionName: "buyLottery",
      args: [BigInt(id), BigInt(lotteryNumber)],
    });
  }

  return (
    <>
      <BuyPageContainer
        buyerAccount={address}
        lotteryNumber={lotteryNumber}
        setLotteryNumber={setLotteryNumber}
        isBusy={isPending || isMining}
        lotteryNumberData={lotteryNumberData}
        doBuyLottery={buyLottery}
      >
        <div className="my-8 w-full px-8 py-8 bg-base-300 flex flex-col flex-wrap md:flex-row gap-2 items-center justify-center">
          <Digit2LotteryContainer>
            <LotteryCowndownContainer lotteryData={lotteryData} />
          </Digit2LotteryContainer>
          <Digit2LotteryRewardContainer contractData={lotteryData.contractData} />
        </div>
      </BuyPageContainer>
    </>
  );
};

export default BuyLottery;
