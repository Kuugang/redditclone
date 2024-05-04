import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import { MyContext } from "../utils/Context";
import { closeModal, handleDialogOutsideClick } from "../utils/functions";
import Close from "../icons/Close";
import { MdFileUpload } from "react-icons/md";

const CreateCommunity = ({ createCommunityRef, communities, setCommunities }) => {
    const { isLoading, setIsLoading } = useContext(MyContext);
    const [communityImage, setCommunityImage] = useState(null);
    const [communityBanner, setCommunityBanner] = useState(null);

    async function handleCreateCommunity(e) {
        e.preventDefault();
        try {
            setIsLoading(true)
            let inputs = new FormData();

            inputs.append("name", e.target.name.value);
            inputs.append("visibility", e.target.visibility.value);
            inputs.append("about", e.target.about.value);
            inputs.append("communityImage", communityImage);
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
        if (e.target.name == "communityImage") {
            setCommunityImage(file);
        } else {
            setCommunityBanner(file);
        }
    }

    return (
        <>
            <dialog ref={createCommunityRef} onClick={(e) => { handleDialogOutsideClick(e, createCommunityRef) }} className="bg-gray-100 rounded-lg">
                {isLoading && <Spinner></Spinner>}
                <form
                    onSubmit={(e) => handleCreateCommunity(e)}
                    className="flex flex-col gap-4 justify-center border p-10 text-sm"
                >
                    <button type="button" onClick={() => closeModal(createCommunityRef)}><Close></Close></button>

                    <label htmlFor="name">Community Name</label>
                    <input type="text" name="name" className="border rounded" />

                    <label htmlFor="visibility">Type</label>

                    <select name="visibility">
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="restricted">Restricted</option>
                    </select>

                    <label htmlFor="about">About</label>
                    <textarea id="about" name="about" cols="30" rows="10" className="border "></textarea>

                    <label htmlFor="communityImage" className="bg-white flex flex-row border border-black rounded-lg px-2 py-1 cursor-pointer items-center shadow-md">
                        <MdFileUpload className="text-xl" />
                        <p>Upload Community Image</p>
                    </label>

                    <input
                        id="communityImage"
                        onChange={handleFileChange}
                        type="file"
                        accept="image/*"
                        name="communityImage"
                        className="px-2 py-1 border border-black rounded w-full hidden"
                    />


                    <label htmlFor="communityBanner" className="bg-white flex flex-row border border-black rounded-lg px-2 py-1 cursor-pointer items-center shadow-md">
                        <MdFileUpload className="text-xl" />
                        <p>Upload Community Banner</p>
                    </label>
                    <input
                        id="communityBanner"
                        onChange={handleFileChange}
                        type="file"
                        accept="image/*"
                        name="communityBanner"
                        className="px-2 py-1 border border-black rounded w-full hidden"
                    />

                    <button
                        type="submit"
                        className="px-3 py-2 border rounded bg-blue-500"
                    >
                        Create Community
                    </button>
                </form>
            </dialog>
        </>
    );
};

export default CreateCommunity;
