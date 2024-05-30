"use client";

import { useState } from "react";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { Digit3LotteryContainer } from "~~/components/lottery-containers/DetailGameContainer";
import { LotteryCowndownContainer } from "~~/components/lottery-containers/LotteryCountdownContainer";
import { Digit3LotteryRewardContainer } from "~~/components/lottery-containers/RewardContainer";
import { BuyPageContainer } from "~~/components/subpage/BuyPageContainer";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useLotteryNumberData } from "~~/hooks/useLotteryNumberData";
import { lottery3DigitsContractName } from "~~/utils/extra";

type PageProps = {
  params: { id?: string };
};
const BuyLottery: NextPage<PageProps> = ({ params }: PageProps) => {
  const id = BigInt(typeof params.id === "string" ? params.id : "0");
  const [lotteryNumber, setLotteryNumber] = useState(BigInt(0));

  const contractName = lottery3DigitsContractName;
  const { isPending, isMining, writeContractAsync2: writeContractAsync } = useScaffoldWriteContract(contractName);
  const { address } = useAccount();

  const lotteryNumberData = useLotteryNumberData({
    id: id,
    contractName: contractName,
    lotteryNumber: lotteryNumber,
  });
  const lotteryData = lotteryNumberData.lotteryData;

  async function buyLottery() {
    await writeContractAsync({
      functionName: "buyLottery",
      args: [id, lotteryNumber],
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
          <Digit3LotteryContainer>
            <LotteryCowndownContainer lotteryData={lotteryData} />
          </Digit3LotteryContainer>
          <Digit3LotteryRewardContainer contractData={lotteryData.contractData} />
        </div>
      </BuyPageContainer>
    </>
  );
};

export default BuyLottery;
