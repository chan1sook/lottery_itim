"use client";

import Link from "next/link";
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
import { LotteryData, LotteryState, useLastestLotteryData } from "~~/hooks/useLotteryData";
import { useTokenSymbol } from "~~/hooks/useTokenData";
import {
  lottery2DigitsContractName,
  lottery3DigitsContractName,
  lottery4DigitsContractName,
  lottery12NumbersRoom10ContractName,
  lottery12NumbersRoom20ContractName,
  lottery12NumbersRoom50ContractName,
  lottery12NumbersRoom100ContractName,
  lottery12NumbersRoom500ContractName,
  lotteryOddEvenContractName,
} from "~~/utils/extra";

type BuyLotteryContainerProp = {
  id: string;
  buyLabel?: string;
  gameName?: string;
  lotteryData: LotteryData;
  adminMode?: boolean;
};

const BuyLotteryContainer = ({ id, buyLabel, gameName, lotteryData, adminMode }: BuyLotteryContainerProp) => {
  let linkInfix = id;
  if (gameName) {
    linkInfix = `${gameName}/${linkInfix}`;
  }

  const isCheckMode = lotteryData.state === LotteryState.DRAWED;
  const isMultipleRoom = (lotteryData.contractData.roomCapacity || BigInt(1)) > BigInt(1);

  return (
    <div className="self-center w-full max-w-sm join rounded">
      {isCheckMode ? (
        <Link className="flex-1 join-item btn btn-secondary" href={`/lottery/${linkInfix}/claim`}>
          Claim
        </Link>
      ) : isMultipleRoom ? (
        <Link className="flex-1 join-item btn btn-secondary" href={`/lottery/${gameName}/buy`}>
          {buyLabel || "Buy"}
        </Link>
      ) : (
        <Link className="flex-1 join-item btn btn-secondary" href={`/lottery/${linkInfix}/buy`}>
          {buyLabel || "Buy"}
        </Link>
      )}
      <Link className="flex-1 join-item btn" href={`/lottery/${gameName}/claim`}>
        Check
      </Link>
      {adminMode && (
        <Link
          className="flex-1 join-item btn btn-accent"
          href={gameName ? `/lottery/${gameName}/manage` : `/lottery/manage`}
        >
          Manage
        </Link>
      )}
    </div>
  );
};

