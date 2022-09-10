import { Tab } from "@headlessui/react";
import { Result } from "ethers/lib/utils";
import GameBoyNoun from "./GameboyNoun";

import { useBlockNumber } from "wagmi";

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

interface Props {
  data: Result | undefined;
  isFetching: boolean;
  isFetched: boolean;
}

const InfoLil = ({ data, isFetching, isFetched }: Props) => {
  const { data: blockNumber } = useBlockNumber();

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Gotta Mint &apos;em All</h1>
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8 mb-6">
        <Tab.Group as="div" className="flex flex-col-reverse">
          <Tab.Panels className="aspect-w-1 aspect-h-1 w-full">
            <Tab.Panel>
              <p className="text-2xl font-bold tracking-tight text-gray-900  mb-1">
                Lil Noun @ block: {blockNumber ? blockNumber : ""}
              </p>
              {isFetched && !isFetching && data && (
                <>
                  <img
                    src={`data:image/svg+xml;base64,${data[2]}`}
                    alt={"nouns"}
                    className="h-full w-full object-cover shadow-xl object-center sm:rounded-lg"
                  />
                </>
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

          <div className="mt-8">
            {/* <GameBoyNoun /> */}

            {/* {lilNoun.details.map((detail) => (
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
              ))} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoLil;
