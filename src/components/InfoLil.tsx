import { Tab } from "@headlessui/react";
import { Result } from "ethers/lib/utils";
import GameBoyNoun from "./GameboyNoun";

import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { AuctionState } from "../pages";
import ConnectWalletBtn from "./ConnectWallet";

import LilNounsOracleAbi from "../abis/preview.json";

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
    <div className="mx-auto max-w-2xl px-4 py-6 lg:max-w-6xl">
      <section></section>
      <div className="flex flex-wrap items-start pt-8 ">
        <h1 className="text-4xl font-bold mb-2 text-[#F8F8F2] w-full">Gotta Mint &apos;em All </h1>
        <p className="font-bold text-[#92FFFF] text-md mb-6">
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
          <p className="text-[#92FFFF] font-bold pb-3">Up next on the block...</p>
          <h1 className="text-3xl font-bold tracking-tight text-[#F8F8F2]">
            {data ? `Lil Noun # ${parseInt(data[1]._hex.toString())}` : ""}
          </h1>

          <div className="mt-3">
            <h2 className="sr-only">lilNoun information</h2>
            <p className="text-3xl tracking-tight text-[#F8F8F2]">{lilNoun.price}</p>
          </div>

          <div className="mt-8">
            {/* <GameBoyNoun /> */}
            {data?.[3] === AuctionState.OVER_NOT_SETTLED && (
              <button
                type="button"
                // disabled={!write}
                onClick={() => handleButtonClicked()}
                className="inline-flex items-center cursor-pointer rounded-lg border text-center border-transparent bg-[#92FFFF] px-5 py-4 w-80 text-xl font-medium text-black shadow-sm hover:bg-[#83e6e6]"
              >
                <span className="w-full"> Settle and start auction</span>
              </button>
            )}

            {data?.[3] === AuctionState.ACTIVE && (
              <button
                type="button"
                disabled
                className="inline-flex items-center rounded border border-transparent bg-[#E11833] px-5 py-2 text-md font-medium text-white shadow-sm cursor-not-allowed"
              >
                Auction Active
              </button>
            )}

            {isFetching && (
              <p className="mt-2 text-md font-medium text-slate-400">Fetching Next Block</p>
            )}

            {/* {lilNoun.details.map((detail) => (
                <div key={detail.name}>
                  <>
                    <h3>
                      <button className="group relative flex w-full items-center justify-between py-6 text-left">
                        <span className="text-gray-900 font-medium text-lg">{detail.name}</span>
                      </button>
                    </h3>
                    <section className="prose prose-sm pb-6">
                      <ul role="list">
                        {detail.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>
                  </>
                </div>
              ))} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoLil;
