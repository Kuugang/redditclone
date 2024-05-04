import React, { useContext, useEffect, useRef, useState } from "react";
import CreateCommunity from "./CreateCommunity.jsx";
import { openModal } from "../utils/functions";
import { MyContext } from "../utils/Context.jsx";
import {FaHouse} from "react-icons/fa6";
import {AiTwotoneLike} from "react-icons/ai";
import {RiCommunityLine} from "react-icons/ri";

function LeftBar() {
    const { communities, setCommunities } = useContext(MyContext);
    const createCommunityRef = useRef(null);

    useEffect(() => {
        const getCommunities = async () => {
            let response = await fetch(
                "http://localhost:6969/api/community/read.php",
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            let JSONData = await response.json();

            setCommunities(JSONData.data.communities);
        }
        getCommunities();
    }, []);

    return (
        <div className="h-screen fixed border border-r-black p-5 left-0 bg-gray-100">
            <button className="flex flex-row items-center gap-3 justify-center">
                <FaHouse className="w-4 h-4"/>
                Home
            </button>
            <button className="flex flex-row items-center gap-3 justify-center">
                <AiTwotoneLike className="w-4 h-4"/>
                Popular
            </button>
            <hr className="border-black mt-2"/>

            <button className="flex flex-row items-center gap-3 justify-center mt-2" onClick={() => openModal(createCommunityRef)}>
                <RiCommunityLine className="w-4 h-4" />
                Create Community
            </button>
            <CreateCommunity
                createCommunityRef={createCommunityRef}
                communities={communities}
                setCommunities={setCommunities}

            ></CreateCommunity>
            <div className="flex flex-col gap-2 mt-4  items-start ml-4">
                {communities && (
                    communities.map(community => (
                        <div key={community.id}>
                            <p>r/{community.name}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default LeftBar;
