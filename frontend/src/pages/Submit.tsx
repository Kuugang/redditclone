import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner.tsx";

const Submit: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreatePost(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      let inputs = new FormData();

      inputs.append("title", e.target.title.value);
      inputs.append("content", e.target.content.value);
      let response = await fetch("http://localhost:6969/api/post/create.php", {
        method: "POST",
        body: inputs,
        credentials: "include",
      });

      if (response.status == 200) {
        setIsLoading(false);
        toast("Post created succesfully ");
        navigate("/");
      }
    } catch (e) {
      toast(e.message);
    }
  }

  return (
    <>
      {isLoading && <Spinner></Spinner>}
      <div className="w-[100vw] flex flex-col items-center">
        <form
          onSubmit={(e) => handleCreatePost(e)}
          className="w-80 border rounded border-black flex flex-col justify-centera p-5 gap-3"
        >
          <input
            name="title"
            type="text"
            placeholder="Title"
            className="border border-black p-1"
          ></input>
          <textarea
            name="content"
            cols={30}
            rows={10}
            placeholder="Text"
            className="border border-black p-1"
          ></textarea>

          <div className="flex flex-row gap-3">
            <button
              type="button"
              className="border border-black rounded px-3 py-2"
            >
              Save as draft
            </button>
            <button
              type="submit"
              className="border border-black rounded px-3 py-2"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Submit;
