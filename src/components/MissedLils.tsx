/* eslint-disable react-hooks/exhaustive-deps */
import type { Result } from "ethers/lib/utils";
import Image from "next/future/image";
import { useEffect, useState } from "react";
import { useBlockNumber } from "wagmi";
import { AuctionState } from "../pages";

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
      imgData: "",
      blockNumber,
    },
  ]);
  useEffect(() => {
    if (data && data[3] === AuctionState.ACTIVE) return;

    if (isFetched && !isFetching && typeof imgData == "string") {
      if (missedList.length <= 4) {
        setMissedList((prevArray) => [...prevArray, { imgData, blockNumber }]);
      }

      if (missedList.length >= 5 && imgData !== null) {
        missedList.shift();
        setMissedList((prevArray) => [...prevArray, { imgData, blockNumber }]);
      }
    }
  }, [imgData]);

  if (missedList.length === 0) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-2xl sm:py-12 sm:px-6 md:px-0 lg:max-w-6xl"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl sm:py-12 sm:px-6 md:px-0 lg:max-w-6xl">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Missed Lils </h2>
        <div className="flex pb-10 pt-1 w-full">
          <div className="flex flex-nowrap gap-x-3 py-8">
            {missedList?.map((lil, index) => {
              if (!lil.imgData) return;
              return (
                <div key={index} className="group relative drop-shadow-lg max-w-[256px]">
                  <div className=" rounded-md bg-gray-200  lg:aspect-none ">
                    <Image
                      width={208}
                      height={208}
                      src={`data:image/svg+xml;base64,${lil.imgData}`}
                      className=" object-cover object-center"
                      alt="lil"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
