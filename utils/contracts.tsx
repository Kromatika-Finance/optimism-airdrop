import { MerkleDistributor__factory } from "@/types/ethers-contracts";

import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "ethers";

export const MerkleDistributorAddress = "0x73060bd1e70Df9CDd9e321ac308948502c4e1fB5";

export const getMerkleDistributorContract = async (
  signerOrProvider: Signer | Provider
) => {
  return MerkleDistributor__factory.connect(MerkleDistributorAddress, signerOrProvider);
};
