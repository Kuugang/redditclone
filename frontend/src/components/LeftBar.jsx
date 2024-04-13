import React, {useEffect, useRef, useState} from "react";
import CreateCommunity from "./CreateCommunity.jsx";
import {openModal} from "../utils/functions";

function LeftBar() {
    const [communities, setCommunities] = useState([]);
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
            let JSONData= await response.json();

            setCommunities(JSONData.data.communities);
        }
        getCommunities();
    }, []);

    return (
        <div className="h-screen fixed border border-black p-5 bg-white left-0">
            <h1>LeftBar</h1>
            <button onClick={()=> openModal(createCommunityRef)}>
                Create Community
            </button>
            <CreateCommunity
                createCommunityRef={createCommunityRef}
                communities = {communities}
                setCommunities = {setCommunities}

            ></CreateCommunity>
            <div className="flex flex-col gap-2 ">
            {communities.length > 0 && (

                communities.map(community => (
                    <div key = {community.id} >

                        <p>{community.name}</p>

                    </div>
                ))
            )}
            </div>
        </div>
    );
}

export default LeftBar;
