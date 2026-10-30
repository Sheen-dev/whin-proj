/* =========================================
   WHIM — User Dashboard
   Database-connected room directory
   ========================================= */

const API_BASE = "../admin/";

const state = {
  currentUser: null,
  activeBuilding: "Building A",
  searchQuery: "",
  rooms: [],
  history: [],
  loading: false,
};

const BUILDINGS = {
  "Building A": "A",
  "Building B": "B",
  "Building C": "C",
};

/* =========================================
   INITIALIZATION
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  renderAnimatedH3("PLMun Classroom Search & Spatial Finder");
  renderHistory();
  loadRooms();
});

/* =========================================
   HELPER FUNCTIONS
   ========================================= */

function getElement(id) {
  return document.getElementById(id);
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
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

function formatTime(time) {
  if (!time) return "";

  const parts = time.split(":");
  if (parts.length < 2) return time;

  let hours = Number(parts[0]);
  const minutes = parts[1];

  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${period}`;
}

function formatSchedule(schedule) {
  return `${formatTime(schedule.start_time)} - ${formatTime(schedule.end_time)}`;
}

function addHistory(action) {
  const now = new Date();

  state.history.unshift({
    action,
    time: now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });

  renderHistory();
}

function showMessage(container, message) {
  if (!container) return;

  container.innerHTML = `
        <p class="text-sm text-zinc-500 col-span-full py-6 text-center">
            ${escapeHTML(message)}
        </p>
    `;
}

/* =========================================
   ANIMATED HERO HEADING
   ========================================= */

function renderAnimatedH3(text) {
  const heading = getElement("animated-hero-heading");

  if (!heading) return;

  heading.innerHTML = "";

  const words = text.split(" ");
  let characterCount = 0;

  words.forEach((word) => {
    const wordSpan = document.createElement("span");

    wordSpan.className = "inline-block whitespace-nowrap mr-3";

    for (let index = 0; index < word.length; index++) {
      const characterSpan = document.createElement("span");

      characterSpan.className = "stagger-char";
      characterSpan.textContent = word[index];
      characterSpan.style.animationDelay = `${characterCount * 0.035}s`;

      wordSpan.appendChild(characterSpan);
      characterCount++;
    }

    heading.appendChild(wordSpan);
  });
}

/* =========================================
   VIEW NAVIGATION
   ========================================= */

function navigateTo(viewId) {
  document.querySelectorAll(".view-panel").forEach((panel) => {
    panel.classList.add("hidden");
    panel.classList.remove("flex");
  });

  const target = getElement(viewId);

  if (!target) return;

  target.classList.remove("hidden");
  target.classList.add("flex");

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

/* =========================================
   BUILDING SELECTION
   ========================================= */

async function selectBuilding(buildingName) {
  if (!BUILDINGS[buildingName]) return;

  state.activeBuilding = buildingName;

  const welcomeMessage = getElement("welcome-message");
  const accountBuilding = getElement("account-active-bldg");

  if (welcomeMessage) {
    welcomeMessage.textContent = `Welcome to ${buildingName}`;
  }

  if (accountBuilding) {
    accountBuilding.textContent = buildingName;
  }

  const buttonIds = ["btn-bldg-a", "btn-bldg-b", "btn-bldg-c"];

  Object.entries(BUILDINGS).forEach(([name], index) => {
    const button = getElement(buttonIds[index]);

    if (!button) return;

    if (name === buildingName) {
      button.className =
        "building-btn active-bldg px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all bg-white text-plmun-green shadow-sm";
    } else {
      button.className =
        "building-btn px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all text-white/80 hover:text-white";
    }
  });

  await loadRooms();

  if (state.searchQuery) {
    executeSearch();
  }

  addHistory(`Switched to ${buildingName} Directory`);
}

/* =========================================
   LOAD ROOMS FROM DATABASE
   ========================================= */

async function loadRooms() {
  const roomContainer = getElement("room-list-container");

  if (!roomContainer) return;

  state.loading = true;

  showMessage(roomContainer, "Loading rooms...");

  try {
    const response = await fetch(`${API_BASE}get_rooms.php`);

    if (!response.ok) {
      throw new Error("Unable to connect to the room API.");
    }

    const data = await response.json();

    if (!data.success || !Array.isArray(data.rooms)) {
      throw new Error(data.message || "Unable to load rooms.");
    }

    const buildingCode = BUILDINGS[state.activeBuilding];

    const buildingRooms = data.rooms.filter(
      (room) => String(room.building_code).toUpperCase() === buildingCode,
    );

    // Load the actual schedules for each room.
    const roomsWithSchedules = await Promise.all(
      buildingRooms.map(async (room) => {
        try {
          const scheduleResponse = await fetch(
            `${API_BASE}get_room_schedule.php?room_id=${encodeURIComponent(room.id)}`,
          );

          if (!scheduleResponse.ok) {
            throw new Error("Unable to load room schedule.");
          }

          const scheduleData = await scheduleResponse.json();

          return {
            ...room,
            schedules:
              scheduleData.success && Array.isArray(scheduleData.schedules)
                ? scheduleData.schedules
                : [],
          };
        } catch (error) {
          console.error(`Schedule error for room ${room.room_number}:`, error);

          return {
            ...room,
            schedules: [],
            scheduleError: true,
          };
        }
      }),
    );

    state.rooms = roomsWithSchedules;

    renderRooms();

    if (state.searchQuery) {
      executeSearch();
    }
  } catch (error) {
    console.error("Room loading error:", error);

    state.rooms = [];

    showMessage(
      roomContainer,
      "Unable to load rooms. Please check your database connection and admin API.",
    );

    updateStatistics(0, 0);
  } finally {
    state.loading = false;
  }
}

/* =========================================
   CURRENT ROOM STATUS
   ========================================= */

function getCurrentDay() {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[new Date().getDay()];
}

function isTimeWithinSchedule(schedule) {
  const now = new Date();

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const startParts = schedule.start_time.split(":");
  const endParts = schedule.end_time.split(":");

  const startMinutes = Number(startParts[0]) * 60 + Number(startParts[1]);

  const endMinutes = Number(endParts[0]) * 60 + Number(endParts[1]);

  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
}

function getCurrentSchedule(room) {
  const today = getCurrentDay();

  return (
    room.schedules.find((schedule) => {
      const sameDay =
        String(schedule.day_of_week).toLowerCase() === today.toLowerCase();

      return sameDay && isTimeWithinSchedule(schedule);
    }) || null
  );
}

function getRoomStatus(room) {
  const currentSchedule = getCurrentSchedule(room);

  if (!currentSchedule) {
    return {
      label: "No Active Schedule",
      available: false,
      schedule: null,
    };
  }

  const status = String(currentSchedule.status || "").trim();
  const available = status.toLowerCase() === "available";

  return {
    label: status || "Unknown Status",
    available,
    schedule: currentSchedule,
  };
}

/* =========================================
   ROOM STATISTICS
   ========================================= */

function updateStatistics(total, available) {
  const totalElement = getElement("stat-total-rooms");
  const availableElement = getElement("stat-available");

  if (totalElement) {
    totalElement.textContent = String(total).padStart(2, "0");
  }

  if (availableElement) {
    availableElement.textContent = String(available).padStart(2, "0");
  }
}

/* =========================================
   RENDER ROOM DIRECTORY
   ========================================= */

function renderRooms() {
  const container = getElement("room-list-container");

  if (!container) return;

  container.innerHTML = "";

  let availableCount = 0;

  if (state.rooms.length === 0) {
    showMessage(container, "No rooms found in this building.");
    updateStatistics(0, 0);
    return;
  }

  state.rooms.forEach((room) => {
    const roomStatus = getRoomStatus(room);

    if (roomStatus.available) {
      availableCount++;
    }

    const roomNumber = escapeHTML(room.room_number);
    const buildingName = escapeHTML(room.building_name);
    const statusLabel = escapeHTML(roomStatus.label);

    const scheduleText = roomStatus.schedule
      ? formatSchedule(roomStatus.schedule)
      : "No active schedule";

    const card = document.createElement("div");

    card.className =
      "bg-white rounded-2xl p-5 flex flex-col justify-between border border-zinc-200/80 shadow-sm hover:border-plmun-green/40 hover:shadow-md transition-all duration-300 group";

    card.innerHTML = `
            <div>
                <div class="flex items-center justify-between mb-2">
                    <span class="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">
                        ${buildingName}
                    </span>

                    <span class="w-2.5 h-2.5 rounded-full ${
                      roomStatus.available
                        ? "bg-emerald-500 shadow-[0_0_8px_#10B981]"
                        : "bg-red-500"
                    }"></span>
                </div>

                <h5 class="text-xl font-bold text-zinc-900 group-hover:text-plmun-green transition-colors">
                    Room ${roomNumber}
                </h5>

                <p class="text-xs text-zinc-400 mt-1 font-mono">
                    ${escapeHTML(scheduleText)}
                </p>
            </div>

            <div class="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span class="${
                  roomStatus.available ? "text-emerald-600" : "text-red-500"
                } font-semibold">
                    ${statusLabel}
                </span>

                <button
                    type="button"
                    onclick="showRoomSchedule(${Number(room.id)})"
                    class="bg-plmun-green text-white hover:bg-plmun-lightgreen px-3 py-1.5 rounded-full font-semibold text-[11px] transition-all">
                    View Schedule
                </button>
            </div>
        `;

    container.appendChild(card);
  });

  updateStatistics(state.rooms.length, availableCount);
}

/* =========================================
   VIEW ROOM SCHEDULE
   ========================================= */

function showRoomSchedule(roomId) {
  const room = state.rooms.find((item) => Number(item.id) === Number(roomId));

  if (!room) return;

  if (!room.schedules.length) {
    alert("There are no schedules recorded for this room.");
    return;
  }

  const scheduleLines = room.schedules.map((schedule) => {
    return [
      schedule.day_of_week,
      formatSchedule(schedule),
      schedule.status,
    ].join(" — ");
  });

  alert(`Room ${room.room_number}\n\n` + scheduleLines.join("\n"));
}

/* =========================================
   SEARCH INPUT
   ========================================= */

function handleSearchTrigger() {
  const input = getElement("main-search-input");

  if (!input) return;

  state.searchQuery = input.value.trim();

  if (state.searchQuery.length > 0) {
    executeSearch();
  } else {
    clearSearch();
  }
}

/* =========================================
   SEARCH AND COMPARISON
   ========================================= */

function executeSearch() {
  const wrapper = getElement("search-results-wrapper");
  const container = getElement("search-results-container");
  const input = getElement("main-search-input");

  if (!wrapper || !container || !input) return;

  const query = input.value.trim().toLowerCase();

  state.searchQuery = input.value.trim();

  wrapper.classList.remove("hidden");
  container.innerHTML = "";

  const matchingRooms = state.rooms.filter((room) => {
    const roomNumber = String(room.room_number).toLowerCase();

    const schedulesText = room.schedules
      .map((schedule) => {
        return [
          schedule.day_of_week,
          schedule.start_time,
          schedule.end_time,
          formatSchedule(schedule),
          schedule.status,
        ].join(" ");
      })
      .join(" ")
      .toLowerCase();

    const buildingText = String(room.building_name || "").toLowerCase();

    return (
      roomNumber.includes(query) ||
      `room ${roomNumber}`.includes(query) ||
      schedulesText.includes(query) ||
      buildingText.includes(query)
    );
  });

  if (matchingRooms.length === 0) {
    showMessage(container, "No matching classroom schedules found.");
  } else {
    matchingRooms.forEach((room) => {
      const roomStatus = getRoomStatus(room);

      const card = document.createElement("div");

      card.className =
        "bg-white border border-zinc-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm";

      const statusClass = roomStatus.available
        ? "bg-emerald-100 text-emerald-700"
        : "bg-red-100 text-red-600";

      const scheduleText = roomStatus.schedule
        ? formatSchedule(roomStatus.schedule)
        : "No active schedule";

      card.innerHTML = `
                <div>
                    <div class="flex justify-between items-center mb-1 gap-2">
                        <span class="text-xs font-mono text-plmun-green font-bold">
                            ${escapeHTML(scheduleText)}
                        </span>

                        <span class="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusClass}">
                            ${escapeHTML(roomStatus.label)}
                        </span>
                    </div>

                    <h5 class="text-lg font-bold text-zinc-900">
                        Room ${escapeHTML(room.room_number)}
                    </h5>

                    <p class="text-xs text-zinc-400 uppercase tracking-wider">
                        ${escapeHTML(room.building_name)}
                    </p>
                </div>

                <div class="mt-3 flex justify-end">
                    <button
                        type="button"
                        onclick="showRoomSchedule(${Number(room.id)})"
                        class="bg-plmun-green text-white hover:bg-plmun-lightgreen px-4 py-1.5 rounded-full text-xs font-bold transition-all">
                        View Schedule
                    </button>
                </div>
            `;

      container.appendChild(card);
    });
  }

  addHistory(`Searched "${state.searchQuery}" in ${state.activeBuilding}`);
}

/* =========================================
   CLEAR SEARCH
   ========================================= */

function clearSearch() {
  const input = getElement("main-search-input");
  const wrapper = getElement("search-results-wrapper");

  if (input) {
    input.value = "";
  }

  if (wrapper) {
    wrapper.classList.add("hidden");
  }

  state.searchQuery = "";
}

/* =========================================
   LOGIN FORM
   ========================================= */

/*
   This is only a temporary interface preview.
   It does NOT verify the password or authenticate
   against a database.
*/

function handleLogin(event) {
  event.preventDefault();

  const userIdInput = getElement("user-id");
  const passwordInput = getElement("password");

  if (!userIdInput || !passwordInput) return;

  const userId = userIdInput.value.trim();

  if (!userId || !passwordInput.value) {
    alert("Please enter your ID and password.");
    return;
  }

  alert(
    "Login is not connected to the authentication API yet.\n\n" +
      "Your account has not been authenticated.",
  );
}

/* =========================================
   LOGOUT
   ========================================= */

function handleLogout() {
  state.currentUser = null;

  alert("There is no authenticated account in this session.");

  navigateTo("home-view");
}

/* =========================================
   ROOM BOOKING PLACEHOLDER
   ========================================= */

/*
   There is currently no reservation API.
   This function intentionally does not create
   a fake booking or show a false success message.
*/

function bookRoom(roomId) {
  alert(
    "Room reservations are not connected yet.\n\n" +
      "A booking API and reservation database table are needed.",
  );
}

/* =========================================
   HISTORY DISPLAY
   ========================================= */

function renderHistory() {
  const container = getElement("history-list-container");

  if (!container) return;

  container.innerHTML = "";

  if (state.history.length === 0) {
    showMessage(container, "No activity recorded in this session.");
    return;
  }

  state.history.forEach((item) => {
    const row = document.createElement("div");

    row.className =
      "flex items-center justify-between p-4 rounded-2xl bg-white border border-zinc-200/80 text-sm shadow-sm gap-4";

    row.innerHTML = `
            <div class="flex items-center gap-3">
                <i class="fa-solid fa-bolt text-plmun-green"></i>

                <span class="text-zinc-700 font-medium">
                    ${escapeHTML(item.action)}
                </span>
            </div>

            <span class="text-xs font-mono text-zinc-400 whitespace-nowrap">
                ${escapeHTML(item.time)}
            </span>
        `;

    container.appendChild(row);
  });
}
