/* =====================================================
   WHIM ROOM MANAGEMENT
   Complete Admin JavaScript
===================================================== */

/* =========================
   GLOBAL VARIABLES
========================= */

let currentBuilding = "A";
let currentRoomId = null;
let currentRoomNumber = null;
let currentScheduleDay = null;
let rooms = [];

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const DEFAULT_SCHEDULES = [
  {
    slot_number: 1,
    start_time: "07:00",
    end_time: "10:00",
    status: "available",
  },
  {
    slot_number: 2,
    start_time: "10:00",
    end_time: "13:00",
    status: "available",
  },
  {
    slot_number: 3,
    start_time: "13:00",
    end_time: "16:00",
    status: "available",
  },
];

/* =========================
   HELPER FUNCTIONS
========================= */

function getElement(id) {
  return document.getElementById(id);
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, function (character) {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character];
  });
}

async function readJSON(response) {
  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch (error) {
    console.error("Invalid JSON response:", text);

    throw new Error(
      "The server returned an invalid response. Check your PHP endpoint.",
    );
  }

  if (!response.ok || data.success === false) {
    throw new Error(data.message || `Request failed (${response.status}).`);
  }

  return data;
}

function normalizeTime(time) {
  if (!time) return "";

  return String(time).substring(0, 5);
}

/* =========================
   TOAST NOTIFICATIONS
========================= */

