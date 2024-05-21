import { ChangeEvent, ReactNode, useState } from "react";
import { ConnectAddressContainer } from "../ConnectAddressContainer";
import { LotteryButton } from "../LotteryButton";
import { LotteryNumberRangeContainer } from "../lottery-containers/LotteryNumberRangeContainer";
import { AddressInput, IntegerInput } from "../scaffold-eth";
import { ItimTokenInput } from "../scaffold-eth/Input/ItimTokenInput";
import dayjs from "dayjs";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { formatEther, isAddress, parseEther } from "viem";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useLotteryActiveRoomAt } from "~~/hooks/useLotteryActiveRoomAt";
import { LotteryContractData, useIsLotteryContractAdmin } from "~~/hooks/useLotteryContractData";
import { LotteryData, LotteryState, useLotteryData } from "~~/hooks/useLotteryData";

type LabelFromAdminModifierProp = {
  admin?: string;
  isAdmin: boolean;
  label: string;
};

function labelFromAdminModifier({ admin, isAdmin, label }: LabelFromAdminModifierProp) {
  return !admin ? "Not Connected" : !isAdmin ? "Not Admin" : label;
}

type GameActionButtonProp = {
  isWaitWriting: boolean;
  adminAccount?: string;
  lotteryData: LotteryData;
  onFastStartLotteryGame: (id: bigint) => void;
  onFastStopLotteryGame: (id: bigint) => void;
};

const GameActionButton = ({
  lotteryData,
  adminAccount,
  isWaitWriting,
  onFastStartLotteryGame,
  onFastStopLotteryGame,
}: GameActionButtonProp) => {
  const contractName = lotteryData.contractData.contractName;
  const isAdmin = useIsLotteryContractAdmin(contractName, adminAccount);

  function _getLabel(label: string) {
    return labelFromAdminModifier({ admin: adminAccount, isAdmin, label });
  }

  return (
    <>
      {lotteryData.state == LotteryState.NOT_STARTED && (
        <LotteryButton
          label={_getLabel("Start game")}
          isError={!isAdmin}
          loading={isWaitWriting}
          onClick={() => onFastStartLotteryGame(lotteryData.id)}
        />
      )}
      {lotteryData.state == LotteryState.OPENING && (
        <LotteryButton
          label={_getLabel(`Close Lottery`)}
          isError={!isAdmin}
          loading={isWaitWriting}
          onClick={() => onFastStopLotteryGame(lotteryData.id)}
        />
      )}
    </>
  );
};

type CloseActionContainerProp = {
  adminAccount?: string;
  contractData: LotteryContractData;
  isWaitWriting: boolean;
  onFastStopLotteryGame: (id: bigint) => void;
};

const CloseActionContainer = ({
  adminAccount,
  contractData,
  isWaitWriting,
  onFastStopLotteryGame,
}: CloseActionContainerProp) => {
  const [roomNth, setRoomNth] = useState(BigInt(0));
  const contractName = contractData.contractName;
  const isAdmin = useIsLotteryContractAdmin(contractName, adminAccount);
  const closeRoomId = useLotteryActiveRoomAt({ contractName: contractName, nth: roomNth });
  const roomActive = contractData.roomActive || BigInt(0);
  if (roomActive < roomNth && roomActive != BigInt(0)) {
    setRoomNth(roomActive - BigInt(1));
  }

  return (
    <>
      {isAdmin && roomActive > BigInt(0) && (
        <div className="flex flex-col sm:flex-row join join-vertical sm:join-horizontal rounded-sm">
          <div className="join-item flex flex-row items-center join">
            <button
              className="btn btn-md btn-primary join-item"
              disabled={isWaitWriting || roomNth <= BigInt(0)}
              onClick={() => setRoomNth(n => n - BigInt(1))}
            >
              <FaChevronLeft />
            </button>
            <div className="bg-white min-w-36 px-4 py-3 text-center join-item select-none">
              #{typeof closeRoomId === "bigint" ? closeRoomId.toString() : "?"}
            </div>
            <button
              className="btn btn-md btn-primary join-item"
              disabled={isWaitWriting || roomNth > roomActive - BigInt(2)}
              onClick={() => setRoomNth(n => n + BigInt(1))}
            >
              <FaChevronRight />
            </button>
          </div>
          <button
            className="min-w-36 btn btn-md btn-warning join-item"
            onClick={() => onFastStopLotteryGame(closeRoomId || BigInt(0))}
            disabled={isWaitWriting}
          >
            Close Lottery
          </button>
        </div>
      )}
    </>
  );
};

type ManageLotteryContainerProps = {
  children?: ReactNode;
  adminAccount?: string;
  lotteryData: LotteryData;
};

