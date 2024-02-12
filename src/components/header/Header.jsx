import ConnectWallet from "./parts/ConnectWallet";
import DesktopHeader from "./parts/DesktopHeader";
import Menu from "./parts/Menu";

const Header = () => {
  return (
    <div
      id="header"
      className="fixed top-0 left-0 w-screen h-[50px] text-2xl text-white z-50 backdrop-blur bg-[#242424] overflow-x-clip"
    >
      <DesktopHeader />
      <Menu />
      <ConnectWallet />
    </div>
  );
};

export default Header;
