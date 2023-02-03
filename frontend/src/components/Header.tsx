import {ConnectButton} from "@rainbow-me/rainbowkit";
import Link from "next/link";

import Logo from "../images/logo.svg";
import MobileNavigation from "./MobileNav";

const Header = () => {
  return (
    <div className="w-full flex justify-between items-start">
      <span className="w-2/5">
        <Link href="https://lilnouns.wtf" legacyBehavior>
          <img src={Logo.src} alt="logo" className="cursor-pointer h-10" />
        </Link>
      </span>

      <MobileNavigation />

      <div className="hidden md:flex gap-x-6 justify-end md:justify-between items-center w-3/5">
        <Link
          href="#wtf"
          className="text-white text-3xl hover:underline hidden md:block">
          
            WTF?
          
        </Link>
        <Link
          href="https://dune.com/nvonpentz/lilblockparty"
          className="text-white text-3xl hover:underline hidden md:block">
          
            Dune
          
        </Link>
        <Link href="https://twitter.com/lilblockparty" className="text-white text-2xl">

          <span className="text-white text-3xl hover:underline hidden md:block">
            Twitter
          </span>

        </Link>
        <Link href="https://discord.gg/YuuvMJ3qD4" className="text-white text-2xl">

          <span className="text-white text-3xl hover:underline hidden md:block">
            Discord
          </span>

        </Link>

        <ConnectButton />
      </div>
    </div>
  );
};

export default Header;
