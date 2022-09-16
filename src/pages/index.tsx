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
import { useWebSocketProvider } from "wagmi";

import { useEffect, useState } from "react";
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
  const [watching, setWatching] = useState(true);
  const { data, isFetching, isFetched } = useContractRead({
    addressOrName: "0x6c3810649c140d2f43Ec4D88B2f733e1375E4C74",
    contractInterface: LilNounsOracleAbi,
    functionName: "fetchNextNoun",
    watch: watching,
    overrides: { blockTag: "pending" },
  });

  useEffect(() => {
    data?.[3] === AuctionState.ACTIVE ? setWatching(false) : setWatching(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.[3]]);

  return (
    <div className="bg-white h-full w-full">
      <div className="mx-auto">
        <div className="bg-[#22212C] ">
          <InfoLil data={data} isFetching={isFetching} isFetched={isFetched} />
        </div>
        <MissedLils data={data} isFetching={isFetching} isFetched={isFetched} />
      </div>
    </div>
  );
};
export default Home;
