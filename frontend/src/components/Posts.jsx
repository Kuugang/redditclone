import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { timeAgo } from "../utils/helper";
import { MyContext } from "../utils/Context";
import Votes from "../components/Votes"
import Comment from "../icons/Comment";
import Share from "../icons/Share";

export default function Posts() {
    const { posts } = useContext(MyContext);

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
                                                    {post.community.communityimage ? (
                                                        <img src={post.community.communityimage} className="w-full h-full rounded-full object-cover" />
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0ZM8.016 8.633a1.616 1.616 0 0 0-.2.806V13.5H5.931V6.172h1.8v.9h.039a3.009 3.009 0 0 1 1.018-.732 3.45 3.45 0 0 1 1.449-.284c.246-.003.491.02.732.068.158.024.309.08.444.164l-.759 1.832a2.09 2.09 0 0 0-1.093-.26c-.33-.01-.658.062-.954.208a1.422 1.422 0 0 0-.591.565Zm2.9 6.918H9.355L14.7 2.633c.426.272.828.58 1.2.922l-4.984 11.996Z"></path></svg>
                                                    )}
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
                                            <div className="flex flex-row gap-3 text-xs">
                                                <Votes post={post} />
                                                <Comment post={post}></Comment>
                                                <Share post={post}></Share>
                                            </div>
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