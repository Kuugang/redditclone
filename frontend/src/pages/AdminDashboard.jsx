import React, { useContext, useEffect, useState } from "react";

export default function AdminDashBoard() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const getPosts = async () => {
      let response = await fetch("http://localhost:6969/api/post/read.php");
      let responseJSON = await response.json();
      console.log(responseJSON.data.posts);
      setPosts(responseJSON.data.posts);
    };
    getPosts();
  }, []);

  return (
    <>
      <h1>Admin Dashboard</h1>
      <table className="m-10">
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>Created At</th>
            <th>Updated at</th>
          </tr>
        </thead>
        <tbody className="p-12 m-10">
          {(posts &&
            posts.length > 0) &&
            posts.map((p) => (
              <>
                <tr key = {p.id}>
                <td className="border px-4 py-2 border-black">{p.title}</td>
                <td className="border px-4 py-2 border-black text-sm p-10">{p.content}</td>
                <td className="border px-4 py-2 border-black">{p.createdat}</td>
                <td className="border px-4 py-2 border-black">{p.updatedat}</td>
                </tr>
              </>
            ))}
        </tbody>
      </table>
    </>
  );
}
