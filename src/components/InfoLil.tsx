import { Tab } from "@headlessui/react";
import { Result } from "ethers/lib/utils";

import { useAccount } from "wagmi";
import { AuctionState } from "../pages";

import ConnectWalletBtn from "./ConnectWallet";

import Logo from "../images/lil-logo.png";
import AuctionBtn from "./AuctionBtn";
import DisabledAuctionBtn from "./DisabledAuctionBtn";

const lilNoun = {
  name: "Lil Noun #9999",
  price: "Ξ 0.15",
  description: `
    <p>ONE LIL NOUN,
    EVERY 15 MINUTES,
    FOREVER.</p>
  `,
  details: [
    {
      name: "Traits",
      items: [
        "bg-cool",
        "body-blue-sky",
        "accessory-stripes-olive",
        "head-abstract",
        "glasses-square-black-rgb",
      ],
    },
  ],
};

interface Props {
  data: Result | undefined;
  isFetching: boolean;
  isFetched: boolean;
}

const InfoLil = ({ data, isFetching, isFetched }: Props) => {
  const { address, isConnected } = useAccount();

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 lg:max-w-6xl">
      <div className="w-full flex justify-between items-center">
        <img src={Logo.src} alt="logo" />

        <ConnectWalletBtn />
      </div>
      <div className="flex flex-wrap items-start pt-8 ">
        <h1 className="text-5xl font-bold mb-2 text-[#F8F8F2] w-full">Lil&apos; Block Party </h1>
        <p className="font-bold text-[#92FFFF] text-xl mb-6">
          Help give birth to the next Lil Noun—settle and start the auction!
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8 mb-6">
        <Tab.Group as="div" className="flex flex-col-reverse">
          <Tab.Panels className="aspect-w-1 aspect-h-1 w-full">
            <Tab.Panel>
              {!isFetching && (
                <>
                  <img
                    src={`data:image/svg+xml;base64,${data?.[2]}`}
                    alt={"nouns"}
                    className="h-full w-full object-cover shadow-xl object-center sm:rounded-lg"
                  />
                </>
              )}
              {isFetching && AuctionState.ACTIVE && (
                <div className="h-full w-full drop-shadow-md sm:rounded-lg flex justify-center animate-pulse bg-gray-100" />
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
        {/* lilNoun info */}

        <div className="flex flex-col justify-center mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0 my-auto h-full">
          <p className="text-[#92FFFF] font-bold mb-6 text-2xl">Up next on the block...</p>
          <h1 className="text-4xl font-bold tracking-tight text-[#F8F8F2]">
            {data?.[1] && `Lil Noun # ${parseInt(data[1]._hex.toString())}`}
          </h1>

          <div className="mt-3">
            <h2 className="sr-only">lilNoun information</h2>
            <p className="text-3xl tracking-tight text-[#F8F8F2]">{lilNoun.price}</p>
          </div>

          <div className="mt-8">
            {data?.[3] === AuctionState.OVER_NOT_SETTLED && (
              <AuctionBtn data={data} isFetching={isFetching} />
            )}

            {data?.[3] === AuctionState.ACTIVE && <DisabledAuctionBtn />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoLil;
