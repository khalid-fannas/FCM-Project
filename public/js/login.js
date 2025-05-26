const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  errorMessage.classList.add("hidden");

  api
    .post("/auth/login", { email, password }) // Removed /api from path because api.js already has baseURL: "/api"
    .then(function (response) {
      if (response.data.redirect) {
        window.location.href = response.data.redirect;
      } else {
        window.location.href = "/dashboard";
      }
    })
    .catch(function (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorText.textContent = error.response.data.message;
      } else {
        errorText.textContent = "Something went wrong. Please try again.";
      }
      errorMessage.classList.remove("hidden");
    });
});
