import React, { useContext, useState } from 'react'
import Upvote from "../icons/Upvote";
import Downvote from "../icons/Downvote";
import { MyContext } from '../utils/Context';

function Votes({ post, votesDisplay }) {
    const { userData, posts, setPosts } = useContext(MyContext)
    const [vote, setVote] = useState();
    async function handleDeleteVote(post, setVote) {
        try {
            let inputs = {
                "postId": post.id
            }

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
            setVote(undefined)
        } catch (e) {
        }
    }

    async function handleVote(post, vote, setVote) {
        try {
            let inputs = {
                "postId": post.id,
                "vote": vote
            }

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
                                return { ...v, vote: vote };
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
            setVote(vote)
        } catch (e) {
        }
    }

    return (
        <div className="flex flex-row gap-1 bg-zinc-300 p-1 rounded items-center rounded-lg">
            <Upvote post={post} vote={vote} setVote={setVote} handleVote={handleVote} handleDeleteVote={handleDeleteVote}></Upvote>
            <p className="font-semibold">{votesDisplay}</p>
            <Downvote post={post} vote={vote} setVote={setVote} handleVote={handleVote} handleDeleteVote={handleDeleteVote}></Downvote>
        </div>
    )
}

export default Votes