function showToast(message, type = "success") {
  let toast = getElement("adminToast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "adminToast";
    toast.className = "admin-toast";

    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");

    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.className = `admin-toast ${type} visible`;

  clearTimeout(window.adminToastTimer);

  window.adminToastTimer = setTimeout(function () {
    toast.classList.remove("visible");
  }, 3000);
}

/* =========================
   MODAL FUNCTIONS
========================= */

function openAddRoomModal() {
  openModal("addRoomModal");

  const roomNumberInput = getElement("newRoomNumber");

  if (roomNumberInput) {
    roomNumberInput.focus();
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);

  if (modal) {
    modal.classList.remove("active");
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
  }
}

/* =========================
   DATE
========================= */

function showTodayDate() {
  const dateElement = getElement("todayDate");

  if (!dateElement) return;

  const today = new Date();

  dateElement.textContent = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* =========================
   LOAD ROOMS
========================= */

async function loadRooms() {
  const roomGrid = getElement("adminRoomGrid");

  if (roomGrid) {
    roomGrid.innerHTML = '<div class="loading-state">Loading rooms...</div>';
  }

  try {
    const response = await fetch("get_rooms.php", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const data = await readJSON(response);

    if (Array.isArray(data)) {
      rooms = data;
    } else if (Array.isArray(data.rooms)) {
      rooms = data.rooms;
    } else if (Array.isArray(data.data)) {
      rooms = data.data;
    } else {
      rooms = [];
    }

    showRooms();
    updateRoomStats();
  } catch (error) {
    console.error("Could not load rooms:", error);

    if (roomGrid) {
      roomGrid.innerHTML = `
        <div class="error-state">
          <h3>Unable to load rooms</h3>
          <p>${escapeHTML(error.message)}</p>
          <button class="secondary-btn" onclick="loadRooms()">
            Try Again
          </button>
        </div>
      `;
    }
  }
}

/* =========================
   BUILDING TABS
========================= */

function selectBuilding(building) {
  currentBuilding = String(building).toUpperCase();

  document.querySelectorAll(".building-tab").forEach(function (tab) {
    const selected = tab.dataset.building === currentBuilding;

    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-pressed", String(selected));
  });

  const title = getElement("buildingTitle");

  if (title) {
    title.textContent = `Building ${currentBuilding} Rooms`;
  }

  showRooms();
  updateRoomStats();
}

/* =========================
   DISPLAY ROOMS
========================= */

function showRooms() {
  const roomGrid = getElement("adminRoomGrid");

  if (!roomGrid) return;

  const searchInput = getElement("roomSearch");

  const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";

  const filteredRooms = rooms.filter(function (room) {
    const sameBuilding =
      String(room.building_code).toUpperCase() === currentBuilding;

    const matchesSearch = String(room.room_number)
      .toLowerCase()
      .includes(searchTerm);

    return sameBuilding && matchesSearch;
  });

  if (filteredRooms.length === 0) {
    roomGrid.innerHTML = `
      <div class="empty-state">
        <h3>No rooms found</h3>
        <p>
          ${
            searchTerm
              ? "Try a different search term."
              : "There are no rooms in this building yet."
          }
        </p>
      </div>
    `;

    return;
  }

  roomGrid.innerHTML = filteredRooms
    .map(function (room) {
      const status =
        room.status === "occupied" || room.status === "unavailable"
          ? "occupied"
          : "available";

      const statusText = status === "occupied" ? "Unavailable" : "Available";

      return `
      <article class="room-card">

        <div class="room-card-header">
          <h3>Room ${escapeHTML(room.room_number)}</h3>

          <span class="room-status ${status}">
            ${statusText}
          </span>
        </div>

        <p class="room-building">
          Building ${escapeHTML(room.building_code)}
        </p>

        <div class="room-card-actions">

          <button
            class="secondary-btn"
            type="button"
            data-action="edit-schedule"
            data-room-id="${escapeHTML(room.id)}"
            data-room-number="${escapeHTML(room.room_number)}"
            data-building="${escapeHTML(room.building_code)}">
            Edit Schedule
          </button>

          <button
            class="danger-btn"
            type="button"
            data-action="delete-room"
            data-room-id="${escapeHTML(room.id)}"
            data-room-number="${escapeHTML(room.room_number)}">
            Delete
          </button>

        </div>

      </article>
    `;
    })
    .join("");
}

/* =========================
   SEARCH ROOMS
========================= */

function searchRooms() {
  showRooms();
}

/* =========================
   ROOM STATISTICS
========================= */

function updateRoomStats() {
  const totalElement = getElement("totalRooms");
  const availableElement = getElement("availableRooms");
  const unavailableElement = getElement("unavailableRooms");

  const buildingRooms = rooms.filter(function (room) {
    return String(room.building_code).toUpperCase() === currentBuilding;
  });

  const availableCount = buildingRooms.filter(function (room) {
    return room.status !== "occupied" && room.status !== "unavailable";
  }).length;

  const unavailableCount = buildingRooms.length - availableCount;

  if (totalElement) {
    totalElement.textContent = buildingRooms.length;
  }

  if (availableElement) {
    availableElement.textContent = availableCount;
  }

  if (unavailableElement) {
    unavailableElement.textContent = unavailableCount;
  }
}

/* =====================================================
   ADD ROOM
===================================================== */

const addRoomForm = getElement("addRoomForm");

if (addRoomForm) {
  addRoomForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const submitButton = addRoomForm.querySelector('button[type="submit"]');

    const roomNumberInput = getElement("newRoomNumber");
    const buildingInput = getElement("newRoomBuilding");

    const roomNumber = roomNumberInput ? roomNumberInput.value.trim() : "";

    const buildingCode = buildingInput ? buildingInput.value.toUpperCase() : "";

    if (!roomNumber || !buildingCode) {
      showToast("Please complete all room details.", "error");
      return;
    }

    if (submitButton && submitButton.disabled) return;

    const formData = new FormData();

    formData.append("room_number", roomNumber);
    formData.append("building_code", buildingCode);

    try {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Adding room...";
      }

      const response = await fetch("add_room.php", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const data = await readJSON(response);

      // Change to the building where the room was added.
      currentBuilding = buildingCode;

      document.querySelectorAll(".building-tab").forEach(function (tab) {
        const active = tab.dataset.building === currentBuilding;

        tab.classList.toggle("active", active);
        tab.setAttribute("aria-pressed", String(active));
      });

      const title = getElement("buildingTitle");

      if (title) {
        title.textContent = `Building ${currentBuilding} Rooms`;
      }

      addRoomForm.reset();
      closeModal("addRoomModal");

      await loadRooms();

      showToast(data.message || "Room added successfully.");
    } catch (error) {
      console.error("Add room error:", error);

      showToast(error.message || "Unable to add room.", "error");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Add Room";
      }
    }
  });
}

/* =====================================================
   DELETE ROOM
===================================================== */

