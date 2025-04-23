document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signupForm");

  if (signupForm) {
      signupForm.addEventListener("submit", async function (e) {
          e.preventDefault();

          const name = document.getElementById("name").value;
          const username = document.getElementById("username").value;
          const email = document.getElementById("email").value;
          const password = document.getElementById("password").value;
          const confirmPassword = document.getElementById("confirmPassword").value;

          if (password !== confirmPassword) {
              alert("Passwords do not match. Please try again.");
              return;
          }

          const userData = {
              name: name,
              username: username,
              email: email,
              password: password
          };

          try {
            //   const response = await fetch("http://localhost:8080/api/auth/signup", {
              const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json"
                  },
                  body: JSON.stringify(userData)
              });

              const result = await response.text();

              if (response.ok) {
                  alert("User registered successfully");
                  window.location.href = "signin.html"; // Redirect to login page after successful signup
              } else {
                  alert(result); // Show error message from API
              }
          } catch (error) {
              alert("An error occurred while signing up. Please try again later.");
              console.error("Signup error:", error);
          }
      });
  }
});
