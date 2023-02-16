import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { useRouter } from "next/router";

import Header from "../../components/Header";
import { EulogyInfo } from "../../components/Memeorium";
import ThreeDotLoader from "../../components/ThreeDotLoader";
import Tombstone from "../../components/Tombstone";

export default function RipPage() {
  const router = useRouter();
  const { wallet } = router.query;

  const { isLoading, isError, data } = useQuery({
    queryKey: ["getWalletLil", wallet],
    queryFn: async () => {
      const res = await fetch(`/api/graveyard/${wallet}`);
      const data: Promise<EulogyInfo[]> = await res.json();
      return data;
    },
  });

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Your Memeories</title>
        </Head>
        <div className="mx-auto pt-6 bg-[#22212C] min-h-screen px-6">
          <Header />
          <section>
            <h1 className="text-5xl text-white text-center mb-20">Your Memories</h1>
            <section className="max-w-xs mx-auto">
              <ThreeDotLoader />
            </section>
          </section>
        </div>
      </>
    );
  }

  if (isError) {
    return <p>errpr</p>;
  }

  return (
    <>
      <Head>
        <title>Your Memeories</title>
      </Head>
      <div className="mx-auto pt-6 bg-[#22212C] min-h-screen px-6 pb-32">
        <Header />
        <section>
          <h1 className="text-5xl text-white text-center mt-20 mb-32">Your Memories</h1>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {data.map((lil) => {
            return (
              <section key={lil.id} className="flex flex-col justify-center items-center mb-20">
                <>
                  <Tombstone />

                  <>
                    <h3 className=" text-gray-400 text-3xl mt-1 mb-4">
                      RIP to the almost Lil #: {lil.token_id}
                    </h3>
                    <span className="text-white text-xl block">{lil?.eulogy}</span>
                  </>
                </>
                <div className="flex justify-center max-w-lg mx-auto">
                  <section className="w-full mt-4">
                    <img
                      src={lil.img_url}
                      className=" object-cover object-center min-h-[384px] mr-auto rounded-md cursor-pointer"
                      alt="lil"
                      onClick={() => {
                        router.push(`/lil/${lil.id}`);
                      }}
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
