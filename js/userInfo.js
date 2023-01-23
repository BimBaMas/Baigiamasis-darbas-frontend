const USERINFO = "https://localhost:7201/UserInfo/";
const USERADDRESS = "https://localhost:7201/UserAddress/";

IsLoggedIn();

function IsLoggedIn() {
  let userId = sessionStorage.getItem("userId");
  let role = sessionStorage.getItem("role");
  if (role == "blocked")
    document.getElementById("info-msg").innerText =
      "YOUR ACCOUNT WAS BLOCKED BY SITE ADMIN!!!";
  if (userId == null || userId == undefined) {
    window.location.href = "index.html";
  } else {
    GetData();
  }
}

function GetData() {
  fetch(USERINFO + "id?id=" + sessionStorage.getItem("userId"))
    .then((Response) => Response.json())
    .then((info) => {
      if (info.status == 404) {
        sessionStorage.setItem("step", "2");
        window.location.href = "register.html";
      } else {
        FillData(info);
        GetAddress();
      }
    });
}

function GetAddress() {
  fetch(USERADDRESS + "id?id=" + sessionStorage.getItem("userId"))
    .then((Response) => Response.json())
    .then((address) => {
      if (address.status == 404) {
        sessionStorage.setItem("step", "3");
        window.location.href = "register.html";
      }
      FillAddress(address);
    });
}

function FillData(info) {
  document.getElementById("name").innerText = info.name;
  document.getElementById("surName").innerText = info.surname;
  document.getElementById("personalId").innerText = info.personalId;
  document.getElementById("phoneNo").innerText = info.phoneNo;
  document.getElementById("email").innerText = info.email;
  let avatar = `data:image/jpeg;base64,${info.avatar}`;
  document.getElementById("avatar").src = avatar;
}

function FillAddress(address) {
  let address_string = "";
  address_string += address.street + " ";
  address_string += address.houseNo;
  let flatNo = address.flatNo;
  if (flatNo != null && flatNo != undefined && flatNo != "")
    address_string += " - " + flatNo;
  address_string += ", " + address.town;
  document.getElementById("address").innerText = address_string;
}

function LogOut() {
  sessionStorage.clear();
  IsLoggedIn();
}
