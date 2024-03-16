import React from "react";

function Spinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  );
}

export default Spinner;
