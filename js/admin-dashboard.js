document.addEventListener('DOMContentLoaded', async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || user.role !== 'admin') {
    alert('Access denied. Admins only.');
    window.location.href = 'auth.html';
    return;
  }

  const userContainer = document.getElementById('user-list');
  const userCount = document.getElementById('userCount');
  const searchInput = document.getElementById('searchInput');
  const prevPageBtn = document.getElementById('prevPage');
  const nextPageBtn = document.getElementById('nextPage');
  const bookingContainer = document.getElementById('booking-list');

  let users = [];
  let currentPage = 1;
  const pageSize = 6;

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      users = await res.json();
      renderUsers();
    } catch (err) {
      console.error(err);
      userContainer.innerHTML = '<p class="text-red-500">Failed to load users.</p>';
    }
  };

  const renderUsers = () => {
    const search = searchInput.value.toLowerCase();
    const filtered = users.filter(u =>
      u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search)
    );

    const totalPages = Math.ceil(filtered.length / pageSize);
    currentPage = Math.min(currentPage, totalPages || 1);
    const start = (currentPage - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    userContainer.innerHTML = '';
    userCount.textContent = `Total users: ${filtered.length} | Page ${currentPage} of ${totalPages || 1}`;

    paginated.forEach(u => {
      const card = document.createElement('div');
      card.className = 'bg-white p-4 rounded shadow';
      card.innerHTML = `
        <img src="/uploads/${u.image}" alt="Profile" class="h-20 w-20 rounded-full mx-auto mb-2 object-cover">
        <h3 class="text-center font-semibold">${u.name}</h3>
        <p class="text-center text-sm text-gray-500">${u.email}</p>
        <p class="text-center text-xs text-gray-400">Role: ${u.role || 'user'}</p>
        <button data-id="${u._id}" class="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded delete-user hover:bg-red-700">Delete</button>
      `;
      userContainer.appendChild(card);
    });

    document.querySelectorAll('.delete-user').forEach(button => {
      button.addEventListener('click', async () => {
        const id = button.getAttribute('data-id');
        const confirmDelete = confirm('Are you sure you want to delete this user?');
        if (!confirmDelete) return;

        try {
          const delRes = await fetch(`/api/users/${id}`, { method: 'DELETE' });
          if (!delRes.ok) throw new Error('Delete failed');
          alert('User deleted');
          await fetchUsers();
        } catch (err) {
          console.error(err);
          alert('Error deleting user');
        }
      });
    });

    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
  };

  searchInput.addEventListener('input', () => {
    currentPage = 1;
    renderUsers();
  });

  prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderUsers();
    }
  });

  nextPageBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(users.filter(u =>
      u.name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      u.email.toLowerCase().includes(searchInput.value.toLowerCase())
    ).length / pageSize);
    if (currentPage < totalPages) {
      currentPage++;
      renderUsers();
    }
  });

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      const bookings = await res.json();

      // Separate pending and confirmed bookings
      const pending = bookings.filter(b => b.status !== 'confirmed');
      const confirmed = bookings.filter(b => b.status === 'confirmed');

      bookingContainer.innerHTML = `
      
        <h2 class="text-xl font-semibold content-center mb-4">Pending Bookings</h2>
        <div id="pending-bookings" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"></div>
        <h2 class="text-xl font-semibold mb-4">Confirmed Bookings</h2>
        <div id="confirmed-bookings" class="grid grid-cols-1 md:grid-cols-2 gap-6"></div>
        
      `;

      const pendingContainer = document.getElementById('pending-bookings');
      const confirmedContainer = document.getElementById('confirmed-bookings');

pending.forEach(b => {
  const card = document.createElement('div');
  card.className = 'bg-white p-4 rounded shadow';
  card.innerHTML = `
    <h3 class="font-bold">${b.tour?.name || 'Unknown Tour'}</h3>
    <p>User: ${b.user?.name || 'Unknown User'}</p>
    <p>Email: ${b.user?.email || 'N/A'}</p>
    <p>Status: <span class="font-medium">${b.status}</span></p>
    <div class="mt-4 flex gap-2">
      <button data-id="${b._id}" class="confirm-booking bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Confirm</button>
      <button data-id="${b._id}" class="cancel-booking bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Cancel</button>
    </div>
  `;
  pendingContainer.appendChild(card);
});

