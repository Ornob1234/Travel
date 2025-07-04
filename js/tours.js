document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('toursContainer');

  try {
    const res = await fetch('/api/tours');
    const tours = await res.json();

    container.innerHTML = tours.map(tour => `
      <div class="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden">
        <img src="${tour.image}" alt="${tour.name}" 
             class="w-full h-50 object-cover"/>

        

      <div class="bg-grey backdrop-blur-md p-4 rounded shadow hover:shadow-lg transition">
        <h2 class="text-xl font-bold text-blue-600">${tour.name}</h2>
        <p class="text-gray-700 mb-2">${tour.description.substring(0, 100)}...</p>
        
        <p class="text-sm text-gray-600 mb-4">Price: $${tour.price}</p>
        <a href="tour-details.html?id=${tour._id}" class="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
          View Details
        </a>
      </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Failed to load tours', err);
    container.innerHTML = `<p class="text-center text-red-500">Failed to load tours.</p>`;
  }
});


document.getElementById('logoutBtn').addEventListener('click', () => {
  const confirmLogout = confirm("Are you sure you want to log out?");
  if (confirmLogout) {
    localStorage.removeItem('user');
    window.location.href = 'auth.html';
    Logout.addEventListener('click', () => {
    Login.classList.remove('hidden');
    Logout.classList.add('hidden');
  });
  }

});

const Login = document.getElementById('login');
const Logout = document.getElementById('logoutBtn');


document.addEventListener('DOMContentLoaded', async () => {

  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return;

  Logout.classList.remove('hidden');
  Login.classList.add('hidden');
});