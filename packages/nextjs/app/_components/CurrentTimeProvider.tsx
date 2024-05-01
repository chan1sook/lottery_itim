import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";
import { useInterval } from "react-interval-hook";

export const CurrentTimeContext = createContext(new Date());
export const SetCurrentTimeContext = createContext<Dispatch<SetStateAction<Date>>>(() => undefined);

export const CurrentTimeProvider = ({ children }: { children: ReactNode }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  return (
    <CurrentTimeContext.Provider value={currentTime}>
      <SetCurrentTimeContext.Provider value={setCurrentTime}>{children}</SetCurrentTimeContext.Provider>
    </CurrentTimeContext.Provider>
  );
};
