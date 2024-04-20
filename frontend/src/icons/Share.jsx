import React from "react";


export default function()
{
   return (
       <button className="flex flex-row gap-1 items-center bg-zinc-200 p-1 rounded">
           <svg
               aria-hidden="true"
               className="icon-share"
               fill="currentColor"
               height="18"
               icon-name="share-ios-outline"
               viewBox="0 0 20 20"
               width="18"
               xmlns="http://www.w3.org/2000/svg"
           >
               <path
                   d="M19 11v5.378A2.625 2.625 0 0 1 16.378 19H3.622A2.625 2.625 0 0 1 1 16.378V11h1.25v5.378a1.373 1.373 0 0 0 1.372 1.372h12.756a1.373 1.373 0 0 0 1.372-1.372V11H19ZM9.375 3.009V14h1.25V3.009l2.933 2.933.884-.884-4-4a.624.624 0 0 0-.884 0l-4 4 .884.884 2.933-2.933Z"></path>
           </svg>
           <h1>Share</h1>
       </button>
   )
}