import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { useAccount, useSwitchNetwork } from "wagmi";
import { checkHasClaimed, claimAirdrop } from "@/utils/interfaces";
import { getProvider, getNetwork, fetchSigner } from "@wagmi/core";
import { optimism } from "wagmi/chains";
import { toast } from "react-hot-toast";
import { utils } from "ethers";
import { useRouter } from "next/router";
import ButtonLoader from "@/components/ButtonLoader";
import Confetti from "@/components/Confetti";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import usersJson from "../components/users.json";
import proofsJson from "../components/proofs.json";

const Home: NextPage = () => {
  const targetChain = optimism;
  const { address, isConnecting, isDisconnected } = useAccount();
  const provider = getProvider({ chainId: targetChain.id });
  const router = useRouter();

  const { chain } = getNetwork();

  const { chains, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  const [addresss, setAddress] = useState<string>("");
  const [eligible, setEligible] = useState<boolean>(false);

  const [userHasClaimed, setUserHasClaimed] = useState<boolean>(false);

  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [claimLoading, setClaimLoading] = useState<boolean>(false);

  const [claimableTokens, setClaimableTokens] = useState<string>("");

  const [indexOfProof, setIndexOfProof] = useState<string>("");

  useEffect(() => {
    if (address) {
      setAddress(address);

      if (chain!.id == targetChain.id) {
        setIsWrongNetwork(false);
      } else {
        setIsWrongNetwork(true);
      }

      if (provider) {
        const eligibleUser = usersJson.filter(
          (user) => user.address.toLowerCase() === addresss.toLowerCase()
        );

        if (eligibleUser.length > 0) {
          setEligible(true);
          setClaimableTokens(eligibleUser[0].amount);

          const index = usersJson.findIndex((object) => {
            return object.address.toLowerCase() === addresss.toLowerCase();
          });
          setIndexOfProof(index.toString());

          const claimed = async () => {
            const hasClaimedBoolean = await checkHasClaimed(provider, address);
            setUserHasClaimed(hasClaimedBoolean);
          };

          claimed();
        } else {
          setEligible(false);
        }
      }
    }
  }, [address, chain, provider, targetChain.id]);

  const checkEligilibity = () => {
    !addresss ? toast.error("Connect Wallet") : null;
  };

  const claimOpHandler = async (amount: string, proofIndex: number) => {
    setClaimLoading(true);
    try {
      const signer = await fetchSigner();
      let tx;
      tx = await claimAirdrop(
        addresss,
        amount,
        proofsJson[proofIndex],
        signer!
      );

      await tx.wait(1);

      setClaimLoading(false);
      toast.success(`You have succesfully claimed ${amount} $OP`);

      const hasClaimedBoolean = await checkHasClaimed(provider, addresss);
      setUserHasClaimed(hasClaimedBoolean);

      return tx;
    } catch (e: any) {
      toast.error(e.reason);
      setClaimLoading(false);
      return null;
    }
  };

  return (
    <div
      className="min-h-contentHeight bg-backgroundColor"
      style={{
        backgroundImage: "url(images/Dapp-background-final-white.png)",
      }}
    >
      {" "}
      <nav className="min-h-navbarHeight flex py-4 px-8 md:px-12 lg:px-16">
        <div className="flex justify-between lg:w-auto w-full lg:border-b-0 border-solid border-gray-300 py-4 lg:py-0">
          <div className="flex items-center flex-shrink-0 text-gray-800">
            <Link href="https://kromatika.finance/" target="_blank">
              <img
                src="/images/krom-logo.png"
                width={50}
                height={50}
                alt="logo icon"
              ></img>
            </Link>
          </div>
        </div>
        <div
          className={
            "menu w-full lg:block flex-grow lg:flex lg:items-center lg:w-auto"
          }
        >
          <div className="xmd:flex xmd:h-20 w-full py-5 items-center justify-end">
            <div className="flex min-w-[165px] justify-end">
              <ConnectButton
                chainStatus={{
                  smallScreen: "icon",
                  largeScreen: "full",
                }}
                accountStatus={{
                  smallScreen: "avatar",
                  largeScreen: "address",
                }}
                showBalance={{
                  smallScreen: true,
                  largeScreen: true,
                }}
              />
            </div>
          </div>
        </div>
      </nav>
      {isWrongNetwork ? (
        <>
          <div className="flex w-11/12 md:w-9/12 items-center justify-center mx-auto flex-wrap py-8">
            {chains.map((x) => (
              <button
                className="bg-wrongNetworkBackground w-11/12 xsm:w-5/6 md:w-4/6 xl:w-2/6 h-40 xsm:h-36 rounded-md text-white"
                disabled={!switchNetwork || x.id === chain?.id}
                key={x.id}
                onClick={() => switchNetwork?.(x.id)}
              >
                Wrong network detected!
                <br></br> Switch to{" "}
                <u>
                  <b>{x.name}</b>
                </u>{" "}
                Network
                {isLoading && pendingChainId === x.id}
                <img
                  src="/images/op-logo.svg"
                  alt="Optimism Logo"
                  className="mx-auto mt-2"
                  width={64}
                  height={64}
                />
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          {" "}
          <div className="w-10/12 sm:w-8/12 lg:w-6/12 2xl:w-4/12 mx-auto py-24 pt-8 sm:pt-24 px-8 sm:px-12 md:px-24">
            <div className="flex flex-col p-4 bg-airdropBackground rounded-2xl ">
              {addresss ? (
                <>
                  {eligible ? (
                    <>
                      {userHasClaimed ? (
                        <>
                          <div className="flex flex-col items-center my-2 lg:mx-4 text-grey text-lg	">
                            {`You've Already Claimed!`}
                          </div>
                          <div className="bg-newColor items-center justify-center w-7/12 sm:w-5/12 xl:w-4/12 flex my-2 mb-6 mx-auto text-grey text-lg rounded-xl gap-4">
                            <img
                              src={"/images/op-logo.svg"}
                              alt="Optimism Logo"
                              width={32}
                              height={32}
                              style={{ margin: "12px 0 12px 0" }}
                            />
                            <p className="">{claimableTokens}</p>
                          </div>
                          <ul className="flex flex-col items-center m-4 text-white text-md text-center">
                            <li>
                              Swap your claimed $OP, using &nbsp;
                              <Link
                                href="https://app.kromatika.finance/swap"
                                target="_blank"
                                className="font-bold "
                              >
                                <u>Kromatika MetaSwap aggregator.</u>
                              </Link>
                            </li>
                          </ul>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col items-center m-4 text-white text-2xl text-center">
                            {`You're Eligible!`}
                          </div>
                          <div className="flex flex-col items-center my-2 lg:mx-4 text-grey text-lg	">
                            You will receive
                          </div>
                          <div className="bg-newColor items-center justify-center w-7/12 sm:w-5/12 xl:w-4/12 flex my-2 mx-auto text-grey text-lg rounded-xl gap-4">
                            <img
                              src={"/images/op-logo.svg"}
                              alt="Optimism Logo"
                              width={32}
                              height={32}
                              style={{ margin: "12px 0 12px 0" }}
                            />
                            <p className="">{claimableTokens}</p>
                          </div>
                          <div className="flex flex-col m-4 mb-8 text-grey text-lg	">
                            {!claimLoading ? (
                              <button
                                className={
                                  claimLoading
                                    ? "bg-progressiveBackground w-7/12 sm:w-5/12 xl:w-4/12 mx-auto rounded-md text-white opacity-25"
                                    : "bg-progressiveBackground w-7/12 sm:w-5/12 xl:w-4/12 mx-auto rounded-md text-white"
                                }
                                onClick={() =>
                                  claimOpHandler(claimableTokens, +indexOfProof)
                                }
                              >
                                Claim
                              </button>
                            ) : (
                              <div className="flex w-5/12 items-center justify-center mx-auto">
                                <ButtonLoader />
                              </div>
                            )}
                            {eligible && <Confetti />}
                          </div>{" "}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <ul className="flex flex-col items-center m-4 text-white text-xl text-center">
                        <li>
                          {`Unfortunately, You're not Eligible, but take a look at`}{" "}
                          <Link
                            href="https://app.kromatika.finance/limitorder"
                            target="_blank"
                            className="font-bold text-linkTextColor"
                          >
                            FELOs.
                          </Link>
                        </li>
                      </ul>
                      <div className="flex flex-col items-center m-4 text-white text-center">
                        Kromatika FELO (Fees Earning Limit Order) leverages two
                        of the most successful technologies in the DeFi space to
                        create a 100% decentralized, and reliable Limit Order
                        feature, based on Uniswap V3.
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="flex flex-col m-4 mb-8 text-grey text-lg	">
                  <button
                    className={
                      "bg-progressiveBackground w-8/12 sm:w-7/12 xl:w-6/12 mx-auto rounded-md text-white"
                    }
                    onClick={() => {
                      checkEligilibity();
                    }}
                  >
                    Check Eligibility
                  </button>
                  {eligible && <Confetti />}
                </div>
              )}
              <div className="flex flex-col items-center h-0.5 text-white text-md text-center bg-grey"></div>

              <div className="flex flex-col items-center m-4 mt-6 text-white text-md text-center">
                <ul>
                  <li>
                    For more information regarding the $OP airdrop criteria,
                    check the following&nbsp;
                    <Link
                      href="https://gov.optimism.io/t/ready-gf-phase-1-proposal-cycle-6-kromatika/3306"
                      target="_blank"
                      className="text-linkTextColor"
                    >
                      <u>link</u>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col m-4 mt-0 text-white text-md text-center">
                <ul>
                  <li>
                    Discover Kromatika
                    <ul className="">
                      <li>
                        <Link
                          href="https://app.kromatika.finance/limitorder"
                          target="_blank"
                          className="text-linkTextColor"
                        >
                          <u className="text-white font-bold">FELO</u>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="https://app.kromatika.finance/swap"
                          target="_blank"
                          className="text-linkTextColor"
                        >
                          <u className="text-white font-bold">Swap</u>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="https://perp.kromatika.finance/"
                          target="_blank"
                          className="text-linkTextColor"
                        >
                          <u className="text-white font-bold">Perpetuals</u>
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
