type ActiveRoomContainerProps = {
  activeRoom?: number;
  activePlayer?: number;
  maxPlayer?: number;
};

export const ActiveRoomContainer = ({ activeRoom, activePlayer, maxPlayer }: ActiveRoomContainerProps) => {
  const actualRoom = activeRoom || 0;
  return (
    <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
      <div className="flex flex-col">
        <span className="countdown font-mono text-3xl">
          <span className="mx-auto" style={{ "--value": Math.min(actualRoom, 99) }}></span>
          {actualRoom > 99 ? "+" : ""}
        </span>
        rooms
      </div>
      <div className="flex flex-col">
        <span className="countdown font-mono text-3xl">
          <span style={{ "--value": activePlayer || 0 }}></span>/<span style={{ "--value": maxPlayer || 0 }}></span>
        </span>
        players
      </div>
    </div>
  );
};
