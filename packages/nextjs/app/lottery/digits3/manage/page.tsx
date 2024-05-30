"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { Digit3LotteryContainer } from "~~/components/lottery-containers/DetailGameContainer";
import { LotteryCowndownContainer } from "~~/components/lottery-containers/LotteryCountdownContainer";
import { Digit3LotteryRewardContainer } from "~~/components/lottery-containers/RewardContainer";
import { StatusBadge } from "~~/components/lottery-containers/StatusBadge";
import { ManageLotteryContainer } from "~~/components/subpage/ManageLotteryContainer";
import { useLastestLotteryData } from "~~/hooks/useLotteryData";
import { lottery3DigitsContractName } from "~~/utils/extra";

const ManageLottery: NextPage = () => {
  const contractName = lottery3DigitsContractName;
  const { address } = useAccount();
  const lotteryData = useLastestLotteryData(contractName);

  return (
    <>
      <ManageLotteryContainer adminAccount={address} lotteryData={lotteryData}>
        <div className="w-full flex flex-col flex-wrap md:flex-row gap-2 items-center justify-center">
          <Digit3LotteryContainer>
            <div className="flex flex-col gap-y-2 items-center">
              <LotteryCowndownContainer lotteryData={lotteryData} />
              <StatusBadge state={lotteryData.state} />
            </div>
          </Digit3LotteryContainer>
          <Digit3LotteryRewardContainer contractData={lotteryData.contractData} />
        </div>
      </ManageLotteryContainer>
    </>
  );
};

export default ManageLottery;
