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

let shifts = [];

async function fetchShift() {
  try {
    const { data } = await api.get("/shift/all");
    shifts = data;
  } catch (error) {
    showToast("Failed to load shifts.", "error");
  }
}

function getShiftName(shiftId) {
  const shift = shifts.find((s) => s.id === shiftId);
  return shift ? shift.name : "Unknown";
}

async function populateShiftOptions() {
  const select = document.getElementById("shift_id");
  select.innerHTML = "";
  shifts.forEach((shift) => {
    const option = document.createElement("option");
    option.value = shift.id;
    option.textContent = shift.name;
    select.appendChild(option);
  });
}

async function fetchEmployees() {
  try {
    const { data } = await api.get("/employee/all");
    return data;
  } catch (error) {
    console.error("Failed to load employees:", error);
    return [];
  }
}

async function displayEmployees() {
  await fetchShift();
  await populateShiftOptions();

  let employees = await fetchEmployees();
  employees = employees.sort((a, b) => {
    return a.status === "active" && b.status !== "active"
      ? -1
      : a.status !== "active" && b.status === "active"
      ? 1
      : 0;
  });

  const container = document.getElementById("employee-container");
  container.innerHTML = "";

  employees.forEach((emp) => {
    const empDiv = document.createElement("div");
    empDiv.className = `bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg shadow-md flex flex-col 
            justify-between border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow relative text-sm`;
    empDiv.innerHTML = `
            <div class="w-full flex items-center justify-between p-4 border-b border-gray-400">
                <div class="flex items-center justify-center gap-1 text-base">
                    <div class="w-3 h-3 rounded-full ${
                      emp.status === "active"
                        ? "bg-green-500 border-green-300"
                        : "bg-red-500 border-red-300"
                    } border"></div>
                    <p id="emp-name-${
                      emp.id
                    }" class="text-base font-extrabold text-gray-500 dark:text-gray-300">${
      emp.first_name
    } ${emp.last_name}</p>
                </div>
				<div class="flex gap-4 items-center justify-between">
					<button id="editEmployeeBtn-${
            emp.id
          }" class="editBtn text-blue-600 hover:underline flex items-center" data-emp-id="${
      emp.id
    }">
						<i class="fas fa-edit mr-1 pointer-events-none"></i> Edit
					</button>
					<button id="deleteEmployeeBtn-${
            emp.id
          }" class="deleteBtn text-red-600 hover:underline flex items-center" data-emp-id="${
      emp.id
    }">
						<i class="fas fa-trash-alt mr-1 pointer-events-none"></i> Delete
					</button>
				</div>

            </div>
            <div class="flex justify-between p-4">
                <div class="flex flex-col gap-1">
                    <p id="emp-email-${
                      emp.id
                    }">Email: <span class="italic text-gray-400 font-semibold dark:text-gray-500">${
      emp.email
    }</span></p>
                    <p id="emp-phone-${
                      emp.id
                    }">Phone Number: <span class="italic text-gray-400 font-semibold dark:text-gray-500">${
      emp.phone_number
    }</span></p>
                    <p id="emp-address-${
                      emp.id
                    }">Address: <span class="italic text-gray-400 font-semibold dark:text-gray-500">${
      emp.address
    }</span></p>
                </div>
                <div class="flex flex-col gap-1">
                    <p id="emp-department-${
                      emp.id
                    }">Department Name: <span class="italic text-gray-400 font-semibold dark:text-gray-500">${
      emp.department_name
    }</span></p>
                    <p id="emp-position-${
                      emp.id
                    }">Position Name: <span class="italic text-gray-400 font-semibold dark:text-gray-500">${
      emp.position_name
    }</span></p>
                    <p id="emp-shift-${
                      emp.id
                    }">Shift: <span class="italic text-gray-400 font-semibold dark:text-gray-500">${getShiftName(
      emp.shift_id
    )}</span></p>
                </div>
                <div class="flex flex-col gap-1">
                    <p id="emp-hire-date-${
                      emp.id
                    }">Hire Date: <span class="italic text-gray-400 font-semibold dark:text-gray-500">${emp.hire_date.slice(
      0,
      10
    )}</span></p>
                    <p id="emp-status-${emp.id}">Status: 
                        <span class="font-bold ${
                          emp.status === "active"
                            ? "text-green-500"
                            : "text-red-500"
                        }">${emp.status}</span></p>
                </div>
            </div>
        `;
    container.appendChild(empDiv);
  });
}

displayEmployees();

// إلغاء مودال التعديل
document.getElementById("cancelModal").addEventListener("click", () => {
  document.getElementById("employeeModal").classList.add("hidden");
});

// إلغاء مودال الحذف
document.getElementById("cancelDelete").addEventListener("click", () => {
  document.getElementById("deleteModal").classList.add("hidden");
});

