export async function getPosts() {
    const response = await fetch("http://localhost:6969/api/post/read.php?page=1");
    const posts = await response.json();
    return posts.posts;
}