import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../utils/helper";
import { MyContext } from "../utils/Context";
import LeftBar from "../components/LeftBar.jsx";
import Posts from "../components/Posts";

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
           <Posts posts={posts} timeAgo = {timeAgo}></Posts>
        </>
    );
};

export default Dashboard;
