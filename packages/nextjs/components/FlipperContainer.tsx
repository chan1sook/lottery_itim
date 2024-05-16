import { ReactNode, useState } from "react";

type FlipperContainerProp = {
  children?: ReactNode;
  value?: any;
};

export const FlipperContainer = ({ children, value }: FlipperContainerProp) => {
  const [prevValue, setValue] = useState(children);
  const [prevContent, setPrevContent] = useState(children);
  const [isFlipped, setIsFlipped] = useState(false);

  if (value != prevValue) {
    setValue(value);
    setPrevContent(children);
    setIsFlipped(state => !state);
  }

  return (
    <div className={`swap swap-flip cursor-default ${isFlipped ? "swap-active" : ""}`}>
      <div className="swap-off">{isFlipped ? children : prevContent}</div>
      <div className="swap-on">{isFlipped ? prevContent : children}</div>
    </div>
  );
};
