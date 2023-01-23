const USERINFO = "https://localhost:7201/UserInfo/";
const USERADDRESS = "https://localhost:7201/UserAddress/";

IsLoggedIn();

function IsLoggedIn() {
  let userId = sessionStorage.getItem("userId");
  let role = sessionStorage.getItem("role");
  if (role == "blocked") window.location.href = "userInfo.html";
  if (userId == null || userId == undefined) {
    window.location.href = "index.html";
  } else {
    GetData();
    GetAddress();
  }
}

function GetData() {
  fetch(USERINFO + "id?id=" + sessionStorage.getItem("userId"))
    .then((Response) => Response.json())
    .then((info) => {
      FillData(info);
    });
}

function GetAddress() {
  fetch(USERADDRESS + "id?id=" + sessionStorage.getItem("userId"))
    .then((Response) => Response.json())
    .then((address) => {
      FillAddress(address);
    });
}

function FillData(info) {
  document.getElementById("name-to-update").value = info.name;
  document.getElementById("surname-to-update").value = info.surname;
  document.getElementById("personalid-to-update").value = info.personalId;
  document.getElementById("phoneno-to-update").value = info.phoneNo;
  document.getElementById("email-to-update").value = info.email;
  document.getElementById("avatar").src = "../img/cat.jpg";
}

function FillAddress(address) {
  document.getElementById("town-to-update").value = address.town;
  document.getElementById("house-to-update").value = address.houseNo;
  document.getElementById("flat-to-update").value = address.flatNo;
  document.getElementById("street-to-update").value = address.street;
}

function ValidateString(name, value) {
  if (!/^[a-z]+$/i.test(document.getElementById(value).value)) {
    document.getElementById("error-msg").innerText = `${name} is not valid.`;
    document.getElementById(value).style.border = "3px solid red";
  } else {
    document.getElementById("error-msg").innerText = ``;
    document.getElementById(value).style.border = "1px solid green";
    UpdateInfo(name, value);
  }
}

function ValidateAvatar(name, value) {
  let avatar = document.getElementById(value).files[0];
  if (avatar == null || avatar == undefined) {
    document.getElementById("error-msg").innerText = `Select your image.`;
    document.getElementById(value).style.border = "3px solid red";
  } else {
    document.getElementById("error-msg").innerText = ``;
    document.getElementById(value).style.border = "1px solid green";
    UpdateAvatar();
  }
}

function ValidateNumbers(name, value) {
  if (!/^[0-9]+$/.test(document.getElementById(value).value)) {
    document.getElementById("error-msg").innerText = `${name} is not valid.`;
    document.getElementById(value).style.border = "3px solid red";
  } else {
    document.getElementById("error-msg").innerText = ``;
    document.getElementById(value).style.border = "1px solid green";
    UpdateInfo(name, value);
  }
}

function ValidatePhoneNo(name, value) {
  if (!/^[+]+[0-9]+$/.test(document.getElementById(value).value)) {
    document.getElementById("error-msg").innerText = `${name} is not valid.`;
    document.getElementById(value).style.border = "3px solid red";
  } else {
    document.getElementById("error-msg").innerText = ``;
    document.getElementById(value).style.border = "1px solid green";
    UpdateInfo(name, value);
  }
}

function ValidateEmail(name, value) {
  if (
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      document.getElementById(value).value
    )
  ) {
    document.getElementById("error-msg").innerText = `${name} is not valid.`;
    document.getElementById(value).style.border = "3px solid red";
  } else {
    document.getElementById("error-msg").innerText = ``;
    document.getElementById(value).style.border = "1px solid green";
    UpdateInfo(name, value);
  }
}

function UpdateInfo(name, value) {
  let endpoint =
    USERINFO +
    name +
    "?id=" +
    sessionStorage.getItem("userId") +
    "&value=" +
    document.getElementById(value).value;
  fetch(endpoint, {
    method: "PUT",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
}

function ValidateAddress(name, value) {
  if (!/^[0-9a-z- .]+$/i.test(document.getElementById(value).value)) {
    document.getElementById("error-msg").innerText = `${name} is not valid.`;
    document.getElementById(value).style.border = "3px solid red";
  } else {
    document.getElementById("error-msg").innerText = ``;
    document.getElementById(value).style.border = "1px solid green";
    UpdateAddress(name, value);
  }
}

function UpdateAddress(name, value) {
  let endpoint =
    USERADDRESS +
    name +
    "?id=" +
    sessionStorage.getItem("userId") +
    "&value=" +
    document.getElementById(value).value;
  fetch(endpoint, {
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
