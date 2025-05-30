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

cancelDelete.addEventListener("click", () => {
  deleteModal.classList.add("hidden");
});

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("vehicles-cards-container");
  const modal = document.getElementById("vehicleModal");
  const form = document.getElementById("vehicleForm");
  const messageBox = document.getElementById("modalMessage");
  const addVehicleBtn = document.getElementById("addVehicleBtn");
  const cancelBtn = document.getElementById("cancelModal");
  const deleteModal = document.getElementById("deleteModal");
  const deleteMessage = document.getElementById("deleteMessage");
  const confirmDelete = document.getElementById("confirmDelete");
  const cancelDelete = document.getElementById("cancelDelete");

  const emailModal = document.getElementById("emailModal");
  const pdfUpload = document.getElementById("pdfUpload");
  const confirmSendEmailBtn = document.getElementById("confirmSendEmail");

  const closeModalBtn = document.getElementById("closeModalBtn");
  const emailModelClose = document.getElementById("emailModal");

  closeModalBtn.addEventListener("click", () => {
    emailModelClose.classList.add("hidden");
  });

  let vehicles = [];
  let currentEditingVehicleId = null;
  let selectedVehicleId = null;

  const getVehicleById = (id) => vehicles.find((v) => v.id == id);

  function renderVehicles() {
    const container = document.getElementById("vehicles-cards-container");
    container.innerHTML = "";

    vehicles.forEach((v) => {
      const purchaseDate = v.purchase_date
        ? new Date(v.purchase_date).toLocaleDateString()
        : "-";

      const card = document.createElement("div");
      card.id = `vehicle-card-${v.id}`;
      card.className = `
        bg-white dark:bg-gray-800 
        text-gray-800 dark:text-gray-200 
        rounded-lg shadow-md 
        flex flex-col justify-between border border-gray-200 dark:border-gray-700 
        hover:shadow-lg transition-shadow
      `;

      card.innerHTML = `
      <div class="flex flex-col items-center text-sm md:text-base">
        <div class="w-full flex items-center justify-between p-4 border-b border-gray-400">
          <div class="flex items-center">
            <h2 class="text-base font-extrabold text-gray-500 dark:text-gray-300">
              ${v.model || "Unknown Model"} - 
              <span class="text-sky-600 dark:text-sky-400">${
                v.vin_number || "Unknown VIN"
              }</span>
            </h2>
          </div>
          <div class="flex flex-col gap-4">
            <div class="flex w-full items-center gap-4 justify-between">
              <button 
                class="sendEmail emailSendBtn ${
                  v.status === "sent" ? "sent" : ""
                }" 
                data-id="${v.id}" 
                ${v.status === "sent" ? "disabled" : ""}>
                <i class="fas fa-envelope mr-2 pointer-events-none"></i>
                ${v.status === "sent" ? "Email Sent" : "Send Email"}
              </button>

              <button class="editVehicleBtn editBtn" data-id="${v.id}">
                <i class="fas fa-edit mr-2 pointer-events-none"></i>Edit
              </button>
              <button class="deleteVehicleBtn deleteBtn" data-id="${v.id}">
                <i class="fas fa-trash-alt mr-2 pointer-events-none"></i>Delete
              </button>
            </div>
          </div>

        </div>
    
        <div class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-4 text-sm">
          <div class="space-y-2">
            <p><span class="">Type:</span> <span class="italic text-gray-400 font-semibold dark:text-gray-500">${
              v.vehicle_type || "-"
            }</span></p>
            <p><span class="">Manufacture Date:</span> <span class="italic text-gray-400 font-semibold dark:text-gray-500">${
              v.manufacture_date || "-"
            }</span></p>
            <p><span class="">Purchase Date:</span> <span class="italic text-gray-400 font-semibold dark:text-gray-500">${purchaseDate}</span></p>
          </div>
    
          <div class="space-y-2">
            <p><span class="">Mileage:</span> <span class="italic text-gray-400 font-semibold dark:text-gray-500">${
              v.mileage != null ? v.mileage : "-"
            }</span></p>
            <p><span class="">Exterior Color:</span> <span class="italic text-gray-400 font-semibold dark:text-gray-500">${
              v.exterior_color || "-"
            }</span></p>
            <p><span class="">Interior Color:</span> <span class="italic text-gray-400 font-semibold dark:text-gray-500">${
              v.interior_color || "-"
            }</span></p>
          </div>
    
          <div class="space-y-2">
            <p><span class="">Market Price:</span> <span class="italic text-gray-400 font-semibold dark:text-gray-500">$${parseInt(
              v.market_price
            )}</span></p>
            <p><span class="">Purchase Price:</span> <span class="italic text-gray-400 font-semibold dark:text-gray-500">$${parseInt(
              v.purchase_price
            )}</span></p>
            <p><span class="">Purchased From:</span> <span class="italic text-gray-400 font-semibold dark:text-gray-500">${
              v.purchased_from || "-"
            }</span></p>
          </div>
    
          <div class="space-y-2">
            <p><span class="">Purchase Team:</span> <span class="italic text-gray-400 font-semibold dark:text-gray-500">${
              v.purchase_team || "-"
            }</span></p>
            <p><span class="">Approved By:</span> <span class="italic text-gray-400 font-semibold dark:text-gray-500">${
              v.approved_by || "-"
            }</span></p>
            <p><span class="">Buyer Name:</span> <span class="italic text-gray-400 font-semibold dark:text-gray-500">${
              v.buyer_first_name
            } ${v.buyer_last_name || "-"}</span></p>
          </div>
        </div>
      </div>
    `;

      container.appendChild(card);
    });
  }

  function updateSubmitButton() {
    const submitBtn = form.querySelector(".submitBtn");
    if (isEditMode) {
      document.getElementById("titleVehicleModal").innerHTML = "Update Vehicle";
      submitBtn.innerHTML = `<i class="fas fa-floppy-disk mr-2 pointer-events-none"></i> Save Changes`;
    } else {
      document.getElementById("titleVehicleModal").innerHTML = "Add Vehicle";
      submitBtn.innerHTML = `<i class="fas fa-car mr-2 pointer-events-none"></i> Add Vehicle`;
    }
  }
  document.getElementById("addVehicleBtn").addEventListener("click", () => {
    openEditModal(null);
  });

  async function openEditModal(vehicle) {
    isEditMode = !!vehicle;

    if (isEditMode) {
      // تعبي النموذج بقيم المركبة الحالية
      form.vehicle_type.value = vehicle.vehicle_type || "";
      form.model.value = vehicle.model || "";
      form.manufacture_date.value = vehicle.manufacture_date || "";
      form.vin_number.value = vehicle.vin_number || "";
      form.exterior_color.value = vehicle.exterior_color || "";
      form.interior_color.value = vehicle.interior_color || "";
      form.mileage.value = vehicle.mileage != null ? vehicle.mileage : "";
      form.purchase_price.value =
        vehicle.purchase_price != null ? parseInt(vehicle.purchase_price) : "";
      form.market_price.value =
        vehicle.market_price != null ? parseInt(vehicle.market_price) : "";
      form.purchased_from.value = vehicle.purchased_from || "";
      form.purchase_date.value = vehicle.purchase_date
        ? vehicle.purchase_date.split("T")[0]
        : "";
      form.purchase_team.value = vehicle.purchase_team || "";
      form.approved_by.value = vehicle.approved_by || "";
      await populateBuyerSelect(form.buyer_id, vehicle.buyer_id);
    } else {
      // تفضيء النموذج (وضع إضافة جديد)
      form.reset();
      await populateBuyerSelect(form.buyer_id, null);
    }

    updateSubmitButton();
    messageBox.textContent = "";
    messageBox.className = "";
    modal.classList.remove("hidden");
  }

  async function fetchVehicles() {
    try {
      const { data } = await api.get("/vehicle/all");
      vehicles = data;
      renderVehicles();
    } catch (error) {
      alert("Failed to load vehicles.");
    }
  }

  async function populateBuyerSelect(buyerSelect, selectedBuyerId = null) {
    buyerSelect.innerHTML = `<option value="">Select Buyer</option>`;

    try {
      const empRes = await api.get("/employee/allActive");
      if (empRes.status !== 200) throw new Error("Failed to load employees");
      const employees = empRes.data;

      employees.forEach((emp) => {
        const option = document.createElement("option");
        option.value = emp.id;
        option.textContent = emp.first_name + " " + emp.last_name;
        if (selectedBuyerId && emp.id === selectedBuyerId) {
          option.selected = true;
        }
        buyerSelect.appendChild(option);
      });
    } catch (err) {
      console.error(err);
      buyerSelect.innerHTML = `<option value="">Failed to load employees</option>`;
    }
  }

  addVehicleBtn.addEventListener("click", async () => {
    currentEditingVehicleId = null;
    form.reset();
    messageBox.textContent = "";
    messageBox.className = "";

    await populateBuyerSelect(form.buyer_id);

    modal.classList.remove("hidden");
  });

  cancelBtn.addEventListener("click", () => modal.classList.add("hidden"));

  container.addEventListener("click", (e) => {
    if (e.target.classList.contains("editVehicleBtn")) {
      currentEditingVehicleId = e.target.getAttribute("data-id");
      const vehicle = getVehicleById(currentEditingVehicleId);
      if (vehicle) openEditModal(vehicle);
    }
    if (e.target.classList.contains("deleteVehicleBtn")) {
      selectedVehicleId = e.target.getAttribute("data-id");
      deleteMessage.textContent = "";
      deleteMessage.className = "";
      deleteModal.classList.remove("hidden");
    }
    if (e.target.classList.contains("sendEmail")) {
      currentEditingVehicleId = e.target.getAttribute("data-id");
      const vehicle = getVehicleById(currentEditingVehicleId);
      if (vehicle) {
        emailModal.classList.remove("hidden");
      }
    }
  });
  confirmSendEmailBtn.addEventListener("click", async () => {
    const userFile = pdfUpload.files[0];
    if (!userFile) {
      showToast("Please upload a PDF file.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("userPdf", userFile);

    confirmSendEmailBtn.disabled = true;
    confirmSendEmailBtn.innerHTML = `<i class="fas fa-spinner fa-spin mr-2"></i> Sending...`;

    try {
      const { data } = await api.post(
        `/vehicle/sendEmail/${currentEditingVehicleId}`,
        formData
      );

      modal.classList.add("hidden");
      showToast(`${data.message}`, "success");

      const vehicle = vehicles.find((v) => v.id == currentEditingVehicleId);
      if (vehicle) vehicle.status = "sent";
      renderVehicles();

      emailModal.classList.add("hidden");
    } catch (error) {
      const errMsg =
        error?.response?.data?.error || "❌ Failed to connect to the server.";
      showToast(errMsg, "error");
    } finally {
      confirmSendEmailBtn.disabled = false;
      confirmSendEmailBtn.innerHTML = `<i class="fas fa-paper-plane mr-2"></i> Send Email`;
    }
  });

  confirmDelete.addEventListener("click", async () => {
    if (!selectedVehicleId) return;

    try {
      const { data } = await api.delete(`/vehicle/delete/${selectedVehicleId}`);
      showToast(` ${data.message}`, "success");

      vehicles = vehicles.filter((v) => v.id != selectedVehicleId);
      renderVehicles();

      setTimeout(() => deleteModal.classList.add("hidden"), 1000);
    } catch (error) {
      const message =
        error?.response?.data?.error || "❌ Failed to connect to the server.";
      showToast(message, "error");
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    [
      "mileage",
      "purchase_price",
      "market_price",
      "buyer_id",
      "created_by",
    ].forEach((key) => {
      data[key] =
        data[key] !== undefined && data[key] !== "" ? Number(data[key]) : null;
    });

    try {
      let res, result;
      if (currentEditingVehicleId) {
        res = await api.patch(
          `/vehicle/update/${currentEditingVehicleId}`,
          data
        );
        result = res.data;
        showToast(` ${result.message}`, "success");

        const idx = vehicles.findIndex((v) => v.id == currentEditingVehicleId);
        if (idx !== -1) vehicles[idx] = { ...vehicles[idx], ...data };

        setTimeout(() => {
          modal.classList.add("hidden");
          renderVehicles();
        }, 500);
      } else {
        res = await api.post("/vehicle/create", data);
        result = res.data;
        showToast(` ${result.message}`, "success");

        if (result.vehicle) {
          vehicles.push(result.vehicle);
        } else {
          await fetchVehicles();
        }

        setTimeout(() => {
          modal.classList.add("hidden");
          renderVehicles();
        }, 1500);
      }
    } catch (error) {
      const errMsg =
        error?.response?.data?.error || "❌ Failed to connect to the server.";
      showToast(errMsg, "error");
    }
  });

  fetchVehicles();
});
