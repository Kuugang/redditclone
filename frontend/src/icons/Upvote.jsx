import React, { useEffect, useContext, useState } from "react";
import { BiUpvote } from "react-icons/bi";
import { BiSolidUpvote } from "react-icons/bi";
import { MyContext } from "../utils/Context";
export default function Upvote({ vote, setVote, post, handleVote, handleDeleteVote }) {
    const { userData } = useContext(MyContext);

    useEffect(() => {
        let postVote
        if (post.votes.length > 0) {
            postVote = (post.votes).find(v => v.userid == userData.id);
            if (postVote) {
                setVote(postVote.vote);
            }
        }
    }, []);

    return (
        <>
            <button className="flex flex-row gap-1 items-center">
                {vote == "upvote" && (
                    <BiSolidUpvote size={20} onClick={() => handleDeleteVote(post, setVote)} className="hover:text-red-600"></BiSolidUpvote>
                )}
                {(vote == "downvote" || vote == undefined) && (
                    <BiUpvote size={20} onClick={() => handleVote(post, "upvote", setVote)} className="hover:text-red-600"></BiUpvote>
                )}
            </button >

            <div className="flex flex-row items-center">
                <h1 className="text-xs font-semibold">
                    {post.upvote_count}
                </h1>
            </div>
        </>
    )
}