import { WalletIcon } from "@heroicons/react/20/solid";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";

import { EulogyInfo } from "../../components/Memeorium";
import Tombstone from "../../components/Tombstone";
import { supabase } from "../../core/supabaseClient";

interface Props {
  eulogy: EulogyInfo[];
}

export default function LilPage({ eulogy }: Props) {
  if (!eulogy) {
    return <div className="mx-auto flex flex-wrap pt-6 bg-[#22212C] min-h-screen"></div>;
  }

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width" />
        <title>Lil Block Party</title>
        <meta name="description" content="Watch the blocks. Pick a lil. Join the party" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="lilblockparty.wtf" />
        <meta property="twitter:url" content="https://www.lilblockparty.wtf" />
        <meta name="twitter:title" content="Lil Block Party" />
        <meta
          name="twitter:description"
          content="Watch the blocks. Pick a lil. Join the party"
        />
        <meta name="twitter:image" content={eulogy[0]?.img_url} />
      </Head>
      <div className="mx-auto flex flex-wrap pt-6 bg-[#22212C] min-h-screen">
        {eulogy.map((lil) => {
          return (
            <div key={lil.token_id} className="mx-auto">
              <section className="mx-auto mb-12">
                <div className="flex flex-wrap w-full items-center">
                  <Tombstone />

                  <div className="ml-4">
                    <h3 className=" text-gray-400 text-3xl mt-4">
                      RIP to the almost Lil #: {lil.token_id}
                    </h3>
                    <span className="text-white text-xl block">{lil?.eulogy}</span>
                  </div>
                </div>
                <div className="flex justify-center max-w-5xl">
                  <section className="w-full mr-8 mt-8">
                    <img
                      src={lil.img_url}
                      className=" object-cover object-center  mx-auto rounded-md"
                      alt="lil"
                    />
                  </section>
                </div>
              </section>
            </div>
          );
        })}
      </div>
    </>
  );
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { data: eulogy, error } = await supabase
    .from("eulogies")
    .select("eulogy,img_url,address,token_id")
    .eq("id", context.query.id);

  if (!error) {
    return {
      props: { eulogy }, // will be passed to the page component as props
    };
  }

  return {
    props: {}, // will be passed to the page component as props
  };
}