confirmed.forEach(b => {
  const card = document.createElement('div');
  card.className = 'bg-white p-4 rounded shadow border border-green-300';
  card.innerHTML = `
    <h3 class="font-bold">${b.tour?.name || 'Unknown Tour'}</h3>
    <p>User: ${b.user?.name || 'Unknown User'}</p>
    <p>Email: ${b.user?.email || 'N/A'}</p>
    <p>Status: <span class="font-medium text-green-600">${b.status}</span></p>
  `;
  confirmedContainer.appendChild(card);
});


      document.querySelectorAll('.confirm-booking').forEach(button => {
        button.addEventListener('click', async () => {
          const id = button.getAttribute('data-id');
          try {
            const res = await fetch(`/api/bookings/${id}/confirm`, { method: 'PATCH' });
            if (!res.ok) throw new Error('Failed to confirm');
            alert('Booking confirmed');
            fetchBookings();
          } catch (err) {
            alert('Error confirming booking');
            console.error(err);
          }
        });
      });

      document.querySelectorAll('.cancel-booking').forEach(button => {
        button.addEventListener('click', async () => {
          const id = button.getAttribute('data-id');
          try {
            const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to cancel');
            alert('Booking cancelled');
            fetchBookings();
          } catch (err) {
            alert('Error cancelling booking');
            console.error(err);
          }
        });
      });

    } catch (err) {
      console.error(err);
      bookingContainer.innerHTML = '<p class="text-red-500">Failed to load bookings.</p>';
    }
  };

  await fetchUsers();
  await fetchBookings();

  
});


// TOUR MANAGEMENT
const tourList = document.getElementById('tour-list');
const tourModal = document.getElementById('tourModal');
const addTourBtn = document.getElementById('addTourBtn');
const cancelTourBtn = document.getElementById('cancelTour');

const tourNameInput = document.getElementById('tourName');
const tourPriceInput = document.getElementById('tourPrice');
const tourDescInput = document.getElementById('tourDescription');
const imageInput = document.getElementById('tourImage');
const modalTitle = document.getElementById('modalTitle');
const form = document.getElementById('addTourForm');

let editingTourId = null;

// Open Modal
const openTourModal = (tour = null) => {
  tourModal.classList.remove('hidden');
  if (tour) {
    modalTitle.textContent = 'Edit Tour';
    editingTourId = tour._id;
    tourNameInput.value = tour.name;
    tourPriceInput.value = tour.price;
    tourDescInput.value = tour.description;
  } else {
    modalTitle.textContent = 'Add Tour';
    editingTourId = null;
    tourNameInput.value = '';
    tourPriceInput.value = '';
    tourDescInput.value = '';
    imageInput.value = '';
  }
};

// Close Modal
const closeTourModal = () => {
  tourModal.classList.add('hidden');
  editingTourId = null;
};

// Submit Tour Form (Add/Edit)
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('name', tourNameInput.value);
  formData.append('price', tourPriceInput.value);
  formData.append('description', tourDescInput.value);
  formData.append('image', imageInput.files[0]);
  formData.append('location', 'N/A'); // Optional
  formData.append('duration', 'N/A'); // Optional

  try {
    const url = editingTourId
      ? `/api/tours/${editingTourId}`
      : `/api/tours`;

    const method = editingTourId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      body: formData,
    });

    if (!res.ok) throw new Error('Failed to save tour');
    closeTourModal();
    await fetchTours();
  } catch (err) {
    alert('Error saving tour');
    console.error(err);
  }
});

// Fetch All Tours
const fetchTours = async () => {
  try {
    const res = await fetch('/api/tours');
    const tours = await res.json();

    tourList.innerHTML = '';
    tours.forEach(t => {
      const card = document.createElement('div');
      card.className = 'bg-white p-4 rounded shadow';
      card.innerHTML = `
        <h3 class="font-bold text-lg">${t.name}</h3>
        <p>Price: $${t.price}</p>
        <p class="text-sm text-gray-600">${t.description}</p>
        ${t.image ? `<img src="http://localhost:2000${t.image}" class="mt-2 rounded w-full h-50 object-cover">` : ''}
        <div class="flex gap-2 mt-4">
          <button data-id="${t._id}" class="edit-tour bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Edit</button>
          <button data-id="${t._id}" class="delete-tour bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
        </div>
      `;
      tourList.appendChild(card);
    });

    // Attach event listeners
    document.querySelectorAll('.edit-tour').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const tour = tours.find(t => t._id === id);
        openTourModal(tour);
      });
    });

    document.querySelectorAll('.delete-tour').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (!confirm('Are you sure you want to delete this tour?')) return;
        try {
          const res = await fetch(`/api/tours/${id}`, { method: 'DELETE' });
          if (!res.ok) throw new Error('Delete failed');
          await fetchTours();
        } catch (err) {
          alert('Error deleting tour');
          console.error(err);
        }
      });
    });

  } catch (err) {
    console.error(err);
    tourList.innerHTML = '<p class="text-red-500">Failed to load tours.</p>';
  }
};

// Dummy user/booking placeholders
const fetchUsers = async () => console.log('fetchUsers placeholder');
const fetchBookings = async () => console.log('fetchBookings placeholder');

// Init
addTourBtn.addEventListener('click', () => openTourModal());
cancelTourBtn.addEventListener('click', closeTourModal);

(async () => {
  await fetchUsers();
  await fetchBookings();
  await fetchTours();
})();
