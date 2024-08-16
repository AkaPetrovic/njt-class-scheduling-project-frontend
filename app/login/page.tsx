"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.name === "username"
      ? setUsername(e.target.value)
      : setPassword(e.target.value);
  };

  const handleLogin = async () => {
    const loginData = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      const token = await response.text();

      document.cookie = `token=${token}; path=/; max-age=${
        60 * 60 * 24
      }; secure; samesite=lax;`;

      router.push("/");
    } catch (error) {
      console.error("Login failed. Error:", error);
    }
  };

  return (
    <main className="flex flex-col justify-center items-center relative h-full w-full">
      <div className="card w-1/5 min-w-fit shadow-xl">
        <div className="card-body">
          <h1>Please Log In</h1>
          <form>
            <div className="flex flex-col mb-3.5">
              <label htmlFor="username" className="mb-1">
                Username:
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                className="input input-bordered w-full"
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col mb-3.5">
              <label htmlFor="password" className="mb-1">
                Password:
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                className="input input-bordered w-full"
                onChange={handleInputChange}
              />
            </div>
          </form>
          <div className="card-actions justify-end">
            <button className="btn btn-neutral" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
