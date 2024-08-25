"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const pathname = usePathname();

  if (pathname !== "/" && pathname !== "/login") {
    return (
      <nav className="navbar shadow rounded-full w-auto flex-grow">
        <Link href="/" className="btn btn-sm text-base btn-ghost ml-4">
          Home
        </Link>
        <Link
          href="/class-coverage-plans"
          className="btn btn-sm text-base btn-ghost ml-4"
        >
          Class Coverage Plans
        </Link>
        <Link href="/subjects" className="btn btn-sm text-base btn-ghost ml-4">
          Subjects
        </Link>
        <Link
          href="/teaching-staff"
          className="btn btn-sm text-base btn-ghost ml-4"
        >
          Teaching Staff
        </Link>
      </nav>
    );
  } else {
    return null;
  }
};

export default NavBar;
