import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

import { MyContext } from "../utils/Context";

const Submit = () => {
    const navigate = useNavigate();
    const { setPosts } = useContext(MyContext);
    const [isLoading, setIsLoading] = useState(false);
    const { communities, setCommunities } = useContext(MyContext);
    const [selectedCommunityImage, setSelectedCommunityImage] = useState();

    async function handleCreatePost(e) {
        e.preventDefault();
        try {
            setIsLoading(true);
            let inputs = {
                "title": e.target.title.value,
                "content": e.target.content.value,
                "communityId": e.target.community.value,
            }

            let response = await fetch("http://localhost:6969/posts", {
                method: "POST",
                body: JSON.stringify(inputs),
                credentials: "include",
            });

            if (response.status === 200) {
                let responseJSON = await response.json();
                setPosts((posts) => [responseJSON.data.post, ...posts]);
                setIsLoading(false);
                toast("Post created successfully");
                navigate("/");
            }
            setIsLoading(false);
        } catch (e) {
            setIsLoading(false);
            toast.error(e.message);
        }
    }


    function handleOnSelectCommunity(selectElement) {
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        setSelectedCommunityImage(selectedOption.dataset.communityimage)
    }

    useEffect(() => {
        const getCommunities = async () => {
            let response = await fetch(
                "http://localhost:6969/communities/public",
                {
                    method: "GET",
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
        }
        getCommunities();
    }, []);


    return (
        <>
            {isLoading && <Spinner />}
            <div className="h-[90vh] flex flex-row justify-center gap-10 p-10 bg-[#030303] text-[#D7DADC]">
                <form
                    onSubmit={(e) => handleCreatePost(e)}
                    className="w-[40%] border rounded border-black flex flex-col justify-center gap-3  h-max p-5"
                >
                    <div className="flex flex-col gap-3 bg-[#030303]">
                        <p className="text-lg font-semibold">Create a post</p>
                        <div className="w-full h-[1px] border-b border-b-[#ffffff33] "></div>

                        <div className="w-[50%] bg-[#1A1A1B] flex flex-row items-center gap-2 px-3 py-2 rounded-lg">
                            {selectedCommunityImage != null ? (
                                <img src={selectedCommunityImage} className="w-[40px] h-[40px] rounded-full object-cover" />
                            ) : (
                                <div className="w-[40px] h-[40px] rounded-full object-contain flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0ZM8.016 8.633a1.616 1.616 0 0 0-.2.806V13.5H5.931V6.172h1.8v.9h.039a3.009 3.009 0 0 1 1.018-.732 3.45 3.45 0 0 1 1.449-.284c.246-.003.491.02.732.068.158.024.309.08.444.164l-.759 1.832a2.09 2.09 0 0 0-1.093-.26c-.33-.01-.658.062-.954.208a1.422 1.422 0 0 0-.591.565Zm2.9 6.918H9.355L14.7 2.633c.426.272.828.58 1.2.922l-4.984 11.996Z"></path></svg>
                                </div>
                            )}
                            <select name="community" className="bg-[#1A1A1B] w-full" onChange={(e) => handleOnSelectCommunity(e.target)}>
                                <option key={1}>Choose a community</option>
                                {communities && communities.length > 0 && (
                                    communities.map(community => (
                                        <option key={community.id} value={community.id} data-communityimage={community.communityimage}>r/{community.name}</option>
                                    ))
                                )}
                            </select>
                        </div>
                    </div>

                    <div className="bg-[#1a1a1b] flex flex-col justify-center gap-3 p-5 rounded-lg">
                        <input
                            name="title"
                            type="text"
                            placeholder="Title"
                            className="border border-[#ffffff33] rounded-sm px-3 py-1 bg-[#1A1A1B] p-1"
                        />

                        <textarea
                            name="content"
                            cols={20}
                            rows={10}
                            placeholder="Text"
                            className="border border-[#ffffff33] rounded-sm px-3 py-1 bg-[#1A1A1B] p-1"
                        />

                        <div className="flex flex-row gap-3 justify-end">
                            <button
                                type="button"
                                className="border border-black rounded px-3 py-2 border border-[#D7DADC] bg-[#1A1A1B] font-semibold rounded-lg"
                            >
                                Save as draft
                            </button>
                            <button
                                type="submit"
                                className="border border-black rounded px-3 py-2 bg-[#D7DADC] text-[#1A1A1B] rounded-lg font-semibold"
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </form>

                <div className="flex flex-col gap-3 bg-[#1a1a1b] p-5 rounded-lg h-max text-[#D7DADC]">

                    <div className="text-sm">
                        <div className="text-base font-semibold border-b border-b-[#ffffff33] p-2">
                            <p>Posting to RedditClone</p>
                        </div>

                        <div className="border-b border-b-[#ffffff33] p-2">
                            <p>1. Remember the human.</p>
                        </div>

                        <div className="border-b border-b-[#ffffff33] p-2">
                            <p>2. Behave like you would in real life.</p>
                        </div>

                        <div className="border-b border-b-[#ffffff33] p-2">
                            <p>3. Look for the original source of content</p>
                        </div>

                        <div className="border-b border-b-[#ffffff33] p-2">
                            <p>4. Search for duplicates before posting</p>
                        </div>

                        <div className="border-b border-b-[#ffffff33] p-2">
                            <p>5. Read the community’s rules</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Submit;
