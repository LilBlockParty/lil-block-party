import { Redis } from "@upstash/redis";
import { useEffect, useState } from "react";

import Tombstone from "./Tombstone";

type EulogyInfo = {
  address: string;
  eulogy: string;
  imgData: string;
  tokenId: number;
};

const redis = new Redis({
  url: "https://us1-singular-duckling-39560.upstash.io",
  token:
    "AZqIACQgYjY4NTlhNzktM2QyNi00M2VlLTk4MTItZWIwZDk1ZDc1MmUzMTgzM2Y3YmEzYjVhNDMzY2I3NTZmMjg4ZWU2MDRlZDY=",
});

export default function Memeorium() {
  const [eulogy, setEulogy] = useState<EulogyInfo[]>([]);
  useEffect(() => {
    async function getEulogies() {
      const data = await redis.smembers("eulogy");
      console.info(data, "set data");
      setEulogy(data);
    }
    getEulogies();
  }, []);
  return (
    <div className="mx-auto max-w-2xl sm:py-12 sm:px-6 md:px-0 lg:max-w-6xl mt-14">
      <div className="-mt-20 flex items-center">
        <div>
          <Tombstone />
          <h2 className="text-5xl font-bold text-gray-900 mt-6">In Memeorium</h2>
          <div className="bg-white hidden md:block">
            <div className="mx-auto max-w-2xl sm:py-4 sm:px-6 md:px-0 lg:max-w-6xl">
              <div className="flex pb-10 pt-1 w-full">
                <div className="flex flex-wrap gap-3">
                  {eulogy?.map((lil, index) => {
                    if (!lil.imgData) return;
                    return (
                      <div key={index} className="group relative drop-shadow-md max-w-[256px]">
                        <div className=" rounded-md bg-gray-200  lg:aspect-none ">
                          <img
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
        </div>
      </div>
    </div>
  );
}
