import React, { createContext, useState } from 'react';


export const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [posts, setPosts] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [communities, setCommunities] = useState();
    return (
        <MyContext.Provider value={{ isLoggedIn, setIsLoggedIn, posts, setPosts, isLoading, setIsLoading, communities, setCommunities }}>
            {children}
        </MyContext.Provider>
    );
};
