export const formatDate = (date: string) => {
    const inputDate = new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - inputDate.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
        return "a minute ago";
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minutes ago`;
    } else if (diffInHours === 1) {
        return "an hour ago";
    } else if (diffInHours < 24) {
        return `${diffInHours} hours ago`;
    } else if (diffInDays === 1) {
        return "Yesterday";
    } else {
        return inputDate.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }
};
