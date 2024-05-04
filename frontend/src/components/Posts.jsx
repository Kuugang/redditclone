import React, { useContext } from "react";
import Upvote from "../icons/Upvote";
import Downvote from "../icons/Downvote";
import Comment from "../icons/Comment";
import Share from "../icons/Share";
import { MyContext } from "../utils/Context";

    
export default function Posts({ posts, communityID, userID, timeAgo }) {
    const { userData } = useContext(MyContext);



    return (
        <>
            <div className="flex flex-row gap-5 justify-center items-center">
                {posts && posts.length > 0 ? (
                    <div className="flex flex-col w-[100v] items-center m-6">
                        <div className="flex flex-col gap-5">
                            {posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="border border-black rounded p-5 w-[500px] bg-gray-50"
                                >
                                    {/* {userData.id == post.author && (
                                        <h1>What</h1>
                                    )} */}

                                    <div className="flex text-xs flex-row gap-2 items-center">
                                        <div className="rounded rounded-full w-[25px] h-[25px] bg-gray-200"></div>
                                        <div className="flex flex-row gap-2">
                                            <p className="font-bold">r/{post.community.name}</p>
                                            <p>Posted by u/{post.author.username}</p>
                                        </div>
                                        <p className="">{timeAgo(post.createdat)}</p>
                                    </div>
                                    <div className="text-left">
                                        <h1 className="text-md font-bold">{post.title}</h1>
                                        <p className="text-sm">{post.content}</p>
                                    </div>
                                    {userData != null && (
                                        <div className="flex flex-row gap-3 text-xs">
                                            <div className="flex flex-row gap-1 bg-zinc-200 p-1 rounded">

                                                <Upvote post={post}></Upvote>
                                                <p>0</p>
                                                <Downvote post={post}></Downvote>
                                            </div>
                                            <Comment post={post}></Comment>
                                            <Share post={post}></Share>

                                        </div>
                                    )}

                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        <h1>Getting Posts</h1>
                    </>
                )}
            </div>

        </>


    )


}