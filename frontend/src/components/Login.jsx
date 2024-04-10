import React from "react";
import Spinner from "./Spinner.jsx"; // assuming Spinner component is in JSX
import { json, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = ({ loginRef, handleCloseDialog, setIsLoggedIn,isLoading, setIsLoading }) => {
  async function handleLogin(e) {
    setIsLoading(true);
    e.preventDefault();

    try {
      let inputs = new FormData();
      inputs.append("username", e.target.username.value);
      inputs.append("password", e.target.password.value);

      let data = await fetch("http://localhost:6969/api/user/login.php", {
        method: "POST",
        body: inputs,
        credentials: "include",
      });

      let jsonData = await data.json();
      if (data.status == 200) {
        setIsLoading(false);
        toast("Logged in successfully");
        setIsLoggedIn(true);
        handleCloseDialog(loginRef);
        e.target.reset();
      } else {
        throw new Error(jsonData.message);
      }
    } catch (e) {
      toast.error(e.message);
      setIsLoading(false);
    }
  }

  return (
        <dialog ref={loginRef}>
          {isLoading && <Spinner></Spinner>}
          <form
              onSubmit={handleLogin}
              method="POST"
              className="border rounded p-6 flex flex-col gap-1 w-[500px]"
          >
            <div className="flex flex-row justify-between">
              <h1 className="font-bold text-2xl">Login</h1>
              <button
                  type="button"
                  className="border rounded-full px-2 py-1 bg-zinc-500 text-white hover:text-black hover:bg-white hover:border-black transition-all ease-in-out"
                  onClick={() => handleCloseDialog(loginRef)}
              >
                <svg
                    fill="currentColor"
                    height="16"
                    icon-name="close-outline"
                    viewBox="0 0 20 20"
                    width="16"
                    xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m18.442 2.442-.884-.884L10 9.116 2.442 1.558l-.884.884L9.116 10l-7.558 7.558.884.884L10 10.884l7.558 7.558.884-.884L10.884 10l7.558-7.558Z"></path>
                </svg>
              </button>
            </div>
            <label htmlFor="loginUsername">Username</label>
            <input
                id="loginUsername"
                name="username"
                className="border"
                type="text"
            ></input>
            <label htmlFor="loginPassword">Password</label>
            <input
                id="loginPassword"
                name="password"
                className="border"
                type="password"
            ></input>
            <button
                type="submit"
                className="border rounded px-3 py-2 bg-blue-500 text-white hover:text-blue-500 hover:bg-white transition-all ease-in-out"
            >
              Login
            </button>
          </form>
        </dialog>
  );
};

export default Login;
