import React from "react";


export default function Upvote({post})
{

    return(
        <>
            <button className="flex flex-row gap-1 items-center">
                <svg
                    fill="currentColor"
                    height="16"
                    icon-name="upvote-outline"
                    viewBox="0 0 20 20"
                    width="16"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M12.877 19H7.123A1.125 1.125 0 0 1 6 17.877V11H2.126a1.114 1.114 0 0 1-1.007-.7 1.249 1.249 0 0 1 .171-1.343L9.166.368a1.128 1.128 0 0 1 1.668.004l7.872 8.581a1.25 1.25 0 0 1 .176 1.348 1.113 1.113 0 0 1-1.005.7H14v6.877A1.125 1.125 0 0 1 12.877 19ZM7.25 17.75h5.5v-8h4.934L10 1.31 2.258 9.75H7.25v8ZM2.227 9.784l-.012.016c.01-.006.014-.01.012-.016Z"></path>
                </svg>
            </button>

            <div className="flex flex-row items-center">
                <h1 className="text-xs font-semibold">
                    {post.upvote_count}
                </h1>
            </div>
        </>
    )
}