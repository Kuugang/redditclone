import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../utils/helper";
import { MyContext } from "../utils/Context";
import LeftBar from "../components/LeftBar.jsx";
import Posts from "../components/Posts";
import { timeAgo } from "../utils/helper";

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

    return (
        <>
            {isLoggedIn && <LeftBar />}
            <Posts></Posts>
        </>
    );
};

export default Dashboard;
