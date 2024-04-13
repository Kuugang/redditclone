import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

import { MyContext } from "../utils/Context";

const Submit = () => {
    const navigate = useNavigate();
    const { posts, setPosts } = useContext(MyContext);
    const [isLoading, setIsLoading] = useState(false);
    const { communities } = useContext(MyContext);

    async function handleCreatePost(e) {
        e.preventDefault();
        try {
            setIsLoading(true);
            let inputs = new FormData();
            inputs.append("title", e.target.title.value);
            inputs.append("content", e.target.content.value);
            inputs.append("communityId", e.target.community.value);

            let response = await fetch("http://localhost:6969/api/post/create.php", {
                method: "POST",
                body: inputs,
                credentials: "include",
            });

            if (response.status === 200) {
                let data = await response.json();
                if (posts.length > 0)
                    setPosts((posts) => [data.newPost, ...posts]);
                else
                    setPosts([data.newPost]);

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

    return (
        <>
            {isLoading && <Spinner />}
            <div className="w-[100vw] flex flex-col items-center">
                <form
                    onSubmit={(e) => handleCreatePost(e)}
                    className="w-80 border rounded border-black flex flex-col justify-center p-5 gap-3"
                >
                    <input
                        name="title"
                        type="text"
                        placeholder="Title"
                        className="border border-black p-1"
                    />

                    <div className="w-full">
                        <label>Choose a community: </label>
                        {communities.length > 0 ? (
                            <select name="community" className="w-full">
                                {communities.map(community => (
                                    <option key={community.id} value={community.id}>{community.name}</option>
                                ))}
                            </select>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>

                    <textarea
                        name="content"
                        cols={30}
                        rows={10}
                        placeholder="Text"
                        className="border border-black p-1"
                    />

                    <div className="flex flex-row gap-3">
                        <button
                            type="button"
                            className="border border-black rounded px-3 py-2"
                        >
                            Save as draft
                        </button>
                        <button
                            type="submit"
                            className="border border-black rounded px-3 py-2"
                        >
                            Post
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Submit;
