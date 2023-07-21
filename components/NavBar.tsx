import { useState } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";

export const NavBar = () => {
  const router = useRouter();
  const [showNavBar, setShowNavBar] = useState(false);

  const showNavBarHandler = () => {
    setShowNavBar(!showNavBar);
  };

  return (
    <nav className="min-h-navbarHeight flex  flex-wrap bg-newColor py-4 lg:px-12 shadow border-solid border-t-2 border-blue-700">
      <div className="flex justify-between lg:w-auto w-full lg:border-b-0 pl-6 pr-2 border-solid border-gray-300 pb-5 lg:pb-0">
        <div className="flex items-center flex-shrink-0 text-gray-800">
          <Link href="https://kromatika.finance/" target="_blank">
            <img
              src="/images/KROM_Transparent_1.png"
              width={166}
              height={166}
              alt="logo icon"
            ></img>
          </Link>
        </div>
        <div className="block lg:hidden ">
          <button
            id="nav"
            onClick={() => {
              showNavBarHandler();
            }}
            className="text-white flex items-center px-3 py-2 border-2 rounded text-blue-700 border-blue-700 hover:text-blue-700 hover:border-blue-700"
          >
            <svg
              className="fill-current h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
      </div>
      <div
        className={
          showNavBar
            ? "menu w-full lg:block flex-grow lg:flex lg:items-center lg:w-auto lg:px-3 px-8"
            : "menu w-full hidden lg:block flex-grow lg:flex lg:items-center lg:w-auto lg:px-3 px-8"
        }
      >
        <div className="xmd:flex xmd:h-20 w-full  p-4">
          <div className="flex-row xmd:flex w-[95%] mx-auto xmd:w-9/12 gap-2"></div>
          <div className="flex w-[95%] xmd:w-3/12 mx-auto justify-center xmd:justify-end">
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
  );
};

export default NavBar;
