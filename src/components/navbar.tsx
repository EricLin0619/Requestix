"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import FlashText from "@/components/flashText";
import Link from "next/link";

function Navbar() {
  return (
    <div className="navbar bg-white text-black rounded-lg shadow-xl">
      <div className="flex-1">
        {/* 添加漢堡選單 */}
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost !bg-transparent hover:!bg-transparent"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-white text-black rounded-box z-[1] w-52 p-2 shadow mt-4"
          >
            <li>
              <Link href="/">Buy Tickets</Link>
            </li>
            <li>
              <Link href="/myTickets">My Tickets</Link>
            </li>
            <li>
              <Link href="/create">Create Event</Link>
            </li>
          </ul>
        </div>
        <Link href="/">
          <FlashText />
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 relative">
          <div className="z-10">
            <ConnectButton />
          </div>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
