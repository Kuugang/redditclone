import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { timeAgo } from "../utils/helper";
import { MyContext } from "../utils/Context";
import Votes from "../components/Votes"
import Comment from "../icons/Comment";
import Share from "../icons/Share";

export default function Posts() {
    const { posts, userData } = useContext(MyContext);

    return (
        <>
            <div className="flex flex-row gap-5 justify-center items-center">
                {posts && posts.length > 0 ? (
                    <div className="flex flex-col w-[100vw] items-center m-6">
                        <div className="flex flex-col gap-5">
                            {posts.map((post) => {
                                return (
                                    <div key={post.id}>
                                        <div
                                            className="rounded px-5 py-1 mb-1 w-[500px] rounded-lg hover:bg-[rgb(19,31,35)] cursor-pointer"
                                        >
                                            <div className="flex text-xs flex-row gap-2 items-center">
                                                <div className="rounded-full w-[30px] h-[30px] border border-black">
                                                    <img src={post.community.communityimage} className="w-full h-full rounded-full object-cover" />
                                                </div>
                                                <div className="flex flex-row gap-2">
                                                    <Link to={`/r/${post.community.name}`} className="font-bold cursor-pointer hover:text-blue-500">r/{post.community.name}</Link>
                                                </div>
                                                <p className="">{timeAgo(post.createdat)}</p>
                                            </div>
                                            <div className="text-left py-2">
                                                <h1 className="text-md font-bold">{post.title}</h1>
                                                <p className="text-sm text-[#b8c5c9]">{post.content}</p>
                                            </div>

                                            {userData != null && (
                                                <div className="flex flex-row gap-3 text-xs">
                                                    <Votes post={post} />
                                                    <Comment post={post}></Comment>
                                                    <Share post={post}></Share>
                                                </div>
                                            )}
                                        </div>
                                        <div className="border-b-[1px] border-[#ffffff33]"></div>
                                    </div>
                                )
                            }
                            )}
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