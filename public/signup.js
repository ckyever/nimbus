const usernameInput = document.getElementById("username");
const usernameInfo = document.getElementById("username-info");
const passwordInput = document.getElementById("password");
const passwordConfirmationInput = document.getElementById("confirm-password");
const passwordConfirmationInfo = document.getElementById(
  "confirm-password-info"
);

const validatePasswords = (password, passwordConfirmation) => {
  if (passwordConfirmation.length === 0) {
    passwordConfirmationInfo.innerText = "";
  } else {
    if (passwordConfirmation === password) {
      passwordConfirmationInfo.innerText = "Passwords match";
      passwordConfirmationInfo.className = "valid-message";
      passwordConfirmationInput.setCustomValidity("");
    } else {
      passwordConfirmationInfo.innerText = "Passwords are not matching";
      passwordConfirmationInfo.className = "invalid-message";
      passwordConfirmationInput.setCustomValidity("Passwords must match");
    }
  }
};

usernameInput.addEventListener("input", async (event) => {
  const username = event.target.value;

  if (username.length > 0) {
    const response = await fetch(`/username/${event.target.value}`);
    data = await response.json();
    if (data.success) {
      usernameInfo.textContent = "Username is not available";
      usernameInfo.className = "invalid-message";
      usernameInput.setCustomValidity("Username must be available");
    } else {
      usernameInfo.textContent = "Username is available";
      usernameInfo.className = "valid-message";
      usernameInput.setCustomValidity("");
    }
  } else {
    usernameInfo.textContent = "";
  }
});

passwordInput.addEventListener("input", () => {
  passwordConfirmationInput.value = "";
  passwordConfirmationInfo.textContent = "";
});

passwordConfirmationInput.addEventListener("input", (event) => {
  validatePasswords(passwordInput.value, event.target.value);
});
