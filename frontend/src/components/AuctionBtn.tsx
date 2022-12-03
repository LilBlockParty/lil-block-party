import type { Result } from "ethers/lib/utils";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";

import { LilNounsOracle } from "../deployments/LilNounsOracle";
import LoadingSpinner from "./LoadingSpinner";

interface Props {
  data: Result | undefined;
  isFetching: boolean;
}

const AuctionBtn = ({ data, isFetching }: Props) => {
  const { isConnected } = useAccount();
  const { config, error: prepareError } = usePrepareContractWrite({
    addressOrName: LilNounsOracle.address,
    contractInterface: LilNounsOracle.abi,
    functionName: "settleAuction",
    args: [data?.[0]],
  });

  const { write } = useContractWrite(config);

  const handleButtonClicked = () => {
    console.log(prepareError);
    write?.();
  };

  // If token is under the threshhold and ends in 10, return true
  // https://github.com/lilnounsDAO/lilnouns-monorepo/blob/59ff19a364e631d8e5484823e2982858d99daf8d/packages/nouns-contracts/contracts/NounsToken.sol#L165-L176
  const isLilNoundersToken = () => {
    if (data?.[1].lte(175300) && data?.[1].mod(10).isZero()) {
      return true;
    } else {
      return false;
    }
  };

  if (isConnected) {
    return (
      <button
        type="button"
        disabled={isFetching || !isConnected}
        onClick={() => handleButtonClicked()}
        className="cursor-pointer rounded-lg border text-center border-transparent bg-[#92FFFF] px-1 py-4 w-full md:max-w-sm text-black shadow-sm hover:bg-[#83e6e6]"
      >
        {isFetching ? (
          <span className="w-full text-3xl text-slate-500">
            Fetching Block...
          </span>
        ) : isLilNoundersToken() ? (
          <span className="w-full text-3xl">I&apos;m feeling lucky</span>
        ) : (
          <span className="w-full text-3xl">Settle auction</span>
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
