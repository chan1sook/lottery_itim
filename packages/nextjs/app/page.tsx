"use client";

import { ActiveRoomContainer } from "./_components/ActiveRoomContainer";
import { BuyLotteryContainer } from "./_components/BuyLotteryContainer";
import { CountdownContainer } from "./_components/CountdownContainer";
import { CurrentTimeProvider } from "./_components/CurrentTimeProvider";
import { GameContainer } from "./_components/GameContainer";
import { GameIdContainer } from "./_components/GameIdContainer";
import { IconsGroup } from "./_components/IconsGroup";
import { NextDrawContainer } from "./_components/NextDrawContainer";
import type { NextPage } from "next";
import { Fa1, Fa2, Fa3, Fa4, FaMinus, FaQuestion } from "react-icons/fa6";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const expiredTime = new Date(2024, 9, 30, 2);

  return (
    <>
      <CurrentTimeProvider>
        <div className="flex items-center flex-col flex-grow pt-10">
          <div className="px-5">
            <h1 className="text-center">
              <span className="block text-4xl font-bold">Lottery Project</span>
            </h1>
            <div className="flex justify-center items-center space-x-2">
              <p className="my-2 font-medium">Connected Address:</p>
              <Address address={connectedAddress} />
            </div>
          </div>
          <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
            <div className="flex flex-wrap justify-center items-center gap-12 flex-col md:flex-row md:overflow-y-auto">
              <GameContainer
                icon={
                  <IconsGroup>
                    <Fa1 />
                    <Fa2 />
                  </IconsGroup>
                }
                countdown={
                  <div className="flex flex-col gap-y-2">
                    <GameIdContainer gameId="abcdef" />
                    <CountdownContainer countdownTo={expiredTime} />
                    <NextDrawContainer expiredTime={expiredTime} />
                  </div>
                }
                footer={<BuyLotteryContainer />}
              >
                2 Digits Game
              </GameContainer>
              <GameContainer
                icon={
                  <IconsGroup>
                    <Fa1 />
                    <Fa2 />
                    <Fa3 />
                  </IconsGroup>
                }
                countdown={
                  <div className="flex flex-col gap-y-2">
                    <GameIdContainer gameId="abcdef" />
                    <CountdownContainer countdownTo={expiredTime} />
                    <NextDrawContainer expiredTime={expiredTime} />
                  </div>
                }
                footer={<BuyLotteryContainer />}
              >
                3 Digits Game
              </GameContainer>
              <GameContainer
                icon={
                  <IconsGroup>
                    <Fa1 />
                    <Fa2 />
                    <Fa3 />
                    <Fa4 />
                  </IconsGroup>
                }
                countdown={
                  <div className="flex flex-col gap-y-2">
                    <GameIdContainer gameId="abcdef" />
                    <CountdownContainer countdownTo={expiredTime} />
                    <NextDrawContainer expiredTime={expiredTime} />
                  </div>
                }
                footer={<BuyLotteryContainer />}
              >
                4 Digits Game
              </GameContainer>
              <GameContainer
                icon={
                  <IconsGroup>
                    <Fa1 />
                    <FaQuestion />
                    <Fa1 />
                    <Fa2 />
                  </IconsGroup>
                }
                countdown={<ActiveRoomContainer activeRoom={7} activePlayer={7} maxPlayer={12} />}
                footer={<BuyLotteryContainer buyLabel="Join" />}
              >
                12 Numbers Game
              </GameContainer>
              <GameContainer
                icon={
                  <IconsGroup>
                    <Fa1 />
                    <FaMinus />
                    <Fa2 />
                  </IconsGroup>
                }
                countdown={<ActiveRoomContainer activeRoom={7} activePlayer={7} maxPlayer={12} />}
                footer={<BuyLotteryContainer buyLabel="Join" />}
              >
                Odd-Even Game
              </GameContainer>
            </div>
          </div>
        </div>
      </CurrentTimeProvider>
    </>
  );
};

export default Home;
