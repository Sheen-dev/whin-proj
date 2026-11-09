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
  bookings: [],
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
  updatePhilippineClock();
  setInterval(updatePhilippineClock, 1000);

  updateLoggedOutInterface();
  restoreLoginSession();
});

/* =========================================
   PHILIPPINE DATE AND TIME
   ========================================= */

function updatePhilippineClock() {
  const dateElement = getElement("philippine-date");
  const timeElement = getElement("philippine-time");

  const now = new Date();

  if (dateElement) {
    dateElement.textContent = new Intl.DateTimeFormat("en-PH", {
      timeZone: "Asia/Manila",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(now);
  }

  if (timeElement) {
    timeElement.textContent = new Intl.DateTimeFormat("en-PH", {
      timeZone: "Asia/Manila",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(now);
  }
}

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

    // Load today's bookings so booked intervals can be removed.
    try {
      const bookingResponse = await fetch("get_bookings.php", {
        credentials: "same-origin",
        cache: "no-store",
      });

      if (!bookingResponse.ok) {
        throw new Error("Unable to load today's bookings.");
      }

      const bookingData = await bookingResponse.json();

      if (!bookingData.success || !Array.isArray(bookingData.bookings)) {
        throw new Error(bookingData.message || "Unable to load bookings.");
      }

      state.bookings = bookingData.bookings;
    } catch (error) {
      console.error("Bookings error:", error);

      // Do not show rooms as available when booking information failed.
      throw error;
    }

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
      "Unable to load rooms or booking information. Please check your connection.",
    );

    updateStatistics(0, 0);
  } finally {
    state.loading = false;
  }
}

/* =========================================
   CURRENT ROOM STATUS
   ========================================= */

function getPhilippineTimeParts() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const values = {};

  parts.forEach((part) => {
    values[part.type] = part.value;
  });

  return {
    day: values.weekday,
    minutes: Number(values.hour) * 60 + Number(values.minute),
  };
}

function timeToMinutes(time) {
  if (!time) return 0;

  const [hours, minutes] = String(time).split(":").map(Number);

  return hours * 60 + minutes;
}

function minutesToInput(minutes) {
  const h = String(Math.floor(minutes / 60)).padStart(2, "0");
  const m = String(minutes % 60).padStart(2, "0");

  return `${h}:${m}`;
}

/* =========================================
   GET REMAINING AVAILABLE TIMES
   ========================================= */

function getTodayAvailableSchedules(room) {
  const now = getPhilippineTimeParts();

  // User/get_bookings.php returns bookings for today's date only.
  const roomBookings = (state.bookings || [])
    .filter((item) => Number(item.room_id) === Number(room.id))
    .map((item) => ({
      start: timeToMinutes(item.start_time),
      end: timeToMinutes(item.end_time),
    }));

  return (room.schedules || [])
    .filter((schedule) => {
      const sameDay =
        String(schedule.day_of_week).toLowerCase() === now.day.toLowerCase();

      const isAvailable =
        String(schedule.status || "")
          .trim()
          .toLowerCase() === "available";

      const slotStart = timeToMinutes(schedule.start_time);
      const slotEnd = timeToMinutes(schedule.end_time);

      const hasNotEnded = slotEnd > now.minutes;

      // If anyone booked ANY part of this time, the whole time is removed
      // from the room card. No smaller leftover time is shown.
      const isBooked = roomBookings.some(
        (booked) => booked.start < slotEnd && booked.end > slotStart,
      );

      return sameDay && isAvailable && hasNotEnded && !isBooked;
    })
    .sort((a, b) => timeToMinutes(a.start_time) - timeToMinutes(b.start_time));
}

