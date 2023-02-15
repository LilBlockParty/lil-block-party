import { WalletIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Tombstone from "./Tombstone";

export type EulogyInfo = {
  id: string;
  address: string;
  eulogy: string;
  img_data: string;
  img_url: string;
  token_id: number;
};

export default function Memeorium() {
  const [eulogy, setEulogy] = useState<EulogyInfo[]>([]);
  const router = useRouter();
  useEffect(() => {
    async function getEulogies() {
      const res = await fetch("/api/graveyard");
      if (res.ok) {
        const data = await res.json();
        console.table(data);
        setEulogy(data);
      }
    }
    getEulogies();
  }, []);
  return (
    <div className="hidden md:block mx-auto max-w-2xl sm:py-12 sm:px-6 md:px-6 lg:max-w-6xl">
      <div className=" flex items-center">
        <div>
          <Tombstone />
          <h2 className="text-5xl font-bold text-gray-900 mt-6" id="inMemorium">
            In Memeorium
          </h2>
          <div className="bg-white">
            <div className="mx-auto max-w-2xl sm:py-4 sm:px-6 md:px-0 lg:max-w-6xl">
              <div className="flex pb-10 pt-1 w-full">
                <div className="flex flex-wrap gap-3">
                  {eulogy?.map((lil, index) => {
                    if (!lil.img_url) return;
                    return (
                      <div
                        key={index}
                        className="group relative  max-w-[256px] cursor-pointer hover:drop-shadow-xl"
                        onClick={() => {
                          router.push(`/lil/${lil.id}`);
                        }}
                      >
                        <div className=" rounded-md lg:aspect-none filter grayscale hover:filter-none transition-transform duration-150 ease-in-out hover:scale-105">
                          <img
                            width={208}
                            height={208}
                            src={lil.img_url}
                            className="drop-shadow-md object-cover object-center mb-2"
                            alt="lil"
                          />
                        </div>
                        <div className="flex items-center">
                          <WalletIcon height={28} />

                          <span className="ml-2">
                            {lil.address.slice(0, 6)}...{lil.address.slice(-6)}
                          </span>
                        </div>
                        <p className="font-balsamiq w-[20ch] break-words">{lil.eulogy}</p>
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
