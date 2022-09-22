import type { Result } from "ethers/lib/utils";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import LilNounsOracleAbi from "../abis/preview.json";
import LoadingSpinner from "./LoadingSpinner";

interface Props {
  data: Result | undefined;
  isFetching: boolean;
}

const AuctionBtn = ({ data, isFetching }: Props) => {
  const { address, isConnected } = useAccount();
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    addressOrName: "0x6c3810649c140d2f43Ec4D88B2f733e1375E4C74",
    contractInterface: LilNounsOracleAbi,
    functionName: "settleAuction",
    args: [data?.[0]],
  });

  const {
    error: writeError,
    isError: isWriteError,
    isLoading: isWriteLoading,
    write,
  } = useContractWrite(config);

  const handleButtonClicked = () => {
    console.log(prepareError);
    write?.();
  };

  if (isConnected) {
    return (
      <button
        type="button"
        disabled={isFetching || !isConnected}
        onClick={() => handleButtonClicked()}
        className="hidden md:inline-flex items-center cursor-pointer rounded-lg border text-center border-transparent bg-[#92FFFF] px-5 py-4 w-auto md:w-full text-xl font-medium text-black shadow-sm hover:bg-[#83e6e6]"
      >
        {isFetching ? (
          <section className="text-center w-full flex items-center justify-center">
            <span>Fetching Next Block</span>
            <LoadingSpinner />
          </section>
        ) : (
          <span className="w-full text-2xl"> Settle auction</span>
        )}
      </button>
    );
  }

  if (!isConnected) {
    return (
      <button
        type="button"
        disabled
        className="hidden md:inline-flex items-center cursor-not-allowed rounded-lg border text-center border-transparent bg-[#FF80BF] px-5 py-4 w-auto md:w-full text-xl font-medium text-black shadow-sm"
      >
        <section className="text-center w-full flex items-center justify-center">
          <span>Connect Wallet</span>
        </section>
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled
      className="hidden md:inline-flex items-center cursor-pointer rounded-lg border text-center border-transparent bg-[#92FFFF] px-5 py-4 w-auto md:w-80 text-xl font-medium text-black shadow-sm hover:bg-[#83e6e6]"
    >
      {"lol"}
    </button>
  );
};

export default AuctionBtn;
