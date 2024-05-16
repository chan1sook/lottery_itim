import type { ReactNode } from "react";
import { IconContext } from "react-icons";

type IconsGroupProp = {
  children: ReactNode;
};

export const IconsGroup = ({ children }: IconsGroupProp) => {
  return (
    <IconContext.Provider value={{ className: "h-6 w-6" }}>
      <div className="inline-flex flex-row">{children}</div>
    </IconContext.Provider>
  );
};
