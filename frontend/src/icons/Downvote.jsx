import React, { useEffect, useContext, useState } from "react";
import { BiDownvote } from "react-icons/bi";
import { BiSolidDownvote } from "react-icons/bi";
import { MyContext } from "../utils/Context";

export default function Downvote({ vote, setVote, post, handleVote, handleDeleteVote }) {
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
                {vote == "downvote" && (
                    <BiSolidDownvote size={20} onClick={() => handleDeleteVote(post, setVote)} className="hover:text-blue-600"></BiSolidDownvote>
                )}
                {(vote == "upvote" || vote == undefined) && (
                    <BiDownvote size={20} onClick={() => handleVote(post, "downvote", setVote)} className="hover:text-blue-600"></BiDownvote>
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