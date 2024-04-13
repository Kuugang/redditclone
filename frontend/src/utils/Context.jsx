import React, { createContext, useState } from 'react';


export const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [posts, setPosts] = useState();
    const [isLoading,setIsLoading] = useState(false);
    return (
        <MyContext.Provider value={{ isLoggedIn, setIsLoggedIn, posts, setPosts , setIsLoading,isLoading}}>
            {children}
        </MyContext.Provider>
    );
};