async function deleteRoom(roomId, roomNumber, button = null) {
  const confirmed = confirm(
    `Are you sure you want to delete Room ${roomNumber} and all its schedules?`,
  );

  if (!confirmed) return;

  const formData = new FormData();

  formData.append("id", roomId);

  try {
    if (button) {
      button.disabled = true;
      button.textContent = "Deleting...";
    }

    const response = await fetch("delete_room.php", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    const data = await readJSON(response);

    await loadRooms();

    showToast(data.message || "Room deleted successfully.");
  } catch (error) {
    console.error("Delete room error:", error);

    showToast(error.message || "Unable to delete room.", "error");

    if (button) {
      button.disabled = false;
      button.textContent = "Delete";
    }
  }
}

/* =========================
   ROOM GRID BUTTON ACTIONS
========================= */

const roomGrid = getElement("adminRoomGrid");

if (roomGrid) {
  roomGrid.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const action = button.dataset.action;

    if (action === "edit-schedule") {
      editRoomSchedule(
        button.dataset.building,
        button.dataset.roomId,
        button.dataset.roomNumber,
      );
    }

    if (action === "delete-room") {
      deleteRoom(button.dataset.roomId, button.dataset.roomNumber, button);
    }
  });
}

/* =====================================================
   SCHEDULE MODAL
===================================================== */

function setScheduleScreen(screen) {
  const daysScreen = getElement("scheduleDaysScreen");
  const editScreen = getElement("scheduleEditScreen");

  if (daysScreen) {
    daysScreen.style.display = screen === "days" ? "block" : "none";
  }

  if (editScreen) {
    editScreen.style.display = screen === "edit" ? "block" : "none";
  }
}

function showScheduleMessage(message, isError = false) {
  const messageElement = getElement("scheduleSaveMessage");

  if (!messageElement) return;

  messageElement.textContent = message;
  messageElement.classList.toggle("error", isError);
}

async function editRoomSchedule(building, roomId, roomNumber) {
  currentRoomId = roomId;
  currentRoomNumber = roomNumber;

  const modal = getElement("scheduleModal");
  const title = getElement("scheduleTitle");

  if (title) {
    title.textContent = `Room ${roomNumber} — Building ${building}`;
  }

  showScheduleMessage("");
  setScheduleScreen("days");

  if (modal) {
    modal.style.display = "flex";
  }

  await renderScheduleDays();
}

/* =========================
   FETCH DAY SCHEDULE
========================= */

