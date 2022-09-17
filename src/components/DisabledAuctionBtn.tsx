const DisabledAuctionBtn = () => {
  return (
    <button
      type="button"
      disabled
      className="hidden md:inline-flex items-center rounded border border-transparent bg-[#E11833] text-md font-medium text-white shadow-sm cursor-not-allowed w-full px-5 py-4 text-3xl text-center"
    >
      Auction Active
    </button>
  );
};

export default DisabledAuctionBtn;
