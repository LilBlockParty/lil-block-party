import { Redis } from "@upstash/redis";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { z } from "zod";

import Tombstone from "../../components/Tombstone";

type LilInfo = {
  eulogy: string;
  imgData: string;
  tokenId: number;
};

const redis = new Redis({
  url: "https://us1-suitable-crab-39528.upstash.io",
  token:
    "AZpoACQgYzQyZDg5NDAtZTVjNy00OGRkLWJjNDQtMTIxMzNmMDNkODkyOTc2YmIyNzEyZTVmNGU1M2EzMGJmYWQ3MjU2NTQ5NDc=",
});

export default function RipPage() {
  const router = useRouter();
  const { wallet } = router.query;
  const [lilInfo, setLilInfo] = useState<LilInfo>({
    eulogy: "",
    imgData: "",
    tokenId: 0,
  });

  console.log(router.query.wallet);

  useEffect(() => {
    if (!wallet) return;
    const walletSchema = z.string().length(42);
    async function fetchLil() {
      const parsedWallet = walletSchema.parse(wallet);
      const data = await redis.get(parsedWallet) as LilInfo;
      if (data) {
        setLilInfo(data);
      }
    }

    fetchLil();
  }, [wallet]);

  return (
    <div className="mx-auto flex flex-col pt-6 bg-[#22212C] min-h-screen">
      <section className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-wrap w-full items-center">
          <Tombstone />

          <div className="ml-4">
            <h3 className=" text-gray-400 text-3xl mt-4">
              RIP to the almost Lil #: {lilInfo.tokenId}
            </h3>
            <span className="text-white text-xl block">{lilInfo?.eulogy}</span>
          </div>
        </div>
      </section>
      <div className="flex justify-center max-w-5xl mx-auto">
        <section className="w-full mr-8">
          <img
            src={`data:image/svg+xml;base64,${lilInfo.imgData}`}
            className=" object-cover object-center min-h-[500px] mr-auto rounded-md"
            alt="lil"
          />

          {/* <PendingLil /> */}
        </section>
      </div>
    </div>
  );
}
