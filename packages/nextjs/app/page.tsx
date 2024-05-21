"use client";

import { BuyLotteryContainer } from "./_components/BuyLotteryContainer";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { ConnectAddressContainer } from "~~/components/ConnectAddressContainer";
import { ActiveRoomContainer } from "~~/components/lottery-containers/ActiveRoomContainer";
import {
  Digit2LotteryContainer,
  Digit3LotteryContainer,
  Digit4LotteryContainer,
  OddEvenLotteryContainer,
  TwelveNumbersLotteryContainer,
} from "~~/components/lottery-containers/DetailGameContainer";
import { LotteryCowndownContainer } from "~~/components/lottery-containers/LotteryCountdownContainer";
import { useIsLotteryContractAdmin } from "~~/hooks/useLotteryContractData";
import { useLastestLotteryData } from "~~/hooks/useLotteryData";

const Home: NextPage = () => {
  const [lottery2DigitsData, lottery3DigitsData, lottery4DigitsData, lottery12NumbersData, lotteryOddEvenData] = [
    useLastestLotteryData("ItimLottery2Digits"),
    useLastestLotteryData("ItimLottery3Digits"),
    useLastestLotteryData("ItimLottery4Digits"),
    useLastestLotteryData("ItimLottery12Numbers"),
    useLastestLotteryData("ItimLotteryOddEven"),
  ];
  const { address } = useAccount();

  const [
    isLottery2DigitsAdmin,
    isLottery3DigitsAdmin,
    isLottery4DigitsAdmin,
    isLottery12NumbersAdmin,
    isLotteryOddEvenAdmin,
  ] = [
    useIsLotteryContractAdmin("ItimLottery2Digits", address),
    useIsLotteryContractAdmin("ItimLottery3Digits", address),
    useIsLotteryContractAdmin("ItimLottery4Digits", address),
    useIsLotteryContractAdmin("ItimLottery12Numbers", address),
    useIsLotteryContractAdmin("ItimLotteryOddEven", address),
  ];

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">Lottery Project</span>
          </h1>
          <ConnectAddressContainer />
        </div>
        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex flex-wrap justify-center items-stretch gap-12 flex-col md:flex-row md:overflow-y-auto">
            <Digit2LotteryContainer
              footer={
                <BuyLotteryContainer
                  id={lottery2DigitsData.id.toString()}
                  gameName="digits2"
                  lotteryData={lottery2DigitsData}
                  adminMode={isLottery2DigitsAdmin}
                />
              }
            >
              <LotteryCowndownContainer lotteryData={lottery2DigitsData} />
            </Digit2LotteryContainer>
            <Digit3LotteryContainer
              footer={
                <BuyLotteryContainer
                  id={lottery3DigitsData.id.toString()}
                  gameName="digits3"
                  lotteryData={lottery3DigitsData}
                  adminMode={isLottery3DigitsAdmin}
                />
              }
            >
              <LotteryCowndownContainer lotteryData={lottery3DigitsData} />
            </Digit3LotteryContainer>
            <Digit4LotteryContainer
              footer={
                <BuyLotteryContainer
                  id={lottery4DigitsData.id.toString()}
                  gameName="digits4"
                  lotteryData={lottery4DigitsData}
                  adminMode={isLottery4DigitsAdmin}
                />
              }
            >
              <LotteryCowndownContainer lotteryData={lottery4DigitsData} />
            </Digit4LotteryContainer>
            <TwelveNumbersLotteryContainer
              footer={
                <BuyLotteryContainer
                  id={lottery12NumbersData.id.toString()}
                  gameName="twelveNum"
                  lotteryData={lottery12NumbersData}
                  adminMode={isLottery12NumbersAdmin}
                />
              }
            >
              <ActiveRoomContainer lotteryData={lottery12NumbersData} />
            </TwelveNumbersLotteryContainer>
            <OddEvenLotteryContainer
              footer={
                <BuyLotteryContainer
                  id={lotteryOddEvenData.id.toString()}
                  gameName="oddEven"
                  lotteryData={lotteryOddEvenData}
                  adminMode={isLotteryOddEvenAdmin}
                />
              }
            >
              <ActiveRoomContainer lotteryData={lotteryOddEvenData} />
            </OddEvenLotteryContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
