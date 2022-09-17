/* eslint-disable react/no-unescaped-entities */

const Wtf = () => {
  return (
    <div className="w-full mx-auto max-w-2xl px-4  py-2 lg:max-w-6xl pt-20 mb-48">
      <section className="w-full text-left mb-8">
        <h1 className="text-5xl mb-4 mt-4">WTF?</h1>
        <p className="max-w-[90ch] text-lg font-balsamiq">
          Lil Block Party is a project for the Lil Nouns DAO community. Lil Block Party shows
          upcoming Lil Nouns based on the current block. Settling and Starting The Auction gives you
          a chance to mint the current Lil Noun as the next auction. This happens REALLY fast, so
          decide if you like the Lil Noun quick to try and settle on the current block!
        </p>
      </section>
      <section className="w-full text-left mb-8">
        <h2 className="text-4xl mb-4" id="wtf">
          Summary
        </h2>
        <p className="max-w-[90ch] text-lg font-balsamiq">
          <ul className="list-disc px-8">
            <li className="mb-2">
              One Lil Noun is born, and trustlessly auctioned every 15 minutes, forever.
            </li>
            <li className="mb-2">The auction must be "settled"; to start the next auction.</li>
            <li className="mb-2">
              The block that "settlement" occurs in determines the next Lil Noun.
            </li>
            <li className="mb-2">
              Lil Block Party lets you watch, block by block, the next possible Lil Nouns.
            </li>
            <li className="mb-2">
              Settling and Starting The Auction gives you a chance to mint the current Lil Noun as
              the next auction.
            </li>
            <li className="mb-2">
              They change REALLY FAST, so have your wallet ready and decide you want a Lil Noun
              quickly. You only have seconds!
            </li>
            <li>A Lil Noun can't always be minted if the chain moves too fast. Keep trying!</li>
          </ul>
        </p>
      </section>
      <section className="w-full text-left mb-8">
        <h2 className="text-4xl mb-4">About Lil Nouns</h2>
        <p className="max-w-[90ch] text-lg font-balsamiq">
          <ul className="list-decimal px-8">
            <li className="mb-2">
              Lil Nouns are an expansion DAO based on Nouns DAO and uses a fork of the Nouns
              Contract. If you know how Nouns work, you know how Lil Nouns work, but you can read
              more about it here.
            </li>
            <li className="mb-2">
              The block in which settlement of the previous Lil Noun auction occurs determines the
              next Lil Noun that is minted. Lil Block Party shows you what Lil Noun would be minted
              if settlement occurred during the current block. We connect with the Lil Nouns
              Contract, allowing you to see in real-time the current Lil Noun based on the current
              block, and Settling and Starting The Auction to give you the best chance of settling
              on the Lil Noun you want.
            </li>

            <li className="mb-2">
              Ethereum Blocks only last 12 seconds, so you need to be ready to settle your
              transaction quickly with enough gas to mint the Lil Noun currently shown. Lil Block
              Party cannot promise that your settlement will occur on the block you want, but we
              give you a much better chance of minting the Lil Noun of your choosing.
            </li>

            <li className="mb-2">
              Lil Block Party mints are REAL Lil Nouns. We interact with the real Lil Nouns
              Contract.
            </li>
          </ul>
        </p>
      </section>
    </div>
  );
};

export default Wtf;
