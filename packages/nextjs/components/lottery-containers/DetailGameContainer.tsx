import { ReactNode } from "react";
import { GameContainer } from "./GameContainer";
import { IconsGroup } from "./_components/IconsGroup";
import { Fa1, Fa2, Fa3, Fa4, FaMinus, FaQuestion } from "react-icons/fa6";

type DetailLotteryContainerProp = {
  children?: ReactNode;
  footer?: ReactNode;
};

export const Digit2LotteryContainer = ({ children, footer }: DetailLotteryContainerProp) => {
  return (
    <GameContainer
      icon={
        <IconsGroup>
          <Fa1 />
          <Fa2 />
        </IconsGroup>
      }
      footer={footer}
      countdown={children}
    >
      2 Digits Game
    </GameContainer>
  );
};

export const Digit3LotteryContainer = ({ children, footer }: DetailLotteryContainerProp) => {
  return (
    <GameContainer
      icon={
        <IconsGroup>
          <Fa1 />
          <Fa2 />
          <Fa3 />
        </IconsGroup>
      }
      footer={footer}
      countdown={children}
    >
      3 Digits Game
    </GameContainer>
  );
};

export const Digit4LotteryContainer = ({ children, footer }: DetailLotteryContainerProp) => {
  return (
    <GameContainer
      icon={
        <IconsGroup>
          <Fa1 />
          <Fa2 />
          <Fa3 />
          <Fa4 />
        </IconsGroup>
      }
      footer={footer}
      countdown={children}
    >
      4 Digits Game
    </GameContainer>
  );
};

export const TwelveNumbersLotteryContainer = ({ children, footer }: DetailLotteryContainerProp) => {
  return (
    <GameContainer
      icon={
        <IconsGroup>
          <Fa1 />
          <FaQuestion />
          <Fa1 />
          <Fa2 />
        </IconsGroup>
      }
      footer={footer}
      countdown={children}
    >
      12 Numbers Game
    </GameContainer>
  );
};

export const OddEvenLotteryContainer = ({ children, footer }: DetailLotteryContainerProp) => {
  return (
    <GameContainer
      icon={
        <IconsGroup>
          <Fa1 />
          <FaMinus />
          <Fa2 />
        </IconsGroup>
      }
      footer={footer}
      countdown={children}
    >
      Odd-Even Game
    </GameContainer>
  );
};