import { Tab } from "@headlessui/react";
import { NextPage } from "next";
import { useContractRead } from "wagmi";
import MissedLils from "../MissedLils";
import LilNounsOracleAbi from "../abis/preview.json";
import Loading from "../components/Loading";

const lilNoun = {
  name: "Lil Noun #9999",
  price: "0.15 Ξ",
  images: [],
  description: `
    <p>ONE LIL NOUN,
    EVERY 15 MINUTES,
    FOREVER.</p>
  `,
  details: [
    {
      name: "Traits",
      items: [
        "bg-cool",
        "body-blue-sky",
        "accessory-stripes-olive",
        "head-abstract",
        "glasses-square-black-rgb",
      ],
    },
  ],
};

const Home: NextPage = () => {
  const { data, isFetching, isFetched } = useContractRead({
    addressOrName: "0xc0AABf8fbE161225B18e6aD0Bd51c060c1e1b5b4",
    contractInterface: LilNounsOracleAbi,
    functionName: "fetchNextNounAndAuctionState",
    watch: true,
    overrides: { blockTag: "pending" },
  });

  {
    console.log(data);

    if (data) {
      console.log(parseInt(data[1]._hex.toString()));
    }
  }

  return (
    <div className="bg-white h-full">
      <div className="mx-auto max-w-2xl py-2 px-4 sm:py-8 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Lil Preview</h1>
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          <Tab.Group as="div" className="flex flex-col-reverse">
            <Tab.Panels className="aspect-w-1 aspect-h-1 w-full">
              <Tab.Panel>
                {isFetched && !isFetching && data && (
                  <img
                    src={`data:image/svg+xml;base64,${data[2]}`}
                    alt={"nouns"}
                    className="h-full w-full object-cover shadow-xl object-center sm:rounded-lg"
                  />
                )}
                {isFetching && (
                  <div className="h-full w-full drop-shadow-md sm:rounded-lg flex justify-center animate-pulse bg-gray-200"></div>
                )}
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
          {/* lilNoun info */}

          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {data ? `Lil Noun # ${parseInt(data[1]._hex.toString())}` : ""}
            </h1>

            <div className="mt-3">
              <h2 className="sr-only">lilNoun information</h2>
              <p className="text-3xl tracking-tight text-gray-900">{lilNoun.price}</p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>

              <div
                className="space-y-6 text-base text-gray-700"
                dangerouslySetInnerHTML={{ __html: lilNoun.description }}
              />
            </div>

            {/* <div className="mt-8 divide-y divide-gray-200 border-t">
              {lilNoun.details.map((detail) => (
                <div key={detail.name}>
                  <>
                    <h3>
                      <button className="group relative flex w-full items-center justify-between py-6 text-left">
                        <span className="text-gray-900 font-medium text-lg">{detail.name}</span>
                      </button>
                    </h3>
                    <section className="prose prose-sm pb-6">
                      <ul role="list">
                        {detail.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>
                  </>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </div>

      <MissedLils />
    </div>
  );
};
export default Home;