async function fetchDaySchedule(day) {
  const response = await fetch(
    `get_room_schedule.php?room_id=${encodeURIComponent(currentRoomId)}` +
      `&day=${encodeURIComponent(day)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  const data = await readJSON(response);

  let scheduleList = [];

  if (Array.isArray(data)) {
    scheduleList = data;
  } else if (Array.isArray(data.schedules)) {
    scheduleList = data.schedules;
  } else if (Array.isArray(data.schedule)) {
    scheduleList = data.schedule;
  } else if (Array.isArray(data.data)) {
    scheduleList = data.data;
  }

  scheduleList = scheduleList.filter(function (item) {
    return (
      !item.day_of_week ||
      String(item.day_of_week).toLowerCase() === day.toLowerCase()
    );
  });

  return DEFAULT_SCHEDULES.map(function (defaultSlot) {
    const savedSlot = scheduleList.find(function (item) {
      return Number(item.slot_number) === Number(defaultSlot.slot_number);
    });

    if (!savedSlot) {
      return { ...defaultSlot };
    }

    return {
      slot_number: Number(savedSlot.slot_number),
      start_time: normalizeTime(savedSlot.start_time) || defaultSlot.start_time,
      end_time: normalizeTime(savedSlot.end_time) || defaultSlot.end_time,
      status: String(savedSlot.status || defaultSlot.status).toLowerCase(),
    };
  });
}

/* =========================
   SHOW SCHEDULE DAYS
========================= */

async function renderScheduleDays() {
  const list = getElement("scheduleDaysList");

  if (!list) return;

  list.innerHTML = '<div class="loading-state">Loading schedule...</div>';

  try {
    const dayResults = await Promise.all(
      DAYS.map(async function (day) {
        return {
          day,
          slots: await fetchDaySchedule(day),
        };
      }),
    );

    list.innerHTML = dayResults
      .map(function (item) {
        const occupied = item.slots.filter(function (slot) {
          return slot.status === "occupied";
        }).length;

        const statusText =
          occupied > 0
            ? `${occupied} occupied slot${occupied > 1 ? "s" : ""}`
            : "No occupied slots";

        return `
        <div class="schedule-day-card">

          <div class="schedule-day-info">
            <h3>${escapeHTML(item.day)}</h3>
            <p>${escapeHTML(statusText)}</p>
          </div>

          <button
            class="schedule-edit-btn"
            type="button"
            data-action="edit-day"
            data-day="${escapeHTML(item.day)}">
            Edit Time
          </button>

        </div>
      `;
      })
      .join("");
  } catch (error) {
    console.error("Could not load schedules:", error);

    list.innerHTML = `
      <div class="error-state">
        Unable to load the schedule.
        <p>${escapeHTML(error.message)}</p>
      </div>
    `;
  }
}

/* =========================
   SCHEDULE DAY BUTTONS
========================= */

const scheduleDaysList = getElement("scheduleDaysList");

if (scheduleDaysList) {
  scheduleDaysList.addEventListener("click", function (event) {
    const button = event.target.closest('button[data-action="edit-day"]');

    if (!button) return;

    openDaySchedule(button.dataset.day);
  });
}

/* =====================================================
   EDIT ONE DAY
===================================================== */

async function openDaySchedule(day) {
  currentScheduleDay = day;

  const dayTitle = getElement("scheduleDayTitle");
  const fields = getElement("dayScheduleFields");

  if (dayTitle) {
    dayTitle.textContent = day;
  }

  if (fields) {
    fields.innerHTML = '<div class="loading-state">Loading time slots...</div>';
  }

  showScheduleMessage("");
  setScheduleScreen("edit");

  try {
    const slots = await fetchDaySchedule(day);

    if (!fields) return;

    fields.innerHTML = slots
      .map(function (slot, index) {
        const number = index + 1;

        return `
        <section class="schedule-slot-card">

          <div class="schedule-slot-heading">
            <h4>
              <span class="schedule-slot-number">
                ${number}
              </span>
              Time Slot ${number}
            </h4>
          </div>

          <div class="schedule-input-grid">

            <div class="form-group">
              <label for="slot${number}Start">
                Start Time
              </label>

              <input
                id="slot${number}Start"
                name="start_time_${number}"
                type="time"
                value="${escapeHTML(slot.start_time)}"
                required>
            </div>

            <div class="form-group">
              <label for="slot${number}End">
                End Time
              </label>

              <input
                id="slot${number}End"
                name="end_time_${number}"
                type="time"
                value="${escapeHTML(slot.end_time)}"
                required>
            </div>

            <div class="form-group schedule-status-label">
              <label for="slot${number}Status">
                Status
              </label>

              <select
                id="slot${number}Status"
                name="status_${number}"
                required>

                <option value="available"
                  ${slot.status === "available" ? "selected" : ""}>
                  Available
                </option>

                <option value="occupied"
                  ${slot.status === "occupied" ? "selected" : ""}>
                  Occupied
                </option>

              </select>
            </div>

          </div>
        </section>
      `;
      })
      .join("");
  } catch (error) {
    console.error("Could not load day schedule:", error);

    if (fields) {
      fields.innerHTML = `
        <div class="error-state">
          Could not load the saved schedule.
          <p>${escapeHTML(error.message)}</p>

          <button
            class="secondary-btn"
            type="button"
            id="retryScheduleBtn">
            Try Again
          </button>
        </div>
      `;

      getElement("retryScheduleBtn").addEventListener("click", function () {
        openDaySchedule(day);
      });
    }
  }
}

/* =========================
   BACK TO SCHEDULE DAYS
========================= */

function backToScheduleDays() {
  showScheduleMessage("");
  setScheduleScreen("days");
  renderScheduleDays();
}

/* =====================================================
   SAVE SCHEDULE
===================================================== */

const dayScheduleForm = getElement("dayScheduleForm");

if (dayScheduleForm) {
  dayScheduleForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!currentRoomId || !currentScheduleDay) {
      showScheduleMessage("Room or day was not selected.", true);
      return;
    }

    const saveButton = getElement("saveDayScheduleBtn");

    if (saveButton && saveButton.disabled) return;

    const schedules = [];

    for (let slotNumber = 1; slotNumber <= 3; slotNumber++) {
      const startInput = getElement(`slot${slotNumber}Start`);
      const endInput = getElement(`slot${slotNumber}End`);
      const statusInput = getElement(`slot${slotNumber}Status`);

      if (!startInput || !endInput || !statusInput) {
        showScheduleMessage("One or more schedule fields are missing.", true);
        return;
      }

      const startTime = startInput.value;
      const endTime = endInput.value;

      if (!startTime || !endTime) {
        showScheduleMessage("Please enter all start and end times.", true);
        return;
      }

      if (startTime < "07:00" || endTime > "20:00") {
        showScheduleMessage(
          "Schedules must be between 7:00 AM and 8:00 PM.",
          true,
        );
        return;
      }

      if (startTime >= endTime) {
        showScheduleMessage(
          `Slot ${slotNumber}: end time must be later than start time.`,
          true,
        );
        return;
      }

      if (!["available", "occupied"].includes(statusInput.value)) {
        showScheduleMessage(`Slot ${slotNumber}: invalid status.`, true);
        return;
      }

      schedules.push({
        slot_number: slotNumber,
        start_time: startTime,
        end_time: endTime,
        status: statusInput.value,
      });
    }

    // Check for overlapping schedules.
    const sortedSchedules = [...schedules].sort(function (a, b) {
      return a.start_time.localeCompare(b.start_time);
    });

    for (let index = 1; index < sortedSchedules.length; index++) {
      if (
        sortedSchedules[index].start_time < sortedSchedules[index - 1].end_time
      ) {
        showScheduleMessage(
          "Time slots cannot overlap. Please adjust the times.",
          true,
        );
        return;
      }
    }

    const formData = new FormData();

    formData.append("room_id", currentRoomId);
    formData.append("day", currentScheduleDay);
    formData.append("day_of_week", currentScheduleDay);
    formData.append("schedules", JSON.stringify(schedules));

    try {
      if (saveButton) {
        saveButton.disabled = true;
        saveButton.textContent = "Saving...";
      }

      const response = await fetch("save_room_schedule.php", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const data = await readJSON(response);

      await renderScheduleDays();

      setScheduleScreen("days");

      showScheduleMessage(
        data.message || `${currentScheduleDay} schedule saved successfully.`,
      );
    } catch (error) {
      console.error("Could not save schedule:", error);

      showScheduleMessage(error.message || "Unable to save schedule.", true);
    } finally {
      if (saveButton) {
        saveButton.disabled = false;
        saveButton.textContent = "Save Schedule";
      }
    }
  });
}

/* =========================
   SEARCH FIELD
========================= */

const roomSearchInput = getElement("roomSearch");

if (roomSearchInput) {
  roomSearchInput.addEventListener("input", searchRooms);
}

/* =========================
   BUILDING TAB EVENTS
========================= */

document.querySelectorAll(".building-tab").forEach(function (tab) {
  tab.addEventListener("click", function () {
    selectBuilding(tab.dataset.building);
  });
});

/* =========================
   MODAL BUTTON EVENTS
========================= */

const addRoomOpenButton = document.querySelector(
  '[data-modal-open="addRoomModal"]',
);

if (addRoomOpenButton) {
  addRoomOpenButton.addEventListener("click", function () {
    openModal("addRoomModal");
  });
}

/* =========================
   ESCAPE KEY
========================= */

document.addEventListener("keydown", function (event) {
  if (event.key !== "Escape") return;

  closeModal("addRoomModal");
  closeModal("scheduleModal");
});

/* =====================================================
   INITIALIZE PAGE
===================================================== */

document.addEventListener("DOMContentLoaded", function () {
  showTodayDate();

  const activeTab = document.querySelector(".building-tab.active");

  if (activeTab && activeTab.dataset.building) {
    currentBuilding = activeTab.dataset.building.toUpperCase();
  }

  selectBuilding(currentBuilding);

  loadRooms();
});
