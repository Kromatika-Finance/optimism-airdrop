import {
  MerkleDistributorAddress,
  getMerkleDistributorContract,
} from "./contracts";
import { Provider } from "@ethersproject/abstract-provider";
import { Signer } from "ethers";
import Web3 from "web3";

// CONTRACTS

export const fetchClaimableTokensAmount = async (
  provider: Provider,
  userAddress: string
) => {
  const contract = await getMerkleDistributorContract(provider);
  return contract.claimableTokens(userAddress);
};

export const checkHasClaimed = async (
  provider: Provider,
  userAddress: string
) => {
  return await (
    await getMerkleDistributorContract(provider)
  ).hasClaimed(userAddress);
};

export const claimAirdrop = async (
  userAddress: string,
  amount: string,
  proof: string[],
  signer: Signer
) => {
  const contract = await getMerkleDistributorContract(signer);
  return contract.claim(userAddress, amount, proof);
};

// Contracts utils

export const toWei = (amount: number) => {
  return amount * 1000000000000000000;
};

export const fromWei = (amount: number) => {
  return amount / 1000000000000000000;
};
