import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import Tombstone from "./Tombstone";
import PendingLil from "../components/PendingLil";
import Toast from "./Toast";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedLil: Record<string, unknown>;
}

const newDate = new Date();

const EulogyModal = ({ open, setOpen, selectedLil }: Props) => {
  const [eulogy, setEulogy] = useState("");
  const router = useRouter();

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10 " onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className=" transform bg-[#22212C] px-4 text-left shadow-xl transition-all  w-full sm:max-w-lg sm:p-6 min-w-full min-h-screen">
                  <p
                    className="text-[#92FFFF] text-xl mb-8 cursor-pointer"
                    onClick={() => setOpen(false)}
                  >
                    ↵ Back to the block
                  </p>

                  <section className="max-w-7xl mx-auto mb-12">
                    <div className="flex flex-wrap w-full items-center">
                      <Tombstone />
                      <div className="ml-4">
                        <h3 className="text-white text-6xl">In Memeorium</h3>

                        <span className="text-gray-400 text-xl">
                          Bid a personal adieu to our lost Lils
                        </span>
                      </div>
                    </div>
                  </section>
                  <div className="flex justify-center max-w-5xl mx-auto">
                    <section className="w-full mr-8">
                      <img
                        src={`data:image/svg+xml;base64,${selectedLil.imgData}`}
                        className=" object-cover object-center min-h-[500px] mr-auto rounded-md"
                        alt="lil"
                      />

                      {/* <PendingLil /> */}
                    </section>

                    <section className="w-full text-white my-auto">
                      <h2 className="text-5xl">Lil Noun</h2>
                      <p className="text-2xl mb-2">
                        Burned On {newDate.toLocaleString().split(",")[0]}
                      </p>
                      <form onSubmit={(e) => e.preventDefault()}>
                        <textarea
                          rows={5}
                          onChange={(e) => setEulogy(e.target.value)}
                          className="bg-[#22212C] border rounded w-2/3 text-2xl p-2 block mb-4"
                          placeholder="Rest in pixels, Lil Noun"
                          minLength={3}
                        />
                        <button
                          type="submit"
                          className="hidden md:inline-flex items-center cursor-pointer rounded-lg border text-center border-transparent bg-[#FFFF80] px-5 py-2 w-auto md:w-2/3 text-xl font-medium text-black shadow-sm hover:bg-[#e6e673]"
                          onClick={() => {
                            if (eulogy.trim().length < 3) return;
                            window.open(
                              encodeURI(
                                `https://twitter.com/intent/tweet?text=${eulogy}\n@lilblockparty`
                              ),
                              "_blank"
                            );
                          }}
                        >
                          <span className="w-full text-2xl">Tweet your eulogy</span>
                        </button>
                      </form>
                    </section>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};
export default EulogyModal;
