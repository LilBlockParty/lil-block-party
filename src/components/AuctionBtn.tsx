import { useContractWrite, usePrepareContractWrite } from "wagmi";
import LilNounsOracleAbi from "../abis/preview.json";
import LoadingSpinner from "./LoadingSpinner";

interface Props {
  data: any;
  isFetching: boolean;
}

const AuctionBtn = ({ data, isFetching }: Props) => {
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
    console.log("?");
    console.log(prepareError);
    write?.();
  };
  return (
    <button
      type="button"
      disabled={isFetching}
      onClick={() => handleButtonClicked()}
      className="inline-flex items-center cursor-pointer rounded-lg border text-center border-transparent bg-[#92FFFF] px-5 py-4 w-80 text-xl font-medium text-black shadow-sm hover:bg-[#83e6e6]"
    >
      {isFetching ? (
        <section className="text-center w-full flex items-center justify-center">
          <LoadingSpinner />
          <span>Fetching Next Block</span>
        </section>
      ) : (
        <span className="w-full"> Settle and start auction</span>
      )}
    </button>
  );
};

export default AuctionBtn;
