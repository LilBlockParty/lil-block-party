import { Tab } from "@headlessui/react";
import { Result } from "ethers/lib/utils";

import { AuctionState } from "../pages";
import { useAccount, useBlockNumber } from "wagmi";

import ConnectWalletBtn from "./ConnectWallet";

import Logo from "../images/lil-logo.png";
import AuctionBtn from "./AuctionBtn";
import DisabledAuctionBtn from "./DisabledAuctionBtn";
import Link from "next/link";

interface Props {
  data: Result | undefined;
  isFetching: boolean;
  isFetched: boolean;
}

const InfoLil = ({ data, isFetching, isFetched }: Props) => {
  const { data: blockNumber } = useBlockNumber();
  const { isConnected } = useAccount();
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 lg:max-w-6xl">
      <div className="w-full flex justify-between items-end">
        <span className="w-3/5">
          <img src={Logo.src} alt="logo" />
        </span>
        <div className="flex justify-between items-end w-2/5">
          <Link href="#wtf">
            <a className="text-white text-2xl hover:underline">WTF?</a>
          </Link>
          <Link href="https://lilnouns.wtf">
            <a className="text-white text-2xl hover:underline">lilnouns.wtf</a>
          </Link>
          <span className="hidden md:block">
            <ConnectWalletBtn />
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-start pt-8 ">
        <h1 className="text-5xl font-bold mb-2 text-[#F8F8F2] w-full">Lil&apos; Block Party </h1>
        <p className="font-bold text-[#92FFFF] text-2xl mb-6">
          Be the first to see, settle, and bid on the next Lil Noun on the block!
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8 mb-6">
        <Tab.Group as="div" className="flex flex-col-reverse">
          <Tab.Panels className="aspect-w-1 aspect-h-1 w-full">
            <Tab.Panel>
              {!isFetching && (
                <>
                  <img
                    src={`data:image/svg+xml;base64,${data?.[2] || ""}`}
                    alt={"nouns"}
                    className="h-full w-full object-cover shadow-xl object-center sm:rounded-lg"
                  />
                </>
              )}
              {isFetching && (
                <div className="h-full w-full drop-shadow-md sm:rounded-lg flex justify-center bg-[#D4D7E1]" />
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
        {/* lilNoun info */}

        <div className="flex flex-col justify-center mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0 my-auto h-full max-w-sm">
          <p className="text-[#92FFFF] font-bold mb-6 text-2xl">Up next on block {blockNumber} </p>
          <h1 className="text-6xl font-bold text-[#F8F8F2]">
            {data?.[1] && `Lil Noun # ${parseInt(data[1]._hex.toString())}`}
          </h1>

          <div className="mt-3">
            <h2 className="sr-only">lilNoun information</h2>
            <p className="text-5xl text-[#F8F8F2]">Ξ 0.15</p>
          </div>

          <div className="mt-8">
            {data?.[3] === AuctionState.OVER_NOT_SETTLED && (
              <>
                <AuctionBtn data={data} isFetching={isFetching} />
                {isConnected ? (
                  <p className="mt-4 text-white font-balsamiq">
                    After an auction has ended, a gas-only transaction is required to settle the
                    previous auction and start the next one.
                    <Link href="#wtf">
                      <a className="text-[#92FFFF] underline ml-[1ch]">
                        Learn more about settling and bidding on Lil Nouns
                      </a>
                    </Link>
                  </p>
                ) : (
                  <p className="mt-4 text-white font-balsamiq">
                    Connect your wallet to settle the latest auction and give birth to the next Lil
                    on the block.
                    <Link href="#wtf">
                      <a className="text-[#92FFFF] underline ml-[1ch]">
                        Learn more about settling and bidding on Lil Nouns
                      </a>
                    </Link>
                  </p>
                )}
              </>
            )}

            {data?.[3] === AuctionState.ACTIVE && <DisabledAuctionBtn />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoLil;
