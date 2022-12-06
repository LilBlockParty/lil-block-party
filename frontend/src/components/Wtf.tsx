/* eslint-disable react/no-unescaped-entities */
const Wtf = () => {
  return (
    <div className="w-full mx-auto max-w-2xl px-4  py-2 lg:max-w-6xl pt-20 mb-20">
      <section className="w-full text-left mb-8">
        <h1 className="text-5xl mb-8 mt-4" id="wtf">
          WTF?
        </h1>
        <p className="max-w-[90ch] text-lg font-balsamiq mb-16">
          Lil Block Party is a project for the{" "}
          <a className="text-[#D63C5E] hover:underline" href="https://lilnouns.wtf">
            Lil Nouns DAO
          </a>{" "}
          community. It shows upcoming Lil Nouns based on the current block. Settling the auction
          gives you a chance to mint the current Lil Noun as the next auction..
        </p>
      </section>
      <section className="w-full text-left mb-20">
        <h2 className="text-4xl mb-4">Summary</h2>
        <p className="max-w-[90ch] text-lg font-balsamiq">
          <ul className="list-disc px-8">
            <li className="mb-2">Lil Block Party helps you preview and mint real Lil Nouns.</li>
            <li className="mb-2">
              Lil Nouns are determined by the block that they are minted on.{" "}
            </li>
            <li className="mb-2">
              Lil Block Party lets youwatch, block by block, the next possible Lil Nouns.{" "}
            </li>
            <li className="mb-2">
              The block where “settlement” occurs determines the next Lil Noun.
            </li>
            <li className="mb-2">
              Settling the auction allows you to mint the shown Lil Noun as the next auction.{" "}
            </li>
            <li className="mb-2">
              If the token number ends in 10, you won't be able to preview the next Lil Noun.{" "}
            </li>
            <li className="mb-2">
              Settlement and wallet confirmation have to happen all within the current block.
            </li>
            <li className="mb-2">
              Blocks change REALLY FAST, so decide you want your Lil Noun quickly.You only have
              seconds!
            </li>

            <li className="mb-2">
              A Lil Noun can’t always be minted if the chain moves too fast. Keep trying!
            </li>
            <li className="mb-2">
              If you successfully settle an auction, you still need to bid on Lil Nouns. Good luck!
            </li>
          </ul>
        </p>
      </section>
      <section className="w-full text-left mb-14">
        <h2 className="text-4xl mb-4">About Lil Block Party</h2>
        <p className="max-w-[90ch] text-lg font-balsamiq">
          Lil Block Party is an extension of Lil Nouns DAO. We show you what Lil noun would be
          minted if settlement occurs during the current block. We interact with the real Lil Nouns
          Contract, allowing you to mint the current Lil Noun. 100% of auction proceeds (ETH) are
          automatically deposited in the Lil Nouns DAO treasury, so Lil Nouns minted on Lil Block
          Party benefit the Lil Nouns community just the same.
        </p>
      </section>

      <section className="mb-14">
        <div className="relative h-0 pb-[56.25%]">
          <iframe
            src="https://www.loom.com/embed/a6abe7704d8449b789563accea2ca6f9"
            frameBorder="0"
            allowFullScreen
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
          />
        </div>
      </section>

      <section className="w-full text-left mb-20">
        <h2 className="text-4xl mb-4">Settling Auctions</h2>
        <p className="max-w-[90ch] text-lg font-balsamiq mb-8">
          Ethereum Blocks last 12 seconds, so you need to act FAST. When a Lil Noun appears that you
          want to mint, you must click “Settle auction” and confirm in your wallet. Both of these
          steps must occur during the current block. Otherwise, your transaction will fail.
        </p>
        <h3 className="text-2xl mb-4 font-balsamiq">Successful Settlement</h3>
        <p className="max-w-[90ch] text-lg font-balsamiq mb-8">
          Congratulations! You have successfully invited a Lil Noun to the party, but you’re not
          done yet! Your Lil Noun is now up for auction on the Lil Nouns website for the next 15
          minutes, with a floor bid of .15 ETH. Place your bid and good luck!
        </p>
        <h3 className="text-2xl mb-4 font-balsamiq">Failed Settlement</h3>
        <p className="max-w-[90ch] text-lg font-balsamiq mb-20">
          If you have a failed transaction, your transaction didn’t make it onto the current block,
          and no auction was started. This can be frustrating, but keep trying!
        </p>
        <h2 className="text-4xl mb-4 mt-8">The Team</h2>
        <ul className="list-disc px-8 text-lg font-balsamiq mb-16">
          <li className="mb-2">
            <a className="text-[#D63C5E] hover:underline" href="https://twitter.com/nvonpentz">
              {" "}
              @nvonpentz.eth{" "}
            </a>{" "}
            solidity
          </li>

          <li className="mb-2">
            <a className="text-[#D63C5E] hover:underline" href="https://twitter.com/mulford_dev">
              @mulford.eth
            </a>{" "}
            dev
          </li>

          <li className="mb-2">
            <a className="text-[#D63C5E] hover:underline" href="https://twitter.com/betterlawMLA">
              @lilpanda.branigan.eth
            </a>{" "}
            PM
          </li>

          <li className="mb-2">
            <a className="text-[#D63C5E] hover:underline" href="https://twitter.com/meesh_lin">
              @meeshlin.eth
            </a>{" "}
            design
          </li>

          <li className="mb-2">
            <a className="text-[#D63C5E] hover:underline" href="https://twitter.com/JamesKrahula">
              @lildonut.ethh
            </a>{" "}
            copy & design
          </li>
        </ul>
        <p className="text-2xl mb-2">
          funded via{" "}
          <a
            className="text-[#D63C5E] hover:underline"
            href="https://etherscan.io/tx/0x0517bbe28d7091a548f437d17fde58ca503f60e538da4d1e6f3738fe3b39a912"
          >
            Lil Nouns DAO
          </a>
        </p>
        <p className="text-2xl ">
          funded via{" "}
          <a className="text-[#D63C5E] hover:underline" href="https://prop.house/proposal/1340">
            lil prop 1340
          </a>
        </p>
      </section>
    </div>
  );
};

export default Wtf;
