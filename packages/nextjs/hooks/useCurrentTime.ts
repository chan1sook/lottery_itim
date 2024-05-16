import { useState } from "react";
import { useInterval } from "react-interval-hook";

export const useCurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  return currentTime;
};
