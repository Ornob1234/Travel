document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("signupForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const user = {
      name,
      email,
      password, // In production, you'd hash this
      role: "user",
    };

    // Save user to localStorage (mocking DB)
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const emailExists = users.find((u) => u.email === email);

    if (emailExists) {
      alert("Email already registered.");
      return;
    }

    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup successful! Redirecting to login...");
    window.location.href = "auth.html";
  });
});
