import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { useAccount, useSwitchNetwork } from "wagmi";
import { fetchClaimableTokensAmount } from "@/utils/interfaces";
import { getProvider, getNetwork, fetchSigner } from "@wagmi/core";
import { sepolia } from "wagmi/chains";
import { toast } from "react-hot-toast";
import { utils } from "ethers";
import { useRouter } from "next/router";
import ButtonLoader from "@/components/ButtonLoader";
import Image from "next/image";
import Confetti from "@/components/Confetti";
import Link from "next/link";

const Home: NextPage = () => {
  const targetChain = sepolia;
  const { address, isConnecting, isDisconnected } = useAccount();
  const provider = getProvider({ chainId: targetChain.id });
  const router = useRouter();

  const { chain } = getNetwork();

  const { chains, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  const [addresss, setAddress] = useState<string>("");
  const [eligible, setEligible] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [createPoolLoading, setCreatePoolLoading] = useState<boolean>(false);

  const [claimableTokens, setClaimableTokens] = useState<string>("");

  useEffect(() => {
    if (address) {
      setAddress(address);
      setEligible(true);

      if (chain!.id == targetChain.id) {
        setIsWrongNetwork(false);
      } else {
        setIsWrongNetwork(true);
      }

      if (provider) {
        const getClaimableTokens = async () => {
          const claimableTokensResult = await fetchClaimableTokensAmount(
            provider,
            address
          );
          console.log(claimableTokensResult.toString());
          setClaimableTokens(claimableTokensResult.toString());
        };

        getClaimableTokens();
      }
    } else {
      setEligible(false);
    }
  }, [address, provider]);

  const checkEligilibity = () => {
    !addresss ? toast.error("Connect Wallet") : null;
  };

  return (
    <div
      className="min-h-contentHeight"
      style={{
        backgroundImage:
          "url(images/Dapp-background-final-white.png), linear-gradient(to right bottom, #0a0f38, #0a0f38, #173F78)",
      }}
    >
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
                <Image
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
          <div className="w-10/12 sm:w-8/12 lg:w-6/12 2xl:w-4/12 mx-auto py-24 px-8 sm:px-12 md:px-24">
            <div className="flex flex-col p-4 bg-airdropBackground rounded-2xl ">
              {addresss ? (
                <>
                  <div className="flex flex-col items-center m-4 text-white text-2xl text-center">
                    {`You're Eligible!`}
                  </div>
                  <div className="flex flex-col items-center my-2 lg:mx-4 text-grey text-lg	">
                    You will receive
                  </div>
                  <div className="bg-newColor items-center justify-center w-7/12 sm:w-5/12 xl:w-4/12 flex my-2 mx-auto text-grey text-lg rounded-xl gap-4">
                    <Image
                      src={"/images/op-logo.svg"}
                      alt="Optimism Logo"
                      width={32}
                      height={32}
                      style={{ margin: "12px 0 12px 0" }}
                    />
                    <p className="">2500</p>
                  </div>
                  <div className="flex flex-col m-4 mb-8 text-grey text-lg	">
                    <button
                      className={
                        createPoolLoading
                          ? "bg-progressiveBackground w-7/12 sm:w-5/12 xl:w-4/12 mx-auto rounded-md text-white opacity-25"
                          : "bg-progressiveBackground w-7/12 sm:w-5/12 xl:w-4/12 mx-auto rounded-md text-white"
                      }
                    >
                      Claim
                    </button>
                    {eligible && <Confetti />}
                  </div>
                </>
              ) : (
                <div className="flex flex-col m-4 mb-8 text-grey text-lg	">
                  <button
                    className={
                      createPoolLoading
                        ? "bg-progressiveBackground w-8/12 sm:w-7/12 xl:w-6/12 mx-auto rounded-md text-white opacity-25"
                        : "bg-progressiveBackground w-8/12 sm:w-7/12 xl:w-6/12 mx-auto rounded-md text-white"
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
                    <Link href="/" className="text-linkTextColor">
                      <u>link</u>
                    </Link>
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
