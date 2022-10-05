import type { Result } from "ethers/lib/utils";

interface Props {
  data: Result | undefined;
}

const PendingLil = ({ data }: Props) => {
  return (
    <div className="w-full relative">
      {data === undefined ? (
        <p className="absolute px-2 text-xl md:text-3xl text-slate-200 bg-red-500 w-full overflow-hidden flex flex-nowrap items-center text-right rounded-t-xl text-ellipsis h-16">
          <span className="block animate-infiniteScroll w-full">
            AUCTION IN PROGRESS, AUCTION IN PROGRESS
          </span>
        </p>
      ) : (
        ""
      )}

      <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="400" rx="20" fill="url(#paint0_linear_179_261)" />
        <path
          d="M142 193V178H172V163H187V148H142V163H112V133H127V118H202V133H217V163H202V178H187V193H142ZM142 223V208H187V223H142Z"
          fill="black"
          fillOpacity="0.9"
        />
        <path
          d="M230 236V226H250V216H260V206H230V216H210V196H220V186H270V196H280V216H270V226H260V236H230ZM230 256V246H260V256H230Z"
          fill="black"
          fillOpacity="0.9"
        />
        <path
          d="M124 277V270H138V263H145V256H124V263H110V249H117V242H152V249H159V263H152V270H145V277H124ZM124 291V284H145V291H124Z"
          fill="black"
          fillOpacity="0.9"
        />
        <defs>
          <linearGradient
            id="paint0_linear_179_261"
            x1="-8.46324e-06"
            y1="-17.6"
            x2="400"
            y2="400"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF80BF" />
            <stop offset="1" stopColor="#9580FF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default PendingLil;
