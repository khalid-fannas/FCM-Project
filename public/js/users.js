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
  container.style.top = "20px";
  container.style.right = "20px";
  container.style.zIndex = "9999";
  document.body.appendChild(container);
  return container;
}

// Fetch and Render Users
async function fetchAndRenderUsers() {
  try {
    const res = await api.get("/user/all");
    const users = res.data;

    if (!Array.isArray(users)) throw new Error("Invalid users response");

    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      // Fetch employee data for each user
      const employeeRes = await api.get(`/employee/${user.employee_id}`);
      const employeeData = employeeRes.data;
      const employeeName = `${employeeData.first_name} ${employeeData.last_name}`;

      const tr = document.createElement("tr");
      tr.className = "border-b";

      tr.innerHTML = `
        <td class="py-3 px-4">${i + 1}</td>
        <td class="py-3 px-4">${user.work_email}</td>
        <td class="py-3 px-4 capitalize">${user.role}</td>
        <td class="py-3 px-4">${employeeName}</td>
        <td class="py-3 px-4">
          <button onclick="openEditModal(${user.id}, '${user.work_email}', '${
        user.role
      }', '${employeeName}')" class="text-blue-500 hover:underline mr-2">Edit</button>
          <button onclick="openDeleteModal('${user.work_email}', ${
        user.id
      })" class="text-red-500 hover:underline">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    }
  } catch (error) {
    console.error("Error fetching users or employees:", error);
    showToast("Error fetching users.", "error");
  }
}

// User Form Logic
async function openUserForm() {
  document.getElementById("userFormModal").classList.remove("hidden");

  const select = document.getElementById("employeeSelect");
  select.innerHTML = "<option value=''>Loading...</option>";

  try {
    const res = await api.get("/employee/all");
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

// Edit & Delete Logic
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
