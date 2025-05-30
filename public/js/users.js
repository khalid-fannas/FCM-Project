function showToast(message, type = "info") {
  const toastContainer =
    document.getElementById("toastContainer") || createToastContainer();
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;

  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("fade-out");
    toast.addEventListener("transitionend", () => toast.remove());
  }, 3000);
}

function createToastContainer() {
  const container = document.createElement("div");
  container.id = "toastContainer";
  container.style.position = "fixed";
  container.style.bottom = "20px";
  container.style.right = "20px";
  container.style.zIndex = "9999";
  document.body.appendChild(container);
  return container;
}

// Fetch and Render as Cards
async function fetchAndRenderUsers() {
  try {
    const res = await api.get("/user/all");
    const users = res.data;
    if (!Array.isArray(users)) throw new Error("Invalid users response");

    const container = document.getElementById("userCardContainer");
    container.innerHTML = "";

    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      const employeeRes = await api.get(`/employee/${user.employee_id}`);
      const employeeData = employeeRes.data;
      const employeeName = `${employeeData.first_name} ${employeeData.last_name}`;

      const card = document.createElement("div");
      card.className = `
      w-full bg-white dark:bg-gray-800 
      text-gray-800 dark:text-gray-200 
      rounded-lg shadow-md 
      flex flex-col justify-between border border-gray-200 dark:border-gray-700 
      hover:shadow-lg transition-shadow
    `;

      card.innerHTML = `
      <div class="flex flex-col items-center text-sm md:text-base">
        <div class="w-full flex items-center justify-between p-4 border-b border-gray-400">
          <div class="flex items-center">
            <h2 class="text-lg font-extrabold text-gray-500 dark:text-gray-400">
              <span class="text-sky-600 dark:text-sky-400">${employeeName}</span>
            </h2>
          </div>
          <div class="flex flex-col gap-4">
            <div class="flex w-full items-center gap-4 justify-between">
              <button 
                class="editBtn" 
                onclick="openEditModal(${user.id}, '${user.work_email}', '${user.role}', '${employeeName}')">
                <i class="fas fa-edit mr-2"></i>Edit
              </button>
              <button 
                class="deleteBtn" 
                onclick="openDeleteModal('${user.work_email}', ${user.id})">
                <i class="fas fa-trash-alt mr-2"></i>Delete
              </button>
            </div>
          </div>
        </div>
    
        <div class="flex justify-between items-center w-full p-4">
            <p><span class="font-semibold text-gray-600 font-bold dark:text-gray-300">Email:</span> 
              <span class="italic text-gray-400 font-semibold dark:text-gray-500">${user.work_email}</span>
            </p>
    
            <p><span class="font-semibold text-gray-600 font-bold dark:text-gray-300">Phone Number:</span> 
              <span class="italic text-gray-400 font-semibold dark:text-gray-500 capitalize">${employeeData.phone_number}</span>
            </p>
    
            <p><span class="font-semibold text-gray-600 font-bold dark:text-gray-300">Postions:</span> 
              <span class="italic text-gray-400 font-semibold dark:text-gray-500 capitalize">${employeeData.position_name}</span>
            </p>
    
            <p><span class="font-semibold text-gray-600 font-bold dark:text-gray-300">Role:</span> 
              <span class="italic text-gray-400 font-semibold dark:text-gray-500 capitalize">${user.role}</span>
            </p>

            <p><span class="font-semibold text-gray-600 font-bold dark:text-gray-300">Address:</span> 
              <span class="italic text-gray-400 font-semibold dark:text-gray-500 capitalize">${employeeData.address}</span>
            </p>
        </div>
      </div>
    `;

      container.appendChild(card);
    }
  } catch (error) {
    console.error("Error fetching users or employees:", error);
    showToast("Error fetching users.", "error");
  }
}

// User Form Modal
async function openUserForm() {
  document.getElementById("userFormModal").classList.remove("hidden");

  const select = document.getElementById("employeeSelect");
  select.innerHTML = "<option value=''>Loading...</option>";

  try {
    const res = await api.get("/employee/allActive");
    const employees = res.data;

    select.innerHTML = "";
    employees.forEach((emp) => {
      const option = document.createElement("option");
      option.value = emp.id;
      option.textContent = `${emp.first_name} ${emp.last_name}`;
      option.dataset.email = emp.email;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading employees:", err);
    showToast("Failed to load employees.", "error");
    select.innerHTML = "<option value=''>Failed to load employees</option>";
  }
}

function closeUserForm() {
  document.getElementById("userFormModal").classList.add("hidden");
  document.getElementById("userForm").reset();
}

document
  .getElementById("userForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const select = document.getElementById("employeeSelect");
    const employeeId = select.value;
    const newWorkEmail = document.getElementById("workEmail").value;
    const role = document.getElementById("roleSelect").value;

    if (!employeeId || !newWorkEmail || !role) {
      showToast("Please fill all fields.", "error");
      return;
    }

    try {
      const res = await api.post("/user/create", {
        employee_id: employeeId,
        work_email: newWorkEmail,
        role: role,
      });

      showToast(res.data.message || "User created successfully!", "success");
      closeUserForm();
      fetchAndRenderUsers();
    } catch (err) {
      console.error("Error creating user:", err);
      showToast(err.response?.data?.error || "Error creating user.", "error");
    }
  });

// Edit & Delete
document.addEventListener("DOMContentLoaded", () => {
  fetchAndRenderUsers();
  document
    .getElementById("confirmDeleteBtn")
    .addEventListener("click", handleDeleteConfirm);
});

function openEditModal(id, email, role, employee) {
  document.getElementById("editIndex").value = id;
  document.getElementById("editEmail").value = email;
  document.getElementById("editRole").value = role;
  document.getElementById("editEmployee").value = employee;
  document.getElementById("editModal").classList.remove("hidden");
}

function openDeleteModal(email, id) {
  document.getElementById("deleteIndex").innerText = email;
  const confirmBtn = document.getElementById("confirmDeleteBtn");
  confirmBtn.dataset.id = id;
  document.getElementById("deleteModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("editModal").classList.add("hidden");
  document.getElementById("deleteModal").classList.add("hidden");
}

function handleEditSubmit(e) {
  e.preventDefault();
  const id = document.getElementById("editIndex").value;
  const work_email = document.getElementById("editEmail").value;
  const role = document.getElementById("editRole").value;

  api
    .patch(`/user/update/${id}`, { work_email, role })
    .then((res) => {
      showToast(res.data.message || "User updated successfully!", "success");
      closeModal();
      fetchAndRenderUsers();
    })
    .catch((err) => {
      console.error("Update failed:", err);
      showToast(err.response?.data?.error || "Error updating user.", "error");
    });
}

function handleDeleteConfirm() {
  const confirmBtn = document.getElementById("confirmDeleteBtn");
  const id = confirmBtn.dataset.id;

  api
    .delete(`/user/delete/${id}`)
    .then((res) => {
      showToast(res.data.message || "User deleted successfully!", "success");
      closeModal();
      fetchAndRenderUsers();
    })
    .catch((err) => {
      console.error(err);
      showToast(err.response?.data?.error || "Error deleting user.", "error");
    });
}
