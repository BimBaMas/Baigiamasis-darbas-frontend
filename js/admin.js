const USERS = "https://localhost:7201/User";

IsLoggedIn();

function IsLoggedIn() {
  let userId = sessionStorage.getItem("userId");
  let role = sessionStorage.getItem("role");
  if (role != "admin") window.location.href = "userInfo.html";
  if (userId == null || userId == undefined) {
    window.location.href = "index.html";
  } else {
    GetUsers();
  }
}

GetUsers();

function GetUsers(id) {
  fetch(USERS + "/all")
    .then((Response) => Response.json())
    .then((users) => {
      DrawTable(users, id);
    });
}

function DrawTable(users, id) {
  let table = document.getElementById("users");
  let adminid = sessionStorage.getItem("userId");
  table.innerHTML =
    "<thead><tr><td>Id</td><td>Username</td><td>Role</td><td>Delete</td></tr></thead><tbody></tbody>";
  let tbody = table.getElementsByTagName("tbody")[0];
  users.forEach((user) => {
    if (user.id != id && user.id != adminid) {
      let tr = document.createElement("TR");
      let td1 = document.createElement("TD");
      td1.innerText = user.id;
      let td2 = document.createElement("TD");
      td2.innerText = user.username;
      let td3 = document.createElement("TD");
      td3.innerHTML = `<select id="drop${user.id}" onchange="UpdateRole(${
        user.id
      })"><option value="${user.role}" selected disabled hidden>${
        user.role.charAt(0).toUpperCase() + user.role.slice(1)
      }</option><option value="user">User</option><option value="admin">Admin</option><option value="blocked">Blocked</option></select>`;
      let td4 = document.createElement("TD");
      td4.innerHTML = `<input type="button" value="DELETE" class="menu-btn" onclick="DeleteUser(${user.id})" />`;
      tr.append(td1, td2, td3, td4);
      tbody.appendChild(tr);
    }
  });
}

function DeleteUser(id) {
  fetch(USERS + "/?id=" + id, {
    method: "DELETE",
  })
    .then((Response) => Response.json())
    .then(GetUsers(id));
}
function UpdateRole(id) {
  value = document.getElementById(`drop${id}`).value;
  fetch(USERS + "/Role?id=" + id + "&value=" + value, {
    method: "PUT",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
}

function LogOut() {
  sessionStorage.clear();
  IsLoggedIn();
}
