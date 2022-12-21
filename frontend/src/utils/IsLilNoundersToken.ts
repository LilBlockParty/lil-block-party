import type { Result } from "ethers/lib/utils";

// If token is under the threshhold and ends in 10, return true
// https://github.com/lilnounsDAO/lilnouns-monorepo/blob/59ff19a364e631d8e5484823e2982858d99daf8d/packages/nouns-contracts/contracts/NounsToken.sol#L165-L176
const isLilNoundersToken = (data: Result | undefined) => {
  if (data?.[1].gte(175300)) {
    return false;
  }

  if (!data?.[1].mod(10).isZero()) {
    return false;
  }

  return true;
};

export default isLilNoundersToken;
