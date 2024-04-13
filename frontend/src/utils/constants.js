export const BACKEND_URL =
    process.env.REACT_APP_NODE_ENV === "production" ? process.env.REACT_APP_SERVER_PRODUCTION_URL : "http://localhost:6969/api";


async function handleCreateCommunity(e) {
    e.preventDefault();
    try {
        setIsLoading(true);
        let inputs = new FormData();
        inputs.append("name", e.target.name.value);
        inputs.append("visibility", e.target.visibility.value);
        let response = await fetch(
            "http://localhost:6969/api/community/create.php",
            {
                method: "POST",
                body: inputs,
                credentials: "include",
            }
        );
        if (response.status = !200) throw new Error("error");
        setIsLoading(false);
        toast.success("Successfully created Community")
    } catch (e) {
        toast(e.getMessage());
    }
}