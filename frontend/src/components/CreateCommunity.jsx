import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import { MyContext } from "../utils/Context";
import { closeModal, handleDialogOutsideClick } from "../utils/functions";
import Close from "../icons/Close";
import { MdFileUpload } from "react-icons/md";

const CreateCommunity = ({ createCommunityRef, communities, setCommunities }) => {
    const { isLoading, setIsLoading } = useContext(MyContext);
    const [communityAvatar, setCommunityAvatar] = useState(null);
    const [communityBanner, setCommunityBanner] = useState(null);


    async function handleCreateCommunity(e) {
        e.preventDefault();
        try {
            setIsLoading(true)
            let inputs = new FormData();

            inputs.append("name", e.target.name.value);
            inputs.append("visibility", e.target.visibility.value);
            inputs.append("about", e.target.about.value);
            inputs.append("communityImage", communityAvatar);
            inputs.append("communityBanner", communityBanner);

            let response = await fetch(
                "http://localhost:6969/communities",
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

            setIsLoading(false);
            const newCommunity = JSONData.data.community;
            setCommunities(communities => [...communities, newCommunity]);
            toast.success("Successfully created Community")
            setIsLoading(false)
            closeModal(createCommunityRef);
        } catch (e) {
            setIsLoading(false)
            toast.error(e.message);
        }
    }

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (e.target.name == "communityAvatar") {
            setCommunityAvatar(file);
        } else {
            setCommunityBanner(file);
        }
    }


    const handleDragEnter = (e) => {
        e.preventDefault();
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
    };

    const handleBannerFileInputDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        setCommunityBanner(droppedFile)
    };

    const handleAvatarFileInputDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        setCommunityAvatar(droppedFile)
    }


    return (
        <>
            <dialog ref={createCommunityRef} onClick={(e) => { handleDialogOutsideClick(e, createCommunityRef) }} className="bg-white/0">
                {isLoading && <Spinner></Spinner>}
                <form
                    onSubmit={(e) => handleCreateCommunity(e)}
                    className="flex flex-col gap-4 justify-center p-4 px-8 text-sm bg-[#181c1f] relative rounded-lg"
                >
                    <div className="flex flex-row justiy-between">
                        <div>
                            <h1 className="text-[#f2f2f2] text-xl font-bold">Name and style your community</h1>
                            <p className="text-[#acacac] text-xs">Banners and descriptions help redditors discover and understand your community.</p>
                        </div>

                        <button onClick={() => closeModal(createCommunityRef)} className="bg-[#1A282D] rounded-full w-[30px] h-[30px] py-2 px-2 flex justify-center items-center hover:bg-[#223237] text-white relative left-5">
                            <svg rpl="" fill="currentColor" height="16" icon-name="close-outline" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg"><path d="m18.442 2.442-.884-.884L10 9.116 2.442 1.558l-.884.884L9.116 10l-7.558 7.558.884.884L10 10.884l7.558 7.558.884-.884L10.884 10l7.558-7.558Z"></path></svg>
                        </button>
                    </div>


                    <div className='h-[115px] rounded-lg'>
                        {communityBanner ? (
                            <div className="relative">
                                <div className="h-[115px] rounded-lg overflow-hidden">
                                    <div
                                        className="w-full h-full bg-center bg-cover"
                                        style={{ backgroundImage: `url(${URL.createObjectURL(communityBanner)})` }}
                                    ></div>
                                </div>

                                <div className='absolute bottom-0 right-0 text-white'>
                                    <button onClick={() => setCommunityBanner(null)} className='bg-[#1A282D] rounded-full w-[40px] h-[40px] py-2 px-2 flex justify-center items-center hover:bg-[#223237]'>
                                        <svg rpl="" fill="currentColor" height="16" icon-name="delete-outline" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg"> <path d="M15.751 6.023 17 6.106l-.761 11.368a2.554 2.554 0 0 1-.718 1.741A2.586 2.586 0 0 1 13.8 20H6.2a2.585 2.585 0 0 1-1.718-.783 2.553 2.553 0 0 1-.719-1.737L3 6.106l1.248-.083.761 11.369c-.005.333.114.656.333.908.22.252.525.415.858.458h7.6c.333-.043.64-.207.859-.46.22-.254.338-.578.332-.912l.76-11.363ZM18 2.983v1.243H2V2.983h4v-.372A2.737 2.737 0 0 1 6.896.718 2.772 2.772 0 0 1 8.875.002h2.25c.729-.03 1.44.227 1.979.716.538.488.86 1.169.896 1.893v.372h4Zm-10.75 0h5.5v-.372a1.505 1.505 0 0 0-.531-1.014 1.524 1.524 0 0 0-1.094-.352h-2.25c-.397-.03-.79.097-1.094.352-.304.256-.495.62-.531 1.014v.372Z"></path></svg>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <label htmlFor="bannerfileinput" id="fileDropArea"
                                    onDragOver={handleDragEnter}
                                    onDragEnter={handleDragEnter}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleBannerFileInputDrop}
                                >
                                    <div className='bg-[#1a282d] w-full h-full rounded-lg flex flex-col gap-2 items-center justify-center px-20 text-xs text-[#82959B] border border-white'>
                                        <svg rpl="" fill="currentColor" height="20" icon-name="upload-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m10.513 5.63 3.929 3.928-.884.884-2.933-2.933V19h-1.25V7.51l-2.933 2.932-.884-.884L9.67 5.446l.589-.029.254.212Zm5.859-1.482A6.876 6.876 0 0 0 10 0a6.876 6.876 0 0 0-6.372 4.148A4.639 4.639 0 0 0 0 8.625a4.716 4.716 0 0 0 4.792 4.625V12A3.465 3.465 0 0 1 1.25 8.625 3.412 3.412 0 0 1 4.189 5.31l.364-.06.123-.35A5.607 5.607 0 0 1 10 1.25a5.607 5.607 0 0 1 5.324 3.65l.123.348.364.06a3.412 3.412 0 0 1 2.939 3.317A3.465 3.465 0 0 1 15.208 12v1.25A4.716 4.716 0 0 0 20 8.625a4.639 4.639 0 0 0-3.628-4.477Z"></path></svg>
                                        <p className='text-center'>Drag and drop or browse your device</p>
                                    </div>
                                </label>
                                <input id="bannerfileinput" name="communityBanner" type="file" onChange={(e) => setCommunityBanner(e.target.files[0])} value={communityBanner} accept='image/*' class='hidden' />
                            </>
                        )}
                    </div>


                    <div className='flex flex-row justify-between'>
                        <div className="rounded-full relative bottom-10 left-3">
                            {communityAvatar ? (
                                <div className="relative w-[70px] h-[70px] border border-white rounded-full">
                                    <img src={URL.createObjectURL(communityAvatar)} alt="" className="w-full h-full rounded-full object-cover" />

                                    <div className='absolute bottom-0 right-0 text-white'>
                                        <button onClick={() => setCommunityAvatar(null)} className='bg-[#1A282D] rounded-full w-[25px] h-[25px] py-2 px-2 flex justify-center items-center hover:bg-[#223237]'>
                                            <svg rpl="" fill="currentColor" height="16" icon-name="delete-outline" viewBox="0 0 20 20" width="16" xmlns="http://www.w3.org/2000/svg"> <path d="M15.751 6.023 17 6.106l-.761 11.368a2.554 2.554 0 0 1-.718 1.741A2.586 2.586 0 0 1 13.8 20H6.2a2.585 2.585 0 0 1-1.718-.783 2.553 2.553 0 0 1-.719-1.737L3 6.106l1.248-.083.761 11.369c-.005.333.114.656.333.908.22.252.525.415.858.458h7.6c.333-.043.64-.207.859-.46.22-.254.338-.578.332-.912l.76-11.363ZM18 2.983v1.243H2V2.983h4v-.372A2.737 2.737 0 0 1 6.896.718 2.772 2.772 0 0 1 8.875.002h2.25c.729-.03 1.44.227 1.979.716.538.488.86 1.169.896 1.893v.372h4Zm-10.75 0h5.5v-.372a1.505 1.505 0 0 0-.531-1.014 1.524 1.524 0 0 0-1.094-.352h-2.25c-.397-.03-.79.097-1.094.352-.304.256-.495.62-.531 1.014v.372Z"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <label htmlFor="avatarfileinput" id="fileDropArea"
                                        onDragOver={handleDragEnter}
                                        onDragEnter={handleDragEnter}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleAvatarFileInputDrop}
                                        className="z-50"
                                    >
                                        <div className='w-[70px] h-[70px] bg-[#1a282d] rounded-full'>
                                            <svg rpl="" className="w-full h-full" fill="#5C6C74" height="20" icon-name="community-fill" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0ZM8.016 8.633a1.616 1.616 0 0 0-.2.806V13.5H5.931V6.172h1.8v.9h.039a3.009 3.009 0 0 1 1.018-.732 3.45 3.45 0 0 1 1.449-.284c.246-.003.491.02.732.068.158.024.309.08.444.164l-.759 1.832a2.09 2.09 0 0 0-1.093-.26c-.33-.01-.658.062-.954.208a1.422 1.422 0 0 0-.591.565Zm2.9 6.918H9.355L14.7 2.633c.426.272.828.58 1.2.922l-4.984 11.996Z"></path></svg>
                                        </div>
                                    </label>
                                    <input id="avatarfileinput" name="communityBanner" type="file" onChange={(e) => setCommunityAvatar(e.target.files[0])} value={communityAvatar} accept='image/*' class='hidden' />
                                </>
                            )}
                        </div>

                        <div class="w-[80%]">
                            <div class="relative w-full min-w-[200px] h-10">
                                <input
                                    name="name"
                                    required
                                    class="peer w-[100%] h-full bg-transparent text-white font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border-[#ffffff33] placeholder-shown:border-[#ffffff33] placeholder-shown:border-[#ffffff33] border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-[#ffffff33] focus:border-[#ffffff33]"
                                    placeholder=" " /><label
                                        class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-white leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-white transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-white peer-focus:text-white before:border-[#ffffff33] peer-focus:before:!border-[#ffffff33] after:border-[#ffffff33] peer-focus:after:!border-[#ffffff33]">Community name
                                </label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div class="relative w-full min-w-[200px]">
                            <textarea
                                name="about"
                                class="peer w-[100%] h-full bg-transparent text-white font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border-[#ffffff33] placeholder-shown:border-[#ffffff33] placeholder-shown:border-[#ffffff33] border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-[#ffffff33] focus:border-[#ffffff33]"
                                placeholder=" " /><label
                                    class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-white leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-white transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-white peer-focus:text-white before:border-[#ffffff33] peer-focus:before:!border-[#ffffff33] after:border-[#ffffff33] peer-focus:after:!border-[#ffffff33]">Description
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="flex flex-row justify-between w-full">
                            <label
                                htmlFor="public"
                                className="w-full flex flex-row gap-4 items-center text-white px-3 py-2"
                            >
                                <div>
                                    <svg rpl="" fill="currentColor" height="20" icon-name="world-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm8.718 9.375h-4.645c-.075-3.017-.7-6.051-1.819-7.82a8.755 8.755 0 0 1 6.464 7.82ZM10 18.75c-1.138 0-2.7-3.077-2.824-8.125h5.647C12.7 15.673 11.137 18.75 10 18.75ZM7.176 9.375C7.3 4.327 8.862 1.25 10 1.25s2.7 3.077 2.823 8.125H7.176Zm.569-7.82C6.625 3.324 6 6.359 5.926 9.375H1.282a8.756 8.756 0 0 1 6.463-7.82Zm-6.463 9.07h4.644c.075 3.016.7 6.051 1.819 7.82a8.756 8.756 0 0 1-6.463-7.82Zm10.972 7.82c1.12-1.769 1.744-4.8 1.819-7.82h4.645a8.754 8.754 0 0 1-6.464 7.82Z"></path></svg>
                                </div>

                                <div>
                                    <p className="font-semibold">Public</p>
                                    <p>Anyone can view and contribute</p>
                                </div>
                            </label>
                            <input
                                type="radio"
                                id="public"
                                name="visibility"
                                value="public"
                                checked
                            />
                        </div>

                        <div className="flex flex-row justify-between w-full">
                            <label
                                htmlFor="private"
                                className="w-full flex flex-row gap-4 items-center text-white px-3 py-2"
                            >
                                <div>
                                    <svg rpl="" fill="currentColor" height="20" icon-name="lock-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M16.375 8H15V5.312A5.17 5.17 0 0 0 10 0a5.169 5.169 0 0 0-5 5.312V8H3.625A1.629 1.629 0 0 0 2 9.63v7.74A1.629 1.629 0 0 0 3.625 19h12.75A1.629 1.629 0 0 0 18 17.37V9.63A1.629 1.629 0 0 0 16.375 8ZM6.25 5.312A3.92 3.92 0 0 1 10 1.25a3.92 3.92 0 0 1 3.75 4.062V8h-7.5V5.312Zm10.5 12.058a.378.378 0 0 1-.375.38H3.625a.378.378 0 0 1-.375-.38V9.63a.383.383 0 0 1 .375-.38h12.75a.378.378 0 0 1 .375.38v7.74Z"></path></svg>
                                </div>

                                <div>
                                    <p className="font-semibold">Private</p>
                                    <p>Anyone can view, but only approved users can contribute</p>
                                </div>
                            </label>
                            <input
                                type="radio"
                                id="private"
                                name="visibility"
                                value="private"
                            />
                        </div>


                        <div className="flex flex-row justify-between w-full">
                            <label
                                htmlFor="restricted"
                                className="w-full flex flex-row gap-4 items-center text-white px-3 py-2"
                            >
                                <div>
                                    <svg rpl="" fill="currentColor" height="20" icon-name="views-outline" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M4.078 9.691a9.85 9.85 0 0 0-.774 1A8.613 8.613 0 0 1 1.97 9.683 8.192 8.192 0 0 1 .211 7.377a1.94 1.94 0 0 1 0-1.753A8.757 8.757 0 0 1 8.014 1a8.679 8.679 0 0 1 7.735 4.5c.227.43.3.924.205 1.4-.391-.157-.792-.29-1.2-.4a.885.885 0 0 0-.106-.412A7.43 7.43 0 0 0 8.014 2.25a7.5 7.5 0 0 0-6.689 3.941.7.7 0 0 0 0 .619 6.938 6.938 0 0 0 1.49 1.953c.388.353.81.664 1.263.928Zm1.635-2.6a2.217 2.217 0 0 1 .222-1.71A2.352 2.352 0 0 1 7.4 4.278c.202-.051.408-.078.616-.078a2.372 2.372 0 0 1 2.3 1.709c.029.113.048.228.06.344.411-.062.826-.1 1.242-.113a3.513 3.513 0 0 0-.1-.563A3.648 3.648 0 0 0 7.08 3.069a3.592 3.592 0 0 0-2.227 1.686 3.442 3.442 0 0 0 .286 3.893c.314-.27.644-.52.988-.75a2.268 2.268 0 0 1-.413-.808v.001Zm11.893 9.889a8.198 8.198 0 0 0 2-2.488A2.142 2.142 0 0 0 19.6 12.5 8.499 8.499 0 0 0 12 8a8.586 8.586 0 0 0-7.67 4.628 1.968 1.968 0 0 0 0 1.745 8.176 8.176 0 0 0 1.726 2.306 8.78 8.78 0 0 0 11.551.3v.001Zm.89-3.9a.899.899 0 0 1 0 .833c-.422.808-1 1.524-1.7 2.108a7.527 7.527 0 0 1-9.89-.254 6.926 6.926 0 0 1-1.464-1.954.716.716 0 0 1 0-.626A7.328 7.328 0 0 1 12 9.25a7.262 7.262 0 0 1 6.5 3.83h-.003Zm-5.572 3.849a3.546 3.546 0 0 0 2.175-1.663 3.508 3.508 0 0 0 .352-2.687 3.588 3.588 0 0 0-5.632-1.897 3.543 3.543 0 0 0-.92 1.051 3.506 3.506 0 0 0-.352 2.686 3.582 3.582 0 0 0 4.377 2.51Zm1.322-4.024a2.265 2.265 0 0 1-.227 1.735 2.306 2.306 0 0 1-1.42 1.081 2.334 2.334 0 0 1-2.849-1.628 2.265 2.265 0 0 1 .227-1.735 2.298 2.298 0 0 1 1.416-1.08 2.357 2.357 0 0 1 2.018.395c.406.308.7.74.835 1.232Z"></path></svg>
                                </div>

                                <div>
                                    <p className="font-semibold">Restricted</p>
                                    <p>Anyone can view, but only approved users can contribute</p>
                                </div>
                            </label>
                            <input
                                type="radio"
                                id="restricted"
                                name="visibility"
                                value="restricted"
                            />
                        </div>
                    </div>


                    <button
                        type="submit"
                        className="px-3 py-2 bg-blue-500 rounded-lg"
                    >
                        <p className="text-white font-semibold">
                            Create Community
                        </p>
                    </button>
                </form >
            </dialog >
        </>
    );
};

export default CreateCommunity;
