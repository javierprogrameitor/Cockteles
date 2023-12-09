//Reused code from the registration task
let inputUser = document.getElementById("user");
let inputPass = document.getElementById("password");
let submitButton = document.getElementById("button");
let form = document.getElementById("loginForm");
let access = document.getElementById("access");


let nameValid = false;
let passwordValid = false;
let regexName = /^[a-zA-Z ]+$/;
let regexPassword = /^[a-zA-Z0-9]{6,}$/;

const USERNAME_INVALID = "Name with only letters and spaces";
const PASSWORD_INVALID = "Password must be at least 6 characters long";
const ACCESSREGISTER = "Thank you for registering. You can access";   
const ACCESSLOGIN = "You have identified yourself correctly. You can access";

inputUser.addEventListener("blur", validName);
inputPass.addEventListener("blur", validPassword);

function check() {
  if (nameValid && passwordValid) {
    submitButton.classList.remove("notAvailable");
  } else {
    submitButton.classList = "notAvailable";
  }
}
function validName() {
  nameValid = regexName.test(inputUser.value);
  inputUser.className = nameValid ? "success" : "error";

  if (!nameValid) {
    inputUser.parentNode.getElementsByTagName("small")[0].innerHTML = USERNAME_INVALID;
  } else {
    inputUser.parentNode.getElementsByTagName("small")[0].innerHTML = "";
  }
  check();
}
function validPassword() {
  passwordValid = regexPassword.test(inputPass.value);
  inputPass.className = passwordValid ? "success" : "error";
  if (!passwordValid) {
    inputPass.parentNode.getElementsByTagName("small")[0].innerHTML =  PASSWORD_INVALID;
  } else {
    inputPass.parentNode.getElementsByTagName("small")[0].innerHTML = "";
  }
  check();
}

form.addEventListener("submit", event => {
  event.preventDefault();

  if (nameValid && passwordValid) {
    // Access the Indexeddb database and check if the user exists
    checkIfUserExists(inputUser.value, inputPass.value);
  }
});
function checkIfUserExists(username, password) {
  const request = indexedDB.open("registro", 1);
  request.onupgradeneeded = event => {
    const db = event.target.result;
    db.createObjectStore("usuarios", { keyPath: 'username' });
  };
  request.onsuccess = event => {
    const db = event.target.result;
    //Start a transaction and obtain the object store
    const transaction = db.transaction(['usuarios'], "readonly");
    const store = transaction.objectStore("usuarios");
    //Check if the user exists
    const requestGet = store.get(username);
    requestGet.onsuccess = () => {
      const existingUser = requestGet.result;
      if (existingUser) {
        access.parentNode.getElementsByTagName("small")[0].innerHTML = ACCESSLOGIN;
      access.classList.remove("notAvailable");
      } else {
        access.parentNode.getElementsByTagName("small")[0].innerHTML = ACCESSREGISTER;
        // Insert the user into the database
        access.classList.remove("notAvailable");
        saveUserToIndexedDB(username, password);
      }
    };
    //Close the database
    transaction.oncomplete = () => {
      db.close();
    };
  };
}
function saveUserToIndexedDB(username, password) {
  const request = indexedDB.open("registro", 1);

  request.onupgradeneeded = event => {
    const db = event.target.result;
    db.createObjectStore("usuarios", { keyPath: 'username' });
  };
  request.onsuccess = event => {
    const db = event.target.result;
    //start a transaction and obtain the object store
    const transaction = db.transaction(["usuarios"], "readwrite");
    const store = transaction.objectStore("usuarios");
    // Add the user to the database
    store.add({ username: username, password: password });
    // Close the database
    transaction.oncomplete = () => {
      db.close();
    };
  };
}
access.addEventListener("click", () => {
    window.location.href = "html/cocktel.html";
})
