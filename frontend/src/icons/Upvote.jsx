import React, { useEffect, useContext, useState } from "react";
import { BiUpvote } from "react-icons/bi";
import { BiSolidUpvote } from "react-icons/bi";
import { MyContext } from "../utils/Context";
export default function Upvote({ vote, setVote, post, handleVote, handleDeleteVote }) {
    const { userData } = useContext(MyContext);

    useEffect(() => {
        if (userData == null) return;
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
            <button>
                {vote == "upvote" && (
                    <BiSolidUpvote size={20} onClick={() => handleDeleteVote(post, setVote)}></BiSolidUpvote>
                )}
                {(vote == "downvote" || vote == undefined) && (
                    <BiUpvote size={20} onClick={() => handleVote(post, "upvote", setVote)} className="hover:text-red-600"></BiUpvote>
                )}
            </button >
        </>
    )
}