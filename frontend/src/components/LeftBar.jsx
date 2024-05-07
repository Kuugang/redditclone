import React, { useContext, useEffect, useRef, useState } from "react";
import CreateCommunity from "./CreateCommunity.jsx";
import { Link } from "react-router-dom";
import { openModal } from "../utils/functions";
import { MyContext } from "../utils/Context.jsx";
import { FaHouse } from "react-icons/fa6";
import { AiTwotoneLike } from "react-icons/ai";

function LeftBar() {
    const { userData, communities, setCommunities, userCommunities, setUserCommunities } = useContext(MyContext);
    const createCommunityRef = useRef(null);

    const [showCommunities, setShowCommunities] = useState(true);

    const toggleCommunities = () => {
        setShowCommunities(!showCommunities);
    };
    useEffect(() => {
        const getCommunities = async () => {
            let response = await fetch(
                "http://localhost:6969/users/communities",
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            let responseJSON = await response.json();
            let cs = [...communities, ...responseJSON.data.communities];
            const uniqueCommunitiesByID = {};
            cs.forEach(community => {
                if (!uniqueCommunitiesByID[community.id]) {
                    uniqueCommunitiesByID[community.id] = community;
                }
            });
            const uniqueCommunities = Object.values(uniqueCommunitiesByID);
            setCommunities(uniqueCommunities);
            setUserCommunities(responseJSON.data.communities);
        }
        if (userData)
            getCommunities();
    }, []);

    return (
        <div className="flex flex-col gap-2 w-[15vw] h-screen overflow-auto fixed border-r border-[#ffffff33] p-4 left-0 text-sm">
            <div>
                <Link to="/" className="flex flex-row gap-3 justify-start items-center px-3 py-2 rounded-lg w-full hover:bg-[#1a282d]">
                    <FaHouse className="w-4 h-4" />
                    <p>Home</p>
                </Link >

                <button className="flex flex-row gap-3 justify-start items-center px-3 py-2 rounded-lg w-full hover:bg-[#1a282d]">
                    <AiTwotoneLike className="w-4 h-4" />
                    <p>Popular</p>
                </button>
            </div>

            <hr className="border-r border-[#ffffff33]" />


            <div>
                <button className="flex flex-row justify-between items-center px-3 py-2 rounded-lg w-full hover:bg-[#1a282d]" onClick={toggleCommunities}>
                    <p>Communities</p>
                    <svg
                        rpl=""
                        fill="currentColor"
                        height="20"
                        icon-name="caret-down-outline"
                        viewBox="0 0 20 20"
                        width="20"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`${showCommunities ? 'rotate-180' : 'rotate-0'} transition-all`}
                    >
                        <path d="M10 13.125a.624.624 0 0 1-.442-.183l-5-5 .884-.884L10 11.616l4.558-4.558.884.884-5 5a.624.624 0 0 1-.442.183Z"></path>
                    </svg>
                </button>

                <div className={`overflow-hidden transition-all duration-200 ${showCommunities ? 'opacity-100 max-h-content' : 'h-0 opacity-0'} flex flex-col gap-2`}>
                    <button className="flex flex-row gap-3 justify-start items-center px-3 py-2 rounded-lg w-full hover:bg-[#1a282d]" onClick={() => openModal(createCommunityRef)}>
                        <svg rpl="" fill="currentColor" height="20" icon-name="add-outline" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 9.375h-8.375V1h-1.25v8.375H1v1.25h8.375V19h1.25v-8.375H19v-1.25Z"></path>
                        </svg>
                        <p>
                            Create Community
                        </p>
                    </button>

                    {/* Dialog */}
                    <CreateCommunity
                        createCommunityRef={createCommunityRef}
                        communities={communities}
                        setCommunities={setCommunities}
                    ></CreateCommunity>

                    {userCommunities && (
                        userCommunities.map(community => (
                            <Link to={`/r/${community.name}`} key={community.id} className="flex flex-row gap-2 justify-start items-center px-3 py-1 rounded-lg w-full hover:bg-[#1a282d]">
                                <div className="rounded-full w-[30px] h-[30px] bg-gray-200 border border-black">
                                    {community.communityimage && (
                                        <img src={community.communityimage} className="w-full h-full rounded-full object-cover" alt={`Community ${community.name}`} />
                                    )}
                                </div>
                                <p>r/{community.name}</p>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default LeftBar;
