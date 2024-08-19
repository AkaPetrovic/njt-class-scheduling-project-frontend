"use client";

import { useContext } from "react";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { useRouter } from "next/navigation";
import { TokenContext } from "./utility/context/TokenContext";

const Profile = () => {
  const router = useRouter();
  const { tokenValue, setTokenValue } = useContext(TokenContext);

  console.log(tokenValue);

  const handleLogout = () => {
    // Clear the JWT token cookie by setting it to a past date
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setTokenValue(null);
    router.push("/login");
  };

  if (tokenValue) {
    return (
      <div className="dropdown dropdown-end z-[1] absolute top-4 right-6">
        <div tabIndex={0} role="button" className="btn m-1 bg-base-100 shadow">
          {tokenValue.sub}
          <AccountBoxIcon />
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu rounded-box z-[1] w-52 p-2 shadow"
        >
          <li>
            <button onClick={handleLogout}>Log out</button>
          </li>
        </ul>
      </div>
    );
  } else {
    return null;
  }
};

export default Profile;
