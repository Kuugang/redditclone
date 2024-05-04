import React, { useContext } from "react";
import Spinner from "./Spinner.jsx"; // assuming Spinner component is in JSX
import { toast } from "react-toastify";
import { MyContext } from "../utils/Context.jsx";
import { IoCloseCircle } from "react-icons/io5";

const Login = ({ loginRef, handleCloseDialog, setIsLoggedIn, isLoading, setIsLoading }) => {
    const { userData, setUserData } = useContext(MyContext);
    async function handleLogin(e) {
        setIsLoading(true);
        e.preventDefault();

        try {
            let inputs = {
                "email": e.target.email.value,
                "password": e.target.password.value,
            };
            let data = await fetch("http://localhost:6969/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(inputs),
                credentials: "include",
            });

            let jsonData = await data.json();
            if (data.status == 200) {
                setIsLoading(false);
                setUserData(jsonData.data.user);
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
                <div className="flex flex-row justify-between ">
                    <h1 className="font-bold text-2xl">Login</h1>
                    <button
                        type="button"
                        onClick={() => handleCloseDialog(loginRef)}
                    >
                        <IoCloseCircle className="h-6 w-6 transition duration-300 ease-in-out hover:text-red-500" />

                    </button>
                </div>
                <p className="mb-10 ml-10 mr-10 mt-5 text-sm">By continuing, you agree to our User Agreement and acknowledge
                    that you understand the Privacy Policy.</p>
                <div className="flex flex-col justify-center items-center">
                    <input
                        id="loginEmail"
                        name="email"
                        className="border h-10 px-4 rounded-xl mb-5 w-8/12"
                        type="text"
                        placeholder="Email"
                    />
                    <input
                        id="loginPassword"
                        name="password"
                        className="border h-10 px-4 rounded-xl mb-3  w-8/12 "
                        type="password"
                        placeholder="Password"
                    />
                    <div className="flex flex-row gap-2 mt-10">
                        <p className=" text-sm">Don't have an account?</p>
                        <a className="text-sm text-blue-500" onClick={() => {
                            handleCloseDialog(loginRef);
                        }}>Sign up now</a>
                    </div>
                </div>
                <button
                    type="submit"
                    className="mt-28 ml-20 mr-20 rounded-3xl border px-3 py-2 bg-blue-500 text-white transition-all duration-300 ease-in-out hover:bg-blue-800 hover:text-white"
                >
                    Login
                </button>
            </form>
        </dialog>
    );
};

export default Login;
