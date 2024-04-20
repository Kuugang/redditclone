import React, { useEffect, useContext, useState } from "react";
import { toast } from "react-toastify"
import { BiUpvote } from "react-icons/bi";
import { BiSolidUpvote } from "react-icons/bi";
import { MyContext } from "../utils/Context";
export default function Upvote({ post }) {

    const { userData, isLoading, setIsLoading } = useContext(MyContext);
    const [vote, setVote] = useState();

    async function handleDelete(e) {
        e.preventDefault();
        try {
            setIsLoading(true)
            let inputs = new FormData();

            inputs.append("postId", post.id);
            let response = await fetch(
                "http://localhost:6969/api/post/deleteVote.php",
                {
                    method: "POST",
                    body: inputs,
                    credentials: "include",
                }
            );
            let JSONData = await response.json();
            if (response.status !== 200) {
                throw new Error(JSONData.message);
            }


            toast.success("Successfully upvote")
            setVote(true)
        } catch (e) {
            toast.error(e.message);
        }
    }

    async function handleUpVote(e) {
        e.preventDefault();
        try {
            let inputs = new FormData();
            console.log(post.id)
            inputs.append("postId", post.id);
            inputs.append("vote", "upvote");

            let response = await fetch(
                "http://localhost:6969/api/post/vote.php",
                {
                    method: "POST",
                    body: inputs,
                    credentials: "include",
                }
            );


            toast.success("Successfully upvote")
            setVote(true)
        } catch (e) {
            toast.error(e.message);
        }
    }

    useEffect(() => {

        if (post) {
            let postVote
            if (post.votes.length > 0) {
                postVote = (post.votes).find(v => v.userid == userData.id);
                setVote(postVote.vote)
            }
        }
    }, [post]);

    return (
        <>

            <button className="flex flex-row gap-1 items-center">
                {vote == "upvote" && (
                    <BiSolidUpvote size = {20} onClick={handleDelete}></BiSolidUpvote>
                )}
                {(vote == "downvote" || vote == undefined) && (
                    <BiUpvote size={20} onClick={handleUpVote}></BiUpvote>
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