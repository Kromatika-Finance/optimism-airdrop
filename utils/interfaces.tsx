import {
  MerkleTreeDistributorAddress,
  getMerkleTreeDistributorContract,
} from "./contracts";
import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "ethers";
import Web3 from "web3";

// CONTRACTS

export const fetchClaimableTokensAmount = async (
  provider: Provider,
  userAddress: string
) => {
  const contract = await getMerkleTreeDistributorContract(provider);
  return contract.claimableTokens(userAddress);
};

// Contracts utils

export const toWei = (amount: number) => {
  return amount * 1000000000000000000;
};

export const fromWei = (amount: number) => {
  return amount / 1000000000000000000;
};