const Home: NextPage = () => {
  const [
    lottery2DigitsData,
    lottery3DigitsData,
    lottery4DigitsData,
    lottery12NumbersDataRoom10,
    lottery12NumbersDataRoom20,
    lottery12NumbersDataRoom50,
    lottery12NumbersDataRoom100,
    lottery12NumbersDataRoom500,
    lotteryOddEvenData,
  ] = [
    useLastestLotteryData(lottery2DigitsContractName),
    useLastestLotteryData(lottery3DigitsContractName),
    useLastestLotteryData(lottery4DigitsContractName),
    useLastestLotteryData(lottery12NumbersRoom10ContractName),
    useLastestLotteryData(lottery12NumbersRoom20ContractName),
    useLastestLotteryData(lottery12NumbersRoom50ContractName),
    useLastestLotteryData(lottery12NumbersRoom100ContractName),
    useLastestLotteryData(lottery12NumbersRoom500ContractName),
    useLastestLotteryData(lotteryOddEvenContractName),
  ];
  const { address } = useAccount();

  const [
    isLottery2DigitsAdmin,
    isLottery3DigitsAdmin,
    isLottery4DigitsAdmin,
    isLottery12NumbersAdminRoom10,
    isLottery12NumbersAdminRoom20,
    isLottery12NumbersAdminRoom50,
    isLottery12NumbersAdminRoom100,
    isLottery12NumbersAdminRoom500,
    isLotteryOddEvenAdmin,
  ] = [
    useIsLotteryContractAdmin(lottery2DigitsContractName, address),
    useIsLotteryContractAdmin(lottery3DigitsContractName, address),
    useIsLotteryContractAdmin(lottery4DigitsContractName, address),
    useIsLotteryContractAdmin(lottery12NumbersRoom10ContractName, address),
    useIsLotteryContractAdmin(lottery12NumbersRoom20ContractName, address),
    useIsLotteryContractAdmin(lottery12NumbersRoom50ContractName, address),
    useIsLotteryContractAdmin(lottery12NumbersRoom100ContractName, address),
    useIsLotteryContractAdmin(lottery12NumbersRoom500ContractName, address),
    useIsLotteryContractAdmin(lotteryOddEvenContractName, address),
  ];

  const tokenSymbol = useTokenSymbol();

  function formatRoomWithToken(n: number) {
    return `(${n} ${typeof tokenSymbol === "string" ? tokenSymbol : "ETH"})`;
  }

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
            <div className="border-2 border-primary px-8 py-8 flex flex-col gap-4">
              <div className="text-2xl font-bold text-center">12 Numbers Game Section</div>
              <div className="flex flex-wrap justify-center items-stretch gap-12 flex-col md:flex-row md:overflow-y-auto">
                <TwelveNumbersLotteryContainer
                  roomStr={formatRoomWithToken(10)}
                  footer={
                    <BuyLotteryContainer
                      id={lottery12NumbersDataRoom10.id.toString()}
                      gameName="twelveNum/room10"
                      lotteryData={lottery12NumbersDataRoom10}
                      adminMode={isLottery12NumbersAdminRoom10}
                    />
                  }
                >
                  <ActiveRoomContainer lotteryData={lottery12NumbersDataRoom10} />
                </TwelveNumbersLotteryContainer>
                <TwelveNumbersLotteryContainer
                  roomStr={formatRoomWithToken(20)}
                  footer={
                    <BuyLotteryContainer
                      id={lottery12NumbersDataRoom20.id.toString()}
                      gameName="twelveNum/room20"
                      lotteryData={lottery12NumbersDataRoom20}
                      adminMode={isLottery12NumbersAdminRoom20}
                    />
                  }
                >
                  <ActiveRoomContainer lotteryData={lottery12NumbersDataRoom20} />
                </TwelveNumbersLotteryContainer>
                <TwelveNumbersLotteryContainer
                  roomStr={formatRoomWithToken(50)}
                  footer={
                    <BuyLotteryContainer
                      id={lottery12NumbersDataRoom50.id.toString()}
                      gameName="twelveNum/room50"
                      lotteryData={lottery12NumbersDataRoom50}
                      adminMode={isLottery12NumbersAdminRoom50}
                    />
                  }
                >
                  <ActiveRoomContainer lotteryData={lottery12NumbersDataRoom50} />
                </TwelveNumbersLotteryContainer>
                <TwelveNumbersLotteryContainer
                  roomStr={formatRoomWithToken(100)}
                  footer={
                    <BuyLotteryContainer
                      id={lottery12NumbersDataRoom100.id.toString()}
                      gameName="twelveNum/room100"
                      lotteryData={lottery12NumbersDataRoom100}
                      adminMode={isLottery12NumbersAdminRoom100}
                    />
                  }
                >
                  <ActiveRoomContainer lotteryData={lottery12NumbersDataRoom100} />
                </TwelveNumbersLotteryContainer>
                <TwelveNumbersLotteryContainer
                  roomStr={formatRoomWithToken(500)}
                  footer={
                    <BuyLotteryContainer
                      id={lottery12NumbersDataRoom500.id.toString()}
                      gameName="twelveNum/room500"
                      lotteryData={lottery12NumbersDataRoom500}
                      adminMode={isLottery12NumbersAdminRoom500}
                    />
                  }
                >
                  <ActiveRoomContainer lotteryData={lottery12NumbersDataRoom500} />
                </TwelveNumbersLotteryContainer>
              </div>
            </div>
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
