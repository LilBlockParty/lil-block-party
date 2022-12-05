import type { Result } from "ethers/lib/utils";

interface Props {
  data: Result | undefined;
}

// If token is under the threshhold and ends in 10, return true
// https://github.com/lilnounsDAO/lilnouns-monorepo/blob/59ff19a364e631d8e5484823e2982858d99daf8d/packages/nouns-contracts/contracts/NounsToken.sol#L165-L176
const isLilNoundersToken = ({ data }: Props) => {
  if (data?.[1].lte(175300) && data?.[1].mod(10).isZero()) {
    return true;
  } else {
    return false;
  }
};

export default isLilNoundersToken;