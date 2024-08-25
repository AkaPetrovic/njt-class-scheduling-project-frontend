"use client";
import { usePathname } from "next/navigation";
import NavBar from "./NavBar";
import Profile from "./Profile";
import ReturnButton from "./ReturnButton";

const Header = () => {
  const pathname = usePathname();
  return (
    <div
      className={`flex ${
        pathname === "/" ? "justify-end" : "justify-between"
      } gap-3 mt-2 w-full`}
    >
      <ReturnButton />
      <NavBar />
      <Profile />
    </div>
  );
};

export default Header;
