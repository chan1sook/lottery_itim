import dayjs from "dayjs";

type NextDrawContainerProp = {
  expiredTime: Date;
};

export const NextDrawContainer = ({ expiredTime }: NextDrawContainerProp) => {
  const dateFormatted = dayjs(expiredTime).format("YYYY-MM-DD HH:MM:ss");
  return (
    <div className="flex flex-row items-baseline justify-center gap-x-2">
      <span className="font-mono">{dateFormatted}</span>
    </div>
  );
};
