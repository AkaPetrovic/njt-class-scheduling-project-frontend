"use client";
import Link from "next/link";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { usePathname } from "next/navigation";

const ReturnButton = () => {
  const pathname = usePathname();
  const nextPath = pathname.split("/").slice(0, -1).join("/") + "/";

  if (pathname !== "/" && pathname !== "/login") {
    return (
      <Link
        href={nextPath}
        className="btn bg-base-100 shadow rounded-r-full p-3 min-h-16 min-w-16"
      >
        <ArrowBackIosNewRoundedIcon />
      </Link>
    );
  } else {
    return null;
  }
};

export default ReturnButton;
