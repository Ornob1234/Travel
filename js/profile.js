const Login = document.getElementById('login');
const Logout = document.getElementById('logoutBtn');


document.addEventListener('DOMContentLoaded', async () => {
  const bookingList = document.getElementById('booking-list');
  const greeting = document.getElementById('greeting');



  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return;


 
  Logout.classList.remove('hidden');
  Login.classList.add('hidden');
  
  document.getElementById('pic').classList.remove('hidden');
  document.getElementById('booking').classList.remove('hidden');
  document.getElementById('header').classList.remove('hidden');
  document.getElementById('header-out').classList.add('hidden');


  greeting.textContent = `Welcome, ${user.name}!`;



  document.getElementById('profile-pic').src = `/uploads/${user.image}`;
  // Load bookings
  async function loadBookings() {
    bookingList.innerHTML = '';
    try {
      const res = await fetch(`/api/bookings/user/${user._id}`);
      
      const bookings = await res.json();
      if (bookings.length === 0) {
        bookingList.innerHTML = `<p class="text-gray-600">You have no bookings yet.</p>`;
        return;
      }

      bookings.forEach(booking => {
        const card = document.createElement('div');
        card.className = "bg-white dark:bg-gray-800 border shadow p-5 rounded-xl";

        card.innerHTML = `
          <h3 class="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-2">${booking.tourId.name}</h3>

          <p class="text-sm text-gray-600 dark:text-gray-300">📅 Date: ${new Date(booking.travelDate).toLocaleDateString()}</p>
          <p class="text-sm text-gray-600 dark:text-gray-300">👥 Guests: ${booking.guests}</p>
          <p class="text-sm text-gray-600 dark:text-gray-300">💰 Total: $${booking.guests * booking.tourId.price}</p>
          <button data-id="${booking._id}" class="mt-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded cancel-booking">Cancel Booking</button>
        `;
        bookingList.appendChild(card);
      });

      // Attach cancel handlers
      document.querySelectorAll('.cancel-booking').forEach(button => {
        button.addEventListener('click', async () => {
          const confirmCancel = confirm("Are you sure you want to cancel this booking?");
          if (!confirmCancel) return;

          const id = button.getAttribute('data-id');
          try {
            const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to cancel');
            alert('Booking canceled.');
            loadBookings();
          } catch (err) {
            alert('Error canceling booking');
            console.error(err);
          }
        });
      });

    } catch (err) {
      console.error(err);
      bookingList.innerHTML = `<p class="text-red-500">No Bookings.</p>`;
    }
  }

  await loadBookings();
});





document.getElementById('logoutBtn').addEventListener('click', () => {
  const confirmLogout = confirm("Are you sure you want to log out?");
  if (confirmLogout) {
    localStorage.removeItem('user');
    window.location.href = 'auth.html';
    Logout.addEventListener('click', () => {
    Login.classList.remove('hidden');
    Logout.classList.add('hidden');
    document.getElementById('pic').classList.add('hidden');
    document.getElementById('booking').classList.add('hidden');
    document.getElementById('header').classList.add('hidden');
    document.getElementById('header-out').classList.remove('hidden');
  });
  }

});