const USER = "https://localhost:7201/User";
const USERINFO = "https://localhost:7201/UserInfo/";
const USERADDRESS = "https://localhost:7201/UserAddress/";

let result;
let error = document.getElementById("error-msg");
CheckSteps();

function CheckSteps() {
  let step = sessionStorage.getItem("step");
  if (
    step == null ||
    step == undefined ||
    (step != "2" && step != "3" && step != "4")
  ) {
    document.getElementById("user-info-container-1").style.display = "flex";
    document.getElementById("user-info-container-2").style.display = "none";
    document.getElementById("user-info-container-3").style.display = "none";
  }
  if (step == "2") {
    document.getElementById("header-message").innerText =
      "CONTINUE REGISTRATION\nENTER YOUR INFO";
    document.getElementById("user-info-container-1").style.display = "none";
    document.getElementById("user-info-container-2").style.display = "flex";
    document.getElementById("user-info-container-3").style.display = "none";
  }
  if (step == "3") {
    document.getElementById("header-message").innerText =
      "CONTINUE REGISTRATION\nENTER YOUR ADDRESS";
    document.getElementById("user-info-container-1").style.display = "none";
    document.getElementById("user-info-container-2").style.display = "none";
    document.getElementById("user-info-container-3").style.display = "flex";
  }
  if (step == "4") {
    document.getElementById("header-message").style.display = "none";
    document.getElementById("user-info-container-1").style.display = "none";
    document.getElementById("user-info-container-2").style.display = "none";
    document.getElementById("user-info-container-3").style.display = "none";
    document.getElementById("main-container").style.display = "none";
    document.getElementById("message").style.display = "flex";
  }
}

function RegisterUser() {
  result = true;
  error = document.getElementById("error-msg");
  error.innerText = "";

  let user = document.getElementById("username-to-register").value;
  fetch(USER + "/user?username=" + user)
    .then((Response) => Response.json())
    .then((user) => {
      if (user.status != 404) {
        error.innerText += `Username "${user.username}" already exists!\n`;
        DrawBorder("username-to-register", "red");
        result = false;
      } else if (IsEmpty("username-to-register")) {
        error.innerText += `Enter your username!\n`;
        DrawBorder("username-to-register", "red");
        result = false;
      } else {
        DrawBorder("username-to-register", "green");
      }
      ValidatePassword();
      if (result) {
        AddUser();
      }
    });
}

