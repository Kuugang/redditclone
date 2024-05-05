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

            let c = communities.find(c => c.id == responseJSON.data.communities[0].id);

            if (c == undefined) {
                if (communities.length < 0) {
                    console.log("WHAT");
                    setCommunities(prev => [...prev, responseJSON.data.communities[0]]);
                }
            }
            setCommunity(responseJSON.data.communities[0]);
        }

        if (communities.length > 0) {
            let community = communities.find(c => c.name == name);
            if (community) {
                setCommunity(community);
            } else {
                console.log("WTF");
                getCommunity();
            }
        } else {
            getCommunity();
        }
    }, [])

    // useEffect(() => {
    //     async function getCommunity() {
    //         let response = await fetch(
    //             `http://localhost:6969/communities?name=${name}`,
    //             {
    //                 method: "GET",
    //             }
    //         );
    //         let responseJSON = await response.json();
    //         setCommunities(prev => [...prev, ...responseJSON.data.communities]);
    //         setCommunity(responseJSON.data.communities);
    //     }

    //     if (communities.length > 0) {
    //         let community = communities.find(c => c.name == name);
    //         if (community) {
    //             setCommunity(community);
    //         } else {
    //             getCommunity();
    //         }
    //     } else {
    //         getCommunity();
    //     }
    // }, [name])

    return (
        <>
            <LeftBar />

            <div className='ml-[16%] flex flex-col gap-5 justify-center p-10 min-h-screen'>
                {community && (
                    <>
                        <div className='w-full flex justify-center h-[200px] rounded-lg '>
                            <img src={community.communitybanner} alt="Community Banner" className='object-fill rounded-lg' />
                        </div>
                        <div className='flex flex-row justify-between w-full bottom-6'>
                            <div className='flex flex-row gap-2  items-end'>
                                <div className='rounded-full w-[70px] h-[70px]'>
                                    <img src={community.communityimage} className="w-full h-full rounded-full object-contain" />
                                </div>
                                <p className='font-bold text-2xl'>r/{community.name}</p>
                            </div>

                            <div className='flex flex-row items-center gap-2'>
                                <button className='flex flex-row gap-2 rounded-lg border border-white px-2 py-1 items-center'>
                                    <svg rpl="" fill="currentColor" height="20" icon-name="add-outline" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19 9.375h-8.375V1h-1.25v8.375H1v1.25h8.375V19h1.25v-8.375H19v-1.25Z"></path>
                                    </svg>
                                    <p>Create a Post</p>
                                </button>

                                {userData && (
                                    community.ownerid === userData.id ? (
                                        <>
                                            <div className="border border-white rounded-full p-2 cursor-pointer">
                                                <svg rpl="" fill="currentColor" height="20" icon-name="notification-fill" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M11 18h1a2 2 0 0 1-4 0h3Zm6.263-7.07a2.699 2.699 0 0 1-1.189-2.23l-.005-1.61a6.069 6.069 0 1 0-12.138 0v1.613a2.7 2.7 0 0 1-1.193 2.227A3.949 3.949 0 0 0 1 14.208v.672A1.119 1.119 0 0 0 2.117 16h15.766A1.119 1.119 0 0 0 19 14.88v-.672a3.952 3.952 0 0 0-1.737-3.278Z"></path></svg>
                                            </div>
                                            <div className="border border-white rounded-full p-2 cursor-pointer">
                                                <svg rpl="" fill="currentColor" height="20" icon-name="overflow-horizontal-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 10a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM10 8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm6 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"></path></svg>
                                            </div>
                                        </>
                                    ) : (
                                        <button className='px-2 py-1 border border-black rounded-lg'>Join</button>
                                    )
                                )}
                            </div>
                        </div>

                        <div className="border-b-[1px] border-[#ffffff33]"></div>

                        <div className='flex flex-row gap-2'>
                            <div className='w-[80%] flex flex-col gap-5'>
                                {posts && posts.map((post) => {
                                    return (
                                        <div key={post.id}>
                                            <div
                                                className="rounded px-5 py-1 mb-1 rounded-lg hover:bg-[rgb(19,31,35)] cursor-pointer"
                                            >
                                                <div className="flex text-xs flex-row gap-2 items-center">
                                                    <div className="flex text-xs flex-row gap-2 items-end">
                                                        <div className='w-[20px] h-[20px] border border-white rounded-full'>

                                                        </div>
                                                        <p>u/{post.author.username}</p>
                                                        <p>•</p>
                                                        <p>{timeAgo(post.createdat)}</p>
                                                    </div>
                                                </div>
                                                <div className="text-left py-2">
                                                    <h1 className="text-md font-bold">{post.title}</h1>
                                                    <p className="text-sm text-[#b8c5c9]">{post.content}</p>
                                                </div>

                                                {userData != null && (
                                                    <div className="flex flex-row gap-3 text-xs">
                                                        <Votes post={post} />
                                                        <Comment post={post}></Comment>
                                                        <Share post={post}></Share>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="border-b-[1px] border-[#ffffff33]"></div>
                                        </div>
                                    )
                                }
                                )}

                            </div>
                            <div className='sticky bg-[#04090a] top-[70px] rounded-lg p-3 border border-black h-20 w-[20%] text-sm'>
                                <p className='text-md font-semibold'>{community.name} on RedditClone</p>
                                <p>{community.about}</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default Community