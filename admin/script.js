/* =========================
   WHIM ROOM MANAGEMENT
   script.js
========================= */

"use strict";

/* =========================
   GLOBAL VARIABLES
========================= */

let rooms = [];
let currentBuilding = "A";
let currentRoomId = null;
let currentRoomNumber = "";
let currentScheduleDay = "";

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
    start_time: "07:00",
    end_time: "08:00",
  },
];
/* =========================
   DOM HELPERS
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

function normalizeTime(time) {
  if (!time) return "";
  return String(time).slice(0, 5);
}

function normalizeRoom(room) {
  return {
    ...room,
    id: room.id ?? room.room_id,
    room_number: room.room_number ?? room.room_name ?? "",
    building_code: String(
      room.building_code ?? room.building ?? "",
    ).toUpperCase(),
    status: String(room.status ?? "available").toLowerCase(),
  };
}

async function readJSON(response) {
  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      "The server did not return valid JSON. Check your PHP endpoint for errors.",
    );
  }

  if (!response.ok) {
    throw new Error(
      data.message || data.error || `Request failed (${response.status}).`,
    );
  }

  if (data.success === false) {
    throw new Error(data.message || data.error || "The request failed.");
  }

  return data;
}

/* =========================
   DATE
========================= */

function showTodayDate() {
  const dateElement = getElement("todayDate");

  if (!dateElement) return;

  dateElement.textContent = new Date().toLocaleDateString("en-PH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* =========================
   MODALS
========================= */

function openAddRoomModal() {
  const modal = getElement("addRoomModal");

  if (modal) {
    modal.style.display = "flex";

    const roomNumberInput = getElement("newRoomNumber");

    if (roomNumberInput) {
      roomNumberInput.focus();
    }
  }
}

function closeModal(modalId) {
  const modal = getElement(modalId);

  if (modal) {
    modal.style.display = "none";
  }
}

function closeModalWhenBackdropClicked(event, modalId) {
  if (event.target.id === modalId) {
    closeModal(modalId);
  }
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

    let roomList;

    if (Array.isArray(data)) {
      roomList = data;
    } else if (Array.isArray(data.rooms)) {
      roomList = data.rooms;
    } else if (Array.isArray(data.data)) {
      roomList = data.data;
    } else {
      roomList = [];
    }

    rooms = roomList.map(normalizeRoom);

    showRooms();
    updateRoomStats();
  } catch (error) {
    console.error("Could not load rooms:", error);

    if (roomGrid) {
      roomGrid.innerHTML = `
        <div class="error-state">
          <strong>Unable to load rooms.</strong>
          <p>${escapeHTML(error.message)}</p>
          <button class="secondary-btn" type="button"
            onclick="loadRooms()">
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

  if (!roomGrid) {
    console.error('Missing HTML element: id="adminRoomGrid"');
    return;
  }

  const searchInput = getElement("roomSearch");
  const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";

  const filteredRooms = rooms.filter(function (room) {
    const sameBuilding = room.building_code === currentBuilding;

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
    return room.building_code === currentBuilding;
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

/* =========================
   ADD ROOM
========================= */

const addRoomForm = getElement("addRoomForm");

if (addRoomForm) {
  addRoomForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const submitButton = addRoomForm.querySelector('button[type="submit"]');

    const roomNumberInput = getElement("newRoomNumber");
    const buildingInput = getElement("newRoomBuilding");

    const roomNumber = roomNumberInput ? roomNumberInput.value.trim() : "";

    const buildingCode = buildingInput ? buildingInput.value : "";

    if (!roomNumber || !buildingCode) {
      alert("Please enter the room number and select a building.");
      return;
    }

    const formData = new FormData();
    formData.append("room_number", roomNumber);
    formData.append("building_code", buildingCode);

    try {
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Adding...";
      }

      const response = await fetch("add_room.php", {
        method: "POST",
        body: formData,
      });

      const data = await readJSON(response);

      alert(data.message || "Room added successfully.");

      addRoomForm.reset();
      closeModal("addRoomModal");

      await loadRooms();
    } catch (error) {
      console.error("Could not add room:", error);
      alert(error.message || "Unable to add room.");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Add Room";
      }
    }
  });
}

/* =========================
   DELETE ROOM
========================= */

async function deleteRoom(roomId, roomNumber) {
  const confirmed = confirm(
    `Are you sure you want to delete Room ${roomNumber}?`,
  );

  if (!confirmed) return;

  const formData = new FormData();
  formData.append("id", roomId);

  try {
    const response = await fetch("delete_room.php", {
      method: "POST",
      body: formData,
    });

    const data = await readJSON(response);

    alert(data.message || "Room deleted successfully.");

    await loadRooms();
  } catch (error) {
    console.error("Could not delete room:", error);
    alert(error.message || "Unable to delete room.");
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
      deleteRoom(button.dataset.roomId, button.dataset.roomNumber);
    }
  });
}

/* =========================
   SCHEDULE MODAL
========================= */

function setScheduleScreen(screen) {
  const daysScreen = getElement("scheduleDaysScreen");
  const editScreen = getElement("scheduleEditScreen");

  if (daysScreen) {
    daysScreen.hidden = screen !== "days";
  }

  if (editScreen) {
    editScreen.hidden = screen !== "edit";
  }
}

function showScheduleMessage(message, isError = false) {
  const messageElement = getElement("scheduleSaveMessage");

  if (!messageElement) return;

  messageElement.textContent = message;
  messageElement.classList.toggle("error", isError);
}

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes) {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const minutes = String(totalMinutes % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function showToast(message, isError = false) {
  const oldToast = document.querySelector(".toast");
  if (oldToast) oldToast.remove();

  const toast = document.createElement("div");
  toast.className = isError ? "toast error" : "toast";
  toast.textContent = message;
  toast.setAttribute("role", "status");

  document.body.appendChild(toast);
  setTimeout(function () {
    toast.remove();
  }, 3000);
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

  // Sort saved slots by their slot number.
  scheduleList.sort(function (a, b) {
    return Number(a.slot_number) - Number(b.slot_number);
  });

  // Use default slots only when no saved slots exist.
  if (scheduleList.length === 0) {
    return DEFAULT_SCHEDULES.map(function (slot) {
      return { ...slot };
    });
  }

  // Keep every saved slot, not just the first three.
  return scheduleList.map(function (slot, index) {
    return {
      slot_number: index + 1,
      start_time: normalizeTime(slot.start_time),
      end_time: normalizeTime(slot.end_time),
      status: "available",
    };
  });
}

/* =========================
   SHOW DAYS
========================= */

async function renderScheduleDays() {
  const list = getElement("scheduleDaysList");

  if (!list) return;

  list.innerHTML = '<div class="loading-state">Loading schedule...</div>';

  try {
    const dayResults = await Promise.all(
      DAYS.map(async function (day) {
        try {
          return {
            day,
            slots: await fetchDaySchedule(day),
          };
        } catch (error) {
          console.warn(`Could not load ${day} schedule:`, error);

          return {
            day,
            slots: DEFAULT_SCHEDULES.map((slot) => ({ ...slot })),
          };
        }
      }),
    );

    list.innerHTML = dayResults
      .map(function (item) {
        const slotCount = item.slots.length;

        const statusText =
          slotCount === 1
            ? "1 available time slot"
            : `${slotCount} available time slots`;

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
    console.error("Could not load schedule days:", error);

    list.innerHTML = `
      <div class="error-state">
        Unable to load the schedule. Please try again.
      </div>
    `;
  }
}

const scheduleDaysList = getElement("scheduleDaysList");

if (scheduleDaysList) {
  scheduleDaysList.addEventListener("click", function (event) {
    const button = event.target.closest('button[data-action="edit-day"]');

    if (!button) return;

    openDaySchedule(button.dataset.day);
  });
}

/* =========================
   CREATE SLOT HTML
========================= */

function createScheduleSlotHTML(slot, index) {
  const number = index + 1;

  return `
    <section class="schedule-slot-card">

      <div class="schedule-slot-heading">
        <h4>
          <span class="schedule-slot-number">${number}</span>
          Time Slot ${number}
        </h4>

       <span class="schedule-available-badge">
    <span class="schedule-available-dot"></span>
    Available
</span>

        <button
          class="delete-slot-btn"
          type="button"
          data-action="delete-slot"
          aria-label="Delete time slot ${number}"
          title="Delete this slot">
          &times;
        </button>
      </div>

      <div class="schedule-input-grid">
        <div class="form-group">
          <label for="slot${number}Start">Start Time</label>
<input
  id="slot${number}Start"
  name="start_time_${number}"
  type="time"
  min="07:00"
  max="20:00"
  value="${escapeHTML(slot.start_time)}"
  required>
        </div>

        <div class="form-group">
          <label for="slot${number}End">End Time</label>
         <input
  id="slot${number}End"
  name="end_time_${number}"
  type="time"
  min="07:00"
  max="20:00"
  value="${escapeHTML(slot.end_time)}"
  required>
        </div>
      </div>

    </section>
  `;
}

/* =========================
   RENDER SCHEDULE SLOTS
========================= */

function renderScheduleSlots(slots) {
  const fields = getElement("dayScheduleFields");

  if (!fields) return;

  fields.innerHTML = slots
    .map(function (slot, index) {
      return createScheduleSlotHTML(slot, index);
    })
    .join("");
}

/* =========================
   RENUMBER SCHEDULE SLOTS
========================= */

function renumberScheduleSlots() {
  const fields = getElement("dayScheduleFields");
  if (!fields) return;

  fields
    .querySelectorAll(".schedule-slot-card")
    .forEach(function (card, index) {
      const number = index + 1;

      const heading = card.querySelector(".schedule-slot-heading h4");
      if (heading) {
        heading.innerHTML = `
        <span class="schedule-slot-number">${number}</span>
        Time Slot ${number}
      `;
      }

      const inputs = card.querySelectorAll('input[type="time"]');
      const labels = card.querySelectorAll(".form-group label");
      const parts = ["Start", "End"];
      const names = ["start_time", "end_time"];

      inputs.forEach(function (input, i) {
        input.id = `slot${number}${parts[i]}`;
        input.name = `${names[i]}_${number}`;

        if (labels[i]) {
          labels[i].htmlFor = input.id;
        }
      });

      const deleteButton = card.querySelector(".delete-slot-btn");
      if (deleteButton) {
        deleteButton.setAttribute("aria-label", `Delete time slot ${number}`);
      }
    });
}
/* =========================
   EDIT ONE DAY
========================= */

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

    renderScheduleSlots(slots);
  } catch (error) {
    console.error("Could not load day schedule:", error);

    if (fields) {
      fields.innerHTML = `
        <div class="error-state">
          Could not load the saved schedule.

          <p>${escapeHTML(error.message)}</p>

          <button class="secondary-btn" type="button"
            onclick="openDaySchedule('${escapeHTML(day)}')">
            Try Again
          </button>
        </div>
      `;
    }
  }
}

/* =========================
   ADD SLOT BUTTON
========================= */

const addScheduleSlotBtn = getElement("addScheduleSlotBtn");

if (addScheduleSlotBtn) {
  addScheduleSlotBtn.addEventListener("click", function () {
    const fields = getElement("dayScheduleFields");
    if (!fields) return;

    let cards = fields.querySelectorAll(".schedule-slot-card");

    // If a loading or error message is showing, clear it first.
    if (cards.length === 0) {
      fields.innerHTML = "";
    }

    if (cards.length >= 255) {
      showScheduleMessage("You cannot add more than 255 time slots.", true);
      return;
    }

    // Find the latest end time of all current slots.
    const DAY_START = 7 * 60; // 7:00 AM
    const DAY_END = 20 * 60; // 8:00 PM
    let latestEnd = DAY_START;

    cards.forEach(function (card) {
      const endInput = card.querySelectorAll('input[type="time"]')[1];

      if (endInput && endInput.value) {
        latestEnd = Math.max(latestEnd, timeToMinutes(endInput.value));
      }
    });

    if (latestEnd >= DAY_END) {
      showScheduleMessage(
        "No time left. The last slot already ends at 8:00 PM.",
        true,
      );
      return;
    }

    // The new slot starts where the last one ends and lasts 1 hour.
    const newSlot = {
      start_time: minutesToTime(latestEnd),
      end_time: minutesToTime(Math.min(latestEnd + 60, DAY_END)),
      status: "available",
    };

    fields.insertAdjacentHTML(
      "beforeend",
      createScheduleSlotHTML(newSlot, cards.length),
    );

    renumberScheduleSlots();
    showScheduleMessage("");

    const newCard = fields.lastElementChild;
    newCard.classList.add("is-new");
    newCard.scrollIntoView({ behavior: "smooth", block: "center" });

    const firstInput = newCard.querySelector('input[type="time"]');
    if (firstInput) firstInput.focus({ preventScroll: true });
  });
}

/* =========================
   DELETE SLOT BUTTON
========================= */

const dayScheduleFields = getElement("dayScheduleFields");

if (dayScheduleFields) {
  dayScheduleFields.addEventListener("click", function (event) {
    const deleteButton = event.target.closest(
      'button[data-action="delete-slot"]',
    );

    if (!deleteButton) return;

    const fields = getElement("dayScheduleFields");
    const cards = fields.querySelectorAll(".schedule-slot-card");

    if (cards.length <= 1) {
      showScheduleMessage("At least one time slot is required.", true);
      return;
    }

    const card = deleteButton.closest(".schedule-slot-card");

    if (card) {
      card.remove();
      renumberScheduleSlots();
      showScheduleMessage("");
    }
  });
}

/* =========================
   BACK TO DAYS
========================= */

function backToScheduleDays() {
  showScheduleMessage("");
  setScheduleScreen("days");
  renderScheduleDays();
}

/* =========================
   SAVE SCHEDULE
========================= */

const dayScheduleForm = getElement("dayScheduleForm");

if (dayScheduleForm) {
  dayScheduleForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!currentRoomId || !currentScheduleDay) {
      showScheduleMessage("Room or day was not selected.", true);
      return;
    }

    const saveButton = getElement("saveDayScheduleBtn");
    const fields = getElement("dayScheduleFields");

    if (!fields) {
      showScheduleMessage("Schedule fields are missing.", true);
      return;
    }

    const cards = fields.querySelectorAll(".schedule-slot-card");

    if (cards.length === 0) {
      showScheduleMessage("Please add at least one time slot.", true);
      return;
    }

    const schedules = [];

    for (let index = 0; index < cards.length; index++) {
      const card = cards[index];
      const slotNumber = index + 1;

      const inputs = card.querySelectorAll('input[type="time"]');

      const startTime = inputs[0] ? inputs[0].value : "";
      const endTime = inputs[1] ? inputs[1].value : "";

      if (!startTime || !endTime) {
        showScheduleMessage(
          `Please enter both times for Slot ${slotNumber}.`,
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

      if (startTime < "07:00" || endTime > "20:00") {
        showScheduleMessage(
          `Slot ${slotNumber}: time must be between 7:00 AM and 8:00 PM.`,
          true,
        );
        return;
      }

      schedules.push({
        slot_number: slotNumber,
        start_time: startTime,
        end_time: endTime,
        status: "available",
      });
    }

    // Check for overlapping time slots.
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
      });

      const data = await readJSON(response);

      await renderScheduleDays();

      setScheduleScreen("days");

      showToast(
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
   CLOSE MODALS WITH ESCAPE
========================= */

document.addEventListener("keydown", function (event) {
  if (event.key !== "Escape") return;

  closeModal("addRoomModal");
  closeModal("scheduleModal");
});

/* =========================
   INITIALIZE PAGE
========================= */

document.addEventListener("DOMContentLoaded", function () {
  showTodayDate();

  const activeTab = document.querySelector(".building-tab.active");

  if (activeTab && activeTab.dataset.building) {
    currentBuilding = activeTab.dataset.building.toUpperCase();
  } else {
    selectBuilding("A");
  }

  loadRooms();
});
