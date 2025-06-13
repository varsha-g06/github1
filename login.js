document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const role = document.getElementById('login-role').value;
  const errorMsg = document.getElementById('login-error');

  axios.post('http://localhost:4000/api/login',
    { username, password, role }, // ✅ Body only
    { headers: { 'Content-Type': 'application/json' } } // ✅ Headers only
  )
    .then(res => {
      const data = res.data;
      if (data.token) { 
        errorMsg.style.color = "#75520b";
        errorMsg.textContent = "Login successful! Redirecting...";

        localStorage.setItem('authToken', data.token);

        setTimeout(() => {
          if (role === "student") window.location.href = "student.html";
          else if (role === "faculty") window.location.href = "faculty.html";
          else if (role === "admin") window.location.href = "admin.html";
        }, 1000);
      } else {
        errorMsg.style.color = "#a52a2a";
        errorMsg.textContent = data.error || "Login failed";
      }
    })
    .catch(err => {
      console.error(err);
      errorMsg.style.color = "#a52a2a";
      errorMsg.textContent = "Invalid credentials or role";
    });
});