// زر التأكيد لحذف الموظف
document.getElementById("confirmDelete").addEventListener("click", async () => {
  const empId = document.getElementById("confirmDelete").dataset.empId;
  await deleteEmployee(empId);
  document.getElementById("deleteModal").classList.add("hidden");
});
document.addEventListener("click", function (e) {
  const submitBtn = document.getElementById("submitBtn");
  const submitIcon = submitBtn.querySelector("i");

  if (e.target && e.target.classList.contains("editBtn")) {
    const empId = e.target.getAttribute("data-emp-id");

    const shiftName = document
      .getElementById(`emp-shift-${empId}`)
      .querySelector("span")
      .textContent.trim();
    const foundShift = shifts.find((s) => s.name === shiftName);
    const shift_id = foundShift ? foundShift.id : "";

    const data = {
      id: empId,
      first_name:
        document
          .getElementById(`emp-name-${empId}`)
          .textContent.trim()
          .split(" ")[0] || "",
      last_name:
        document
          .getElementById(`emp-name-${empId}`)
          .textContent.trim()
          .split(" ")[1] || "",
      email: document
        .getElementById(`emp-email-${empId}`)
        .querySelector("span")
        .textContent.trim(),
      phone_number: document
        .getElementById(`emp-phone-${empId}`)
        .querySelector("span")
        .textContent.trim(),
      address: document
        .getElementById(`emp-address-${empId}`)
        .querySelector("span")
        .textContent.trim(),
      department_name: document
        .getElementById(`emp-department-${empId}`)
        .querySelector("span")
        .textContent.trim(),
      position_name: document
        .getElementById(`emp-position-${empId}`)
        .querySelector("span")
        .textContent.trim(),
      shift_id: shift_id,
      hire_date: document
        .getElementById(`emp-hire-date-${empId}`)
        .querySelector("span")
        .textContent.trim(),
      status: document
        .getElementById(`emp-status-${empId}`)
        .querySelector("span")
        .textContent.trim(),
    };

    document.getElementById("first_name").value = data.first_name;
    document.getElementById("last_name").value = data.last_name;
    document.getElementById("email").value = data.email;
    document.getElementById("phone_number").value = data.phone_number;
    document.getElementById("address").value = data.address;
    document.getElementById("department_name").value = data.department_name;
    document.getElementById("position_name").value = data.position_name;
    document.getElementById("shift_id").value = data.shift_id;
    document.getElementById("hire_date").value = data.hire_date;
    document.getElementById("employeeModal").classList.remove("hidden");
    document.getElementById("employeeForm").setAttribute("data-emp-id", empId);
    document.getElementById("titleEmployeeModal").innerHTML = "Edit Employee";

    submitBtn.textContent = "";
    submitIcon.className = "fas fa-floppy-disk mr-2";
    submitBtn.appendChild(submitIcon);
    submitBtn.appendChild(document.createTextNode(" Update"));
  } else if (e.target && e.target.classList.contains("deleteBtn")) {
    const empId = e.target.getAttribute("data-emp-id");
    document.getElementById("confirmDelete").setAttribute("data-emp-id", empId);
    document.getElementById("deleteModal").classList.remove("hidden");
  } else if (e.target && e.target.classList.contains("addEmployeeBtn")) {
    const form = document.getElementById("employeeForm");
    form.reset();

    form.removeAttribute("data-emp-id");
    document.getElementById("employeeModal").classList.remove("hidden");
    document.getElementById("titleEmployeeModal").innerHTML = "Add Employee";
    submitBtn.textContent = "";
    submitIcon.className = "fas fa-user-plus mr-2";
    submitBtn.appendChild(submitIcon);
    submitBtn.appendChild(document.createTextNode(" Add"));
  }
});

// حذف الموظف
async function deleteEmployee(empId) {
  try {
    const res = await api.delete(`/employee/delete/${empId}`);
    if (res && res.data && res.data.message) {
      showToast(res.data.message, "success");
      await displayEmployees();
    } else {
      showToast("Failed to delete employee.", "error");
    }
  } catch (error) {
    console.error("Error deleting employee:", error);
    showToast("Error occurred while deleting employee.", "error");
  }
}

// إرسال النموذج للتعديل
document
  .getElementById("employeeForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const empId = e.target.getAttribute("data-emp-id");

    const employeeData = {
      first_name: document.getElementById("first_name").value.trim(),
      last_name: document.getElementById("last_name").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone_number: document.getElementById("phone_number").value.trim(),
      address: document.getElementById("address").value.trim(),
      department_name: document.getElementById("department_name").value.trim(),
      position_name: document.getElementById("position_name").value.trim(),
      shift_id: document.getElementById("shift_id").value,
      hire_date: document.getElementById("hire_date").value,
    };

    try {
      let res;
      if (empId) {
        res = await api.patch(`/employee/update/${empId}`, employeeData);
      } else {
        res = await api.post("/employee/create", employeeData);
      }

      if (res && res.data && res.data.message) {
        showToast(res.data.message, "success");
        document.getElementById("employeeModal").classList.add("hidden");
        e.target.reset();
        e.target.removeAttribute("data-emp-id");
        await displayEmployees();
      } else {
        showToast("Operation failed.", "error");
      }
    } catch (error) {
      console.error("Error during employee operation:", error);
      const backendMessage =
        error.response?.data?.error || "Error occurred while saving employee.";
      showToast(backendMessage, "error");
    }
  });

document.getElementById("addEmplyeeBtn").addEventListener("click", () => {
  document.getElementById("employeeModal").classList.remove("hidden");
});
