import { Tab } from "@headlessui/react";
import { Result } from "ethers/lib/utils";
import Link from "next/link";
import { useAccount, useBlockNumber } from "wagmi";

import { AuctionState } from "../pages";
import AuctionBtn from "./AuctionBtn";
import Header from "./Header";
import PendingLil from "./PendingLil";

interface Props {
  data: Result | undefined;
  isFetching: boolean;
  isFetched: boolean;
}

const InfoLil = ({ data, isFetching, isFetched }: Props) => {
  const { data: blockNumber } = useBlockNumber();
  const { isConnected } = useAccount();

  // If token is under the threshhold and ends in 10, return true
  // https://github.com/lilnounsDAO/lilnouns-monorepo/blob/59ff19a364e631d8e5484823e2982858d99daf8d/packages/nouns-contracts/contracts/NounsToken.sol#L165-L176
  const isLilNoundersToken = () => {
    if (data?.[1].lte(175300) && data?.[1].mod(10).isZero()) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-1.5 md:px-4 pt-6 pb-12 lg:max-w-6xl">
      <Header />
      <div className="flex flex-wrap items-start pt-8 ">
        <h1 className="text-5xl font-bold mb-2 text-[#F8F8F2] w-full">Lil&apos; Block Party </h1>
        <p className="font-bold text-[#92FFFF] text-3xl mb-6 hidden md:block">
          Watch the blocks. Pick a lil. Join the party.
        </p>
      </div>
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8 mb-6">
        <Tab.Group as="div" className="flex flex-col-reverse">
          <Tab.Panels className="aspect-w-1 aspect-h-1 w-full">
            <Tab.Panel>
              {/* Display next lil noun if data has been fetched & is not the lil nounder's reward */}
              {isFetched && data?.[3] && !isLilNoundersToken() && (
                <img
                  src={`data:image/svg+xml;base64,${data?.[2] || ""}`}
                  alt={"nouns"}
                  className="h-full w-full object-cover shadow-xl object-center sm:rounded-lg relative"
                />
              )}

              {/* Display a question mark image if auction state data is undefined or next token is lil nounder's reward */}
              {(data?.[3] === undefined || isLilNoundersToken()) && <PendingLil data={data} />}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
        {/* lilNoun info */}

        <div className="flex flex-col justify-center mt-3 md:mt-10 md:px-4 sm:mt-16 sm:px-0 lg:mt-0 my-auto h-full md:max-w-md">
          <div className="md:mt-8 w-full">
            {data?.[3] === AuctionState.OVER_NOT_SETTLED && (
              <>
                <p className="text-[#92FFFF] font-bold mb-6 text-2xl hidden md:block">
                  Up next on block {blockNumber}{" "}
                </p>
                <h1 className="text-5xl md:text-6xl font-bold text-[#F8F8F2] w-full">
                  Lil Noun {data?.[1] && `# ${parseInt(data[1]._hex.toString())}`}
                </h1>
                <div className="mt-3 mb-3">
                  <h2 className="sr-only">lilNoun information</h2>
                  <p className="text-5xl text-[#F8F8F2]">Ξ 0.15</p>
                </div>
                {isConnected && <AuctionBtn data={data} isFetching={isFetching} />}
                <Link href="#wtf">
                  <a className="text-[#92FFFF] underline font-balsamiq mt-4 inline-block">
                    Learn more about settling and bidding on Lil Nouns
                  </a>
                </Link>
              </>
            )}

            {data === undefined && (
              <>
                <h2 className="text-white text-2xl md:text-3xl mt-1">
                  An auction is currently in progress!
                </h2>
                <p className="text-white text-xl md:text-2xl">
                  Try your hand at bidding on{" "}
                  <a className="text-[#92FFFF] hover:underline" href="https://lilnouns.wtf">
                    lilnouns.wtf
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoLil;
