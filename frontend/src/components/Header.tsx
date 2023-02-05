import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { Fragment } from "react";

import Logo from "../images/logo.svg";

function CloseIcon(props: Record<string, string>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="m17.25 6.75-10.5 10.5M6.75 6.75l10.5 10.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MobileNavItem({ href, children }: { href: string; children: string }) {
  return (
    <li>
      <Popover.Button as={Link} href={href} className="block py-2">
        {children}
      </Popover.Button>
    </li>
  );
}

const Header = () => {
  return (
    <div className="w-full flex justify-start items-start">
      <span className="w-2/5">
        <Link href="https://lilnouns.wtf" legacyBehavior>
          <img src={Logo.src} alt="logo" className="cursor-pointer h-10" />
        </Link>
      </span>

      {/* <div className="hidden md:flex gap-x-6 justify-end md:justify-between items-center w-3/5">
       */}
      <div className="w-3/5 flex justify-end">
        <Popover>
          <Popover.Button className="group flex items-center rounded-full bg-white/90 px-4 py-2 text-2xl font-medium text-zinc-800 shadow-lg shadow-zinc-800/5 ring-1 ring-zinc-900/5 backdrop-blur dark:bg-zinc-800/90 dark:text-zinc-200 dark:ring-white/10 dark:hover:ring-white/20">
            Menu
            <ChevronDownIcon className="ml-3 h-auto w-6 stroke-zinc-500 group-hover:stroke-zinc-700 dark:group-hover:stroke-zinc-400" />
          </Popover.Button>
          <Transition.Root>
            <Transition.Child
              as={Fragment}
              enter="duration-150 ease-out"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="duration-150 ease-in"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Popover.Overlay className="fixed inset-0 z-50 bg-zinc-800/40 backdrop-blur-sm dark:bg-black/80" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="duration-150 ease-out"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="duration-150 ease-in"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Popover.Panel
                focus
                className="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-white p-8 ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-zinc-800 max-w-md mx-auto"
              >
                <div className="flex flex-row-reverse items-center justify-between">
                  <Popover.Button aria-label="Close menu" className="-m-1 p-1">
                    <CloseIcon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
                  </Popover.Button>
                  <h2 className="text-xl font-medium text-zinc-600 dark:text-zinc-400">
                    Navigation
                  </h2>
                </div>
                <nav className="mt-6">
                  <ul className="-my-2 divide-y divide-zinc-100 text-xl text-zinc-800 dark:divide-zinc-100/5 dark:text-zinc-300">
                    {/* <MobileNavItem href="#wtf">WTF</MobileNavItem> */}
                    {/* <MobileNavItem href="/articles">Articles</MobileNavItem> */}
                    {/* <MobileNavItem href="/projects">Projects</MobileNavItem>
                    <MobileNavItem href="https://github.com/mhmulford0">Github</MobileNavItem> */}

                    <MobileNavItem href="#wtf">WTF?</MobileNavItem>
                    <MobileNavItem href="https://dune.com/nvonpentz/lilblockparty">
                      Dune
                    </MobileNavItem>
                    <MobileNavItem href="https://twitter.com/lilblockparty">
                      Twitter
                    </MobileNavItem>
                    <MobileNavItem href="https://discord.gg/YuuvMJ3qD4">Discord</MobileNavItem>
                  </ul>
                  <div className="block md:hidden mt-3">
                    <ConnectButton showBalance={false} />
                  </div>
                </nav>
              </Popover.Panel>
            </Transition.Child>
          </Transition.Root>
        </Popover>
      </div>

      <div className="hidden md:block ml-4">
        <ConnectButton showBalance={false} />
      </div>
    </div>
  );
};

export default Header;
