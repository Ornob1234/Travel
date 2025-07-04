// public/js/admin-users.js

document.addEventListener('DOMContentLoaded', async () => {
  const admin = JSON.parse(localStorage.getItem('admin'));
  if (!admin || admin.role !== 'admin') {
    window.location.href = 'admin.html';
    return;
  }

  const userTableBody = document.getElementById('userTableBody');

  async function loadUsers() {
    try {
      const res = await fetch('/api/users');
      const users = await res.json();

      userTableBody.innerHTML = '';

      users.forEach(user => {
        const tr = document.createElement('tr');
        tr.className = 'border-b';

        tr.innerHTML = `
          <td class="p-3">
            <img src="/uploads/${user.image}" class="h-10 w-10 rounded-full" />
          </td>
          <td class="p-3">${user.name}</td>
          <td class="p-3">${user.email}</td>
          <td class="p-3">
            <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded delete-user" data-id="${user._id}">Delete</button>
          </td>
        `;

        userTableBody.appendChild(tr);
      });

      document.querySelectorAll('.delete-user').forEach(button => {
        button.addEventListener('click', async () => {
          const id = button.getAttribute('data-id');
          const confirmDelete = confirm("Are you sure you want to delete this user?");
          if (!confirmDelete) return;

          try {
            const res = await fetch(`/api/users/${id}`, {
              method: 'DELETE'
            });

            if (res.ok) {
              alert('User deleted');
              loadUsers();
            } else {
              alert('Failed to delete user');
            }
          } catch (err) {
            console.error(err);
            alert('Error deleting user');
          }
        });
      });

    } catch (err) {
      console.error('Failed to load users', err);
      userTableBody.innerHTML = `<tr><td colspan="4" class="text-center text-red-500 p-4">Error loading users.</td></tr>`;
    }
  }

  loadUsers();
});
