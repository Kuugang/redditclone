document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let username = document.getElementById("loginUsername").value;
    let password = document.getElementById("loginPassword").value;

    let data = new FormData();
    data.append("username", username);
    data.append("password", password);

    fetch("http://localhost:6969/api/user/login.php", {
        method: "POST",
        body: data,
        credentials: "same-origin"
    }).then(async (response) => {
        response = await response.json();
        document.cookie = "PHPSESSID=" + response.sessionID + "; path=/; domain=localhost";
        window.location.href = "dashboard.html";
        console.log(response);
    }).catch((error) => {
        console.error('Error:', error);
    });
});


document.getElementById("test").addEventListener("click", function () {
    fetch("http://localhost:6969/api/user/read.php", {
        method: "GET",
        credentials: "include",
    }).then(async (response) => {
        response = await response.json();
        console.log(response);
    }).catch((error) => {
        console.error('Error:', error);
    });
})


document.getElementById("logout").addEventListener("click", function () {
    fetch("http://localhost:6969/api/user/logout.php", {
        method: "GET",
        credentials: "include",
    }).then(async (response) => {
        response = await response.json();
        console.log(response)
    }).catch((error) => {
        console.log("Error", error);
    })
})