import type { NextPage } from "next";
import dynamic from "next/dynamic";

import MissedLils from "../MissedLils";

const InfoLil = dynamic(() => import("../components/InfoLil"), {
  ssr: false,
});

import LilNounsOracleAbi from "../abis/preview.json";
import { useContractRead } from "wagmi";

const Home: NextPage = () => {
  const { data, isFetching, isFetched } = useContractRead({
    addressOrName: "0xc0AABf8fbE161225B18e6aD0Bd51c060c1e1b5b4",
    contractInterface: LilNounsOracleAbi,
    functionName: "fetchNextNounAndAuctionState",
    watch: true,
    overrides: { blockTag: "pending" },
  });

  return (
    <div className="bg-white h-full">
      <div className="mx-auto max-w-2xl py-2 px-4 sm:py-8 sm:px-6 lg:max-w-7xl lg:px-8">
        <InfoLil data={data} isFetching={isFetching} isFetched={isFetched} />
        <MissedLils data={data} isFetching={isFetching} isFetched={isFetched} />
      </div>
    </div>
  );
};
export default Home;
