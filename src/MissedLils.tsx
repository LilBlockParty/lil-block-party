const missed = [
  {
    id: 1,
    imageAlt: "Missed Lil Nouns",
  },
  {
    id: 2,
    imageAlt: "Missed Lil Nouns",
  },
  ,
  {
    id: 3,
    imageAlt: "Missed Lil Nouns",
  },
  ,
  {
    id: 4,
    imageAlt: "Missed Lil Nouns",
  },
  {
    id: 5,
    imageAlt: "Missed Lil Nouns",
  },
  // {
  //   id: 6,
  //   imageAlt: "Missed Lil Nouns",
  // },
  // ,
  // {
  //   id: 7,
  //   imageAlt: "Missed Lil Nouns",
  // },
  ,
  ,
] as const;

export default function MissedLils() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Missed Lils</h2>

        <div className="flex overflow-x-scroll pb-10 pt-1 w-full">
          <div className="flex flex-nowrap overflow-x-auto gap-x-3 py-8">
            {missed.map((lil) => {
              if (!lil) return;
              return (
                <div key={lil.id} className="group relative drop-shadow-lg">
                  <div className="aspect-w-1 aspect-h-1 w-full rounded-md bg-gray-200  lg:aspect-none ">
                    <img
                      width={256}
                      height={256}
                      src={`/images/lilnoun${lil.id}.png`}
                      alt={lil.imageAlt}
                      className=" object-cover object-center"
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
