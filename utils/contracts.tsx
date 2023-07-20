import { MerkleTreeDistributor__factory } from "@/types/ethers-contracts";

import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "ethers";

export const MerkleTreeDistributorAddress = "0x42c385E43C56B281182220f8A0710b3fd2EC1A3b";

export const getMerkleTreeDistributorContract = async (
  signerOrProvider: Signer | Provider
) => {
  return MerkleTreeDistributor__factory.connect(MerkleTreeDistributorAddress, signerOrProvider);
};
