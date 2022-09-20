/* eslint-disable react-hooks/exhaustive-deps */
import type { NextPage } from "next";
import dynamic from "next/dynamic";

const MissedLils = dynamic(() => import("../components/MissedLils"), {
  ssr: false,
});

const InfoLil = dynamic(() => import("../components/InfoLil"), {
  ssr: false,
});

const Wtf = dynamic(() => import("../components/Wtf"), {
  ssr: false,
});

import { LilNounsOracle } from "../deployments/LilNounsOracle";
import { useContractRead } from "wagmi";
import { useEffect, useState } from "react";
import { Result } from "ethers/lib/utils";

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
  const [lilData, setLilData] = useState<Result | undefined>();

  const { data, isFetching, isFetched } = useContractRead({
    addressOrName: LilNounsOracle.address,
    contractInterface: LilNounsOracle.abi,
    functionName: "fetchNextNoun",
    watch: true,
    overrides: { blockTag: "pending" },
  });

  useEffect(() => {
    if (data?.[3] === AuctionState.ACTIVE) return;

    setLilData(data);
  }, [data]);

  return (
    <div className="bg-white h-full w-full">
      <div className="mx-auto">
        <div className="bg-[#22212C] ">
          <InfoLil data={lilData} isFetching={isFetching} isFetched={isFetched} />
        </div>
        <MissedLils data={lilData} isFetching={isFetching} isFetched={isFetched} />
      </div>

      <Wtf />
    </div>
  );
};
export default Home;
