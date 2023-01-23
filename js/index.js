const USERS = "https://localhost:7201/";

IsLoggedIn();

function IsLoggedIn() {
  let userId = sessionStorage.getItem("userId");
  if (userId != null && userId != undefined) {
    window.location.href = "userInfo.html";
  }
}

function Login() {
  fetch(
    USERS +
      "User?username=" +
      document.getElementById("login").value +
      "&password=" +
      document.getElementById("password").value
  )
    .then((Response) => Response.json())
    .then((user) => {
      CheckUser(user);
    });
}

function CheckUser(user) {
  if (user.status == 404) {
    document.getElementById("error-msg").innerText = "Bad login or password";
  } else {
    sessionStorage.setItem("username", user.username);
    sessionStorage.setItem("userId", user.id);
    sessionStorage.setItem("role", user.role);
    window.location.href = "userInfo.html";
  }
}
