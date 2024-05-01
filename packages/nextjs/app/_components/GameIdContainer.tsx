type GameIdContainerProp = {
  gameId: string;
};

export const GameIdContainer = ({ gameId }: GameIdContainerProp) => {
  return (
    <div className="flex flex-row items-baseline justify-center gap-x-2">
      <span className="font-mono">#{gameId}</span>
    </div>
  );
};
