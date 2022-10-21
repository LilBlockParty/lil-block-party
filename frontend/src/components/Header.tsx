import {ConnectButton} from "@rainbow-me/rainbowkit";
import Link from "next/link";

import Logo from "../images/logo.svg";
import MobileNavigation from "./MobileNav";

const Header = () => {
  return (
    <div className="w-full flex justify-between items-start">
      <span className="w-2/5">
        <Link href="https://lilnouns.wtf">
          <img src={Logo.src} alt="logo" className="cursor-pointer h-10" />
        </Link>
      </span>

      <MobileNavigation />

      <div className="hidden md:flex gap-x-6 justify-end md:justify-between items-center w-3/5">
        <Link href="#wtf">
          <a className="text-white text-3xl hover:underline hidden md:block">
            WTF?
          </a>
        </Link>
        <Link href="https://dune.com/nvonpentz/lilblockparty">
          <a className="text-white text-3xl hover:underline hidden md:block">
            Dune
          </a>
        </Link>
        <Link href="https://twitter.com/lilblockparty">
          <a className="text-white text-2xl">
            <a className="text-white text-3xl hover:underline hidden md:block">
              Twitter
            </a>
          </a>
        </Link>
        <Link href="https://discord.gg/HDcEmMWmhc">
          <a className="text-white text-2xl">
            <a className="text-white text-3xl hover:underline hidden md:block">
              Discord
            </a>
          </a>
        </Link>

        <ConnectButton />
      </div>
    </div>
  );
};

export default Header;