export const ManageLotteryContainer = ({ children, adminAccount, lotteryData }: ManageLotteryContainerProps) => {
  const contractData = lotteryData.contractData;
  const contractName = contractData.contractName;
  const { isPending, isMining, writeContractAsync2: writeContractAsync } = useScaffoldWriteContract(contractName);

  const isAdmin = useIsLotteryContractAdmin(contractName, adminAccount);

  const [lotteryCost, setLotteryCost] = useState("1.0");
  const [roomNth, setRoomNth] = useState(BigInt(0));
  const [roomCapacity, setRoomCapacity] = useState(BigInt(1));
  const [lotteryReward, setLotteryReward] = useState("10.0");
  const [lotteryReward2nd, setLotteryReward2nd] = useState("2.0");
  const [lotteryReward3rd, setLotteryReward3rd] = useState("1.5");
  const [tokenContractAccount, setTokenContractAccount] = useState("");
  const [treasuryAccount, setTreasuryAccount] = useState("");
  const [datetimeStr, setDatetimeStr] = useState(dayjs().format("YYYY-MM-DDTHH:mm"));

  const [waitContactData, setWaitContractData] = useState(false);

  const roomActive = contractData.roomActive || BigInt(0);
  if (roomActive < roomNth && roomActive != BigInt(0)) {
    setRoomNth(roomActive - BigInt(1));
  }

  if (!waitContactData && contractData.ready) {
    setWaitContractData(true);
    setLotteryCost(formatEther(contractData.lotteryCost || BigInt(0)));
    setLotteryReward(formatEther(contractData.lotteryReward || BigInt(0)));
    setTokenContractAccount(contractData.tokenContractAccount || "");
    setTreasuryAccount(contractData.treasuryAccount || "");
  }

  const isSetLotteryCostInvalid = !isAdmin;
  const isSetLotteryRewardInvalid = !isAdmin;
  const isSetAccountCostInvalid = !(isAdmin && isAddress(treasuryAccount) && isAddress(tokenContractAccount));
  const isWaitWriting = !contractData.ready || isPending || isMining;

  const newLotteryData = useLotteryData({
    id:
      lotteryData.id !== BigInt(0) && typeof contractData.lastestId === "bigint"
        ? contractData.lastestId + BigInt(1)
        : BigInt(0),
    contractName: contractData.contractName,
  });
  const isRoomFull =
    roomActive >= (typeof contractData.roomCapacity === "bigint" ? contractData.roomCapacity : BigInt(0));

  function updateDateTimeStr(e: ChangeEvent<HTMLInputElement>) {
    setDatetimeStr(e.target.value as unknown as string);
  }

  function setRoomCapacityValue(val: string | bigint) {
    setRoomCapacity(typeof val === "string" ? BigInt(val) : val);
  }

  async function updateRoomCapacity(capacity: bigint) {
    await writeContractAsync({
      functionName: "setLotteryRoomCap",
      args: [capacity],
    });
  }

  async function updateLotteryCost(cost: bigint) {
    await writeContractAsync({
      functionName: "setLotteryCost",
      args: [cost],
    });
  }

  async function updateLotteryReward(reward: bigint) {
    await writeContractAsync({
      functionName: "setLotteryReward",
      args: [reward],
    });
  }

  async function updateLotteryReward2nd(reward: bigint) {
    if (contractName === "ItimLottery3Digits") {
      await writeContractAsync({
        functionName: "setLottery2ndReward",
        args: [reward],
      });
    } else if (contractName === "ItimLottery4Digits") {
      await writeContractAsync({
        functionName: "setLotteryOthersReward",
        args: [reward, BigInt(lotteryReward3rd)],
      });
    }
  }

  async function updateLotteryReward3rd(reward: bigint) {
    if (contractName === "ItimLottery4Digits") {
      await writeContractAsync({
        functionName: "setLotteryOthersReward",
        args: [BigInt(lotteryReward2nd), reward],
      });
    }
  }

  async function updateAccounts(tokenAccount: string, treasuryAccount: string) {
    await writeContractAsync({
      functionName: "setAccounts",
      args: [tokenAccount, treasuryAccount],
    });
  }

  async function fastStartLotteryGame(gameid: bigint, ts: number) {
    await writeContractAsync({
      functionName: "fastStartLottery",
      args: [gameid, BigInt(ts)],
    });
  }

  async function fastStopLotteryGame(gameid: bigint) {
    await writeContractAsync({
      functionName: "fastStopLottery",
      args: [gameid],
    });
  }

  function _getLabel(label: string) {
    return labelFromAdminModifier({ admin: adminAccount, isAdmin, label });
  }

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5">
        <h1 className="text-center">
          <span className="block text-4xl font-bold">Manage Lottery</span>
        </h1>
        <ConnectAddressContainer />
      </div>
      <div className="my-8 w-full px-8 py-8 bg-base-300 flex flex-col gap-y-4 items-center justify-center">
        <LotteryNumberRangeContainer contractData={contractData} />
        {children}
        {isAdmin && !isRoomFull && (
          <>
            <div className="w-full max-w-screen-sm flex border-2 border-base-300 bg-base-200 rounded-full text-accent">
              <input
                type="datetime-local"
                className="input input-ghost focus-within:border-transparent focus:outline-none focus:bg-transparent focus:text-gray-700 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-700"
                value={datetimeStr}
                onChange={updateDateTimeStr}
              />
            </div>
            <div className="w-full max-w-52">
              <GameActionButton
                adminAccount={adminAccount}
                lotteryData={newLotteryData}
                isWaitWriting={isWaitWriting}
                onFastStartLotteryGame={id => fastStartLotteryGame(id, Math.floor(dayjs(datetimeStr).valueOf() / 1000))}
                onFastStopLotteryGame={fastStopLotteryGame}
              />
            </div>
          </>
        )}
        <CloseActionContainer
          contractData={contractData}
          adminAccount={adminAccount}
          isWaitWriting={isWaitWriting}
          onFastStopLotteryGame={fastStopLotteryGame}
        />
      </div>
      <div className="w-full px-6 max-w-screen-md flex flex-col gap-y-2 items-stretch">
        <div>Room Capacity:</div>
        <div>
          <IntegerInput value={roomCapacity} onChange={setRoomCapacityValue}></IntegerInput>
        </div>
        <div className="flex flex-row justify-center">
          <div className="w-full max-w-52">
            <LotteryButton
              label={_getLabel("Set Capacity")}
              loading={isWaitWriting}
              onClick={() => updateRoomCapacity(roomCapacity)}
            />
          </div>
        </div>
        <div>Lottery Cost:</div>
        <div>
          <ItimTokenInput value={lotteryCost} onChange={setLotteryCost}></ItimTokenInput>
        </div>
        <div className="flex flex-row justify-center">
          <div className="w-full max-w-52">
            <LotteryButton
              label={_getLabel("Set Cost")}
              loading={isWaitWriting}
              isError={isSetLotteryCostInvalid}
              disabled={isSetLotteryCostInvalid}
              onClick={() => updateLotteryCost(parseEther(lotteryCost))}
            />
          </div>
        </div>
        <div> Lottery Reward:</div>
        <div>
          <ItimTokenInput value={lotteryReward} onChange={setLotteryReward}></ItimTokenInput>
        </div>
        <div className="flex flex-row justify-center">
          <div className="w-full max-w-52">
            <LotteryButton
              label={_getLabel("Set Reward")}
              loading={isWaitWriting}
              isError={isSetLotteryRewardInvalid}
              disabled={isSetLotteryRewardInvalid}
              onClick={() => updateLotteryReward(parseEther(lotteryReward))}
            />
          </div>
        </div>
        {contractData.lotteryReward2nd && (
          <>
            <div> Lottery 2nd Reward:</div>
            <div>
              <ItimTokenInput value={lotteryReward2nd} onChange={setLotteryReward2nd}></ItimTokenInput>
            </div>

            <div className="flex flex-row justify-center">
              <div className="w-full max-w-52">
                <LotteryButton
                  label={_getLabel("Set Reward")}
                  loading={isWaitWriting}
                  isError={isSetLotteryRewardInvalid}
                  disabled={isSetLotteryRewardInvalid}
                  onClick={() => updateLotteryReward2nd(parseEther(lotteryReward2nd))}
                />
              </div>
            </div>
          </>
        )}
        {contractData.lotteryReward3rd && (
          <>
            <div> Lottery 3rd Reward:</div>
            <div>
              <ItimTokenInput value={lotteryReward3rd} onChange={setLotteryReward3rd}></ItimTokenInput>
            </div>

            <div className="flex flex-row justify-center">
              <div className="w-full max-w-52">
                <LotteryButton
                  label={_getLabel("Set Reward")}
                  loading={isWaitWriting}
                  isError={isSetLotteryRewardInvalid}
                  disabled={isSetLotteryRewardInvalid}
                  onClick={() => updateLotteryReward3rd(parseEther(lotteryReward3rd))}
                />
              </div>
            </div>
          </>
        )}
        <div>Treasury Account:</div>
        <div>
          <AddressInput
            value={treasuryAccount}
            placeholder="Treasury Account"
            onChange={setTreasuryAccount}
          ></AddressInput>
        </div>
        <div className="flex flex-row justify-center">
          <div className="w-full max-w-52">
            <LotteryButton
              label={_getLabel("Set")}
              loading={isWaitWriting}
              isError={isSetAccountCostInvalid}
              disabled={isSetAccountCostInvalid}
              onClick={() => updateAccounts(tokenContractAccount, treasuryAccount)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
