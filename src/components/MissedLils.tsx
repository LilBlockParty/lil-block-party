/* eslint-disable react-hooks/exhaustive-deps */
import type { Result } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import { useBlockNumber } from "wagmi";

interface Props {
  data: Result | undefined;
  isFetching: boolean;
  isFetched: boolean;
}

export default function MissedLils({ data, isFetched, isFetching }: Props) {
  const imgData: Result | null = data ? data[2] : null;

  const { data: blockNumber, isFetched: isBlockFetched } = useBlockNumber();
  const [missedList, setMissedList] = useState([
    {
      imgData,
      blockNumber,
    },
  ]);
  useEffect(() => {
    if (isFetched && !isFetching && typeof imgData == "string") {
      if (missedList.length <= 4 && blockNumber !== 0) {
        setMissedList((prevArray) => [...prevArray, { imgData, blockNumber }]);
      }

      if (missedList.length >= 5 && imgData !== null) {
        missedList.shift();
        setMissedList((prevArray) => [...prevArray, { imgData, blockNumber }]);
      }
    }
  }, [imgData]);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl sm:py-12 sm:px-6 md:px-0 lg:max-w-7xl">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Missed Lils </h2>
        <div className="flex pb-10 pt-1 w-full">
          <div className="flex flex-nowrap gap-x-3 py-8">
            {missedList?.map((lil, index) => {
              if (!lil.imgData) return;
              return (
                <div key={index} className="group relative drop-shadow-lg">
                  <div className=" rounded-md bg-gray-200  lg:aspect-none ">
                    <img
                      width={256}
                      height={256}
                      src={`data:image/svg+xml;base64,${lil.imgData}`}
                      className=" object-cover object-center"
                      alt="lil"
                    />
                  </div>
                  <p className="mt-2 text-md text-gray-500">
                    {blockNumber ? `@ block ${blockNumber}` : ""}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
