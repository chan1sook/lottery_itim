"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { ActiveRoomContainer } from "~~/components/lottery-containers/ActiveRoomContainer";
import { TwelveNumbersLotteryContainer } from "~~/components/lottery-containers/DetailGameContainer";
import { TwelveNumberLotteryRewardContainer } from "~~/components/lottery-containers/RewardContainer";
import { StatusBadge } from "~~/components/lottery-containers/StatusBadge";
import { ManageLotteryContainer } from "~~/components/subpage/ManageLotteryContainer";
import { useLastestLotteryData } from "~~/hooks/useLotteryData";
import { lottery12NumbersRoom20ContractName } from "~~/utils/extra";

const ManageLottery: NextPage = () => {
  const contractName = lottery12NumbersRoom20ContractName;
  const { address } = useAccount();
  const lotteryData = useLastestLotteryData(contractName);

  return (
    <>
      <ManageLotteryContainer adminAccount={address} lotteryData={lotteryData}>
        <div className="w-full flex flex-col flex-wrap md:flex-row gap-2 items-center justify-center">
          <TwelveNumbersLotteryContainer>
            <div className="flex flex-col gap-y-2 items-center">
              <ActiveRoomContainer lotteryData={lotteryData} />
              <StatusBadge state={lotteryData.state} />
            </div>
          </TwelveNumbersLotteryContainer>
          <TwelveNumberLotteryRewardContainer contractData={lotteryData.contractData} />
        </div>
      </ManageLotteryContainer>
    </>
  );
};

export default ManageLottery;
