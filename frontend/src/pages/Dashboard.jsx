import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../utils/helper";
import { MyContext } from "../utils/Context";
import LeftBar from "../components/LeftBar.jsx";

const Dashboard = () => {
    const { isLoggedIn, posts, setPosts } = useContext(MyContext);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await getPosts(page);
                if (page === 1) {

                    setPosts(data);
                } else {
                    setPosts((prevPosts) => [...prevPosts, ...data]);
                }
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
                setIsFetching(false);
            }
        };
        fetchData();
    }, [page]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop !==
                document.documentElement.offsetHeight ||
                isFetching
            )
                return;
            setIsFetching(true);
            setPage((prevPage) => prevPage + 1);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isFetching]);

    const timeAgo = (date) => {
        const currentDate = new Date();
        const createdAt = new Date(date);
        const timeDifference = currentDate.getTime() - createdAt.getTime();

        const minute = 60 * 1000;
        const hour = minute * 60;
        const day = hour * 24;
        const month = day * 30;
        const year = day * 365;

        if (timeDifference < minute) {
            return "Just now";
        } else if (timeDifference < hour) {
            const minutes = Math.floor(timeDifference / minute);
            return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
        } else if (timeDifference < day) {
            const hours = Math.floor(timeDifference / hour);
            return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        } else if (timeDifference < month) {
            const days = Math.floor(timeDifference / day);
            return `${days} day${days > 1 ? "s" : ""} ago`;
        } else if (timeDifference < year) {
            const months = Math.floor(timeDifference / month);
            return `${months} month${months > 1 ? "s" : ""} ago`;
        } else {
            const years = Math.floor(timeDifference / year);
            return `${years} year${years > 1 ? "s" : ""} ago`;
        }
    };

    return (
        <>
            {isLoggedIn && <LeftBar />}
            <div className="flex flex-row gap-5 justify-center items-center">
                {posts && posts.length > 0 ? (
                    <div className="flex flex-col w-[100v] items-center m-6">
                        <div className="flex flex-col gap-5">
                            {posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="border border-black rounded p-5 w-[500px] bg-gray-50"
                                >
                                    <div className="flex text-xs flex-row gap-2 items-center">
                                        <div className="rounded rounded-full w-[25px] h-[25px] bg-gray-200"></div>
                                        <div className="flex flex-row gap-2">
                                            <p className="font-bold">r/{post.community.name}</p>
                                            <p>Posted by u/{post.author.username}</p>
                                        </div>
                                        <p className="">{timeAgo(post.createdat)}</p>
                                    </div>
                                    <div className="text-left">
                                        <h1 className="text-md font-bold">{post.title}</h1>
                                        <p className="text-sm">{post.content}</p>
                                    </div>

                                    <div className="flex flex-row gap-3 text-xs">
                                        <div className="flex flex-row gap-1 bg-zinc-200 p-1 rounded">
                                            <button className="flex flex-row gap-1 items-center">
                                                <svg
                                                    fill="currentColor"
                                                    height="16"
                                                    icon-name="upvote-outline"
                                                    viewBox="0 0 20 20"
                                                    width="16"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M12.877 19H7.123A1.125 1.125 0 0 1 6 17.877V11H2.126a1.114 1.114 0 0 1-1.007-.7 1.249 1.249 0 0 1 .171-1.343L9.166.368a1.128 1.128 0 0 1 1.668.004l7.872 8.581a1.25 1.25 0 0 1 .176 1.348 1.113 1.113 0 0 1-1.005.7H14v6.877A1.125 1.125 0 0 1 12.877 19ZM7.25 17.75h5.5v-8h4.934L10 1.31 2.258 9.75H7.25v8ZM2.227 9.784l-.012.016c.01-.006.014-.01.012-.016Z"></path>
                                                </svg>
                                            </button>

                                            <div className="flex flex-row items-center">
                                                <h1 className="text-xs font-semibold">
                                                    {post.upvote_count}
                                                </h1>
                                            </div>

                                            <button className="flex flex-row gap-1 items-center">
                                                <svg
                                                    fill="currentColor"
                                                    height="16"
                                                    icon-name="downvote-outline"
                                                    viewBox="0 0 20 20"
                                                    width="16"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M10 20a1.122 1.122 0 0 1-.834-.372l-7.872-8.581A1.251 1.251 0 0 1 1.118 9.7 1.114 1.114 0 0 1 2.123 9H6V2.123A1.125 1.125 0 0 1 7.123 1h5.754A1.125 1.125 0 0 1 14 2.123V9h3.874a1.114 1.114 0 0 1 1.007.7 1.25 1.25 0 0 1-.171 1.345l-7.876 8.589A1.128 1.128 0 0 1 10 20Zm-7.684-9.75L10 18.69l7.741-8.44H12.75v-8h-5.5v8H2.316Zm15.469-.05c-.01 0-.014.007-.012.013l.012-.013Z"></path>
                                                </svg>
                                            </button>
                                        </div>

                                        <button className="flex flex-row gap-1 items-center bg-zinc-200 p-1 rounded">
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
                                                <path d="M7.725 19.872a.718.718 0 0 1-.607-.328.725.725 0 0 1-.118-.397V16H3.625A2.63 2.63 0 0 1 1 13.375v-9.75A2.629 2.629 0 0 1 3.625 1h12.75A2.63 2.63 0 0 1 19 3.625v9.75A2.63 2.63 0 0 1 16.375 16h-4.161l-4 3.681a.725.725 0 0 1-.489.191ZM3.625 2.25A1.377 1.377 0 0 0 2.25 3.625v9.75a1.377 1.377 0 0 0 1.375 1.375h4a.625.625 0 0 1 .625.625v2.575l3.3-3.035a.628.628 0 0 1 .424-.165h4.4a1.377 1.377 0 0 0 1.375-1.375v-9.75a1.377 1.377 0 0 0-1.374-1.375H3.625Z"></path>
                                            </svg>
                                            <h1>{post.comment_count}</h1>
                                        </button>

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
                                                <path d="M19 11v5.378A2.625 2.625 0 0 1 16.378 19H3.622A2.625 2.625 0 0 1 1 16.378V11h1.25v5.378a1.373 1.373 0 0 0 1.372 1.372h12.756a1.373 1.373 0 0 0 1.372-1.372V11H19ZM9.375 3.009V14h1.25V3.009l2.933 2.933.884-.884-4-4a.624.624 0 0 0-.884 0l-4 4 .884.884 2.933-2.933Z"></path>
                                            </svg>
                                            <h1>Share</h1>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        <h1>Getting Posts</h1>
                    </>
                )}
            </div>
        </>
    );
};

export default Dashboard;
