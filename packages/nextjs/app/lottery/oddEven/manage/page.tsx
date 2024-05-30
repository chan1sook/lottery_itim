"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { ActiveRoomContainer } from "~~/components/lottery-containers/ActiveRoomContainer";
import { OddEvenLotteryContainer } from "~~/components/lottery-containers/DetailGameContainer";
import { OddEvenLotteryRewardContainer } from "~~/components/lottery-containers/RewardContainer";
import { StatusBadge } from "~~/components/lottery-containers/StatusBadge";
import { ManageLotteryContainer } from "~~/components/subpage/ManageLotteryContainer";
import { useLastestLotteryData } from "~~/hooks/useLotteryData";
import { lotteryOddEvenContractName } from "~~/utils/extra";

const ManageLottery: NextPage = () => {
  const contractName = lotteryOddEvenContractName;
  const { address } = useAccount();
  const lotteryData = useLastestLotteryData(contractName);

  return (
    <>
      <ManageLotteryContainer adminAccount={address} lotteryData={lotteryData}>
        <div className="w-full flex flex-col flex-wrap md:flex-row gap-2 items-center justify-center">
          <OddEvenLotteryContainer>
            <div className="flex flex-col gap-y-2 items-center">
              <ActiveRoomContainer lotteryData={lotteryData} />
              <StatusBadge state={lotteryData.state} />
            </div>
          </OddEvenLotteryContainer>
          <OddEvenLotteryRewardContainer contractData={lotteryData.contractData} />
        </div>
      </ManageLotteryContainer>
    </>
  );
};

export default ManageLottery;
