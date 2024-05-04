import React, { useContext, useEffect } from "react";
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
                                let votesDisplay = 0;
                                if (post.votes.length > 0) {
                                    votesDisplay = post.votes.filter(p => p.vote == "upvote").length - post.votes.filter(p => p.vote == "downvote").length
                                    votesDisplay = votesDisplay < 0 ? 0 : votesDisplay;
                                }


                                return (
                                    <div
                                        key={post.id}
                                        className="border border-black rounded p-5 w-[500px] bg-gray-50"
                                    >
                                        <div className="flex text-xs flex-row gap-2 items-center">
                                            <div className="rounded-full w-[30px] h-[30px] bg-gray-200 border border-black">
                                                <img src={post.community.communityimage} className="w-full h-full rounded-full object-cover" />
                                            </div>
                                            <div className="flex flex-row gap-2">
                                                <Link to={`/r/${post.community.name}`} className="font-bold cursor-pointer hover:text-blue-500">r/{post.community.name}</Link>
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
                                                <Votes post={post} votesDisplay={votesDisplay} />
                                                <Comment post={post}></Comment>
                                                <Share post={post}></Share>
                                            </div>
                                        )}

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