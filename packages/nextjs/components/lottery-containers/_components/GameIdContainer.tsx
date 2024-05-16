import { FlipperContainer } from "~~/components/FlipperContainer";

type GameIdContainerProp = {
  gameId: string;
};

export const GameIdContainer = ({ gameId }: GameIdContainerProp) => {
  return (
    <div className="flex flex-row items-baseline justify-center gap-x-2">
      <div className="font-mono">
        <FlipperContainer value={gameId}>{"#" + gameId}</FlipperContainer>
      </div>
    </div>
  );
};
