<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>PLMun - Classroom Booking & Search System</title>

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Tailwind Configuration: Original PLMun Theme -->
    <script>
    tailwind.config = {
        theme: {
            extend: {
                fontFamily: {
                    sans: ['Inter', 'sans-serif']
                },
                colors: {
                    plmun: {
                        green: '#044D29',
                        lightgreen: '#0B6E3D',
                        accent: '#F59E0B',
                        bg: '#FAFBFB'
                    }
                },
                animation: {
                    'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                },
                keyframes: {
                    fadeInUp: {
                        '0%': {
                            opacity: '0',
                            transform: 'translateY(20px)'
                        },
                        '100%': {
                            opacity: '1',
                            transform: 'translateY(0)'
                        }
                    }
                }
            }
        }
    };
    </script>

    <!-- Fonts and Icons -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- External CSS -->
    <link rel="stylesheet" href="style.css">

    <!-- External JavaScript -->
    <script src="script.js" defer></script>
</head>

<body
    class="bg-plmun-bg text-zinc-900 font-sans antialiased min-h-screen relative selection:bg-plmun-green selection:text-white">

    <!-- Fixed Grain Overlay Texture -->
    <div class="grain-overlay z-50"></div>

    <!-- Background Gradient Accent -->
    <div class="fixed inset-0 bg-gradient-to-b from-emerald-50/60 via-plmun-bg to-white -z-10"></div>

    <!-- Main Container -->
    <div class="max-w-[1600px] mx-auto min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-8">

        <!-- FLOATING PLMUN GLASS NAVBAR -->
        <header
            class="glass-nav rounded-full px-6 py-3 flex items-center justify-between sticky top-4 z-40 transition-all duration-300 shadow-sm">

            <div class="flex items-center space-x-3 cursor-pointer" onclick="navigateTo('home-view')">
                <div
                    class="w-9 h-9 bg-plmun-green text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
                    <i class="fa-solid fa-graduation-cap text-xs"></i>
                </div>

                <div class="flex flex-col">
                    <span
                        class="tracking-widest font-extrabold text-sm sm:text-base uppercase text-plmun-green leading-none">
                        PLMUN
                    </span>

                    <span class="text-[9px] font-semibold text-zinc-500 tracking-wider">
                        CLASSROOM SEARCH
                    </span>
                </div>
            </div>

            <!-- Navigation Links -->
            <nav class="hidden md:flex items-center space-x-1 text-xs font-semibold uppercase tracking-wider">

                <button onclick="navigateTo('home-view')"
                    class="px-4 py-2 rounded-full text-zinc-600 hover:bg-emerald-50 hover:text-plmun-green transition-all">
                    Home
                </button>

                <button onclick="navigateTo('history-view')"
                    class="px-4 py-2 rounded-full text-zinc-600 hover:bg-emerald-50 hover:text-plmun-green transition-all">
                    History
                </button>

                <button onclick="navigateTo('account-view')"
                    class="px-4 py-2 rounded-full text-zinc-600 hover:bg-emerald-50 hover:text-plmun-green transition-all">
                    Account
                </button>

            </nav>

            <!-- Auth Action Button -->
            <div id="nav-auth-btn">
                <button onclick="navigateTo('login-view')"
                    class="bg-plmun-green hover:bg-plmun-lightgreen text-white text-xs tracking-wider uppercase font-semibold px-5 py-2.5 rounded-full transition-all flex items-center gap-2 shadow-sm">
                    <span>Login</span>
                    <i class="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
            </div>

        </header>

        <!-- MAIN VIEW AREA -->
        <main class="my-6 flex-1 relative">

            <!-- ========================================================= -->
            <!-- VIEW 1: LOGIN SCREEN -->
            <!-- ========================================================= -->

            <section id="login-view"
                class="view-panel hidden flex-col items-center justify-center min-h-[75vh] animate-fade-in-up">

                <div
                    class="glass-card-light rounded-[2.5rem] p-8 sm:p-12 w-full max-w-md relative overflow-hidden shadow-xl border border-emerald-900/10">

                    <div class="text-center mb-8">

                        <div
                            class="w-16 h-16 bg-plmun-green/10 border border-plmun-green/20 text-plmun-green rounded-full mx-auto flex items-center justify-center mb-4">
                            <i class="fa-solid fa-magnifying-glass text-2xl"></i>
                        </div>

                        <h2 class="text-3xl font-extrabold tracking-tight text-plmun-green mb-1">
                            PLMun Portal
                        </h2>

                        <p class="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">
                            Pamantasan ng Lungsod ng Muntinlupa
                        </p>

                    </div>

                    <form id="login-form" onsubmit="handleLogin(event)" class="space-y-6">

                        <div>
                            <label class="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-600 mb-2">
                                Student # / Teacher ID #
                            </label>

                            <input type="text" id="user-id" required placeholder="e.g. 2026-10492 or TCH-882"
                                class="w-full bg-white border border-zinc-200 rounded-2xl px-5 py-4 text-sm text-zinc-800 focus:outline-none focus:border-plmun-green focus:ring-2 focus:ring-plmun-green/10 transition-all placeholder:text-zinc-400">
                        </div>

                        <div>
                            <label class="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-600 mb-2">
                                Password
                            </label>

                            <input type="password" id="password" required placeholder="••••••••"
                                class="w-full bg-white border border-zinc-200 rounded-2xl px-5 py-4 text-sm text-zinc-800 focus:outline-none focus:border-plmun-green focus:ring-2 focus:ring-plmun-green/10 transition-all placeholder:text-zinc-400">
                        </div>

                        <button type="submit"
                            class="w-full group bg-plmun-green hover:bg-plmun-lightgreen transition-all duration-300 rounded-full pl-6 pr-2 py-2 flex items-center justify-between text-white font-medium shadow-md">
                            <span class="font-semibold text-sm">
                                Proceed to Platform
                            </span>

                            <span
                                class="w-10 h-10 bg-white/20 group-hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all">
                                <i class="fa-solid fa-arrow-right text-xs"></i>
                            </span>
                        </button>

                    </form>

                    <p class="text-center text-xs text-zinc-400 mt-6 font-light">
                        Log in with your university credentials for full system privileges.
                    </p>

                </div>

            </section>


            <!-- ========================================================= -->
            <!-- VIEW 2: HOME & SEARCH DASHBOARD -->
            <!-- ========================================================= -->

            <section id="home-view" class="view-panel flex flex-col gap-8 animate-fade-in-up">

                <!-- HERO SECTION -->
                <div
                    class="relative rounded-[2.5rem] overflow-hidden min-h-[70vh] flex flex-col justify-between p-8 sm:p-12 border border-emerald-900/10 bg-gradient-to-br from-plmun-green via-plmun-green to-emerald-950 text-white shadow-xl">

                    <!-- Background Accent Overlay -->
                    <div
                        class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-10 pointer-events-none mix-blend-overlay">
                    </div>

                    <div
                        class="absolute -bottom-10 -left-10 text-[22vw] font-black text-white/[0.04] select-none pointer-events-none leading-none blur-sm">
                        PLMUN
                    </div>

                    <!-- Top Hero Row -->
                    <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">

                        <div>
                            <p class="text-[10px] font-bold tracking-[0.2em] text-emerald-300 uppercase mb-2">
                                Campus Location
                            </p>

                            <h2 id="welcome-message" class="text-3xl sm:text-5xl font-extrabold tracking-tight">
                                Welcome to Building A
                            </h2>
                        </div>

                        <!-- Building Selector -->
                        <div
                            class="flex items-center gap-2 bg-black/20 p-2 rounded-full border border-white/10 backdrop-blur-md">

                            <button onclick="selectBuilding('Building A')" id="btn-bldg-a"
                                class="building-btn active-bldg px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all bg-white text-plmun-green shadow-sm">
                                Bldg A
                            </button>

                            <button onclick="selectBuilding('Building B')" id="btn-bldg-b"
                                class="building-btn px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all text-white/80 hover:text-white">
                                Bldg B
                            </button>

                            <button onclick="selectBuilding('Building C')" id="btn-bldg-c"
                                class="building-btn px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all text-white/80 hover:text-white">
                                Bldg C
                            </button>

                        </div>

                    </div>

                    <!-- Center Hero Row -->
                    <div class="relative z-10 my-8 max-w-4xl">

                        <h3 id="animated-hero-heading"
                            class="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-none text-white/95">
                        </h3>

                        <p class="text-emerald-100/80 text-sm sm:text-base mt-4 max-w-xl font-light">
                            Where Values Matter. Seamless real-time classroom search and schedule index.
                        </p>

                    </div>

                    <!-- Bottom Hero Row -->
                    <div
                        class="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-8">

                        <!-- Search Input -->
                        <div class="w-full lg:max-w-xl">

                            <label class="block text-[10px] font-bold tracking-[0.2em] text-emerald-200 uppercase mb-2">
                                Automated Availability Search
                            </label>

                            <div class="relative group">

                                <input type="text" id="main-search-input" onkeyup="handleSearchTrigger()"
                                    placeholder="Search schedule (e.g. 3:00 pm - 5:00 pm or Room 4)..."
                                    class="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-full pl-14 pr-32 py-4 text-sm text-white placeholder:text-emerald-100/50 focus:outline-none focus:border-white focus:bg-white/20 shadow-2xl transition-all">

                                <i
                                    class="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-emerald-200 transition-all"></i>

                                <button onclick="executeSearch()"
                                    class="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-plmun-green hover:bg-emerald-50 text-xs font-bold px-5 py-2.5 rounded-full transition-all shadow-md">
                                    Search
                                </button>

                            </div>

                        </div>

                        <!-- Glass Stats -->
                        <div class="flex items-center gap-4">

                            <div class="glass-card-dark rounded-2xl p-5 w-36 flex flex-col justify-between">
                                <span class="text-3xl font-bold tracking-tight text-white" id="stat-total-rooms">
                                    00
                                </span>

                                <span class="text-xs text-white/70 mt-1 font-light">
                                    Total Rooms
                                </span>
                            </div>

                            <div
                                class="glass-card-dark rounded-2xl p-5 w-36 flex flex-col justify-between border-emerald-400/40">
                                <span class="text-3xl font-bold tracking-tight text-emerald-300" id="stat-available">
                                    00
                                </span>

                                <span class="text-xs text-white/70 mt-1 font-light">
                                    Available Now
                                </span>
                            </div>

                        </div>

                    </div>

                </div>


                <!-- SEARCH COMPARISON RESULTS PANEL -->
                <div id="search-results-wrapper"
                    class="hidden glass-card-light rounded-[2.5rem] p-6 sm:p-8 animate-fade-in-up border border-plmun-green/20 shadow-lg">

                    <div class="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200">

                        <div>
                            <span class="text-[10px] font-bold tracking-[0.2em] uppercase text-plmun-green">
                                Comparison Logic Engine
                            </span>

                            <h4 class="text-xl font-bold text-zinc-900">
                                Matching Room Schedule Results
                            </h4>
                        </div>

                        <button onclick="clearSearch()" class="text-xs text-zinc-500 hover:text-plmun-green underline">
                            Clear Results
                        </button>

                    </div>

                    <div id="search-results-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <!-- Dynamic comparison cards -->
                    </div>

                </div>


                <!-- ROOM LIST DIRECTORY -->
                <div class="space-y-4">

                    <div class="flex items-center justify-between px-2">

                        <h4 class="text-lg font-bold text-zinc-900">
                            Building Room Directory
                        </h4>

                        <span class="text-xs text-zinc-400 font-mono">
                            Live Sync
                        </span>

                    </div>

                    <div id="room-list-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <!-- Rooms will be loaded from the database -->
                    </div>

                </div>


                <!-- FEATURE GRID SECTION -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">

                    <!-- Left Column -->
                    <div
                        class="lg:col-span-5 glass-card-light rounded-[2.5rem] p-8 flex flex-col justify-between shadow-sm">

                        <div>
                            <p class="text-[10px] font-bold tracking-[0.2em] text-plmun-green uppercase mb-3">
                                PLMun Architecture
                            </p>

                            <h3
                                class="text-4xl sm:text-5xl font-extrabold tracking-tight leading-none mb-8 text-zinc-900">
                                Efficient Spatial Finder.
                            </h3>
                        </div>

                        <div class="grid grid-cols-2 gap-4">

                            <div class="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-sm">
                                <i class="fa-solid fa-clock text-plmun-green mb-2"></i>
                                <p class="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                                    Time Matching
                                </p>
                            </div>

                            <div class="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-sm">
                                <i class="fa-solid fa-building-columns text-plmun-green mb-2"></i>
                                <p class="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                                    Multi-Building
                                </p>
                            </div>

                            <div class="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-sm">
                                <i class="fa-solid fa-user-shield text-plmun-green mb-2"></i>
                                <p class="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                                    Role Auth
                                </p>
                            </div>

                            <div class="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-sm">
                                <i class="fa-solid fa-bolt text-plmun-green mb-2"></i>
                                <p class="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                                    Instant Filter
                                </p>
                            </div>

                        </div>

                    </div>


                    <!-- Right Column -->
                    <div
                        class="lg:col-span-7 relative group rounded-[2.5rem] overflow-hidden min-h-[380px] border border-zinc-200/80 flex flex-col justify-end p-8 bg-zinc-900 shadow-md">

                        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                            class="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-500 ease-out -z-0"
                            alt="University environment">

                        <div
                            class="absolute inset-0 bg-gradient-to-t from-plmun-green/90 via-plmun-green/40 to-transparent -z-0">
                        </div>

                        <div class="relative z-10 glass-card-dark p-6 rounded-2xl max-w-md text-white">

                            <span class="text-[10px] font-bold tracking-[0.2em] text-emerald-300 uppercase">
                                Automated Indexing
                            </span>

                            <h4 class="text-xl font-bold mt-1">
                                Smart Room Scheduling
                            </h4>

                            <p class="text-xs text-emerald-100/80 mt-2 font-light">
                                Compare simultaneous availabilities between classrooms with minimal friction.
                            </p>

                        </div>

                    </div>

                </div>


                <!-- DARK PRODUCTIVITY BLOCK -->
                <div
                    class="w-full bg-plmun-green text-white rounded-[2.5rem] p-8 sm:p-12 border border-emerald-900/20 relative overflow-hidden shadow-xl">

                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                        <div class="lg:col-span-5 space-y-6">

                            <span class="text-[10px] font-bold tracking-[0.2em] text-emerald-300 uppercase">
                                System Workflow
                            </span>

                            <h3 class="text-3xl font-extrabold tracking-tight">
                                How the Finder Operates
                            </h3>

                            <div class="space-y-4">

                                <div
                                    class="flex items-start gap-4 p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">

                                    <span class="text-lg font-bold text-plmun-accent font-mono">
                                        01
                                    </span>

                                    <div>
                                        <h5 class="text-sm font-semibold">
                                            Select Building
                                        </h5>

                                        <p class="text-xs text-emerald-100/70 mt-0.5">
                                            Filter room arrays instantly dynamic to Building A, B, or C.
                                        </p>
                                    </div>

                                </div>

                                <div
                                    class="flex items-start gap-4 p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">

                                    <span class="text-lg font-bold text-plmun-accent font-mono">
                                        02
                                    </span>

                                    <div>
                                        <h5 class="text-sm font-semibold">
                                            Automatic Time Comparison
                                        </h5>

                                        <p class="text-xs text-emerald-100/70 mt-0.5">
                                            Filter identical schedules across room slots.
                                        </p>
                                    </div>

                                </div>

                            </div>

                        </div>


                        <!-- Code Mockup -->
                        <div class="lg:col-span-7 flex justify-center">

                            <div
                                class="w-full max-w-lg bg-zinc-950 rounded-2xl p-6 border border-white/10 shadow-2xl transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">

                                <div class="flex items-center gap-2 mb-4">

                                    <div class="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div class="w-3 h-3 rounded-full bg-amber-500"></div>
                                    <div class="w-3 h-3 rounded-full bg-emerald-500"></div>

                                    <span class="text-xs font-mono text-zinc-500 ml-2">
                                        plmun_room_logic.json
                                    </span>

                                </div>

                                <pre class="text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">{
  <span class="text-white">"institution"</span>: <span class="text-amber-300">"PLMun"</span>,
  <span class="text-white">"search_query"</span>: <span class="text-amber-300">"3:00 pm - 5:00 pm"</span>,
  <span class="text-white">"building"</span>: <span class="text-amber-300">"Building A"</span>,
  <span class="text-white">"results"</span>: [
    { <span class="text-white">"room"</span>: <span class="text-amber-300">"Room 4"</span>, <span class="text-white">"available"</span>: <span class="text-emerald-300">true</span> },
    { <span class="text-white">"room"</span>: <span class="text-amber-300">"Room 6"</span>, <span class="text-white">"available"</span>: <span class="text-emerald-300">true</span> },
    { <span class="text-white">"room"</span>: <span class="text-amber-300">"Room 12"</span>, <span class="text-white">"available"</span>: <span class="text-red-400">false</span> }
  ]
}</pre>

                            </div>

                        </div>

                    </div>

                </div>


                <!-- PRICING / ACCESS BENTO GRID -->
                <div class="my-6">

                    <div class="mb-6">
                        <span class="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">
                            User Privileges
                        </span>

                        <h3 class="text-2xl font-bold text-zinc-900">
                            Campus Account Tiers
                        </h3>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <!-- Student Account -->
                        <div
                            class="bg-white rounded-[2rem] p-6 flex flex-col justify-between border border-zinc-200/80 shadow-md">

                            <div>
                                <div class="h-14 flex items-center justify-between border-b border-zinc-100 pb-4">

                                    <span class="text-[10px] font-bold tracking-widest uppercase text-zinc-400">
                                        Tier 01
                                    </span>

                                    <i class="fa-solid fa-graduation-cap text-plmun-green text-xl"></i>

                                </div>

                                <div class="py-6">
                                    <h4 class="text-2xl font-bold text-zinc-900">
                                        Student Account
                                    </h4>

                                    <p class="text-xs text-zinc-500 mt-2">
                                        Log in using Student # to search room schedules and check availability.
                                    </p>
                                </div>
                            </div>

                            <button onclick="navigateTo('login-view')"
                                class="w-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold py-3 rounded-full transition-all">
                                Student Access
                            </button>

                        </div>


                        <!-- Faculty Account -->
                        <div
                            class="bg-white rounded-[2rem] p-6 flex flex-col justify-between border border-zinc-200/80 shadow-md">

                            <div>
                                <div class="h-14 flex items-center justify-between border-b border-zinc-100 pb-4">

                                    <span class="text-[10px] font-bold tracking-widest uppercase text-plmun-green">
                                        Tier 02
                                    </span>

                                    <i class="fa-solid fa-chalkboard-user text-plmun-green text-xl"></i>

                                </div>

                                <div class="py-6">
                                    <h4 class="text-2xl font-bold text-zinc-900">
                                        Faculty Account
                                    </h4>

                                    <p class="text-xs text-zinc-500 mt-2">
                                        Log in using Teacher ID # for faculty room reservations and priority override.
                                    </p>
                                </div>
                            </div>

                            <button onclick="navigateTo('login-view')"
                                class="w-full bg-plmun-green hover:bg-plmun-lightgreen text-white text-xs font-semibold py-3 rounded-full transition-all">
                                Faculty Access
                            </button>

                        </div>


                        <!-- Admin Account -->
                        <div
                            class="bg-white rounded-[2rem] p-6 flex flex-col justify-between border border-zinc-200/80 shadow-md">

                            <div>
                                <div class="h-14 flex items-center justify-between border-b border-zinc-100 pb-4">

                                    <span class="text-[10px] font-bold tracking-widest uppercase text-zinc-400">
                                        Tier 03
                                    </span>

                                    <i class="fa-solid fa-building-flag text-plmun-green text-xl"></i>

                                </div>

                                <div class="py-6">
                                    <h4 class="text-2xl font-bold text-zinc-900">
                                        Campus Admin
                                    </h4>

                                    <p class="text-xs text-zinc-500 mt-2">
                                        Full administrative management over buildings and master schedules.
                                    </p>
                                </div>
                            </div>

                            <button
                                class="w-full bg-zinc-100 text-zinc-400 cursor-not-allowed text-xs font-semibold py-3 rounded-full"
                                disabled>
                                Admin Portal Only
                            </button>

                        </div>

                    </div>

                </div>

            </section>


            <!-- ========================================================= -->
            <!-- VIEW 3: HISTORY SCREEN -->
            <!-- ========================================================= -->

            <section id="history-view" class="view-panel hidden flex-col animate-fade-in-up">

                <div class="glass-card-light rounded-[2.5rem] p-8 sm:p-12 border border-zinc-200 shadow-lg">

                    <div class="flex items-center justify-between mb-8">

                        <div>
                            <p class="text-[10px] font-bold tracking-[0.2em] uppercase text-plmun-green">
                                Activity Records
                            </p>

                            <h2 class="text-3xl font-extrabold text-zinc-900">
                                Booking & Search History
                            </h2>
                        </div>

                        <i class="fa-solid fa-clock-rotate-left text-2xl text-zinc-400"></i>

                    </div>

                    <div id="history-list-container" class="space-y-3">
                        <!-- Dynamic history items -->
                    </div>

                </div>

            </section>


            <!-- ========================================================= -->
            <!-- VIEW 4: ACCOUNT SCREEN -->
            <!-- ========================================================= -->

            <section id="account-view" class="view-panel hidden flex-col animate-fade-in-up">

                <div
                    class="glass-card-light rounded-[2.5rem] p-8 sm:p-12 max-w-2xl mx-auto w-full border border-zinc-200 shadow-lg">

                    <div class="text-center mb-8">

                        <div
                            class="w-20 h-20 bg-plmun-green/10 rounded-full border border-plmun-green/20 mx-auto flex items-center justify-center text-3xl text-plmun-green mb-4">
                            <i class="fa-solid fa-user"></i>
                        </div>

                        <h2 id="account-user-id" class="text-2xl font-bold text-zinc-900">
                            Not Logged In
                        </h2>

                        <p id="account-user-role"
                            class="text-xs font-bold tracking-widest uppercase text-zinc-400 mt-1">
                            Guest Session
                        </p>

                    </div>

                    <div class="space-y-4 border-t border-zinc-200 pt-6">

                        <div class="flex justify-between items-center py-3 border-b border-zinc-100 text-sm">

                            <span class="text-zinc-500">
                                Authentication Status
                            </span>

                            <span id="account-status-badge"
                                class="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                                Logged Out
                            </span>

                        </div>

                        <div class="flex justify-between items-center py-3 border-b border-zinc-100 text-sm">

                            <span class="text-zinc-500">
                                Active Building Selection
                            </span>

                            <span id="account-active-bldg" class="font-semibold text-zinc-900">
                                Building A
                            </span>

                        </div>

                    </div>

                    <div class="mt-8">

                        <button onclick="handleLogout()"
                            class="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3 rounded-full transition-all text-xs tracking-wider uppercase border border-red-200">
                            Log Out
                        </button>

                    </div>

                </div>

            </section>

        </main>


        <!-- FOOTER -->
        <footer
            class="mt-auto pt-6 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">

            <div class="flex items-center gap-3">

                <button onclick="navigateTo('home-view')"
                    class="w-10 h-10 rounded-full bg-white border border-zinc-200 shadow-sm hover:bg-emerald-50 text-plmun-green flex items-center justify-center transition-all">
                    <i class="fa-solid fa-house"></i>
                </button>

                <span class="font-semibold text-zinc-600">
                    Pamantasan ng Lungsod ng Muntinlupa
                </span>

            </div>

            <div class="flex items-center gap-6 text-zinc-500 font-medium">

                <button onclick="navigateTo('account-view')" class="hover:text-plmun-green transition-all">
                    Account
                </button>

                <button onclick="navigateTo('history-view')" class="hover:text-plmun-green transition-all">
                    History
                </button>

                <button onclick="handleLogout()" class="hover:text-red-500 transition-all">
                    Log out
                </button>

            </div>

        </footer>

    </div>

</body>

</html>