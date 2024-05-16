import { Address, RainbowKitCustomConnectButton } from "./scaffold-eth";
import { useAccount } from "wagmi";

export const ConnectAddressContainer = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <div className="flex justify-center items-center gap-y-2 gap-x-2">
      {connectedAddress ? (
        <>
          <p className="font-medium">Connected Address:</p>
          <Address address={connectedAddress} />
        </>
      ) : (
        <div className="my-2">
          <RainbowKitCustomConnectButton />
        </div>
      )}
    </div>
  );
};
