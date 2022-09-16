const DisabledAuctionBtn = () => {
  return (
    <button
      type="button"
      disabled
      className="inline-flex items-center rounded border border-transparent bg-[#E11833] text-md font-medium text-white shadow-sm cursor-not-allowed w-96 px-5 py-4  md:w-96 text-2xl "
    >
      Auction Active
    </button>
  );
};

export default DisabledAuctionBtn;
