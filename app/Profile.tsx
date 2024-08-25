"use client";
import { useContext } from "react";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { useRouter } from "next/navigation";
import { TokenContext } from "./utility/context/TokenContext";

const Profile = () => {
  const router = useRouter();
  const { tokenValue, setTokenValue } = useContext(TokenContext);

  const handleLogout = () => {
    // Clear the JWT token cookie by setting it to a past date
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setTokenValue(null);
    router.push("/login");
  };

  if (tokenValue) {
    return (
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn bg-base-100 shadow rounded-l-full min-h-16"
        >
          {tokenValue.sub}
          <AccountBoxIcon />
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu z-[1] rounded-box p-0 shadow mt-1"
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
