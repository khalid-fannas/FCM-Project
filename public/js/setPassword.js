const form = document.getElementById("newPasswordForm");
const messageBox = document.getElementById("messageBox");
const messageText = document.getElementById("messageText");
const messageIcon = document.getElementById("messageIcon");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const password = document.getElementById("password").value.trim();
  const confirmPassword = document
    .getElementById("confirmPassword")
    .value.trim();

  messageBox.classList.add("hidden");

  if (password !== confirmPassword) {
    showMessage("Passwords do not match.", "error");
    return;
  }

  if (password.length < 8) {
    showMessage("Password must be at least 8 characters long.", "error");
    return;
  }

  api
    .post("/auth/setPassword", {
      newPassword: password,
      confirmPassword,
    })
    .then((response) => {
      if (response.data.redirect) {
        window.location.href = response.data.redirect;
      } else {
        showMessage("Your password has been updated successfully.", "success");
      }
    })
    .catch((error) => {
      let msg = "Something went wrong. Please try again.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        msg = error.response.data.message;
      }
      showMessage(msg, "error");
    });
});

function showMessage(text, type) {
  messageText.textContent = text;
  messageBox.classList.remove("hidden");

  if (type === "success") {
    messageBox.classList.remove(
      "border-red-400",
      "text-red-700",
      "bg-red-100/30"
    );
    messageBox.classList.add(
      "border-green-400",
      "text-green-700",
      "bg-green-100/30"
    );

    messageIcon.classList.remove("text-red-600");
    messageIcon.classList.add("text-green-600");

    messageIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          `;
  } else {
    messageBox.classList.remove(
      "border-green-400",
      "text-green-700",
      "bg-green-100/30"
    );
    messageBox.classList.add("border-red-400", "text-red-700", "bg-red-100/30");

    messageIcon.classList.remove("text-green-600");
    messageIcon.classList.add("text-red-600");

    messageIcon.innerHTML = `
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12" y2="16"></line>
          `;
  }
}
