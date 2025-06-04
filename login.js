document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const role = document.getElementById('login-role').value;
  const errorMsg = document.getElementById('login-error');

  fetch('users.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load user data');
      }
      return response.json();
    })
    .then(users => {
      const user = users.find(
        u => u.username === username && u.password === password && u.role === role
      );

      if (user) {
        errorMsg.style.color = "#75520b";
        errorMsg.textContent = "Login successful! Redirecting...";
        setTimeout(() => {
          if (role === "student") {
            window.location.href = "student.html";
          } else if (role === "admin") {
            window.location.href = "admin.html";
          } else if (role === "faculty") {
            window.location.href = "faculty.html";
          } else {
            window.location.href = "index.html";
          }
        }, 500);
      } else {
        errorMsg.style.color = "#a52a2a";
        errorMsg.textContent = "Invalid credentials or role.";
      }
    })
    .catch(error => {
      errorMsg.style.color = "#a52a2a";
      errorMsg.textContent = "Error loading user data.";
      console.error(error);
    });
});