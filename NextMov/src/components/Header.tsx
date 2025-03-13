import Logo from "./Logo";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className=" mt-0 flex items-center justify-between p-1 bg-gray-800 text-white">
      <div className="flex items-center">
        <Logo />
      </div>
    </header>
  );
};

export default Header;
