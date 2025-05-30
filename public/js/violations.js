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

let isEditMode = false;

function openEditModal(button) {
  isEditMode = true;

  const row = button.closest(".violation-row");
  const id = row.dataset.id;
  const title = row.dataset.title;
  const description = row.dataset.description;
  const type = row.dataset.type;

  document.getElementById("violationIdInput").value = id;
  document.getElementById("violation_title").value = title;
  document.getElementById("violation_description").value = description;
  document.getElementById("violation_type").value = type;

  document.getElementById("saveViolationBtn").innerText = "Update Violation";
  document.getElementById("ViolationModal").classList.remove("hidden");
}

function openAddModal() {
  isEditMode = false;

  document.getElementById("violationIdInput").value = "";
  document.getElementById("violation_title").value = "";
  document.getElementById("violation_description").value = "";
  document.getElementById("violation_type").value = "";
  document.getElementById("saveViolationBtn").innerText = "Add Violation";
  document.getElementById("ViolationModal").classList.remove("hidden");
}

async function saveViolation(event) {
  event.preventDefault();

  const id = document.getElementById("violationIdInput").value;
  const title = document.getElementById("violation_title").value;
  const description = document.getElementById("violation_description").value;
  const type = document.getElementById("violation_type").value;
  const created_by = 4;
  const data = { title, description, type, created_by };

  try {
    if (isEditMode && id) {
      const res = await api.patch(`violation/update/${id}`, data);
      showToast(
        res.data.message || "Violation updated successfully!",
        "success"
      );
    } else {
      const res = await api.post("violation/create", data);
      showToast(res.data.message || "Violation added successfully!", "success");
    }
    closeModal();

    // Delay the reload to show the toast
    setTimeout(() => {
      location.reload();
    }, 750); // 1.5 seconds delay
  } catch (error) {
    console.error("Save failed:", error);
    showToast(
      error.response?.data?.error || "Error saving violation.",
      "error"
    );
  }
}

function closeModal() {
  document.getElementById("ViolationModal").classList.add("hidden");
}

document
  .getElementById("violationForm")
  .addEventListener("submit", saveViolation);

let deleteId = null;
function openDeleteModal(button) {
  const row = button.closest(".violation-row");
  deleteId = row.dataset.id;
  document.getElementById("deleteViolationModal").classList.remove("hidden");
}

function closeDeleteModal() {
  document.getElementById("deleteViolationModal").classList.add("hidden");
  deleteId = null;
}

async function confirmDelete() {
  if (!deleteId) return;
  try {
    const response = await api.delete(`violation/delete/${deleteId}`);
    showToast(
      response.data.message || "Violation deleted successfully!",
      "success"
    );

    const row = document.querySelector(`.violation-row[data-id="${deleteId}"]`);
    if (row) row.remove();

    const tableBody = document.getElementById("violationsTableBody");
    if (tableBody.children.length === 0) {
      document.getElementById("noViolationsMessage").classList.remove("hidden");
      document.getElementById("listOfViolations").classList.add("hidden");
    }

    closeDeleteModal();

    // Delay the reload to show the toast
    setTimeout(() => {
      location.reload();
    }, 750); // 1.5 seconds delay
  } catch (error) {
    console.error("Failed to delete violation:", error);
    showToast(
      error.response?.data?.error || "Error deleting violation.",
      "error"
    );
    closeDeleteModal();
  }
}
