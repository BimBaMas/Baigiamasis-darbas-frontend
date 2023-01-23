const USER = "https://localhost:7201/User";
const USERINFO = "https://localhost:7201/UserInfo/";
const USERADDRESS = "https://localhost:7201/UserAddress/";

function Register() {
  result = ValidateFields();
}

function DrawBorder(id, color) {
  let border = 0;
  color == "red" ? (border = 3) : (border = 1);
  document.getElementById(id).style.border = `${border}px solid ${color}`;
}
function CheckUserName() {
  let user = document.getElementById("username-to-register").value;
  fetch(USER + "/user?username=" + user)
    .then((Response) => Response.json())
    .then((user) => {
      if (user.status != 404) {
        document.getElementById(
          "error-msg"
        ).innerText += `Username "${user.username}" already exists!\n`;
        DrawBorder("username-to-register", "red");
        return false;
      } else {
        DrawBorder("username-to-register", "green");
        return true;
      }
    });
}

function SetImage() {
  const preview = document.getElementById("avatar");
  const file = document.getElementById("avatar-to-register").files[0];
  const reader = new FileReader();
  reader.addEventListener(
    "load",
    () => {
      preview.src = reader.result;
      console.log(preview.src);
    },
    false
  );
  if (file) {
    reader.readAsDataURL(file);
  }
}

function ValidateFields() {
  let result = true;
  let error = document.getElementById("error-msg");
  error.innerText = "";

  let user = document.getElementById("username-to-register").value;
  fetch(USER + "/user?username=" + user)
    .then((Response) => Response.json())
    .then((user) => {
      if (user.status != 404) {
        error.innerText += `Username "${user.username}" already exists!\n`;
        DrawBorder("username-to-register", "red");
        result = false;
      } else {
        DrawBorder("username-to-register", "green");
      }

      let pass1 = document.getElementById("password-to-register-1").value;
      let pass2 = document.getElementById("password-to-register-2").value;
      if (pass1 != pass2) {
        result = false;
        DrawBorder("password-to-register-1", "red");
        DrawBorder("password-to-register-2", "red");
        error.innerText += "Passwords does not mach!\n";
      } else {
        DrawBorder("password-to-register-1", "green");
        DrawBorder("password-to-register-2", "green");
      }
      let avatar = document.getElementById("avatar-to-register").files[0];
      if (avatar == null || avatar == undefined) {
        result = false;
        error.innerText += "Select your picture!\n";
        DrawBorder("avatar-to-register", "red");
      } else {
        DrawBorder("avatar-to-register", "green");
      }
      let name = document.getElementById("name-to-register").value;
      if (!/^[a-z]+$/i.test(name)) {
        result = false;
        error.innerText += "Use only letters for name!\n";
        DrawBorder("name-to-register", "red");
      } else {
        DrawBorder("name-to-register", "green");
      }

      let surname = document.getElementById("surname-to-register").value;
      if (!/^[a-z]+$/i.test(surname)) {
        result = false;
        error.innerText += "Use only letters for surname!\n";
        DrawBorder("surname-to-register", "red");
      } else {
        DrawBorder("surname-to-register", "green");
      }
      let personalid = document.getElementById("personalid-to-register").value;
      if (!/^[0-9]+$/.test(personalid)) {
        result = false;
        error.innerText += "Use only numbers for personal ID!\n";
        DrawBorder("personalid-to-register", "red");
      } else {
        DrawBorder("personalid-to-register", "green");
      }
      let phoneno = document.getElementById("phoneno-to-register").value;
      console.log(phoneno);
      if (!/^[+]+[0-9]+$/.test(phoneno)) {
        result = false;
        error.innerText += "Use only numbers for phoneno!\n";
        DrawBorder("phoneno-to-register", "red");
      } else {
        DrawBorder("phoneno-to-register", "green");
      }
      let email = document.getElementById("email-to-register").value;
      if (
        !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          email
        )
      ) {
        result = false;
        error.innerText += "Email addres is not valid!\n";
        DrawBorder("email-to-register", "red");
      } else {
        DrawBorder("email-to-register", "green");
      }
      let town = document.getElementById("town-to-register").value;
      if (!/^[a-z- .]+$/i.test(town)) {
        result = false;
        error.innerText += "Town name is not valid!\n";
        DrawBorder("town-to-register", "red");
      } else {
        DrawBorder("town-to-register", "green");
      }
      let street = document.getElementById("street-to-register").value;
      if (!/^[a-z0-9- .]+$/i.test(street)) {
        result = false;
        error.innerText += "Street name is not valid!\n";
        DrawBorder("street-to-register", "red");
      } else {
        DrawBorder("street-to-register", "green");
      }
      let house = document.getElementById("house-to-register").value;
      if (!/^[a-z0-9- ]+$/i.test(house)) {
        result = false;
        error.innerText += "House number is not valid!\n";
        DrawBorder("house-to-register", "red");
      } else {
        DrawBorder("house-to-register", "green");
      }
      let flat = document.getElementById("flat-to-register").value;
      if (!/^[a-z0-9- ]+$/i.test(flat) && flat != "") {
        result = false;
        error.innerText += "Flat number is not valid!\n";
        DrawBorder("flat-to-register", "red");
      } else {
        DrawBorder("flat-to-register", "green");
      }
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
      AddUserInfo(user.id);
      AddUserAddress(user.id);
      document.getElementById("main-container").style.display = "none";
      document.getElementById("message").style.display = "flex";
    });
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

function AddUserInfo(id) {
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
  });
}

function AddUserAddress(id) {
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
  });
}
