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

async function getEmployeeDetails(id) {
  try {
    const res = await api.get(`/employee/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error fetching employee ${id}:`, err);
    showToast(
      `Error fetching employee ${id}: ${
        err.response?.data?.message || err.message
      }`,
      "error"
    );
    return null;
  }
}

async function getBonusDetails(id) {
  try {
    const res = await api.get(`/bonus/employee/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error fetching bonus ${id}:`, err);
    showToast(
      `Error fetching bonus ${id}: ${
        err.response?.data?.message || err.message
      }`,
      "error"
    );
    return null;
  }
}

async function renderSalaryPage() {
  try {
    // Get all salaries using the api instance
    const res = await api.get("/salary/all");
    const salaries = res.data;

    const container = document.getElementById("salary-container");
    container.innerHTML = "";

    for (const s of salaries) {
      // Get employee details
      const employee = await getEmployeeDetails(s.employee_id);

      // Get bonus details
      const bonus = await getBonusDetails(s.employee_id);

      // Create card element
      const card = document.createElement("div");
      card.className =
        "shadow-md rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800";

      card.innerHTML = `
        <div class="flex flex-row items-center space-x-8 text-sm md:text-base text-gray-700 dark:text-gray-100">
          <div class="flex-1">
            <div class="flex w-full justify-between items-center border-b border-gray-400 dark:border-gray-600 p-4">
              <h2 class="text-lg font-extrabold text-gray-600 dark:text-gray-400">
                ${
                  employee
                    ? `${employee.first_name} ${
                        employee.last_name || ""
                      }`.trim()
                    : "Unknown"
                }
              </h2>
              <div class="flex gap-4">
                <button class="editVehicleBtn editBtn" 
                        data-id="${s.id}" data-employee-id="${
        employee?.id || ""
      }">
                  <i class="fas fa-edit mr-2"></i>Edit
                </button>
                <button class="deleteVehicleBtn deleteBtn" 
                        data-id="${s.id}">
                  <i class="fas fa-trash-alt mr-2"></i>Delete
                </button>
              </div>
            </div>

            <div class="flex flex-wrap justify-between items-center p-4 gap-y-2 text-sm md:text-base text-gray-700 dark:text-gray-100">
              <p><span class="font-semibold">Email:</span> <span class="italic text-gray-600 dark:text-gray-400">${
                employee?.email || "-"
              }</span></p>
              <p><span class="font-semibold">Phone:</span> <span class="italic text-gray-600 dark:text-gray-400">${
                employee?.phone_number || "-"
              }</span></p>
              <p><span class="font-semibold">Base Salary:</span> <span class="italic text-gray-600 dark:text-gray-400">${
                s.base_salary
              }</span></p>
              <p><span class="font-semibold">Bonuses:</span> <span class="italic text-gray-600 dark:text-gray-400">${
                bonus?.totalBonus ?? 0
              }</span></p>
              <p class="">
                <span class="font-semibold">Total Salary:</span>
                <span class="italic text-gray-600 dark:text-gray-400">
                  ${Number(s.base_salary) + Number(bonus?.totalBonus ?? 0)}
                </span>
              </p>
            </div>

          </div>
        </div>
      `;

      container.appendChild(card);
    }
  } catch (err) {
    const container = document.getElementById("salary-container");
    container.textContent = "Error loading data.";
    console.error("Error fetching salaries:", err);
  }
}

function getTextByLabel(card, label) {
  const p = [...card.querySelectorAll("p")].find((p) =>
    p.textContent.includes(label)
  );
  return p?.querySelector("span.italic")?.textContent.trim() || "";
}

function openEditModal(editBtn) {
  const modal = document.getElementById("editModal");
  modal.classList.remove("hidden");

  const salaryId = editBtn.getAttribute("data-id");
  const employeeId = editBtn.getAttribute("data-employee-id") || "";
  const card = editBtn.closest("div.flex-row.items-center");

  const name = card.querySelector("h2")?.textContent.trim() || "";
  const baseSalary = getTextByLabel(card, "Base Salary:").replace("$", "");
  const bonuses = getTextByLabel(card, "Bonuses:").replace("$", "");

  document.getElementById("salaryId").value = salaryId;
  document.getElementById("employeeId").value = employeeId;
  document.getElementById("employeeName").value = name;
  document.getElementById("baseSalary").value = baseSalary;
  document.getElementById("bonuses").value = bonuses;
}

document.addEventListener("DOMContentLoaded", renderSalaryPage);

