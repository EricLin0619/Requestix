import { ConnectButton } from "@rainbow-me/rainbowkit";

function Navbar() {
  return (
    <div className="navbar bg-white text-black rounded-lg shadow-xl">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">NFT Market</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <ConnectButton/>
          {/* <li>
            <details>
              <summary>Parent</summary>
              <ul className="p-2 bg-base-100 rounded-t-none">
                <li>
                  <a>Link 1</a>
                </li>
                <li>
                  <a>Link 2</a>
                </li>
              </ul>
            </details>
          </li> */}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;