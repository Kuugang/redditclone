import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { timeAgo } from '../utils/helper';
import { MyContext } from '../utils/Context';
import LeftBar from '../components/LeftBar';
import Comment from '../icons/Comment';
import Share from '../icons/Share';
import Votes from '../components/Votes';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';

function Community() {
    const { isLoading, setIsLoading, userData, communities, setCommunities, posts } = useContext(MyContext);
    const [community, setCommunity] = useState();
    const [isEditing, setIsEditing] = useState(false);
    const [currentEdit, setCurrentEdit] = useState(null);
    const [communityName, setCommunityName] = useState(null);
    const [communityVisibility, setCommunityVisibility] = useState(null);
    const [communityAbout, setCommunityAbout] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [banner, setBanner] = useState(null);
    const [hideEditAppearance, setHideEditAppearance] = useState(false);

    const { name } = useParams();


    async function handleUpdateCommunity() {
        try {
            setIsLoading(true);
            const formdata = new FormData();

            formdata.set("communityId", community.id);
            if (communityName != null) formdata.set("name", communityName);
            if (communityVisibility != null) formdata.set("visibility", communityVisibility);
            if (communityAbout != null) formdata.set("about", communityAbout);
            if (avatar != null) formdata.set("communityImage", avatar);
            if (banner != null) formdata.set("communityBanner", banner);

            let response = await fetch("http://localhost:6969/communities/update",
                {
                    method: "POST",
                    body: formdata,
                    credentials: 'include'
                }
            )
            let responseJSON = await response.json();
            setCommunity(responseJSON.data.community);
            let communitiesUpdate = communities.map(c => {
                if (c.id == community.id) {
                    return {
                        ...responseJSON.data.community
                    }
                }
                return c
            })
            setCommunities(communitiesUpdate);

            setIsEditing(false);
            setCurrentEdit(null);
            setBanner(null);
            setAvatar(null);
            toast(responseJSON.message);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    function handleFileInput(e) {
        if (currentEdit == "banner") {
            setBanner(e.target.files[0]);
            console.log(banner);
        } else {
            setAvatar(e.target.files[0]);
            console.log(avatar);
        }
    }

    useEffect(() => {
        setCommunity(null);
        setIsEditing(false);
        setCurrentEdit(null);
        setBanner(null);
        setAvatar(null);
        setHideEditAppearance(false);
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
    }, [name])


    const handleDragEnter = (e) => {
        e.preventDefault();
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();

        const droppedFile = e.dataTransfer.files[0];
        if (currentEdit == "banner") {
            setBanner(droppedFile)
        } else {
            setAvatar(droppedFile)
        }
    };

    return (
        <>
            {isLoading && <Spinner />}
            <LeftBar />
            <div className='ml-[16%] flex flex-col gap-5 p-10 min-h-screen'>
                {community && (
                    <>
                        <div className={`fixed w-[350px] flex flex-col gap-4 left-[3%] bg-[#0f1a1c] p-5 rounded-lg duration-500 ${isEditing ? 'bottom-[3%]' : ' bottom-[-40%]'} transform ${hideEditAppearance ? 'bottom-[-30%]' : 'bottom-[3%]'}`}>
                            <div className="flex flex-row justify-between gap-4 items-center">
                                {currentEdit == null && (
                                    <p className="font-semibold">Community Appearance</p>
                                )}

                                <div className='flex flex-row gap-2 items-center'>
                                    {currentEdit != null && (
                                        <button onClick={() => setCurrentEdit(null)} className="bg-[#1A282D] rounded-full w-[40px] h-[40px] py-2 px-2 flex justify-center items-center hover:bg-[#223237]">
                                            <svg rpl="" fill="currentColor" height="16" icon-name="left-outline" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg"><path d="m13.058 19.442-9-9a.624.624 0 0 1 0-.884l9-9 .884.884L5.384 10l8.558 8.558-.884.884Z"></path></svg>
                                        </button>
                                    )}

                                    {currentEdit == "banner" && (
                                        <p className="font-semibold">Banner</p>
                                    )}

                                    {currentEdit == "avatar" && (
                                        <p className="font-semibold">Avatar</p>
                                    )}
                                </div>

                                <div className="flex flex-row gap-2">
                                    <button onClick={() => setHideEditAppearance(!hideEditAppearance)} className="bg-[#1A282D] rounded-full w-[40px] h-[40px] py-2 px-2 flex justify-center items-center hover:bg-[#223237]">
                                        <svg
                                            rpl=""
                                            fill="currentColor"
                                            height="20"
                                            icon-name="caret-down-outline"
                                            viewBox="0 0 20 20"
                                            width="20"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`transition-all ${hideEditAppearance ? 'rotate-180' : 'rotate-0'}`}
                                        >
                                            <path d="M10 13.125a.624.624 0 0 1-.442-.183l-5-5 .884-.884L10 11.616l4.558-4.558.884.884-5 5a.624.624 0 0 1-.442.183Z"></path>
                                        </svg>
                                    </button>

                                    <button onClick={() => { setIsEditing(false); setCurrentEdit(null) }} className="bg-[#1A282D] rounded-full w-[40px] h-[40px] py-2 px-2 flex justify-center items-center hover:bg-[#223237]">
                                        <svg rpl="" fill="currentColor" height="16" icon-name="close-outline" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg"><path d="m18.442 2.442-.884-.884L10 9.116 2.442 1.558l-.884.884L9.116 10l-7.558 7.558.884.884L10 10.884l7.558 7.558.884-.884L10.884 10l7.558-7.558Z"></path></svg>
                                    </button>
                                </div>
                            </div>

                            <div className="w-full h-[1px] bg-[#ffffff33]"></div>
                            {currentEdit == null && (
                                <>
                                    <div onClick={() => setCurrentEdit("avatar")} className="flex justify-between items-center p-3  hover:bg-[#1A282D] cursor-pointer">
                                        <p>Avatar</p>
                                        <div className='flex flex-row gap-2 items-center'>
                                            {avatar && (
                                                <p className='text-[8px] text-[#0B1416] p-1 rounded-lg bg-[#B8C5C9]'>Edited</p>
                                            )}
                                            <svg rpl="" fill="currentColor" height="20" icon-name="caret-right-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m7.942 15.442-.884-.884L11.616 10 7.058 5.442l.884-.884 5 5a.624.624 0 0 1 0 .884l-5 5Z"></path></svg>
                                        </div>
                                    </div>

                                    <div onClick={() => setCurrentEdit("banner")} className="flex justify-between items-center p-3  hover:bg-[#1A282D] cursor-pointer">
                                        <p>Banner</p>
                                        <div className='flex flex-row gap-2 items-center'>
                                            {banner && (
                                                <p className='text-[8px] text-[#0B1416] p-1 rounded-lg bg-[#B8C5C9]'>Edited</p>
                                            )}
                                            <svg rpl="" fill="currentColor" height="20" icon-name="caret-right-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m7.942 15.442-.884-.884L11.616 10 7.058 5.442l.884-.884 5 5a.624.624 0 0 1 0 .884l-5 5Z"></path></svg>
                                        </div>
                                    </div>
                                </>
                            )}

                            {(currentEdit == "banner" || currentEdit == "avatar") && (
                                <div className='h-[115px] relative'>
                                    {((currentEdit == "banner" && banner == null) || (currentEdit == "avatar" && avatar == null)) && (
                                        <>
                                            <label htmlFor="fileinput" id="fileDropArea"
                                                onDragOver={handleDragEnter}
                                                onDragEnter={handleDragEnter}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}
                                            >
                                                <div class='bg-[#1a282d] w-full h-full rounded-lg flex flex-col gap-2 items-center justify-center px-20 text-xs text-[#82959B]'>
                                                    <svg rpl="" fill="currentColor" height="20" icon-name="upload-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m10.513 5.63 3.929 3.928-.884.884-2.933-2.933V19h-1.25V7.51l-2.933 2.932-.884-.884L9.67 5.446l.589-.029.254.212Zm5.859-1.482A6.876 6.876 0 0 0 10 0a6.876 6.876 0 0 0-6.372 4.148A4.639 4.639 0 0 0 0 8.625a4.716 4.716 0 0 0 4.792 4.625V12A3.465 3.465 0 0 1 1.25 8.625 3.412 3.412 0 0 1 4.189 5.31l.364-.06.123-.35A5.607 5.607 0 0 1 10 1.25a5.607 5.607 0 0 1 5.324 3.65l.123.348.364.06a3.412 3.412 0 0 1 2.939 3.317A3.465 3.465 0 0 1 15.208 12v1.25A4.716 4.716 0 0 0 20 8.625a4.639 4.639 0 0 0-3.628-4.477Z"></path></svg>
                                                    <p className='text-center'>Drag and drop or browse your device</p>
                                                </div>
                                            </label>
                                            <input id="fileinput" onChange={handleFileInput} type="file" accept='image/*' class='hidden' />
                                        </>
                                    )}

                                    {((currentEdit == "avatar" && avatar != null) || (currentEdit == "banner" && banner != null)) && (
                                        <div className='flex items-center justify-center h-full bg-[#0b1416] rounded-lg'>
                                            {currentEdit == "banner" && (
                                                <img src={URL.createObjectURL(banner)} alt="" className='w-[350px] h-[115px] object-contain' />
                                            )}
                                            {currentEdit == "avatar" && (
                                                <img src={URL.createObjectURL(currentEdit == "banner" ? banner : avatar)} alt="" className='object-contain w-[70px] h-[70px] rounded-full border' />
                                            )}
                                            <div className='absolute bottom-0 right-0'>
                                                <button onClick={currentEdit == "banner" ? () => setBanner(null) : () => setAvatar(null)} className='bg-[#1A282D] rounded-full w-[40px] h-[40px] py-2 px-2 flex justify-center items-center hover:bg-[#223237]'>
                                                    <svg rpl="" fill="currentColor" height="16" icon-name="delete-outline" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg"> <path d="M15.751 6.023 17 6.106l-.761 11.368a2.554 2.554 0 0 1-.718 1.741A2.586 2.586 0 0 1 13.8 20H6.2a2.585 2.585 0 0 1-1.718-.783 2.553 2.553 0 0 1-.719-1.737L3 6.106l1.248-.083.761 11.369c-.005.333.114.656.333.908.22.252.525.415.858.458h7.6c.333-.043.64-.207.859-.46.22-.254.338-.578.332-.912l.76-11.363ZM18 2.983v1.243H2V2.983h4v-.372A2.737 2.737 0 0 1 6.896.718 2.772 2.772 0 0 1 8.875.002h2.25c.729-.03 1.44.227 1.979.716.538.488.86 1.169.896 1.893v.372h4Zm-10.75 0h5.5v-.372a1.505 1.505 0 0 0-.531-1.014 1.524 1.524 0 0 0-1.094-.352h-2.25c-.397-.03-.79.097-1.094.352-.304.256-.495.62-.531 1.014v.372Z"></path></svg>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}


                            <div className="w-full h-[1px] bg-[#ffffff33]"></div>

                            <div className="flex flex-row justify-between font-semibold gap-6">
                                <button className="bg-[#1A282D] px-3 py-2 flex rounded-lg justify-center items-center hover:bg-[#223237] w-1/2">
                                    <p>Cancel</p>
                                </button>

                                <button onClick={handleUpdateCommunity} className="bg-[#0045AC] px-3 py-2 flex rounded-lg justify-center items-center hover:bg-[#1870f4] w-1/2">
                                    <p>Save</p>
                                </button>
                            </div>
                        </div>


                        <div className='w-full flex items-stretch justify-center h-[150px] rounded-lg border border-[#ffffff33] relative z-40'>
                            {community.communitybanner && (!isEditing || banner == null) && (
                                <img src={community.communitybanner} alt="Community Banner" className='object-cover w-full h-full rounded-lg' />
                            )}

                            {isEditing && banner != null && (
                                <img src={URL.createObjectURL(banner)} alt="" className='object-fill rounded-lg' />
                            )}

                            {userData && userData.id == community.ownerid && (
                                <button onClick={() => { setIsEditing(true); setCurrentEdit("banner") }} className='absolute right-3 top-[70%] rounded-full p-2 bg-black'>
                                    <svg rpl="" fill="currentColor" height="16" icon-name="edit-outline" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg"><path d="m18.236 3.158-1.4-1.4a2.615 2.615 0 0 0-3.667-.021L1.336 13.318a1.129 1.129 0 0 0-.336.8v3.757A1.122 1.122 0 0 0 2.121 19h3.757a1.131 1.131 0 0 0 .8-.337L18.256 6.826a2.616 2.616 0 0 0-.02-3.668ZM5.824 17.747H2.25v-3.574l9.644-9.435L15.259 8.1l-9.435 9.647ZM17.363 5.952l-1.23 1.257-3.345-3.345 1.257-1.23a1.362 1.362 0 0 1 1.91.01l1.4 1.4a1.364 1.364 0 0 1 .008 1.908Z"></path></svg>
                                </button>
                            )}
                        </div>
                        <div className='flex flex-row justify-between w-full bottom-6'>
                            <div className='flex flex-row gap-2  items-end'>
                                <div className={`relative rounded-full w-[70px] h-[70px] border ${userData && userData.id === community.ownerid && 'cursor-pointer'}`}>
                                    {(isEditing && avatar != null) ? (
                                        <img src={URL.createObjectURL(avatar)} alt="" className='w-full h-full rounded-full object-contain' />
                                    ) : (
                                        community.communityimage ? (
                                            <img src={community.communityimage} className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0ZM8.016 8.633a1.616 1.616 0 0 0-.2.806V13.5H5.931V6.172h1.8v.9h.039a3.009 3.009 0 0 1 1.018-.732 3.45 3.45 0 0 1 1.449-.284c.246-.003.491.02.732.068.158.024.309.08.444.164l-.759 1.832a2.09 2.09 0 0 0-1.093-.26c-.33-.01-.658.062-.954.208a1.422 1.422 0 0 0-.591.565Zm2.9 6.918H9.355L14.7 2.633c.426.272.828.58 1.2.922l-4.984 11.996Z"></path></svg>
                                        )
                                    )}
                                    {userData && userData.id == community.ownerid && (
                                        <div onClick={() => { setIsEditing(true); setCurrentEdit("avatar") }} className='group flex items-center justify-center absolute transform right-1/2 translate-x-1/2 bottom-1/2 translate-y-1/2 w-full h-full border border-white rounded-full hover:bg-[#666666]/50'>
                                            <svg className='opacity-0 group-hover:opacity-100' rpl="" fill="currentColor" height="16" icon-name="edit-outline" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg"><path d="m18.236 3.158-1.4-1.4a2.615 2.615 0 0 0-3.667-.021L1.336 13.318a1.129 1.129 0 0 0-.336.8v3.757A1.122 1.122 0 0 0 2.121 19h3.757a1.131 1.131 0 0 0 .8-.337L18.256 6.826a2.616 2.616 0 0 0-.02-3.668ZM5.824 17.747H2.25v-3.574l9.644-9.435L15.259 8.1l-9.435 9.647ZM17.363 5.952l-1.23 1.257-3.345-3.345 1.257-1.23a1.362 1.362 0 0 1 1.91.01l1.4 1.4a1.364 1.364 0 0 1 .008 1.908Z"></path></svg>
                                        </div>
                                    )}
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
                                {posts && posts.filter(p => p.community.name == community.name).map((post) => {
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