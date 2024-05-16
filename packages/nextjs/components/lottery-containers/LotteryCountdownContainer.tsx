"use client";

import { FlipperContainer } from "../FlipperContainer";
import { CountdownContainer } from "./CountdownContainer";
import { ExpiredDayContainer } from "./_components/ExpiredDayContainer";
import { GameIdContainer } from "./_components/GameIdContainer";
import { LotteryStatusContainer } from "./_components/LotteryStatusContainer";
import { LotteryData, LotteryState } from "~~/hooks/useLotteryData";

export const LotteryCowndownContainer = ({ lotteryData }: { lotteryData: LotteryData }) => {
  return (
    <div className="flex flex-col gap-y-2">
      <GameIdContainer gameId={lotteryData.id.toString()} />
      <FlipperContainer value={lotteryData.state}>
        {lotteryData.state == LotteryState.OPENING ? (
          <CountdownContainer countdownTo={lotteryData.expired} />
        ) : (
          <LotteryStatusContainer lotteryData={lotteryData} />
        )}
      </FlipperContainer>
      <ExpiredDayContainer expiredTime={lotteryData.expired} />
    </div>
  );
};
