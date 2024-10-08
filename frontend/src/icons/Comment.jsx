import React from "react";


export default function Comment({ post }) {

    return (
        <>
            <button className="flex flex-row gap-1 items-center p-1 rounded bg-[#1a282d]">
                <svg
                    aria-hidden="true"
                    className="icon-comment"
                    fill="currentColor"
                    height="18"
                    icon-name="comment-outline"
                    viewBox="0 0 20 20"
                    width="18"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M7.725 19.872a.718.718 0 0 1-.607-.328.725.725 0 0 1-.118-.397V16H3.625A2.63 2.63 0 0 1 1 13.375v-9.75A2.629 2.629 0 0 1 3.625 1h12.75A2.63 2.63 0 0 1 19 3.625v9.75A2.63 2.63 0 0 1 16.375 16h-4.161l-4 3.681a.725.725 0 0 1-.489.191ZM3.625 2.25A1.377 1.377 0 0 0 2.25 3.625v9.75a1.377 1.377 0 0 0 1.375 1.375h4a.625.625 0 0 1 .625.625v2.575l3.3-3.035a.628.628 0 0 1 .424-.165h4.4a1.377 1.377 0 0 0 1.375-1.375v-9.75a1.377 1.377 0 0 0-1.374-1.375H3.625Z"></path>
                </svg>
                <h1>{post.comment_count}</h1>
            </button>
        </>
    )
}