const firstNameField = document.getElementById("firstName");
const lastNameField = document.getElementById("lastName");

document.getElementById("loginButton").addEventListener("click", async function() {
    
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPass").value.trim();

    if (!username || !password) {
        console.error("Username and password are required.");
        return;
    }

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
            console.error("Login failed: Incorrect credentials.");
        } else {
            console.error("Login failed: Unknown error.");
        }
    } catch (error) {
        console.error("Error during login:", error);
    }
}

document.getElementById("regButton").addEventListener("click", async function () {
    
    const firstName = firstNameField.value.trim();
    const lastName = lastNameField.value.trim();
    const username = document.getElementById("registerUser").value.trim();
    const password = document.getElementById("registerPass").value.trim();

    if (!firstName) {
        console.log("First name is required.");
        return;
    }

    if (!lastName) {
        console.log("Last name is required.");
        return;
    }

    if (!username) {
        console.log("Username is required.");
        return;
    }

    if (!checkPasswordInput(password)) {
        console.log("Password validation failed.");
        return;
    }

    console.log("Attempting registration...");
    await register(username, password, firstName, lastName);
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
            console.error("Registration failed: Username already exists.");
            alert("This username is already taken. Please choose another one.");
        } else if (response.status === 400) {
            console.error("Registration failed: Bad request.");
            alert("Please fill in all fields correctly.");
        } else {
            console.error("Registration failed: Unknown error.");
            alert("An unexpected error occurred. Please try again.");
        }
    } catch (error) {
        console.error("Error during registration:", error);
        alert("Network error. Please check your connection and try again.");
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
