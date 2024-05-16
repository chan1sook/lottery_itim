import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useCurrentTime } from "~~/hooks/useCurrentTime";

dayjs.extend(duration);

type CountdownSlotContainerProp = {
  value?: number;
  suffix?: string;
};

const CountdownSlotContainer = ({ value, suffix }: CountdownSlotContainerProp) => {
  const hasValue = typeof value === "number";
  const flooredNumber = hasValue ? Math.floor(value) : 0;

  return (
    <div className="flex flex-col">
      <div className="font-mono text-3xl">
        {hasValue ? (
          <div className="countdown">
            <span style={{ "--value": Math.min(flooredNumber, 99) }}></span>
            {flooredNumber > 99 ? "+" : ""}
          </div>
        ) : (
          "--"
        )}
      </div>
      {suffix}
    </div>
  );
};

type CountdownContainerProps = {
  countdownTo?: Date;
};

const DayContainer = ({ countdownTo }: CountdownContainerProps) => {
  const suffix = "days";
  const startTime = useCurrentTime();

  if (!countdownTo) {
    return <CountdownSlotContainer suffix={suffix} />;
  }

  let remainDays = 0;
  const timeDiff = dayjs(countdownTo).diff(startTime);
  if (timeDiff > 0) {
    const duration = dayjs.duration(timeDiff);
    remainDays = Math.floor(duration.asDays());
  }

  return <CountdownSlotContainer value={remainDays} suffix={suffix} />;
};

const HourContainer = ({ countdownTo }: CountdownContainerProps) => {
  const suffix = "hrs";
  const startTime = useCurrentTime();

  if (!countdownTo) {
    return <CountdownSlotContainer suffix={suffix} />;
  }

  let remainHours = 0;
  const timeDiff = dayjs(countdownTo).diff(startTime);
  if (timeDiff > 0) {
    const duration = dayjs.duration(timeDiff);
    remainHours = duration.hours();
  }

  return <CountdownSlotContainer value={remainHours} suffix={suffix} />;
};

const MinuteContainer = ({ countdownTo }: CountdownContainerProps) => {
  const suffix = "min";
  const startTime = useCurrentTime();

  if (!countdownTo) {
    return <CountdownSlotContainer suffix={suffix} />;
  }

  let remainMin = 0;
  const timeDiff = dayjs(countdownTo).diff(startTime);
  if (timeDiff > 0) {
    const duration = dayjs.duration(timeDiff);
    remainMin = duration.minutes();
  }

  return <CountdownSlotContainer value={remainMin} suffix={suffix} />;
};

const SecondContainer = ({ countdownTo }: CountdownContainerProps) => {
  const suffix = "sec";
  const startTime = useCurrentTime();

  if (!countdownTo) {
    return <CountdownSlotContainer suffix={suffix} />;
  }

  let remainSec = 0;
  const timeDiff = dayjs(countdownTo).diff(startTime);
  if (timeDiff > 0) {
    const duration = dayjs.duration(timeDiff);
    remainSec = duration.seconds();
  }

  return <CountdownSlotContainer value={remainSec} suffix={suffix} />;
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
