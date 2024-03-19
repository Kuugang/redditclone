import React, { useRef } from "react";
import CreateCommunity from "./CreateCommunity.tsx";

function LeftBar() {
  const createCommunityRef = useRef<HTMLDialogElement>(null);

  const handleOpenDialog = (ref: React.RefObject<HTMLDialogElement>) => {
    if (ref.current) {
      ref.current.showModal();
    }
  };

  const handleCloseDialog = (ref: React.RefObject<HTMLDialogElement>) => {
    if (ref.current) {
      ref.current.close();
    }
  };

  return (
    <>
      <h1>LeftBar</h1>
      <button onClick={() => handleOpenDialog(createCommunityRef)}>
        Create Community
      </button>
      <CreateCommunity
        createCommunityRef={createCommunityRef}
      ></CreateCommunity>
    </>
  );
}

export default LeftBar;