function getRoomStatus(room) {
  const availableSchedules = getTodayAvailableSchedules(room);

  if (availableSchedules.length === 0) {
    return {
      label: "No Active Schedule",
      available: false,
      schedules: [],
    };
  }

  return {
    label: "Available",
    available: true,
    schedules: availableSchedules,
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
   RESTORE LOGIN SESSION
   ========================================= */

async function restoreLoginSession() {
  try {
    const response = await fetch("check_session.php", {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Unable to check login session.");
    }

    const data = await response.json();

    if (data.success && data.user) {
      state.currentUser = data.user;
      updateLoggedInInterface(data.user);
    } else {
      state.currentUser = null;
      updateLoggedOutInterface();
    }
  } catch (error) {
    console.error("Session restoration error:", error);

    state.currentUser = null;
    updateLoggedOutInterface();
  }
}

/* =========================================
   UPDATE HEADER AND ACCOUNT
   ========================================= */

function updateLoggedInInterface(user) {
  if (!user) return;

  const navAuthButton = getElement("nav-auth-btn");
  const accountId = getElement("account-user-id");
  const accountRole = getElement("account-user-role");
  const accountStatus = getElement("account-status-badge");
  const accountDetails = getElement("account-details");

  const role = String(user.role || "").toUpperCase();
  const isStudent = role === "STUDENT";

  const roleLabel = isStudent ? "Student Account" : "Professor Account";
  const idLabel = isStudent ? "Student Number" : "Professor ID";

  if (navAuthButton) {
    navAuthButton.innerHTML = `
      <button
        type="button"
        onclick="navigateTo('account-view')"
        class="bg-plmun-green hover:bg-plmun-lightgreen text-white text-xs tracking-wider font-semibold px-5 py-2.5 rounded-full transition-all flex items-center gap-2 shadow-sm">
        <i class="fa-solid fa-user-circle"></i>
        <span>Welcome, ${escapeHTML(user.user_id)}</span>
      </button>
    `;
  }

  if (accountId) {
    accountId.textContent = user.full_name || user.user_id;
  }

  if (accountRole) {
    accountRole.textContent = roleLabel;
  }

  if (accountStatus) {
    accountStatus.textContent = "Logged In";
    accountStatus.className = "account-status logged-in";
  }

  if (accountDetails) {
    const details = [
      ["Full Name", user.full_name, "fa-user"],
      [idLabel, user.user_id, "fa-id-card"],
      ["Age", user.age, "fa-calendar"],
      ["Role", roleLabel, "fa-user-shield"],
    ];

    if (isStudent) {
      details.push(
        ["Course", user.course, "fa-graduation-cap"],
        ["Year Level", user.year_level, "fa-layer-group"],
      );
    } else {
      details.push(
        ["Department", user.department, "fa-building"],
        ["Designation", user.designation, "fa-briefcase"],
      );
    }

    accountDetails.className = "account-details-grid";

    accountDetails.innerHTML = details
      .map(
        ([label, value, icon]) => `
          <div class="account-info-card">
            <div class="account-info-icon">
              <i class="fa-solid ${icon}"></i>
            </div>

            <div class="account-info-content">
              <span class="account-info-label">
                ${escapeHTML(label)}
              </span>

              <span class="account-info-value">
                ${escapeHTML(value || "—")}
              </span>
            </div>
          </div>
        `,
      )
      .join("");
  }
}

function updateLoggedOutInterface() {
  const navAuthButton = getElement("nav-auth-btn");
  const accountId = getElement("account-user-id");
  const accountRole = getElement("account-user-role");
  const accountStatus = getElement("account-status-badge");
  const accountDetails = getElement("account-details");

  if (navAuthButton) {
    navAuthButton.innerHTML = `
      <button
        type="button"
        onclick="navigateTo('login-view')"
        class="bg-plmun-green hover:bg-plmun-lightgreen text-white text-xs tracking-wider uppercase font-semibold px-5 py-2.5 rounded-full transition-all flex items-center gap-2 shadow-sm">
        <span>Login</span>
        <i class="fa-solid fa-arrow-right text-[10px]"></i>
      </button>
    `;
  }

  if (accountId) {
    accountId.textContent = "Not Logged In";
  }

  if (accountRole) {
    accountRole.textContent = "Guest Session";
  }

  if (accountStatus) {
    accountStatus.textContent = "Logged Out";
    accountStatus.className = "account-status logged-out";
  }

  if (accountDetails) {
    accountDetails.className = "account-details-grid";

    accountDetails.innerHTML = `
      <div class="account-empty-state">
        <i class="fa-solid fa-lock"></i>
        <p>Please log in to view your personal information.</p>
      </div>
    `;
  }
}

/* =========================================
   RENDER ROOM DIRECTORY
   ========================================= */

function renderRooms() {
  const container = getElement("room-list-container");

  if (!container) return;

  container.innerHTML = "";

  if (state.rooms.length === 0) {
    showMessage(container, "No rooms found in this building.");
    updateStatistics(0, 0);
    return;
  }

  // Only rooms with an available time today are shown.
  const visibleRooms = state.rooms.filter(
    (room) => getRoomStatus(room).available,
  );

  if (visibleRooms.length === 0) {
    showMessage(container, "No rooms have an available time today.");
    updateStatistics(state.rooms.length, 0);
    return;
  }

  visibleRooms.forEach((room) => {
    const roomStatus = getRoomStatus(room);

    const roomNumber = escapeHTML(room.room_number);
    const buildingName = escapeHTML(room.building_name);

    // Only available (not booked) admin times are listed.
    const scheduleHTML = roomStatus.schedules
      .map(
        (schedule) => `
          <div class="room-schedule-item">
            <span>${escapeHTML(schedule.day_of_week)}</span>
            <span>${escapeHTML(formatSchedule(schedule))}</span>
          </div>
        `,
      )
      .join("");

    const card = document.createElement("div");

    card.className =
      "bg-white rounded-2xl p-5 flex flex-col justify-between border border-zinc-200/80 shadow-sm hover:border-plmun-green/40 hover:shadow-md transition-all duration-300 group";

    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">
            ${buildingName}
          </span>

          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]"></span>
        </div>

        <h5 class="text-xl font-bold text-zinc-900 group-hover:text-plmun-green transition-colors">
          Room ${roomNumber}
        </h5>

        <div class="mt-3 space-y-2">
          ${scheduleHTML}
        </div>
      </div>

      <div class="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
        <span class="text-emerald-600 text-xs font-semibold">
          Available
        </span>

        <button
          type="button"
          onclick="bookRoom(${Number(room.id)})"
          class="bg-plmun-green hover:bg-plmun-lightgreen cursor-pointer text-white px-4 py-1.5 rounded-full font-semibold text-[11px] transition-all">
          Book
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  updateStatistics(state.rooms.length, visibleRooms.length);
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
    const availableSchedules = getTodayAvailableSchedules(room);

    if (availableSchedules.length === 0) return false;

    const roomNumber = String(room.room_number).toLowerCase();
    const buildingText = String(room.building_name || "").toLowerCase();

    const schedulesText = availableSchedules
      .map((schedule) =>
        [
          schedule.day_of_week,
          schedule.start_time,
          schedule.end_time,
          formatSchedule(schedule),
        ].join(" "),
      )
      .join(" ")
      .toLowerCase();

    // Numeric searches match room numbers only.
    if (/^\d+$/.test(query)) {
      return roomNumber.includes(query);
    }

    return (
      roomNumber.includes(query) ||
      `room ${roomNumber}`.includes(query) ||
      schedulesText.includes(query) ||
      buildingText.includes(query)
    );
  });

  if (matchingRooms.length === 0) {
    showMessage(container, "No matching available classroom times found.");
  } else {
    matchingRooms.forEach((room) => {
      const availableSchedules = getTodayAvailableSchedules(room);

      const scheduleHTML = availableSchedules
        .map(
          (schedule) => `
            <div class="room-schedule-item">
              <span>${escapeHTML(schedule.day_of_week)}</span>
              <span>${escapeHTML(formatSchedule(schedule))}</span>
            </div>
          `,
        )
        .join("");

      const card = document.createElement("div");

      card.className =
        "bg-white border border-zinc-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm";

      card.innerHTML = `
        <div>
          <div class="flex justify-between items-center mb-2 gap-2">
            <span class="text-xs font-mono text-plmun-green font-bold">
              ${escapeHTML(room.building_name)}
            </span>

            <span class="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-100 text-emerald-700">
              Available
            </span>
          </div>

          <h5 class="text-lg font-bold text-zinc-900">
            Room ${escapeHTML(room.room_number)}
          </h5>

          <div class="mt-3 space-y-2">
            ${scheduleHTML}
          </div>
        </div>

        <div class="mt-3 flex justify-end">
          <button
            type="button"
            onclick="bookRoom(${Number(room.id)})"
            class="bg-plmun-green hover:bg-plmun-lightgreen text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all">
            Book
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

function clearLoginErrors() {
  document.querySelectorAll(".login-input").forEach((input) => {
    input.classList.remove("input-error");
  });

  const errorElement = getElement("login-error");

  if (errorElement) {
    errorElement.classList.add("hidden");
    errorElement.textContent = "";
  }
}

function showLoginError(message) {
  const errorElement = getElement("login-error");

  document.querySelectorAll(".login-input").forEach((input) => {
    input.classList.remove("input-error");

    void input.offsetWidth;

    input.classList.add("input-error");
  });

  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.remove("hidden");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".login-input").forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("input-error");
    });
  });
});

async function handleLogin(event) {
  event.preventDefault();

  const userId = getElement("user-id").value.trim();
  const password = getElement("password").value;

  const button =
    event.submitter ||
    document.querySelector('#login-form button[type="submit"]');

  clearLoginErrors();

  if (!userId || !password) {
    showLoginError("Please enter your user ID and password.");
    return;
  }

  if (button) button.disabled = true;

  try {
    const response = await fetch("login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify({
        user_id: userId,
        password: password,
      }),
    });

    const responseText = await response.text();

    console.log("Login HTTP status:", response.status);
    console.log("Login server response:", responseText);

    let data;

    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error(
        "The server did not return valid JSON. Check login.php for PHP errors.",
      );
    }

    if (!response.ok || !data.success) {
      showLoginError(data.message || "Wrong user ID or password.");
      return;
    }

    state.currentUser = data.user;

    updateLoggedInInterface(data.user);

    getElement("password").value = "";

    navigateTo("home-view");
  } catch (error) {
    console.error("Login error:", error);

    showLoginError(error.message || "Unable to connect. Please try again.");
  } finally {
    if (button) button.disabled = false;
  }
}

/* =========================================
   LOGOUT
   ========================================= */

async function handleLogout() {
  try {
    const response = await fetch("logout.php", {
      method: "POST",
      credentials: "same-origin",
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Logout request failed.");
    }

    state.currentUser = null;

    updateLoggedOutInterface();

    alert("You have been logged out.");

    navigateTo("home-view");
  } catch (error) {
    console.error("Logout error:", error);
    alert("Unable to log out. Please try again.");
  }
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

/* =========================================
   BOOKING WINDOW
   ========================================= */

const booking = {
  room: null,
  slots: [],
  slot: null,
};

function formatDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const parts = [];

  if (hours > 0) parts.push(`${hours} ${hours === 1 ? "hr" : "hrs"}`);
  if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? "min" : "mins"}`);

  return parts.join(" ") || "0 mins";
}

function bookRoom(roomId) {
  if (!state.currentUser) {
    alert("Please log in first before booking a room.");
    navigateTo("login-view");
    return;
  }

  const room = state.rooms.find((item) => Number(item.id) === Number(roomId));

  if (!room) {
    alert("Room not found.");
    return;
  }

  const availableSchedules = getTodayAvailableSchedules(room);

  if (availableSchedules.length === 0) {
    alert("This room has no available time today.");
    return;
  }

  openBookingModal(room, availableSchedules);
}

function openBookingModal(room, schedules) {
  booking.room = room;
  booking.slots = schedules;
  booking.slot = null;

  getElement("booking-title").textContent =
    `Room ${room.room_number} — ${room.building_name}`;

  // 1. Available times (radio buttons)
  getElement("booking-slots").innerHTML = schedules
    .map(
      (schedule, index) => `
        <label class="flex items-center gap-3 p-3 rounded-2xl border border-zinc-200 hover:border-plmun-green hover:bg-emerald-50/50 cursor-pointer transition-colors">
          <input type="radio"
            name="booking-slot"
            value="${index}"
            onchange="selectSlot(${index})"
            class="w-4 h-4 accent-emerald-700">

          <span class="flex-1 min-w-0">
            <span class="block text-sm font-semibold text-zinc-800">
              ${escapeHTML(formatSchedule(schedule))}
            </span>

            <span class="block mt-0.5 text-xs text-emerald-700">
              Available time
            </span>
          </span>
        </label>
      `,
    )
    .join("");

  const details = getElement("booking-details");

  details.classList.add("hidden");

  details.innerHTML = `
    <div id="booking-controls" class="space-y-4">

      <div class="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <p class="text-[10px] font-bold tracking-[0.16em] uppercase text-emerald-700">
          Available time selected
        </p>

        <p id="booking-selected-window"
          class="mt-1 text-base font-extrabold text-emerald-900">
          —
        </p>

        <p class="mt-1 text-xs text-emerald-800">
          After booking, this whole available time is marked as booked.
        </p>
      </div>

      <div>
        <label for="booking-hours"
          class="block text-sm font-bold text-zinc-800 mb-2">
          How long do you need the room?
        </label>

        <select id="booking-hours"
          onchange="applyHours()"
          class="w-full border border-zinc-200 bg-white rounded-xl px-4 py-3 text-sm font-semibold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-plmun-green">
        </select>

        <p class="mt-1.5 text-xs text-zinc-500">
          Pick a duration, then change Time In and Time Out if you want an exact time.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">

        <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-3.5 focus-within:border-plmun-green focus-within:ring-2 focus-within:ring-emerald-100">
          <label for="booking-time-in"
            class="block text-[10px] font-bold tracking-[0.14em] uppercase text-zinc-500 mb-2">
            Time In
          </label>

          <input type="time"
            id="booking-time-in"
            oninput="handleTimeChange()"
            class="w-full min-w-0 bg-transparent text-xl font-extrabold text-zinc-900 outline-none">
        </div>

        <div class="rounded-2xl border border-zinc-200 bg-zinc-50 p-3.5 focus-within:border-plmun-green focus-within:ring-2 focus-within:ring-emerald-100">
          <label for="booking-time-out"
            class="block text-[10px] font-bold tracking-[0.14em] uppercase text-zinc-500 mb-2">
            Time Out
          </label>

          <input type="time"
            id="booking-time-out"
            oninput="handleTimeChange()"
            class="w-full min-w-0 bg-transparent text-xl font-extrabold text-zinc-900 outline-none">
        </div>

      </div>

      <button type="button"
        onclick="resetBookingTimes()"
        class="inline-flex items-center gap-2 text-xs font-semibold text-plmun-green hover:text-emerald-800 transition-colors">
        <i class="fa-solid fa-rotate-left"></i>
        Use suggested time again
      </button>

      <div class="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4"
        aria-live="polite">
        <div class="flex items-center gap-2 text-emerald-700">
          <i class="fa-solid fa-calendar-check"></i>
          <p class="text-[10px] font-bold tracking-[0.16em] uppercase">
            Preferred time
          </p>
        </div>

        <p id="booking-preferred"
          class="mt-2 text-lg sm:text-xl font-extrabold text-plmun-green">
          —
        </p>
      </div>

      <p id="booking-error"
        class="hidden rounded-xl bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-700"
        role="alert">
      </p>

    </div>
  `;

  getElement("booking-submit").disabled = true;
  getElement("booking-submit").textContent = "Book";

  const modal = getElement("booking-modal");

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeBookingModal() {
  const modal = getElement("booking-modal");

  modal.classList.add("hidden");
  modal.classList.remove("flex");

  booking.slot = null;
}

// Builds the "how long" dropdown: 30 mins, 1 hr, 1 hr 30 mins ...
// up to the length of the selected available time.
function setDurationOptions(slotLength, selectedMinutes) {
  const select = getElement("booking-hours");

  let options = '<option value="">Custom time</option>';

  for (let minutes = 30; minutes <= slotLength; minutes += 30) {
    options += `<option value="${minutes}">${formatDuration(minutes)}</option>`;
  }

  select.innerHTML = options;

  const exists = Array.from(select.options).some(
    (option) => option.value === String(selectedMinutes),
  );

  select.value = exists ? String(selectedMinutes) : "";
}

// Suggested duration: 1 hour if it fits, otherwise the longest that fits.
function getSuggestedMinutes(slotLength) {
  return Math.min(60, Math.floor(slotLength / 30) * 30);
}

function selectSlot(index) {
  const slot = booking.slots[index];

  if (!slot) return;

  booking.slot = slot;

  const slotStart = timeToMinutes(slot.start_time);
  const slotEnd = timeToMinutes(slot.end_time);

  getElement("booking-selected-window").textContent = formatSchedule(slot);

  const timeIn = getElement("booking-time-in");
  const timeOut = getElement("booking-time-out");

  timeIn.min = timeOut.min = minutesToInput(slotStart);
  timeIn.max = timeOut.max = minutesToInput(slotEnd);

  getElement("booking-details").classList.remove("hidden");

  setDurationOptions(
    slotEnd - slotStart,
    getSuggestedMinutes(slotEnd - slotStart),
  );

  applyHours();
}

// When the duration changes, Time In goes to the start of the
// available time and Time Out is calculated.
function applyHours() {
  if (!booking.slot) return;

  const slotStart = timeToMinutes(booking.slot.start_time);
  const slotEnd = timeToMinutes(booking.slot.end_time);

  const minutes = Number(getElement("booking-hours").value);

  getElement("booking-time-in").value = minutesToInput(slotStart);
  getElement("booking-time-out").value = minutesToInput(
    minutes > 0 ? slotStart + minutes : slotEnd,
  );

  updatePreferred();
}

// Time In and Time Out can be edited freely (any minute).
function handleTimeChange() {
  const timeIn = getElement("booking-time-in").value;
  const timeOut = getElement("booking-time-out").value;
  const select = getElement("booking-hours");

  if (timeIn && timeOut) {
    const duration = timeToMinutes(timeOut) - timeToMinutes(timeIn);

    const listed = Array.from(select.options).some(
      (option) => option.value === String(duration),
    );

    select.value = listed ? String(duration) : "";
  }

  updatePreferred();
}

function resetBookingTimes() {
  if (!booking.slot) return;

  const slotLength =
    timeToMinutes(booking.slot.end_time) -
    timeToMinutes(booking.slot.start_time);

  setDurationOptions(slotLength, getSuggestedMinutes(slotLength));

  applyHours();
}

function updatePreferred() {
  const preferred = getElement("booking-preferred");
  const error = getElement("booking-error");
  const submit = getElement("booking-submit");

  if (!booking.slot || !preferred || !error || !submit) return;

  const slotStart = timeToMinutes(booking.slot.start_time);
  const slotEnd = timeToMinutes(booking.slot.end_time);

  const timeInValue = getElement("booking-time-in").value;
  const timeOutValue = getElement("booking-time-out").value;

  let message = "";

  if (!timeInValue || !timeOutValue) {
    message = "Please set both Time In and Time Out.";
  } else {
    const start = timeToMinutes(timeInValue);
    const end = timeToMinutes(timeOutValue);

    if (start < slotStart || end > slotEnd) {
      message = `Please stay inside ${formatSchedule(booking.slot)}.`;
    } else if (end <= start) {
      message = "Time Out must be later than Time In.";
    }
  }

  if (message) {
    error.textContent = message;
    error.classList.remove("hidden");

    preferred.textContent = "—";

    submit.disabled = true;
    return;
  }

  error.classList.add("hidden");
  error.textContent = "";

  const minutes = timeToMinutes(timeOutValue) - timeToMinutes(timeInValue);

  preferred.textContent =
    `${formatTime(timeInValue)} – ${formatTime(timeOutValue)} ` +
    `(${formatDuration(minutes)})`;

  submit.disabled = false;
}

async function submitBooking() {
  if (!booking.room || !booking.slot) return;

  updatePreferred();

  const submit = getElement("booking-submit");

  if (submit.disabled) return;

  const timeIn = getElement("booking-time-in").value;
  const timeOut = getElement("booking-time-out").value;

  submit.disabled = true;
  submit.textContent = "Booking...";

  try {
    const response = await fetch("book_room.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      cache: "no-store",
      body: JSON.stringify({
        room_id: booking.room.id,
        start_time: timeIn,
        end_time: timeOut,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      alert(data.message || "Unable to book this room.");
      return;
    }

    const summary =
      `Room ${booking.room.room_number} (${booking.room.building_name}) · ` +
      `${formatTime(timeIn)} to ${formatTime(timeOut)}`;

    addHistory(`Booked ${summary}`);

    closeBookingModal();

    // Reload so the booked time is removed from the room card.
    await loadRooms();

    alert(`Booking saved!\n\n${summary}`);
  } catch (error) {
    console.error("Booking error:", error);

    alert("Unable to connect. Please try again.");
  } finally {
    submit.textContent = "Book";

    if (booking.slot) {
      updatePreferred();
    }
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeBookingModal();
});
