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

// ---------------------- البحث ----------------------

document.getElementById("searchInput").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const cards = document.querySelectorAll(".violation-card");
  let visibleCount = 0;

  cards.forEach((card) => {
    const name = card.getAttribute("data-name").toLowerCase();
    const email = card.getAttribute("data-email").toLowerCase();

    if (name.includes(query) || email.includes(query)) {
      card.style.display = "block";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  const noResultsMessage = document.getElementById("noResultsMessage");
  noResultsMessage.classList.toggle("hidden", visibleCount > 0);
});

// ---------------------- تحميل الموظفين والمخالفات ----------------------
async function loadViolationsNames(selectElement) {
  try {
    const response = await api.get("/violation/all");
    const violations = response.data;

    selectElement.innerHTML = "";
    violations.forEach((violation) => {
      const option = document.createElement("option");
      option.value = violation.id;
      option.textContent = `${violation.title}`;
      selectElement.appendChild(option);
    });

    return violations;
  } catch (error) {
    console.error("Failed to load violations:", error);
    return [];
  }
}

async function loadEmployees(selectElement) {
  try {
    const response = await api.get("/employee/allActive");
    const employees = response.data;
    selectElement.innerHTML = "";
    employees.forEach((employee) => {
      const option = document.createElement("option");
      option.value = employee.id;
      option.textContent = `${employee.first_name} ${employee.last_name} - ${employee.email}`;
      selectElement.appendChild(option);
    });

    return employees;
  } catch (error) {
    console.error("Failed to load employees:", error);
    return [];
  }
}

// ---------------------- فتح مودال إضافة مخالفة ----------------------
async function showViolationsRecordModal() {
  const modal = document.getElementById("ViolationsRecordModal");
  await loadEmployees(document.getElementById("employee"));
  await loadViolationsNames(modal.querySelector('[name="violation_title"]'));
  modal.classList.remove("hidden");
}

// ---------------------- غلق المودالات ----------------------
function closeAllModals() {
  document.getElementById("ViolationsRecordModal").classList.add("hidden");
  document.getElementById("editViolationEmployeeModal").classList.add("hidden");
  document.getElementById("deleteViolationRecordModal").classList.add("hidden");
}

// ---------------------- إضافة مخالفة ----------------------
document
  .getElementById("editViolationRecordForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const employeeId = document.getElementById("employee").value;
    const violationId = this.querySelector('[name="violation_title"]').value;
    const reason = document.getElementById("addReason").value;
    try {
      const response = await api.post("/violationsRecord/create", {
        offender_id: employeeId,
        violation_id: violationId,
        reason: reason,
      });
      // Show success toast with backend message or fallback
      showToast(
        response.data.message + " " + response.data.emailStatus ||
          "Violation added successfully!",
        "success"
      );
      document.getElementById("ViolationsRecordModal").classList.add("hidden");
      setTimeout(() => location.reload(), 1500);
    } catch (error) {
      console.error("Error adding violation:", error);
      const message =
        error.response?.data?.message || "Failed to add violation.";
      showToast(message, "error");
    }
  });
// ---------------------- فتح مودال التعديل ----------------------
async function openEditViolationRecordModal(button) {
  const card = button.closest(".violation-card");
  if (!card) return alert("Record card not found");

  const modal = document.getElementById("editViolationRecordModal");
  modal.classList.remove("hidden");

  const employeeName = card.querySelector("h2")?.textContent || "";
  modal.querySelector("span.text-sky-600").textContent = employeeName;

  const emailSpan =
    card.querySelector("p span.italic.text-gray-400")?.textContent || "";
  modal.querySelector("p span.font-medium").textContent = emailSpan;

  const violationSelect = modal.querySelector('select[name="violation_title"]');
  const violations = await loadViolationsNames(violationSelect);

  const violationSpan = card.querySelector(
    "div:nth-child(2) p span.italic.text-gray-400"
  );
  const currentViolationTitle = violationSpan
    ? violationSpan.textContent.trim().toLowerCase()
    : "";

  for (const option of violationSelect.options) {
    if (option.textContent.trim().toLowerCase() === currentViolationTitle) {
      violationSelect.value = option.value;
      break;
    }
  }

  const reasonSpan = card.querySelector("p span#violationRecordReason");
  const currentReason = reasonSpan ? reasonSpan.textContent.trim() : "";
  modal.querySelector('textarea[name="reason"]').value = currentReason;

  const recordId = card.getAttribute("data-id");
  if (recordId) {
    modal.setAttribute("data-record-id", recordId);
  } else {
    alert("Record ID not found!");
  }
}

// ---------------------- تعديل مخالفة ----------------------
document
  .getElementById("editViolationForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const modal = document.getElementById("editViolationRecordModal");
    const recordId = modal.getAttribute("data-record-id");
    const violationId = modal.querySelector('[name="violation_title"]').value;
    const reason = modal.querySelector('[name="reason"]').value;

    try {
      const response = await api.patch(`/violationsRecord/update/${recordId}`, {
        violation_id: violationId,
        reason: reason,
      });
      showToast(
        response.data.message || "Violation updated successfully!",
        "success"
      );
      document
        .getElementById("editViolationRecordModal")
        .classList.add("hidden");
      setTimeout(() => location.reload(), 1500);
    } catch (error) {
      console.error("Error updating violation:", error);
      const message =
        error.response?.data?.message || "Failed to update violation.";
      showToast(message, "error");
    }
  });
// ---------------------- حذف مخالفة ----------------------
function openDeleteRecordModal(recordId) {
  const modal = document.getElementById("deleteViolationRecordModal");
  const deleteBtn = modal.querySelector(".deleteBtn");

  deleteBtn.setAttribute("data-record-id", recordId);
  modal.classList.remove("hidden");
}

function closeDeleteRecordModal() {
  document.getElementById("deleteViolationRecordModal").classList.add("hidden");
}

async function confirmRecordDelete() {
  const modal = document.getElementById("deleteViolationRecordModal");
  const recordId = modal
    .querySelector(".deleteBtn")
    .getAttribute("data-record-id");

  try {
    const response = await api.delete(`/violationsRecord/delete/${recordId}`);
    showToast(
      response.data.message || "Violation deleted successfully!",
      "success"
    );
    setTimeout(() => location.reload(), 700);
  } catch (error) {
    console.error("Failed to delete violation:", error);
    const message =
      error.response?.data?.message || "Failed to delete violation.";
    showToast(message, "error");
  }
  closeDeleteRecordModal();
}
// ---------------------- إغلاق عند الضغط على أزرار الإلغاء ----------------------
document.addEventListener("click", function (event) {
  if (
    event.target.id === "cancelAddModal" ||
    event.target.closest("#cancelAddModal")
  ) {
    const modal = document.getElementById("ViolationsRecordModal");
    modal.classList.add("hidden");
  }
});

document.addEventListener("click", function (event) {
  const modal = document.getElementById("editViolationRecordModal");

  if (
    event.target.id === "cancelEditModal" ||
    event.target.closest("#cancelEditModal")
  ) {
    modal.classList.add("hidden");
    modal.removeAttribute("data-record-id");

    modal.querySelector('select[name="violation_title"]').innerHTML = "";
    modal.querySelector('textarea[name="reason"]').value = "";
    modal.querySelector("span.text-sky-600").textContent = "";
    modal.querySelector("p span.font-medium").textContent = "";
  }
});
