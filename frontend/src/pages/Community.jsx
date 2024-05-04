import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { timeAgo } from '../utils/helper';
import { MyContext } from '../utils/Context';
import LeftBar from '../components/LeftBar';
import Comment from '../icons/Comment';
import Share from '../icons/Share';
import Votes from '../components/Votes';

function Community() {
    const { userData, communities, setCommunities, posts } = useContext(MyContext);
    const [community, setCommunity] = useState();

    const { name } = useParams();

    useEffect(() => {
        async function getCommunity() {
            let response = await fetch(
                `http://localhost:6969/communities?name=${name}`,
                {
                    method: "GET",
                }
            );
            let responseJSON = await response.json();
            setCommunities([...communities, responseJSON.data.communities]);
            setCommunity(responseJSON.data.communities);
        }

        if (communities.length > 0) {
            let community = communities.find(c => c.name == name);
            if (community) {
                setCommunity(community);
            } else {
                getCommunity();
            }
        } else {
            getCommunity();
        }
    }, [])

    return (
        <>
            <LeftBar />

            {community && (
                <div className='ml-[16%] flex flex-col justify-center p-10 relative'>
                    <div className='w-full flex justify-center h-[200px] rounded-lg border '>
                        <img src={community.communitybanner} alt="Community Banner" className='object-fill rounded-lg' />
                    </div>
                    <div className='flex flex-row justify-between w-full relative bottom-6'>
                        <div className='flex flex-row gap-2  items-end'>
                            <div className='rounded-full w-[70px] h-[70px] border boder-black '>
                                <img src={community.communityimage} className="w-full h-full rounded-full object-contain" />
                            </div>
                            <p className='font-bold text-2xl'>r/{community.name}</p>
                        </div>

                        <div className='flex flex-row items-end gap-2'>
                            <button className='flex flex-row gap-2 rounded-lg border border-black px-2 py-1 items-center'>
                                <svg rpl="" fill="currentColor" height="20" icon-name="add-outline" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 9.375h-8.375V1h-1.25v8.375H1v1.25h8.375V19h1.25v-8.375H19v-1.25Z"></path>
                                </svg>
                                <p>Create a Post</p>
                            </button>
                            <button className='px-2 py-1 border border-black rounded-lg'>Join</button>
                        </div>
                    </div>

                    <div className='flex flex-row gap-2'>
                        <div className='w-[80%]'>
                            {posts && posts.length > 0 && (
                                posts
                                    .filter(p => p.community.id == community.id)
                                    .map(post => {
                                        let votesDisplay = 0;
                                        if (post.votes.length > 0) {
                                            votesDisplay = post.votes.filter(p => p.vote == "upvote").length - post.votes.filter(p => p.vote == "downvote").length
                                            votesDisplay = votesDisplay < 0 ? 0 : votesDisplay;
                                        }

                                        return (
                                            <>
                                                <div key={post.id} className='p-3 rounded-lg hover:bg-gray-200 cursor-pointer'>
                                                    <div className="flex text-xs flex-row gap-2 items-center">
                                                        <div className="flex flex-row gap-2">
                                                            <p>u/{post.author.username}</p>
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
                                                <div className='border-b border-black'></div>
                                            </>
                                        )
                                    }
                                    )
                            )}
                        </div>
                        <div className='sticky top-[66px] rounded-lg p-3 border border-black h-20 w-[20%] text-sm'>
                            <p className='text-md font-semibold'>{community.name} on RedditClone</p>
                            <p>{community.about}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Community