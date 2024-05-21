"use client";

import { useState } from "react";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { ActivePlayerContainer } from "~~/components/lottery-containers/ActiveRoomContainer";
import { TwelveNumbersLotteryContainer } from "~~/components/lottery-containers/DetailGameContainer";
import { TwelveNumberLotteryRewardContainer } from "~~/components/lottery-containers/RewardContainer";
import { BuyPageContainer } from "~~/components/subpage/BuyPageContainer";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { LotteryBasicContractName } from "~~/hooks/useLotteryContractData";
import { useLotteryNumberData } from "~~/hooks/useLotteryNumberData";

type PageProps = {
  params: { id?: string };
};
const BuyLottery: NextPage<PageProps> = ({ params }: PageProps) => {
  const id = BigInt(typeof params.id === "string" ? params.id : "0");
  const [lotteryNumber, setLotteryNumber] = useState(BigInt(0));

  const contractName: LotteryBasicContractName = "ItimLottery12Numbers";
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
          <TwelveNumbersLotteryContainer>
            <ActivePlayerContainer lotteryData={lotteryData} />
          </TwelveNumbersLotteryContainer>
          <TwelveNumberLotteryRewardContainer contractData={lotteryData.contractData} />
        </div>
      </BuyPageContainer>
    </>
  );
};

export default BuyLottery;
