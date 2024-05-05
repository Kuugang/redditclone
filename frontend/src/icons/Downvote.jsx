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
            <button>
                {vote == "downvote" && (
                    <BiSolidDownvote size={20} onClick={() => handleDeleteVote(post, setVote)}></BiSolidDownvote>
                )}
                {(vote == "upvote" || vote == undefined) && (
                    <BiDownvote size={20} onClick={() => handleVote(post, "downvote", setVote)} className="hover:text-blue-600"></BiDownvote>
                )}
            </button >
        </>
    )
}