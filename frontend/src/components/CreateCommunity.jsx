import React, {useContext, useEffect} from "react";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import {MyContext} from "../utils/Context";
import buttonClose from "../icons/Close";
import {closeModal, handleDialogOutsideClick} from "../utils/functions";
import Close from "../icons/Close";
import {axiosReq} from "../utils/axios";

const CreateCommunity = ({ createCommunityRef, communities, setCommunities }) => {
  const {isLoading, setIsLoading}= useContext(MyContext);
  async function handleCreateCommunity(e) {
    e.preventDefault();
    try {
      setIsLoading(true)
      let inputs = new FormData();

      inputs.append("name", e.target.name.value);
      inputs.append("visibility", e.target.visibility.value);

      let response = await fetch(
          "http://localhost:6969/api/community/create.php",
          {
            method: "POST",
            body: inputs,
            credentials: "include",
          }
      );
        let JSONData = await response.json();
      if (response.status !== 200)
      {
            console.log(response);
          throw new Error(JSONData.message);
      }

      setIsLoading(false);
        const newCommunity = JSONData.data.newCommunity;
      setCommunities(communities => [...communities, newCommunity]);


      toast.success("Successfully created Community")
      setIsLoading(false)
        closeModal(createCommunityRef);
    } catch (e) {
     setIsLoading(false)
      toast.error(e.message);
    }
  }

    useEffect(() => {
        console.log(communities)
    }, [communities]);
  return (
      <React.Fragment>
        <dialog ref={createCommunityRef} onClick={(e)=>{handleDialogOutsideClick(e, createCommunityRef)}}>
          {isLoading &&<Spinner></Spinner>}
          <form
              onSubmit={(e) => handleCreateCommunity(e)}
              className="w-[400px] h-[300px] flex flex-col p-16"
          >
            <button type = "button" onClick={()=>closeModal(createCommunityRef)}><Close></Close></button>

            <label htmlFor="name">Community Name</label>
            <input type="text" name="name" className="border rounded" />

            <label htmlFor="visibility">Type</label>
            <select name="visibility">
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="restricted">Restricted</option>
            </select>

            <button
                type="submit"
                className="px-3 py-2 border rounded bg-blue-500"
            >
              Create Community
            </button>
          </form>
        </dialog>
      </React.Fragment>
  );
};

export default CreateCommunity;
