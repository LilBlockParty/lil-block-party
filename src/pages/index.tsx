import type { NextPage } from "next";
import dynamic from "next/dynamic";

const MissedLils = dynamic(() => import("../components/MissedLils"), {
  ssr: false,
});

const InfoLil = dynamic(() => import("../components/InfoLil"), {
  ssr: false,
});

import LilNounsOracleAbi from "../abis/preview.json";
import { useContractRead } from "wagmi";
/*

  signature for fetchNextNoun
      
  return (
    [0] blockhash(block.number - 1),
    [1] nounId,
    [2] svg,
    [3] auctionState,
    [4] nextNounSeed

  );

*/

export enum AuctionState {
  NOT_STARTED,
  ACTIVE,
  OVER_NOT_SETTLED,
  OVER_AND_SETTLED,
}

const Home: NextPage = () => {
  const { data, isFetching, isFetched } = useContractRead({
    addressOrName: "0xA1879c5dC7049106f641cC5C3A567e7ABF31035C",
    contractInterface: LilNounsOracleAbi,
    functionName: "fetchNextNoun",
    watch: true,
    overrides: { blockTag: "pending" },
  });

  return (
    <div className="bg-white h-full">
      <div className="mx-auto max-w-2xl py-2 px-4 sm:py-8 sm:px-6 lg:max-w-6xl lg:px-8">
        <InfoLil data={data} isFetching={isFetching} isFetched={isFetched} />
        <MissedLils data={data} isFetching={isFetching} isFetched={isFetched} />
      </div>
    </div>
  );
};
export default Home;
