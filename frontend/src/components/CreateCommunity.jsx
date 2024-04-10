import React from "react";
import { toast } from "react-toastify";

const CreateCommunity = ({ createCommunityRef }) => {
  async function handleCreateCommunity(e) {
    e.preventDefault();
    try {
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
    } catch (e) {
      toast(e.getMessage());
    }
  }

  return (
      <React.Fragment>
        <dialog ref={createCommunityRef}>
          <form
              onSubmit={(e) => handleCreateCommunity(e)}
              className="w-[400px] h-[300px] flex flex-col p-16"
          >
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
