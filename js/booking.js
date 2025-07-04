// js/booking.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bookingForm');
  const status = document.getElementById('status');
  const tourIdField = document.getElementById('tourId');

  // Simulate setting tour ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const tourId = urlParams.get('tourId'); // e.g., booking.html?tourId=665f8a31d4a899da07ab6bcf
  tourIdField.value = tourId;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userData = localStorage.getItem('user');
    if (!userData) {
      alert('Please log in to book a tour.');
      return;
    }

    const user = JSON.parse(userData);
    const travelDate = document.getElementById('travelDate').value;
    const guests = parseInt(document.getElementById('guests').value);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          tourId,
          travelDate,
          guests
        })
      });

      const data = await res.json();
      if (res.ok) {
        status.textContent = 'Booking successful!';
        status.className = 'text-green-600 text-center mt-4';
        form.reset();
      } else {
        status.textContent = data.error || 'Something went wrong.';
        status.className = 'text-red-600 text-center mt-4';
      }
    } catch (err) {
      console.error('Booking error:', err);
      status.textContent = 'Server error. Try again later.';
      status.className = 'text-red-600 text-center mt-4';
    }
  });
});
