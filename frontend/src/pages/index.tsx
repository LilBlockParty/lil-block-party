/* eslint-disable react-hooks/exhaustive-deps */
import { Result } from "ethers/lib/utils";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";

import EulogyModal from "../components/EulogyModal";
import MissedLils from "../components/MissedLils";
import { LilNounsOracle } from "../deployments/LilNounsOracle";

const InfoLil = dynamic(() => import("../components/InfoLil"), { ssr: false });
const Wtf = dynamic(() => import("../components/Wtf"), { ssr: false });
const Memeorium = dynamic(() => import("../components/Memeorium"), { ssr: false });

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
  }, [data?.[0]]);

  const [open, setOpen] = useState(false);
  const [selectedLil, setSelectedLil] = useState({});

  return (
    <div className="bg-white h-full w-full">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width" />
        <title>Lil Block Party</title>
        <meta name="description" content="Watch the blocks. Pick a lil. Join the party" />

        {/* <!-- Facebook Meta Tags --> */}
        <meta property="og:url" content="https://www.lbp.wtf" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Lil Block Party" />
        <meta
          property="og:description"
          content="Watch the blocks. Pick a lil. Join the party"
        />
        <meta property="og:image" content="https://www.lbp.wtf/images/og.jpeg" />

        {/* <!-- Twitter Meta Tags --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="lbp.wtf" />
        <meta property="twitter:url" content="https://www.lbp.wtf" />
        <meta name="twitter:title" content="Lil Block Party" />
        <meta
          name="twitter:description"
          content="Watch the blocks. Pick a lil. Join the party"
        />
        <meta name="twitter:image" content="https://www.lbp.wtf/images/og.jpeg" />

        {/* <!-- Meta Tags Generated via https://www.opengraph.xyz --> */}
      </Head>
      <div className="mx-auto">
        <div className="bg-[#22212C] min-h-80vh md:min-h-[60vh]">
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

      <Memeorium />

      <Wtf />
      <EulogyModal open={open} setOpen={setOpen} selectedLil={selectedLil} data={data} />
    </div>
  );
};
export default Home;
