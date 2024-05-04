import React, { useEffect, useState } from 'react';

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [communities, setCommunities] = useState([])
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const getUser = async () => {
            let response = await fetch("http://localhost:6969/api/admin/users.php");
            let responseJSON = await response.json();
            setUsers(responseJSON.data.users);
        }

        const getCommunities = async () => {
            let response = await fetch("http://localhost:6969/api/community/read.php");
            let responseJSON = await response.json();
            setCommunities(responseJSON.data.communities);
        }

        const getPosts = async () => {
            let response = await fetch("http://localhost:6969/api/post/read.php");
            let responseJSON = await response.json();
            setPosts(responseJSON.data.posts);
        }

        getUser();
        getCommunities();
        getPosts();
    }, [])

    return (
        <div className='p-10'>
            <div className="w-full flex flex-col items-center gap-5">
                <h1 className='font-bold text-2xl'>Users</h1>
                {(users && users.length > 0) ? (

                    <table className='text-start'>
                        <thead className='border border-black'>
                            <th className='border border-r-1 border-black p-2'>Username</th>
                            <th className='border border-r-1 border-black p-2'>Email</th>
                            <th className='border border-r-1 border-black p-2'>First Name</th>
                            <th className='border border-r-1 border-black p-2'>Last Name</th>
                            <th className='border border-r-1 border-black p-2'>Gender</th>
                            <th className='border border-r-1 border-black p-2'>BirthDate</th>
                            <th className='border border-r-1 border-black p-2'>Created At</th>
                            <th className='border border-r-1 border-black p-2'>Updated At</th>
                        </thead>
                        <tbody>
                            {(users && users.length > 0) && (
                                users.map(u => (
                                    <>
                                        <tr key={u.id} className='border border-r-1 border-black'>
                                            <td className='border boder-r-1 border-black p-2'>{u.username}</td>
                                            <td className='border boder-r-1 border-black p-2'>{u.email}</td>
                                            <td className='border boder-r-1 border-black p-2'>{u.firstname}</td>
                                            <td className='border boder-r-1 border-black p-2'>{u.lastname}</td>
                                            <td className='border boder-r-1 border-black p-2'>{u.gender}</td>
                                            <td className='border boder-r-1 border-black p-2'>{u.birthdate}</td>
                                            <td className='border boder-r-1 border-black p-2'>{u.createdat}</td>
                                            <td className={`border boder-r-1 border-black p-2 ${u.updatedat == null && "text-red-500"}`}>{u.updatedat == null ? "NULL" : u.updatedat}</td>
                                        </tr>
                                    </>
                                ))
                            )}
                        </tbody>
                    </table>
                ) : (
                    <h1>Fetching Users...</h1>
                )}

                <h1 className='font-bold text-2xl'>Communites</h1>
                {(communities && communities.length > 0) ? (
                    <table className='text-start'>
                        <thead className='border border-black'>
                            <th className='border border-r-1 border-black p-2'>Name</th>
                            <th className='border border-r-1 border-black p-2'>About</th>
                            <th className='border border-r-1 border-black p-2'>Created At</th>
                            <th className='border border-r-1 border-black p-2'>Updated At</th>
                        </thead>
                        <tbody>
                            {(communities && communities.length > 0) && (
                                communities.map(c => (
                                    <>
                                        <tr key={c.id} className='border border-r-1 border-black'>
                                            <td className='border boder-r-1 border-black p-2'>{c.name}</td>
                                            <td className={`border boder-r-1 border-black p-2 ${c.about == null && "text-red-500"}`}>{c.about == null ? "NULL" : c.about}</td>
                                            <td className='border boder-r-1 border-black p-2'>{c.createdat}</td>
                                            <td className={`border boder-r-1 border-black p-2 ${c.updatedat == null && "text-red-500"}`}>{c.updatedat == null ? "NULL" : c.updatedat}</td>
                                        </tr>
                                    </>
                                ))
                            )}
                        </tbody>
                    </table>
                ) : (
                    <h1>Fetching Communities...</h1>
                )}

                <h1 className='font-bold text-2xl'>Posts</h1>
                {(posts && posts.length > 0) ? (

                    <table className='text-start'>
                        <thead className='border border-black'>
                            <th className='border border-r-1 border-black p-2'>Title</th>
                            <th className='border border-r-1 border-black p-2'>Content</th>
                            <th className='border border-r-1 border-black p-2'>Author Username</th>
                            <th className='border border-r-1 border-black p-2'>Community</th>
                            <th className='border border-r-1 border-black p-2'>Upvotes</th>
                            <th className='border border-r-1 border-black p-2'>Downvotes</th>
                            <th className='border border-r-1 border-black p-2'>Created At</th>
                            <th className='border border-r-1 border-black p-2'>Updated At</th>
                        </thead>
                        <tbody>
                            {(posts && posts.length > 0) && (
                                posts.map(p => (
                                    <>
                                        <tr key={p.id} className='border border-r-1 border-black'>
                                            <td className='border boder-r-1 border-black p-2'>{p.title}</td>
                                            {/* <td className={`border boder-r-1 border-black p-2 ${c.cont== null && "text-red-500"}`}>{c.about == null ? "NULL" : c.about}</td> */}
                                            <td className='border boder-r-1 border-black p-2'>{p.content}</td>
                                            <td className='border boder-r-1 border-black p-2'>{p.author.username}</td>
                                            <td className='border boder-r-1 border-black p-2'>{p.community.name}</td>
                                            <td className='border boder-r-1 border-black p-2'>{p.votes.filter(v => v.vote == "upvote").length}</td>
                                            <td className='border boder-r-1 border-black p-2'>{p.votes.filter(v => v.vote == "downvote").length}</td>
                                            <td className='border boder-r-1 border-black p-2'>{p.createdat}</td>
                                            <td className={`border boder-r-1 border-black p-2 ${p.updatedat == null && "text-red-500"}`}>{p.updatedat == null ? "NULL" : p.updatedat}</td>
                                        </tr>
                                    </>
                                ))
                            )}
                        </tbody>
                    </table>
                ) : (
                    <h1>Fetching posts...</h1>
                )}

            </div>
        </div>
    )
}

export default AdminDashboard;