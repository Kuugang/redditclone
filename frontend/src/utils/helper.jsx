export async function getPosts(page) {
    const response = await fetch(`http://localhost:6969/api/post/read.php?page=${page}`);
    const JSONData = await response.json();
    return JSONData.data.posts;
}