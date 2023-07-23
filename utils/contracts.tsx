import { MerkleDistributor__factory } from "@/types/ethers-contracts";

import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "ethers";

export const MerkleDistributorAddress = "0xF98dCd95217E15E05d8638da4c91125E59590B07";

export const getMerkleDistributorContract = async (
  signerOrProvider: Signer | Provider
) => {
  return MerkleDistributor__factory.connect(MerkleDistributorAddress, signerOrProvider);
};