function AddUser() {
  let user = document.getElementById("username-to-register").value;
  let pass = document.getElementById("password-to-register-2").value;
  fetch(USER, {
    method: "POST",
    body: JSON.stringify({
      username: user,
      password: pass,
      role: "user",
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((Response) => Response.json())
    .then((user) => {
      sessionStorage.setItem("username", user.username);
      sessionStorage.setItem("userId", user.id);
      sessionStorage.setItem("role", user.role);
      sessionStorage.setItem("step", "2");
      CheckSteps();
    });
}

function RegisterInfo() {
  result = true;
  ValidateName();
  ValidateSurname();
  ValidateAvatar();
  ValidateEmail();
  ValidatePersonalId();
  ValidatePhoneNo();

  if (result) {
    AddUserInfo();
  }
}

function AddUserInfo() {
  let id = sessionStorage.getItem("userId");
  let name = document.getElementById("name-to-register").value;
  let surname = document.getElementById("surname-to-register").value;
  let personalid = document.getElementById("personalid-to-register").value;
  let phoneno = document.getElementById("phoneno-to-register").value;
  let email = document.getElementById("email-to-register").value;
  let avatar = ToBase64();
  fetch(USERINFO, {
    method: "POST",
    body: JSON.stringify({
      userId: id,
      name: name,
      surname: surname,
      personalId: personalid,
      phoneNo: phoneno,
      email: email,
      avatar: avatar,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((Response) => Response.json())
    .then(() => {
      sessionStorage.setItem("step", "3");
      CheckSteps();
    });
}

function RegisterAddress() {
  result = true;
  ValidateTown();
  ValidateStreet();
  ValidateHouseNo();
  ValidateFlatNo();
  if (result) {
    AddUserAddress();
  }
}

function AddUserAddress() {
  let id = sessionStorage.getItem("userId");
  let town = document.getElementById("town-to-register").value;
  let street = document.getElementById("street-to-register").value;
  let house = document.getElementById("house-to-register").value;
  let flat = document.getElementById("flat-to-register").value;
  fetch(USERADDRESS, {
    method: "POST",
    body: JSON.stringify({
      userId: id,
      town: town,
      street: street,
      houseNo: house,
      flatNo: flat,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((Response) => Response.json())
    .then(() => {
      sessionStorage.setItem("step", "4");
      CheckSteps();
    });
}

function DrawBorder(id, color) {
  let border = 0;
  color == "red" ? (border = 3) : (border = 1);
  document.getElementById(id).style.border = `${border}px solid ${color}`;
}

function IsEmpty(id) {
  let str = document.getElementById(id).value;
  return !str || str.trim() === "";
}

function ValidatePassword() {
  let pass1 = document.getElementById("password-to-register-1").value;
  let pass2 = document.getElementById("password-to-register-2").value;
  if (pass1 != pass2) {
    result = false;
    DrawBorder("password-to-register-1", "red");
    DrawBorder("password-to-register-2", "red");
    error.innerText += "Passwords does not mach!\n";
  } else if (IsEmpty("password-to-register-1")) {
    result = false;
    DrawBorder("password-to-register-1", "red");
    error.innerText += "Enter your password!\n";
  } else {
    DrawBorder("password-to-register-1", "green");
    DrawBorder("password-to-register-2", "green");
  }
}

function ValidateAvatar() {
  let avatar = document.getElementById("avatar-to-register").files[0];
  if (avatar == null || avatar == undefined) {
    result = false;
    error.innerText += "Select your picture!\n";
    DrawBorder("avatar-to-register", "red");
  } else {
    DrawBorder("avatar-to-register", "green");
  }
}

function ValidateName() {
  let name = document.getElementById("name-to-register").value;
  if (!/^[a-z]+$/i.test(name)) {
    result = false;
    error.innerText += "Use only letters for name!\n";
    DrawBorder("name-to-register", "red");
  } else if (IsEmpty("name-to-register")) {
    result = false;
    DrawBorder("name-to-register", "red");
    error.innerText += "Enter your Name!\n";
  } else {
    DrawBorder("name-to-register", "green");
  }
}

function ValidateSurname() {
  let surname = document.getElementById("surname-to-register").value;
  if (!/^[a-z]+$/i.test(surname)) {
    result = false;
    error.innerText += "Use only letters for surname!\n";
    DrawBorder("surname-to-register", "red");
  } else if (IsEmpty("surname-to-register")) {
    result = false;
    DrawBorder("surname-to-register", "red");
    error.innerText += "Enter your surname!\n";
  } else {
    DrawBorder("surname-to-register", "green");
  }
}

function ValidatePersonalId() {
  let personalid = document.getElementById("personalid-to-register").value;
  if (!/^[0-9]+$/.test(personalid)) {
    result = false;
    error.innerText += "Use only numbers for personal ID!\n";
    DrawBorder("personalid-to-register", "red");
  } else if (IsEmpty("personalid-to-register")) {
    result = false;
    DrawBorder("personalid-to-register", "red");
    error.innerText += "Enter your personal id!\n";
  } else {
    DrawBorder("personalid-to-register", "green");
  }
}

function ValidatePhoneNo() {
  let phoneno = document.getElementById("phoneno-to-register").value;
  if (!/^[+]+[0-9]+$/.test(phoneno)) {
    result = false;
    error.innerText += "Use only numbers for phoneno!\n";
    DrawBorder("phoneno-to-register", "red");
  } else if (IsEmpty("phoneno-to-register")) {
    result = false;
    DrawBorder("phoneno-to-register", "red");
    error.innerText += "Enter your phone no!\n";
  } else {
    DrawBorder("phoneno-to-register", "green");
  }
}

function ValidateEmail() {
  let email = document.getElementById("email-to-register").value;
  if (
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email
    )
  ) {
    result = false;
    error.innerText += "Email addres is not valid!\n";
    DrawBorder("email-to-register", "red");
  } else if (IsEmpty("email-to-register")) {
    result = false;
    DrawBorder("email-to-register", "red");
    error.innerText += "Enter your email!\n";
  } else {
    DrawBorder("email-to-register", "green");
  }
}

function ValidateTown() {
  let town = document.getElementById("town-to-register").value;
  if (!/^[a-z- .]+$/i.test(town)) {
    result = false;
    error.innerText += "Town name is not valid!\n";
    DrawBorder("town-to-register", "red");
  } else if (IsEmpty("town-to-register")) {
    result = false;
    DrawBorder("town-to-register", "red");
    error.innerText += "Enter your town!\n";
  } else {
    DrawBorder("town-to-register", "green");
  }
}

function ValidateStreet() {
  let street = document.getElementById("street-to-register").value;
  if (!/^[a-z0-9- .]+$/i.test(street)) {
    result = false;
    error.innerText += "Street name is not valid!\n";
    DrawBorder("street-to-register", "red");
  } else if (IsEmpty("street-to-register")) {
    result = false;
    DrawBorder("street-to-register", "red");
    error.innerText += "Enter your street!\n";
  } else {
    DrawBorder("street-to-register", "green");
  }
}

function ValidateHouseNo() {
  let house = document.getElementById("house-to-register").value;
  if (!/^[a-z0-9- ]+$/i.test(house)) {
    result = false;
    error.innerText += "House number is not valid!\n";
    DrawBorder("house-to-register", "red");
  } else if (IsEmpty("house-to-register")) {
    result = false;
    DrawBorder("house-to-register", "red");
    error.innerText += "Enter your house no!\n";
  } else {
    DrawBorder("house-to-register", "green");
  }
}

function ValidateFlatNo() {
  let flat = document.getElementById("flat-to-register").value;
  if (!/^[a-z0-9- ]+$/i.test(flat) && flat != "") {
    result = false;
    error.innerText += "Flat number is not valid!\n";
    DrawBorder("flat-to-register", "red");
  } else if (IsEmpty("flat-to-register")) {
    result = false;
    DrawBorder("flat-to-register", "red");
    error.innerText += "Enter your flat no(for private house enter -)!\n";
  } else {
    DrawBorder("flat-to-register", "green");
  }
}

function ToBase64() {
  img = document.getElementById("avatar");
  var canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d");
  canvas.width = 200;
  canvas.height = 200;
  ctx.drawImage(img, 0, 0, 200, 200);
  return canvas
    .toDataURL("image/jpeg", 0.5)
    .replace("data:", "")
    .replace(/^.+,/, "");
}

function SetImage() {
  const preview = document.getElementById("avatar");
  const file = document.getElementById("avatar-to-register").files[0];
  const reader = new FileReader();
  reader.addEventListener(
    "load",
    () => {
      preview.src = reader.result;
    },
    false
  );
  if (file) {
    reader.readAsDataURL(file);
  }
}
