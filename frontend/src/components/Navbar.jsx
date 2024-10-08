import React, { useRef, useContext, useState } from "react";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import { Link } from "react-router-dom";
import { MyContext } from "../utils/Context";
import { useNavigate } from "react-router-dom";
import { Button } from "../stories/Button";
import { MdForum } from "react-icons/md";
import SearchBar from "../icons/SearchBar";
import { openModal } from "../utils/functions.js";


const Navbar = () => {
    const navigate = useNavigate();
    const { isLoggedIn, setIsLoggedIn, userData, setUserData } = useContext(MyContext);
    const [toggleProfileOptions, setToggleProfileOption] = useState(false);
    const loginRef = useRef(null);
    const registerRef = useRef(null);

    async function handleLogout() {
        setToggleProfileOption(false);
        document.cookie = "PHPSESSID=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        setIsLoggedIn(false);
        setUserData(null);
        navigate("/");
    }

    return (
        <>
            <nav className="shadow-2xl text-md fixed top-0 left-0 flex flex-row justify-between w-full p-3 items-center border-b border-b-[#ffffff33] bg-[#0B1416] z-50 h-[10vh]">
                <div className="flex flex-row items-center gap-2">
                    <MdForum size={30}></MdForum>
                    <Link to="/">
                        <h1 className="font-bold text-2xl">RedditClone</h1>
                    </Link>
                </div>
                <SearchBar></SearchBar>

                <div className="flex flex-row gap-5 items-center">
                    {isLoggedIn == true ? (
                        <>
                            <button>
                                <svg
                                    fill="currentColor"
                                    height="20"
                                    icon-name="chat-outline"
                                    viewBox="0 0 20 20"
                                    width="20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M11.61 19.872a10.013 10.013 0 0 0 6.51-4.035A9.999 9.999 0 0 0 12.275.264c-1.28-.3-2.606-.345-3.903-.132a10.05 10.05 0 0 0-8.25 8.311 9.877 9.877 0 0 0 1.202 6.491l-1.24 4.078a.727.727 0 0 0 .178.721.72.72 0 0 0 .72.19l4.17-1.193A9.87 9.87 0 0 0 9.998 20c.54 0 1.079-.043 1.612-.128ZM1.558 18.458l1.118-3.69-.145-.24A8.647 8.647 0 0 1 1.36 8.634a8.778 8.778 0 0 1 7.21-7.27 8.765 8.765 0 0 1 8.916 3.995 8.748 8.748 0 0 1-2.849 12.09 8.763 8.763 0 0 1-3.22 1.188 8.68 8.68 0 0 1-5.862-1.118l-.232-.138-3.764 1.076ZM6.006 9a1.001 1.001 0 0 0-.708 1.707A1 1 0 1 0 6.006 9Zm4.002 0a1.001 1.001 0 0 0-.195 1.981 1 1 0 1 0 .195-1.98Zm4.003 0a1.001 1.001 0 1 0 0 2.003 1.001 1.001 0 0 0 0-2.003Z"></path>
                                </svg>
                            </button>

                            <Link to="/submit" className="flex flex-row gap-1 items-center">
                                <svg
                                    fill="currentColor"
                                    height="18"
                                    icon-name="add-outline"
                                    viewBox="0 0 20 20"
                                    width="18"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M19 9.375h-8.375V1h-1.25v8.375H1v1.25h8.375V19h1.25v-8.375H19v-1.25Z"></path>
                                </svg>

                                <h1>Create</h1>
                            </Link>


                            <button>
                                <svg
                                    fill="currentColor"
                                    height="20"
                                    icon-name="notification-outline"
                                    viewBox="0 0 20 20"
                                    width="20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M11 18h1a2 2 0 0 1-4 0h3Zm8-3.792v.673A1.12 1.12 0 0 1 17.883 16H2.117A1.12 1.12 0 0 1 1 14.881v-.673a3.947 3.947 0 0 1 1.738-3.277A2.706 2.706 0 0 0 3.926 8.7V7.087a6.07 6.07 0 0 1 12.138 0l.01 1.613a2.7 2.7 0 0 0 1.189 2.235A3.949 3.949 0 0 1 19 14.208Zm-1.25 0a2.7 2.7 0 0 0-1.188-2.242A3.956 3.956 0 0 1 14.824 8.7V7.088a4.819 4.819 0 1 0-9.638 0v1.615a3.956 3.956 0 0 1-1.738 3.266 2.7 2.7 0 0 0-1.198 2.239v.542h15.5v-.542Z"></path>
                                </svg>
                            </button>

                            <button onClick={() => setToggleProfileOption(!toggleProfileOptions)}>
                                <div className="w-[30px] h-[30px] rounded-full border border-white">
                                    <>
                                        {(userData.profile.profileimage != null) ? (
                                            <img src={userData.profile.profileimage} alt="" className="object-contain rounded-full" />
                                        ) : (
                                            <div className="w-full h-full bg-black rounded-full"></div>
                                        )}
                                        <div className="relative w-[8px] h-[8px] bg-green-400 rounded-full bottom-2 left-6"></div>
                                    </>
                                </div>

                            </button>

                            <div className={`flex flex-col absolute w-[200px] right-2 top-[66px] bg-[#0F1A1C] rounded-lg text-xs ${toggleProfileOptions ? 'opacity-100 block' : 'opacity-0 hidden'} duration-200`}>
                                <button className="flex flex-row gap-2 items-center py-2 px-3 hover:bg-[#131f23] rounded-lg">
                                    <div className="w-[35px] h-[35px] rounded-full border border-white">
                                        {(userData.profile.profileimage) ? (
                                            <img src={userData.profile.profileimage} alt="" className="object-contain rounded-full" />
                                        ) : (
                                            <div className="w-full h-full bg-black rounded-full"></div>
                                        )}
                                        <div className="relative w-[8px] h-[8px] bg-green-400 rounded-full bottom-2 left-6"></div>
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <p className="text-sm">View Profile</p>
                                        <p>u/{userData.profile.username}</p>
                                    </div>
                                </button>

                                <button onClick={handleLogout} className="flex flex-row gap-2 items-center py-2 px-3 hover:bg-[#131f23] rounded-lg">
                                    <svg rpl="" fill="currentColor" height="20" icon-name="logout-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.991 10.625H1v-1.25h10.991l-1.933-1.933.884-.884 3 3a.624.624 0 0 1 0 .884l-3 3-.884-.884 1.933-1.933ZM15.375 1h-9.75A2.629 2.629 0 0 0 3 3.625v.792h1.25v-.792A1.377 1.377 0 0 1 5.625 2.25h9.75a1.377 1.377 0 0 1 1.375 1.375v12.75a1.377 1.377 0 0 1-1.375 1.375h-9.75a1.377 1.377 0 0 1-1.375-1.375v-.792H3v.792A2.63 2.63 0 0 0 5.625 19h9.75A2.63 2.63 0 0 0 18 16.375V3.625A2.63 2.63 0 0 0 15.375 1Z"></path>
                                    </svg>
                                    <p>Logout</p>
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Button label={"Register"} onClick={() => openModal(registerRef)} className="text-white"></Button>
                            <Button label={"Login"} onClick={() => openModal(loginRef)} className="text-white"></Button>
                        </>
                    )}
                </div>
            </nav>

            <Login loginRef={loginRef}></Login>
            <Register registerRef={registerRef}></Register>
        </>
    );
};

export default Navbar;
