import dayjs from "dayjs";
import { FlipperContainer } from "~~/components/FlipperContainer";

type ExpiredDayContainerProp = {
  expiredTime?: Date;
};

export const ExpiredDayContainer = ({ expiredTime }: ExpiredDayContainerProp) => {
  const dateFormatted = expiredTime ? dayjs(expiredTime).format("YYYY-MM-DD HH:MM") : "...";

  return (
    <div className="flex flex-row items-baseline justify-center gap-x-2">
      <span className="font-mono whitespace-nowrap">
        <FlipperContainer value={dateFormatted}>{dateFormatted}</FlipperContainer>
      </span>
    </div>
  );
};
