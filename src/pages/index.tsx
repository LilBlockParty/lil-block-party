/* eslint-disable react-hooks/exhaustive-deps */
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useIdle } from "react-use";

const MissedLils = dynamic(() => import("../components/MissedLils"), {
  ssr: false,
});

const InfoLil = dynamic(() => import("../components/InfoLil"), {
  ssr: false,
});

const Wtf = dynamic(() => import("../components/Wtf"), {
  ssr: false,
});

import LilNounsOracleAbi from "../abis/preview.json";
import { useContractRead } from "wagmi";
import { useEffect, useState } from "react";
import { Result } from "ethers/lib/utils";
import EulogyModal from "../components/EulogyModal";

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
    addressOrName: "0x6c3810649c140d2f43Ec4D88B2f733e1375E4C74",
    contractInterface: LilNounsOracleAbi,
    functionName: "fetchNextNoun",
    watch: true,
    overrides: { blockTag: "pending" },
  });

  const isIdle = useIdle(60e3);

  useEffect(() => {
    if (data?.[3] === AuctionState.ACTIVE || isIdle) return;

    setLilData(data);
  }, [data, isIdle]);

  const [open, setOpen] = useState(false);
  const [selectedLil, setSelectedLil] = useState({});

  return (
    <div className="bg-white h-full w-full">
      <div className="mx-auto">
        <div className="bg-[#22212C] ">
          <InfoLil data={lilData} isFetching={isFetching} isFetched={isFetched} />
        </div>
        <MissedLils
          data={lilData}
          isFetching={isFetching}
          isFetched={isFetched}
          setModalOpen={setOpen}
          setSelectedLil={setSelectedLil}
        />
      </div>

      <Wtf />
      <EulogyModal open={open} setOpen={setOpen} selectedLil={selectedLil} data={data} />
    </div>
  );
};
export default Home;
