import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { z } from "zod";

import Header from "../../components/Header";
import { EulogyInfo } from "../../components/Memeorium";
import Tombstone from "../../components/Tombstone";

export default function RipPage() {
  const router = useRouter();
  const { wallet } = router.query;
  const [lilInfo, setLilInfo] = useState<EulogyInfo[] | null>(null);

  useEffect(() => {
    if (!wallet) return;
    async function getEulogies() {
      const res = await fetch(`/api/graveyard/${wallet}`);
      if (res.ok) {
        const data: EulogyInfo[] = await res.json();
        data.filter((lil) => lil.address);
        console.info(data, "set data");
        setLilInfo(data);
      }
    }
    getEulogies();
  }, [wallet]);

  const { isLoading, data } = useQuery({
    queryKey: ["getWalletLil"],
    queryFn: async () => {
      const data = await fetch(`/api/graveyard/${wallet}`);
      return data;
    },
  });

  console.log(isLoading);
  console.log(data);

  if (!lilInfo || lilInfo.length === 0) {
    return (
      <>
        <Head>
          <title>Your Memeories</title>
        </Head>{" "}
        <div className="mx-auto pt-6 bg-[#22212C] min-h-screen px-6">
          <Header />
          <h1 className="text-5xl text-white text-center m-20">No Memeories Made, yet!</h1>
        </div>
      </>
    );
  }

  console.log(lilInfo);

  return (
    <>
      <Head>
        <title>Your Memeories</title>
      </Head>
      <div className="mx-auto pt-6 bg-[#22212C] min-h-screen px-6">
        <Header />
        <section>
          <h1 className="text-5xl text-white text-center mb-20">Your Memories</h1>
        </section>
        <div className="grid grid-cols-3 gap-4 w-full">
          {lilInfo.map((lil) => {
            return (
              <section key={lil.id}>
                <div>
                  <Tombstone />

                  <>
                    <h3 className=" text-gray-400 text-3xl mt-4">
                      RIP to the almost Lil #: {lil.token_id}
                    </h3>
                    <span className="text-white text-xl block">{lil?.eulogy}</span>
                  </>
                </div>
                <div className="flex justify-center max-w-lg mx-auto">
                  <section className="w-full mt-8">
                    <img
                      src={lil.img_url}
                      className=" object-cover object-center min-h-[384px] mr-auto rounded-md"
                      alt="lil"
                    />
                  </section>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
