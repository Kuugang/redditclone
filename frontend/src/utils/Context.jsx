import React, { createContext, useState } from 'react';


export const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [posts, setPosts] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [communities, setCommunities] = useState([]);
    const [userData, setUserData] = useState();
    return (
        <MyContext.Provider value={{ isLoggedIn, setIsLoggedIn, posts, setPosts, isLoading, setIsLoading, communities, setCommunities, userData, setUserData }}>
            {children}
        </MyContext.Provider>
    );
};
