export async function getPosts(page) {
    const response = await fetch(`http://localhost:6969/posts?page=${page}`);
    const JSONData = await response.json();
    return JSONData.data.posts;
}

export function timeAgo(date) {
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