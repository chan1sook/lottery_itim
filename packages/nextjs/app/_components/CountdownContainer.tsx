import { useContext } from "react";
import { CurrentTimeContext } from "./CurrentTimeProvider";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

type CountdownContainerProps = {
  currentTime?: Date;
  countdownTo: Date;
};

const DayContainer = ({ countdownTo, currentTime }: CountdownContainerProps) => {
  const contextCurrentTime = useContext(CurrentTimeContext);
  const startTime = currentTime || contextCurrentTime || Date.now();

  let remainDays = 0;
  const timeDiff = dayjs(countdownTo).diff(startTime);
  if (timeDiff > 0) {
    const duration = dayjs.duration(timeDiff);
    remainDays = Math.floor(duration.asDays());
  }

  return (
    <div className="flex flex-col">
      <span className="countdown font-mono text-3xl">
        <span style={{ "--value": Math.min(remainDays, 99) }}></span>
        {remainDays > 99 ? "+" : ""}
      </span>
      days
    </div>
  );
};

const HourContainer = ({ countdownTo, currentTime }: CountdownContainerProps) => {
  const contextCurrentTime = useContext(CurrentTimeContext);
  const startTime = currentTime || contextCurrentTime || Date.now();

  let remainHours = 0;
  const timeDiff = dayjs(countdownTo).diff(startTime);
  if (timeDiff > 0) {
    const duration = dayjs.duration(timeDiff);
    remainHours = duration.hours();
  }

  return (
    <div className="flex flex-col">
      <span className="countdown font-mono text-3xl">
        <span style={{ "--value": remainHours }}></span>
      </span>
      hrs
    </div>
  );
};

const MinuteContainer = ({ countdownTo, currentTime }: CountdownContainerProps) => {
  const contextCurrentTime = useContext(CurrentTimeContext);
  const startTime = currentTime || contextCurrentTime || Date.now();

  let remainMin = 0;
  const timeDiff = dayjs(countdownTo).diff(startTime);
  if (timeDiff > 0) {
    const duration = dayjs.duration(timeDiff);
    remainMin = duration.minutes();
  }

  return (
    <div className="flex flex-col">
      <span className="countdown font-mono text-3xl">
        <span style={{ "--value": remainMin }}></span>
      </span>
      min
    </div>
  );
};

const SecondContainer = ({ countdownTo, currentTime }: CountdownContainerProps) => {
  const contextCurrentTime = useContext(CurrentTimeContext);
  const startTime = currentTime || contextCurrentTime || Date.now();

  let remainSec = 0;
  const timeDiff = dayjs(countdownTo).diff(startTime);
  if (timeDiff > 0) {
    const duration = dayjs.duration(timeDiff);
    remainSec = duration.seconds();
  }

  return (
    <div className="flex flex-col">
      <span className="countdown font-mono text-3xl">
        <span style={{ "--value": remainSec }}></span>
      </span>
      sec
    </div>
  );
};

export const CountdownContainer = ({ countdownTo }: CountdownContainerProps) => {
  return (
    <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
      <DayContainer countdownTo={countdownTo} />
      <HourContainer countdownTo={countdownTo} />
      <MinuteContainer countdownTo={countdownTo} />
      <SecondContainer countdownTo={countdownTo} />
    </div>
  );
};
