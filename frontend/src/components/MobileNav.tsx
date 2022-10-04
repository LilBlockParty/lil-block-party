import { Popover, Transition } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { Fragment } from "react";

interface ItemProps {
  href: string;
  children: string;
}

function CloseIcon(props: Record<string, unknown>) {
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

function MobileNavItem({ href, children }: ItemProps) {
  return (
    <li>
      <Popover.Button as={Link} href={href} className="block py-2">
        {children}
      </Popover.Button>
    </li>
  );
}

export default function MobileNavigation(props: any) {
  return (
    <Popover {...props} className="inline-block md:hidden">
      <Popover.Button className="group flex items-center rounded-full bg-white/90 px-4 py-2 text-2xl text-zinc-800 shadow-lg shadow-zinc-800/5 backdrop-blur dark:bg-zinc-700/90 dark:text-zinc-200">
        <Bars3Icon className="w-6 h-6" />
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter="duration-100 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 z-50 bg-zinc-700/40 backdrop-blur-sm dark:bg-black/80" />
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
            className="fixed inset-x-4 top-8 z-50 origin-top rounded-3xl bg-white p-8 dark:bg-zinc-800"
          >
            <div className="flex flex-row-reverse items-center justify-between">
              <Popover.Button aria-label="Close menu" className="-m-1 p-1">
                <CloseIcon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
              </Popover.Button>
              <h2 className="text-4xl font-medium text-zinc-700 dark:text-zinc-300">Navigation</h2>
            </div>
            <nav className="mt-6">
              <ul className="my-12  text-3xl text-zinc-700 mb-12 dark:text-zinc-300 flex flex-col gap-y-12 justify-center items-start w-full">
                <MobileNavItem href="#wtf">WTF?</MobileNavItem>
                <MobileNavItem href="https://dune.com/nvonpentz/lilblockparty">Dune</MobileNavItem>
                <MobileNavItem href="https://twitter.com/lilblockparty">Twitter</MobileNavItem>
              </ul>

              <ConnectButton />
            </nav>
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  );
}
