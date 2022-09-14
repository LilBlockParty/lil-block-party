const DisabledAuctionBtn = () => {
  return (
    <button
      type="button"
      disabled
      className="inline-flex items-center rounded border border-transparent bg-[#E11833] px-5 py-2 text-md font-medium text-white shadow-sm cursor-not-allowed"
    >
      Auction Active
    </button>
  );
};

export default DisabledAuctionBtn;
