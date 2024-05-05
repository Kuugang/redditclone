import React, { useContext, useEffect, useState } from 'react'
import Upvote from "../icons/Upvote";
import Downvote from "../icons/Downvote";
import { MyContext } from '../utils/Context';

function Votes({ post }) {
    const { userData, posts, setPosts } = useContext(MyContext)
    const [vote, setVote] = useState();
    const [votesDisplay, setVotesDisplay] = useState(0);

    async function handleDeleteVote(post, setVote) {
        try {
            let inputs = {
                "postId": post.id
            }

            if (vote == "upvote") {
                setVotesDisplay(votesDisplay - 1);
            }

            if (vote == "downvote") {
                setVotesDisplay(votesDisplay + 1);
            }

            setVote(undefined)
            await fetch(
                "http://localhost:6969/posts/votes",
                {
                    method: "DELETE",
                    body: JSON.stringify(inputs),
                    credentials: "include",
                }
            );

            const updatedPosts = posts.map(p => {
                if (p.id == post.id) {
                    const updatedVotes = p.votes.filter(vote => vote.userid != userData.id);
                    return { ...p, votes: updatedVotes };
                }
                return p;
            });

            setPosts(updatedPosts);
        } catch (e) {
        }
    }

    async function handleVote(post, userVote, setVote) {
        try {
            let inputs = {
                "postId": post.id,
                "vote": userVote
            }

            if (vote != undefined) {
                console.log("WTHST")
                if (vote == "upvote") {
                    setVotesDisplay(votesDisplay - 2);
                }

                if (vote == "downvote") {
                    setVotesDisplay(votesDisplay + 2);
                }
            } else {
                setVotesDisplay(userVote == "upvote" ? votesDisplay + 1 : votesDisplay - 1);
            }
            setVote(userVote)
            let response = await fetch(
                "http://localhost:6969/posts/votes",
                {
                    method: "POST",
                    body: JSON.stringify(inputs),
                    credentials: "include",
                }
            );
            let responseJSON = await response.json();
            let newVote = responseJSON.data.vote;

            let updatedPosts = posts.map(p => {
                if (p.id === post.id) {
                    let updatedVotes;
                    if (p.votes.find(v => v.userid == userData.id)) {
                        updatedVotes = p.votes.map(v => {
                            if (v.id === newVote.id) {
                                return { ...v, vote: userVote };
                            }
                            return v;
                        });
                    } else {
                        updatedVotes = [...p.votes, newVote];
                    }

                    return {
                        ...p,
                        votes: updatedVotes
                    };
                }
                return p;
            });
            setPosts(updatedPosts);
        } catch (e) {
        }
    }

    useEffect(() => {
        if (post.votes.length > 0) {
            setVotesDisplay(post.votes.filter(p => p.vote == "upvote").length - post.votes.filter(p => p.vote == "downvote").length)
        }
    }, [])

    return (
        <div className={`flex flex-row items-center gap-1 bg-[#1a282d] rounded-lg p-1 ${vote == "upvote" && 'bg-[#D93A00]'} ${vote == "downvote" && 'bg-[#6A5CFF]'} `}>
            <Upvote post={post} vote={vote} setVote={setVote} handleVote={handleVote} handleDeleteVote={handleDeleteVote}></Upvote>
            <p className="font-semibold">{votesDisplay}</p>
            <Downvote post={post} vote={vote} setVote={setVote} handleVote={handleVote} handleDeleteVote={handleDeleteVote}></Downvote>
        </div>
    )
}

export default Votes