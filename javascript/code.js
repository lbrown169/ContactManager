const firstNameField = document.getElementById("firstName");
const lastNameField = document.getElementById("lastName");

document.getElementById("loginButton").addEventListener("click", async function() {
    
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPass").value.trim();

    if (!username) {
        clearError("login");
        showLoginError("Username required to login");
        return;
    }
    if(!password){
        clearError("login");
        showLoginError("Password required to login");
        return;
    }

    clearError("login");
    await login(username, password);
});

async function login(username, password) {
    try {
        const response = await fetch("http://cop4331.tech/LAMPAPI/Login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ login: username, password: password })
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Login successful:", data);
            window.location.href = "contacts.html";
        } else if (response.status === 401) {
            showLoginError("Incorrect credentials. Change username or password.");
        } else {
            showLoginError("Unknown Error");
        }
    } catch (error) {
        showLoginError("Unknown Error");
        console.error("Error during login:", error);
    }
}

document.getElementById("regButton").addEventListener("click", async function () {
    
    const firstName = firstNameField.value.trim();
    const lastName = lastNameField.value.trim();
    const username = document.getElementById("registerUser").value.trim();
    const password = document.getElementById("registerPass").value.trim();

    clearError("reg");
    if (!firstName) {
        showRegistrationError("First name is required.");
        return;
    }

    if (!lastName) {
        showRegistrationError("Last name is required.");
        return;
    }

    if (!username) {
        showRegistrationError("Username is required.");
        return;
    }

    if (!checkPasswordInput(password)) {
        showRegistrationError("Password contents invalid, must be at least 8 characters, include lowercase letter, uppercase letter, number, and special character");
        return;
    }

    await register(username, password, firstName, lastName);
    document.getElementById('registerDiv').style.display='none';
});

async function register(username, password, firstName, lastName) {
    try {
        const response = await fetch("http://cop4331.tech/LAMPAPI/Register.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ login: username, password: password, firstName: firstName, lastName: lastName })
        });

        if (response.status === 201) {
            console.log("Registration successful!");
            window.location.href = "contacts.html";
        } else if (response.status === 409) {
            showRegistrationError("Username already exists.");
        } else if (response.status === 400) {
            showRegistrationError("Bad request");
        } else {
            showRegistrationError("Unknown error");
        }
    } catch (error) {
        showRegistrationError("Unknown error");
        console.error("Error during registration:", error);
    }
}


function toggleFields() {
    clearInputs();

    if (isLoginMode) {
        firstNameField.classList.add("hidden");
        lastNameField.classList.add("hidden");
    } else {
        firstNameField.classList.remove("hidden");
        lastNameField.classList.remove("hidden");
    }
}

function clearInputs() {
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("loginUsername").value = "";
    document.getElementById("loginPass").value = "";
}

function checkPasswordInput(password) {
    if (typeof password !== "string") {
        return false;
    }

    let passwordLength = false;
    let hasUpperCase = false;
    let hasLowerCase = false;
    let hasNumber = false;
    let hasSpecialCharacter = false;

    if (password.length >= 8){
        passwordLength = true;
    }

    for (let i = 0; i < password.length; i++) {
        const char = password[i];
        if (char >= "A" && char <= "Z") {
            hasUpperCase = true;
        } else if (char >= "a" && char <= "z") {
            hasLowerCase = true;
        } else if (char >= "0" && char <= "9") {
            hasNumber = true;
        } else if ("!@#$%^&*(),.?\":{}|<>_".includes(char)) {
            hasSpecialCharacter = true;
        }

        if (hasUpperCase && hasLowerCase && hasNumber && hasSpecialCharacter) {
            break;
        }
    }

    if(passwordLength == true && hasUpperCase == true && hasLowerCase == true && hasNumber == true && hasSpecialCharacter == true){
        return true;
    }
    if(passwordLength == false){
        console.log("Password length must be atleast 8 letters");
    }
    if(hasUpperCase == false){
        console.log("Password must contain atleast 1 upper case letter");
    }
    if(hasLowerCase == false){
        console.log("Password must contain atleast 1 lower case letter");
    }
    if(hasNumber == false){
        console.log("Password must contain atleast 1 number");
    }
    if(hasSpecialCharacter == false){
        console.log("Password must contain atleast 1 special character");
    }
    return false;
}

function displayError(type, message) {
    var errorDiv = (type === "login") ? document.getElementById("loginErrorFeed") : document.getElementById("regErrorFeed");
    errorDiv.style.display = 'block';
    errorDiv.textContent = message;
}

function clearError(type) {
    var errorDiv = (type === "login") ? document.getElementById("loginErrorFeed") : document.getElementById("regErrorFeed");
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
}

function showLoginError(message) {
    displayError("login", message);
}

function showRegistrationError(message) {
    displayError("registration", message);
}
