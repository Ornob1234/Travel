// js/auth.js
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const showLoginBtn = document.getElementById('showLogin');
  const showSignupBtn = document.getElementById('showSignup');

  // Toggle forms
  showLoginBtn.addEventListener('click', () => {
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
  });

  showSignupBtn.addEventListener('click', () => {
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  });

  // ✅ Handle Signup with Image Upload
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(signupForm);

    try {
      const res = await fetch('/api/users/signup', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Signup failed');
      }

      alert('Signup successful. Please log in.');
      showLoginBtn.click();
    } catch (err) {
      alert('Something went wrong. Try again.\n' + err.message);
    }
  });

  // ✅ Handle Login
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      const user = data.user;

      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect based on role
      if (user.role === 'admin') {
        window.location.href = 'admin-dashboard.html';
      } else {
        window.location.href = 'profile.html';
      }
    } catch (err) {
      console.error('Login Error:', err);
      alert('Something went wrong. Try again.\n' + err.message);
    }
  });
});
