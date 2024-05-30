import { type ReactNode } from "react";

type GameContainerProp = {
  icon?: ReactNode;
  children: ReactNode;
  countdown?: ReactNode;
  footer?: ReactNode;
};

export const GameContainer = ({ icon, children, countdown, footer }: GameContainerProp) => {
  return (
    <div className="transistion-all duration-100 relative w-full max-w-2xl border shadow bg-base-100 rounded-3xl">
      <div className="h-full flex flex-col gap-x-6 gap-y-4 px-6 py-6">
        <div className="my-auto flex flex-col items-center gap-x-6 gap-y-4 md:flex-row">
          <div className="w-full flex flex-row gap-x-6 gap-y-4 items-center justify-between md:justify-start">
            {icon}
            {children}
          </div>
          {countdown}
        </div>
        {footer}
      </div>
    </div>
  );
};
