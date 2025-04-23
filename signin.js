document.addEventListener("DOMContentLoaded", function () {
  const signinForm = document.getElementById("signinForm");

  if (signinForm) {
      signinForm.addEventListener("submit", async function (e) {
          e.preventDefault();

          const username = document.getElementById("username").value;
          const password = document.getElementById("password").value;

          const loginData = {
              username: username,
              password: password
          };

          try {
            //   const response = await fetch("http://localhost:8080/api/auth/login", {
              const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json"
                  },
                  body: JSON.stringify(loginData)
              });

              if (response.ok) {
                  const token = await response.text(); // API returns JWT token as text
                  alert("Login successful!");

                  // Store token in localStorage for future requests
                  localStorage.setItem("jwtToken", token);

                  // Redirect to the dashboard or home page
                  window.location.href = "home.html";
              } else {
                  alert("Invalid username or password. Please try again.");
              }
          } catch (error) {
              alert("An error occurred while signing in. Please try again later.");
              console.error("Sign-in error:", error);
          }
      });
  }
});