document.getElementById("salary-container").addEventListener("click", (e) => {
  const editBtn = e.target.closest(".editVehicleBtn");
  if (!editBtn) return;
  openEditModal(editBtn);
});

// Cancel editing modal
document.getElementById("cancelEditBtn").addEventListener("click", () => {
  document.getElementById("editModal").classList.add("hidden");
});

// Submit edited salary data
document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const salaryId = document.getElementById("salaryId").value;
  const baseSalary =
    parseFloat(document.getElementById("baseSalary").value) || 0;
  const employeeId =
    parseInt(document.getElementById("employeeId").value) || null;

  if (!employeeId) {
    showToast("Employee ID is missing!", "error");
    return;
  }

  const payload = {
    employee_id: employeeId,
    base_salary: baseSalary,
  };

  try {
    await api.patch(`/salary/update/${salaryId}`, payload);
    document.getElementById("editModal").classList.add("hidden");
    showToast("Salary updated successfully!", "success");
    renderSalaryPage();
  } catch (error) {
    console.error("Update salary error:", error);
    showToast(
      "Failed to update salary: " +
        (error.response?.data?.message || error.message),
      "error"
    );
  }
});

let deleteSalaryId = null;

document.getElementById("salary-container").addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".deleteVehicleBtn");
  if (!deleteBtn) return;

  deleteSalaryId = deleteBtn.getAttribute("data-id");

  const modal = document.getElementById("deleteSalaryModal");
  const msg = document.getElementById("deleteSalaryMessage");
  msg.textContent = `Salary record with ID ${deleteSalaryId} will be permanently deleted.`;

  modal.classList.remove("hidden");
});

document.getElementById("cancelDeleteSalary").addEventListener("click", () => {
  document.getElementById("deleteSalaryModal").classList.add("hidden");
  deleteSalaryId = null;
});

document
  .getElementById("confirmDeleteSalary")
  .addEventListener("click", async () => {
    if (!deleteSalaryId) return;

    try {
      await api.delete(`/salary/delete/${deleteSalaryId}`);
      document.getElementById("deleteSalaryModal").classList.add("hidden");
      deleteSalaryId = null;
      showToast("Salary deleted successfully!", "success");
      renderSalaryPage();
    } catch (error) {
      console.error("Delete salary error:", error);
      showToast(
        "Error deleting salary: " +
          (error.response?.data?.message || error.message),
        "error"
      );
    }
  });

document.getElementById("addSalaryBtn").addEventListener("click", async () => {
  const modal = document.getElementById("addSalaryModal");
  const select = document.getElementById("newEmployeeId");
  const baseSalary = document.getElementById("newBaseSalary").value;

  select.innerHTML = '<option value="">Select employee</option>';
  try {
    const empRes = await api.get("/employee/allActive");
    const employees = empRes.data;

    const salaryRes = await api.get("/salary/all");
    const salaries = salaryRes.data;

    const salaryEmployeeIds = new Set(salaries.map((s) => s.employee_id));

    const availableEmployees = employees.filter(
      (emp) => !salaryEmployeeIds.has(emp.id)
    );

    for (const emp of availableEmployees) {
      const option = document.createElement("option");
      option.value = emp.id;
      option.textContent = `${emp.first_name} ${emp.last_name || ""}`.trim();
      select.appendChild(option);
    }

    document.getElementById("newBaseSalary").value = "";
    modal.classList.remove("hidden");
  } catch (error) {
    console.error("Error loading employee list:", error);
    showToast(
      "Error loading employee list: " +
        (error.response?.data?.message || error.message),
      "error"
    );
  }
});

function closeAddSalaryModal() {
  document.getElementById("newEmployeeId").value = "";
  document.getElementById("newBaseSalary").value = "";
  document.getElementById("addSalaryModal").classList.add("hidden");
}

document
  .getElementById("cancelAddSalaryBtn")
  .addEventListener("click", closeAddSalaryModal);

document
  .getElementById("addSalaryForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const employeeId = document.getElementById("newEmployeeId").value;
    const baseSalary =
      parseFloat(document.getElementById("newBaseSalary").value) || 0;

    if (!employeeId) {
      showToast("Please select an employee.", "error");
      return;
    }

    const payload = {
      employee_id: parseInt(employeeId),
      base_salary: baseSalary,
    };

    try {
      await api.post("/salary/create", payload);
      closeAddSalaryModal();
      showToast("Salary added successfully!", "success");
      renderSalaryPage();
    } catch (error) {
      console.error("Add salary error:", error);
      showToast(
        "Failed to add salary: " +
          (error.response?.data?.message || error.message),
        "error"
      );
    }
  });
