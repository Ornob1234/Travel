// js/admin.js
document.addEventListener("DOMContentLoaded", () => {
  const openModalBtn = document.getElementById("openAddModal");
  const modal = document.getElementById("addTourModal");
  const cancelBtn = document.getElementById("cancelAddTour");
  const addForm = document.getElementById("addTourForm");
  const tourTableBody = document.getElementById("tourTableBody");

  let tours = [
    { destination: "Bali, Indonesia", duration: "7 Days", price: 799 },
    { destination: "Tokyo, Japan", duration: "5 Days", price: 999 }
  ];

  const renderTours = () => {
    tourTableBody.innerHTML = "";
    tours.forEach((tour, index) => {
      const row = document.createElement("tr");
      row.classList.add("border-t");
      row.innerHTML = `
        <td class="py-3 px-4">${index + 1}</td>
        <td class="py-3 px-4">${tour.destination}</td>
        <td class="py-3 px-4">${tour.duration}</td>
        <td class="py-3 px-4">$${tour.price}</td>
        <td class="py-3 px-4">
          <button class="text-blue-600 hover:underline mr-2">Edit</button>
          <button onclick="deleteTour(${index})" class="text-red-600 hover:underline">Delete</button>
        </td>
      `;
      tourTableBody.appendChild(row);
    });
  };

  openModalBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    addForm.reset();
  });

  addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const destination = document.getElementById("destination").value;
    const duration = document.getElementById("duration").value;
    const price = document.getElementById("price").value;

    tours.push({ destination, duration, price: parseFloat(price) });
    renderTours();
    addForm.reset();
    modal.classList.add("hidden");
  });

  // Initial render
  renderTours();
});

function deleteTour(index) {
  const confirmed = confirm("Are you sure you want to delete this tour?");
  if (confirmed) {
    tours.splice(index, 1);
    document.dispatchEvent(new Event("DOMContentLoaded")); // re-render
  }
}
