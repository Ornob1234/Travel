


const user = JSON.parse(localStorage.getItem('user'));
if (!user) {
  alert("Please log in first.");
  window.location.href = "auth.html";
}

document.addEventListener('DOMContentLoaded', async () => {
  const tourInfo = document.getElementById('tourInfo');
  const bookingForm = document.getElementById('bookingForm');

  const urlParams = new URLSearchParams(window.location.search);
  const tourId = urlParams.get('id');

  

  // Fetch and render tour info
  try {
    const res = await fetch(`/api/tours/${tourId}`);
    const tour = await res.json();

 tourInfo.innerHTML = `
    <img src="${tour.image}" alt="${tour.name}" class="w-full h-full object-cover rounded-md mb-4 shadow">
      <h1 class="text-3xl font-bold text-blue-600">${tour.name}</h1>
      <p class="text-gray-700">${tour.description}</p>
      
      <p class="text-sm text-gray-600">Price: $${tour.price}</p>
    `;
  } catch (err) {
    tourInfo.innerHTML = `<p class="text-red-500">Unable to load tour details.</p>`;
    console.error(err);
  }

  // Handle booking
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(bookingForm);
    const travelDate = formData.get('travelDate');
    const guests = formData.get('guests');

    if (new Date(travelDate) < new Date()) {
  alert("Please select a valid future date.");
  return;
}
if (parseInt(guests) <= 0) {
  alert("Number of guests must be at least 1.");
  return;
}


    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user._id,
          tourId,
          travelDate,
          guests
        })
      });

      if (!res.ok) throw new Error('Booking failed');

      alert('Booking successful!');
      window.location.href = 'profile.html';
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    }
  });
});


