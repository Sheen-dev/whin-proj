<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>PLMun - Classroom Booking & Search System</title>
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Inter & Font Awesome Icons CDN -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>

  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
          },
          colors: {
            plmun: {
              green: '#044D29',    /* PLMun Primary University Green */
              lightgreen: '#0B6E3D',
              accent: '#F59E0B',   /* Gold Highlight Accent */
              bg: '#FAFBFB',       /* Light Clean Minimal Background */
            }
          },
          animation: {
            'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          },
          keyframes: {
            fadeInUp: {
              '0%': { opacity: '0', transform: 'translateY(20px)' },
              '100%': { opacity: '1', transform: 'translateY(0)' },
            }
          }
        }
      }
    }
  </script>

  <style>
    /* Clean Minimalist Light Glassmorphism */
    .glass-card-light {
      background: rgba(255, 255, 255, 0.75);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(4, 77, 41, 0.08);
    }

    .glass-card-dark {
      background: rgba(4, 77, 41, 0.95);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .glass-nav {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(4, 77, 41, 0.1);
    }

    /* Grain Overlay Texture */
    .grain-overlay {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      opacity: 0.04;
      pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }

    /* Staggered Letter Animation for H3 Heading (Part 3) */
    @keyframes letterStagger {
      0% {
        opacity: 0;
        transform: translateY(20px);
        filter: blur(10px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
        filter: blur(0px);
      }
    }

    .stagger-char {
      display: inline-block;
      animation: letterStagger 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      opacity: 0;
    }

    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: #FAFBFB;
    }
    ::-webkit-scrollbar-thumb {
      background: #CBD5E1;
      border-radius: 9999px;
    }
  </style>
</head>

<body class="bg-plmun-bg text-zinc-900 font-sans antialiased min-h-screen relative selection:bg-plmun-green selection:text-white">

  <!-- Fixed Grain Overlay Texture -->
  <div class="grain-overlay z-50"></div>

  <!-- Background Gradient Accent -->
  <div class="fixed inset-0 bg-gradient-to-b from-emerald-50/60 via-plmun-bg to-white -z-10"></div>

  <!-- CONTAINER (Max-width 1600px, 2.5rem Rounded Containers) -->
  <div class="max-w-[1600px] mx-auto min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-8">

    <!-- FLOATING PLMUN GLASS NAVBAR -->
    <header class="glass-nav rounded-full px-6 py-3 flex items-center justify-between sticky top-4 z-40 transition-all duration-300 shadow-sm">
      <div class="flex items-center space-x-3 cursor-pointer" onclick="navigateTo('home-view')">
        <div class="w-9 h-9 bg-plmun-green text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm">
          <i class="fa-solid fa-graduation-cap text-xs"></i>
        </div>
        <div class="flex flex-col">
          <span class="tracking-widest font-extrabold text-sm sm:text-base uppercase text-plmun-green leading-none">PLMUN</span>
          <span class="text-[9px] font-semibold text-zinc-500 tracking-wider">CLASSROOM SEARCH</span>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="hidden md:flex items-center space-x-1 text-xs font-semibold uppercase tracking-wider">
        <button onclick="navigateTo('home-view')" class="px-4 py-2 rounded-full text-zinc-600 hover:bg-emerald-50 hover:text-plmun-green transition-all">Home</button>
        <button onclick="navigateTo('history-view')" class="px-4 py-2 rounded-full text-zinc-600 hover:bg-emerald-50 hover:text-plmun-green transition-all">History</button>
        <button onclick="navigateTo('account-view')" class="px-4 py-2 rounded-full text-zinc-600 hover:bg-emerald-50 hover:text-plmun-green transition-all">Account</button>
      </nav>

      <!-- Auth Action Button -->
      <div id="nav-auth-btn">
        <button onclick="navigateTo('login-view')" class="bg-plmun-green hover:bg-plmun-lightgreen text-white text-xs tracking-wider uppercase font-semibold px-5 py-2.5 rounded-full transition-all flex items-center gap-2 shadow-sm">
          <span>Login</span>
          <i class="fa-solid fa-arrow-right text-[10px]"></i>
        </button>
      </div>
    </header>

    <!-- MAIN VIEW AREA -->
    <main class="my-6 flex-1 relative">

      <!-- ========================================================================= -->
      <!-- VIEW 1: LOGIN SCREEN -->
      <!-- ========================================================================= -->
      <section id="login-view" class="view-panel hidden flex-col items-center justify-center min-h-[75vh] animate-fade-in-up">
        <div class="glass-card-light rounded-[2.5rem] p-8 sm:p-12 w-full max-w-md relative overflow-hidden shadow-xl border border-emerald-900/10">
          
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-plmun-green/10 border border-plmun-green/20 text-plmun-green rounded-full mx-auto flex items-center justify-center mb-4">
              <i class="fa-solid fa-magnifying-glass text-2xl"></i>
            </div>
            <h2 class="text-3xl font-extrabold tracking-tight text-plmun-green mb-1">PLMun Portal</h2>
            <p class="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Pamantasan ng Lungsod ng Muntinlupa</p>
          </div>

          <form id="login-form" onsubmit="handleLogin(event)" class="space-y-6">
            <div>
              <label class="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-600 mb-2">Student # / Teacher ID #</label>
              <input type="text" id="user-id" required placeholder="e.g. 2026-10492 or TCH-882" 
                class="w-full bg-white border border-zinc-200 rounded-2xl px-5 py-4 text-sm text-zinc-800 focus:outline-none focus:border-plmun-green focus:ring-2 focus:ring-plmun-green/10 transition-all placeholder:text-zinc-400">
            </div>

            <div>
              <label class="block text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-600 mb-2">Password</label>
              <input type="password" id="password" required placeholder="••••••••" 
                class="w-full bg-white border border-zinc-200 rounded-2xl px-5 py-4 text-sm text-zinc-800 focus:outline-none focus:border-plmun-green focus:ring-2 focus:ring-plmun-green/10 transition-all placeholder:text-zinc-400">
            </div>

            <!-- Custom Interactive Action Button -->
            <button type="submit" class="w-full group bg-plmun-green hover:bg-plmun-lightgreen transition-all duration-300 rounded-full pl-6 pr-2 py-2 flex items-center justify-between text-white font-medium shadow-md">
              <span class="font-semibold text-sm">Proceed to Platform</span>
              <span class="w-10 h-10 bg-white/20 group-hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all">
                <i class="fa-solid fa-arrow-right text-xs"></i>
              </span>
            </button>
          </form>

          <p class="text-center text-xs text-zinc-400 mt-6 font-light">
            Log in with your university credentials for full system privileges.
          </p>
        </div>
      </section>

      <!-- ========================================================================= -->
      <!-- VIEW 2: HOME & SEARCH DASHBOARD -->
      <!-- ========================================================================= -->
      <section id="home-view" class="view-panel flex flex-col gap-8 animate-fade-in-up">
        
        <!-- HERO SECTION -->
        <div class="relative rounded-[2.5rem] overflow-hidden min-h-[70vh] flex flex-col justify-between p-8 sm:p-12 border border-emerald-900/10 bg-gradient-to-br from-plmun-green via-plmun-green to-emerald-950 text-white shadow-xl">
          
          <!-- Background Accent Overlay & Watermark -->
          <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-10 pointer-events-none mix-blend-overlay"></div>
          <div class="absolute -bottom-10 -left-10 text-[22vw] font-black text-white/[0.04] select-none pointer-events-none leading-none blur-sm">
            PLMUN
          </div>

          <!-- Top Hero Row: Building Selection & Welcome -->
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p class="text-[10px] font-bold tracking-[0.2em] text-emerald-300 uppercase mb-2">Campus Location</p>
              <h2 id="welcome-message" class="text-3xl sm:text-5xl font-extrabold tracking-tight">Welcome to Building A</h2>
            </div>

            <!-- Building Selector Buttons -->
            <div class="flex items-center gap-2 bg-black/20 p-2 rounded-full border border-white/10 backdrop-blur-md">
              <button onclick="selectBuilding('Building A')" id="btn-bldg-a" class="building-btn active-bldg px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all bg-white text-plmun-green shadow-sm">Bldg A</button>
              <button onclick="selectBuilding('Building B')" id="btn-bldg-b" class="building-btn px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all text-white/80 hover:text-white">Bldg B</button>
              <button onclick="selectBuilding('Building C')" id="btn-bldg-c" class="building-btn px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all text-white/80 hover:text-white">Bldg C</button>
            </div>
          </div>

          <!-- Center Hero Row: PART 3 STAGGERED ANIMATED H3 -->
          <div class="relative z-10 my-8 max-w-4xl">
            <h3 id="animated-hero-heading" class="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-none text-white/95">
              <!-- Animated characters inserted via JavaScript -->
            </h3>
            <p class="text-emerald-100/80 text-sm sm:text-base mt-4 max-w-xl font-light">
              Where Values Matter. Seamless real-time classroom search and schedule index.
            </p>
          </div>

          <!-- Bottom Hero Row: Search Bar & Glass Cards -->
          <div class="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-8">
            
            <!-- Interactive Search Input Bar -->
            <div class="w-full lg:max-w-xl">
              <label class="block text-[10px] font-bold tracking-[0.2em] text-emerald-200 uppercase mb-2">Automated Availability Search</label>
              <div class="relative group">
                <input type="text" id="main-search-input" onkeyup="handleSearchTrigger()" placeholder="Search schedule (e.g. 3:00 pm - 5:00 pm or Room 4)..." 
                  class="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-full pl-14 pr-32 py-4 text-sm text-white placeholder:text-emerald-100/50 focus:outline-none focus:border-white focus:bg-white/20 shadow-2xl transition-all">
                <i class="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-emerald-200 transition-all"></i>
                <button onclick="executeSearch()" class="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-plmun-green hover:bg-emerald-50 text-xs font-bold px-5 py-2.5 rounded-full transition-all shadow-md">
                  Search
                </button>
              </div>
            </div>

            <!-- Glass Stats Stack -->
            <div class="flex items-center gap-4">
              <div class="glass-card-dark rounded-2xl p-5 w-36 flex flex-col justify-between">
                <span class="text-3xl font-bold tracking-tight text-white" id="stat-total-rooms">10</span>
                <span class="text-xs text-white/70 mt-1 font-light">Total Rooms</span>
              </div>
              <div class="glass-card-dark rounded-2xl p-5 w-36 flex flex-col justify-between border-emerald-400/40">
                <span class="text-3xl font-bold tracking-tight text-emerald-300" id="stat-available">06</span>
                <span class="text-xs text-white/70 mt-1 font-light">Available Now</span>
              </div>
            </div>

          </div>
        </div>

        <!-- SEARCH COMPARISON RESULTS PANEL -->
        <div id="search-results-wrapper" class="hidden glass-card-light rounded-[2.5rem] p-6 sm:p-8 animate-fade-in-up border border-plmun-green/20 shadow-lg">
          <div class="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200">
            <div>
              <span class="text-[10px] font-bold tracking-[0.2em] uppercase text-plmun-green">Comparison Logic Engine</span>
              <h4 class="text-xl font-bold text-zinc-900">Matching Room Schedule Results</h4>
            </div>
            <button onclick="clearSearch()" class="text-xs text-zinc-500 hover:text-plmun-green underline">Clear Results</button>
          </div>
          
          <div id="search-results-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Dynamic comparison cards inserted here -->
          </div>
        </div>

        <!-- ROOM LIST DIRECTORY -->
        <div class="space-y-4">
          <div class="flex items-center justify-between px-2">
            <h4 class="text-lg font-bold text-zinc-900">Building Room Directory</h4>
            <span class="text-xs text-zinc-400 font-mono">Live Sync</span>
          </div>

          <div id="room-list-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <!-- Room cards dynamically populated -->
          </div>
        </div>

        <!-- FEATURE GRID SECTION -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
          <!-- Left Column Sticky Header -->
          <div class="lg:col-span-5 glass-card-light rounded-[2.5rem] p-8 flex flex-col justify-between shadow-sm">
            <div>
              <p class="text-[10px] font-bold tracking-[0.2em] text-plmun-green uppercase mb-3">PLMun Architecture</p>
              <h3 class="text-4xl sm:text-5xl font-extrabold tracking-tight leading-none mb-8 text-zinc-900">Efficient Spatial Finder.</h3>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-sm">
                <i class="fa-solid fa-clock text-plmun-green mb-2"></i>
                <p class="text-xs font-bold text-zinc-800 uppercase tracking-wider">Time Matching</p>
              </div>
              <div class="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-sm">
                <i class="fa-solid fa-building-columns text-plmun-green mb-2"></i>
                <p class="text-xs font-bold text-zinc-800 uppercase tracking-wider">Multi-Building</p>
              </div>
              <div class="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-sm">
                <i class="fa-solid fa-user-shield text-plmun-green mb-2"></i>
                <p class="text-xs font-bold text-zinc-800 uppercase tracking-wider">Role Auth</p>
              </div>
              <div class="p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-sm">
                <i class="fa-solid fa-bolt text-plmun-green mb-2"></i>
                <p class="text-xs font-bold text-zinc-800 uppercase tracking-wider">Instant Filter</p>
              </div>
            </div>
          </div>

          <!-- Right Column Large Display Card -->
          <div class="lg:col-span-7 relative group rounded-[2.5rem] overflow-hidden min-h-[380px] border border-zinc-200/80 flex flex-col justify-end p-8 bg-zinc-900 shadow-md">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" 
              class="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-500 ease-out -z-0" alt="University environment"/>
            <div class="absolute inset-0 bg-gradient-to-t from-plmun-green/90 via-plmun-green/40 to-transparent -z-0"></div>

            <div class="relative z-10 glass-card-dark p-6 rounded-2xl max-w-md text-white">
              <span class="text-[10px] font-bold tracking-[0.2em] text-emerald-300 uppercase">Automated Indexing</span>
              <h4 class="text-xl font-bold mt-1">Smart Room Scheduling</h4>
              <p class="text-xs text-emerald-100/80 mt-2 font-light">
                Compare simultaneous availabilities between Room 4, Room 6, and Room 12 with minimal friction.
              </p>
            </div>
          </div>
        </div>

        <!-- DARK PRODUCTIVITY BLOCK -->
        <div class="w-full bg-plmun-green text-white rounded-[2.5rem] p-8 sm:p-12 border border-emerald-900/20 relative overflow-hidden shadow-xl">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div class="lg:col-span-5 space-y-6">
              <span class="text-[10px] font-bold tracking-[0.2em] text-emerald-300 uppercase">System Workflow</span>
              <h3 class="text-3xl font-extrabold tracking-tight">How the Finder Operates</h3>
              
              <div class="space-y-4">
                <div class="flex items-start gap-4 p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">
                  <span class="text-lg font-bold text-plmun-accent font-mono">01</span>
                  <div>
                    <h5 class="text-sm font-semibold">Select Building</h5>
                    <p class="text-xs text-emerald-100/70 mt-0.5">Filter room arrays instantly dynamic to Building A, B, or C.</p>
                  </div>
                </div>

                <div class="flex items-start gap-4 p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">
                  <span class="text-lg font-bold text-plmun-accent font-mono">02</span>
                  <div>
                    <h5 class="text-sm font-semibold">Automatic Time Comparison</h5>
                    <p class="text-xs text-emerald-100/70 mt-0.5">Filter identical schedules (e.g. 3:00 pm - 5:00 pm) across room slots.</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3D Window Code Mockup -->
            <div class="lg:col-span-7 flex justify-center">
              <div class="w-full max-w-lg bg-zinc-950 rounded-2xl p-6 border border-white/10 shadow-2xl transform lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-3 h-3 rounded-full bg-red-500"></div>
                  <div class="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span class="text-xs font-mono text-zinc-500 ml-2">plmun_room_logic.json</span>
                </div>
                <pre class="text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
{
  <span class="text-white">"institution"</span>: <span class="text-amber-300">"PLMun"</span>,
  <span class="text-white">"search_query"</span>: <span class="text-amber-300">"3:00 pm - 5:00 pm"</span>,
  <span class="text-white">"building"</span>: <span class="text-amber-300">"Building A"</span>,
  <span class="text-white">"results"</span>: [
    { <span class="text-white">"room"</span>: <span class="text-amber-300">"Room 4"</span>, <span class="text-white">"available"</span>: <span class="text-emerald-300">true</span> },
    { <span class="text-white">"room"</span>: <span class="text-amber-300">"Room 6"</span>, <span class="text-white">"available"</span>: <span class="text-emerald-300">true</span> },
    { <span class="text-white">"room"</span>: <span class="text-amber-300">"Room 12"</span>, <span class="text-white">"available"</span>: <span class="text-red-400">false</span> }
  ]
}
                </pre>
              </div>
            </div>

          </div>
        </div>

        <!-- PRICING / ACCESS BENTO GRID -->
        <div class="my-6">
          <div class="mb-6">
            <span class="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">User Privileges</span>
            <h3 class="text-2xl font-bold text-zinc-900">Campus Account Tiers</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div class="bg-white rounded-[2rem] p-6 flex flex-col justify-between border border-zinc-200/80 shadow-md">
              <div>
                <div class="h-14 flex items-center justify-between border-b border-zinc-100 pb-4">
                  <span class="text-[10px] font-bold tracking-widest uppercase text-zinc-400">Tier 01</span>
                  <i class="fa-solid fa-graduation-cap text-plmun-green text-xl"></i>
                </div>
                <div class="py-6">
                  <h4 class="text-2xl font-bold text-zinc-900">Student Account</h4>
                  <p class="text-xs text-zinc-500 mt-2">Log in using Student # to search room schedules and check availability.</p>
                </div>
              </div>
              <button onclick="navigateTo('login-view')" class="w-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold py-3 rounded-full transition-all">
                Student Access
              </button>
            </div>

            <div class="bg-white rounded-[2rem] p-6 flex flex-col justify-between border border-zinc-200/80 shadow-md">
              <div>
                <div class="h-14 flex items-center justify-between border-b border-zinc-100 pb-4">
                  <span class="text-[10px] font-bold tracking-widest uppercase text-plmun-green">Tier 02</span>
                  <i class="fa-solid fa-chalkboard-user text-plmun-green text-xl"></i>
                </div>
                <div class="py-6">
                  <h4 class="text-2xl font-bold text-zinc-900">Faculty Account</h4>
                  <p class="text-xs text-zinc-500 mt-2">Log in using Teacher ID # for faculty room reservations and priority override.</p>
                </div>
              </div>
              <button onclick="navigateTo('login-view')" class="w-full bg-plmun-green hover:bg-plmun-lightgreen text-white text-xs font-semibold py-3 rounded-full transition-all">
                Faculty Access
              </button>
            </div>

            <div class="bg-white rounded-[2rem] p-6 flex flex-col justify-between border border-zinc-200/80 shadow-md">
              <div>
                <div class="h-14 flex items-center justify-between border-b border-zinc-100 pb-4">
                  <span class="text-[10px] font-bold tracking-widest uppercase text-zinc-400">Tier 03</span>
                  <i class="fa-solid fa-building-flag text-plmun-green text-xl"></i>
                </div>
                <div class="py-6">
                  <h4 class="text-2xl font-bold text-zinc-900">Campus Admin</h4>
                  <p class="text-xs text-zinc-500 mt-2">Full administrative management over buildings and master schedules.</p>
                </div>
              </div>
              <button class="w-full bg-zinc-100 text-zinc-400 cursor-not-allowed text-xs font-semibold py-3 rounded-full">
                Admin Portal Only
              </button>
            </div>

          </div>
        </div>

      </section>

      <!-- ========================================================================= -->
      <!-- VIEW 3: HISTORY SCREEN -->
      <!-- ========================================================================= -->
      <section id="history-view" class="view-panel hidden flex-col animate-fade-in-up">
        <div class="glass-card-light rounded-[2.5rem] p-8 sm:p-12 border border-zinc-200 shadow-lg">
          <div class="flex items-center justify-between mb-8">
            <div>
              <p class="text-[10px] font-bold tracking-[0.2em] uppercase text-plmun-green">Activity Records</p>
              <h2 class="text-3xl font-extrabold text-zinc-900">Booking & Search History</h2>
            </div>
            <i class="fa-solid fa-clock-rotate-left text-2xl text-zinc-400"></i>
          </div>

          <div id="history-list-container" class="space-y-3">
            <!-- Dynamic history items -->
          </div>
        </div>
      </section>

      <!-- ========================================================================= -->
      <!-- VIEW 4: ACCOUNT SCREEN -->
      <!-- ========================================================================= -->
      <section id="account-view" class="view-panel hidden flex-col animate-fade-in-up">
        <div class="glass-card-light rounded-[2.5rem] p-8 sm:p-12 max-w-2xl mx-auto w-full border border-zinc-200 shadow-lg">
          <div class="text-center mb-8">
            <div class="w-20 h-20 bg-plmun-green/10 rounded-full border border-plmun-green/20 mx-auto flex items-center justify-center text-3xl text-plmun-green mb-4">
              <i class="fa-solid fa-user"></i>
            </div>
            <h2 id="account-user-id" class="text-2xl font-bold text-zinc-900">Not Logged In</h2>
            <p id="account-user-role" class="text-xs font-bold tracking-widest uppercase text-zinc-400 mt-1">Guest Session</p>
          </div>

          <div class="space-y-4 border-t border-zinc-200 pt-6">
            <div class="flex justify-between items-center py-3 border-b border-zinc-100 text-sm">
              <span class="text-zinc-500">Authentication Status</span>
              <span id="account-status-badge" class="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">Logged Out</span>
            </div>
            <div class="flex justify-between items-center py-3 border-b border-zinc-100 text-sm">
              <span class="text-zinc-500">Active Building Selection</span>
              <span id="account-active-bldg" class="font-semibold text-zinc-900">Building A</span>
            </div>
          </div>

          <div class="mt-8">
            <button onclick="handleLogout()" class="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3 rounded-full transition-all text-xs tracking-wider uppercase border border-red-200">
              Log Out
            </button>
          </div>
        </div>
      </section>

    </main>

    <!-- FOOTER NAV LOGIC -->
    <footer class="mt-auto pt-6 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
      <div class="flex items-center gap-3">
        <button onclick="navigateTo('home-view')" class="w-10 h-10 rounded-full bg-white border border-zinc-200 shadow-sm hover:bg-emerald-50 text-plmun-green flex items-center justify-center transition-all">
          <i class="fa-solid fa-house"></i>
        </button>
        <span class="font-semibold text-zinc-600">Pamantasan ng Lungsod ng Muntinlupa</span>
      </div>

      <div class="flex items-center gap-6 text-zinc-500 font-medium">
        <button onclick="navigateTo('account-view')" class="hover:text-plmun-green transition-all">Account</button>
        <button onclick="navigateTo('history-view')" class="hover:text-plmun-green transition-all">History</button>
        <button onclick="handleLogout()" class="hover:text-red-500 transition-all">Log out</button>
      </div>
    </footer>

  </div>

  <!-- JAVASCRIPT SYSTEM LOGIC -->
  <script>
    const ROOM_NUMBERS = [1, 2, 4, 5, 6, 7, 8, 9, 10, 12];
    
    let state = {
      currentUser: null,
      activeBuilding: 'Building A',
      searchQuery: '',
      history: [
        { time: '2:30 PM', action: 'Searched 3:00 pm - 5:00 pm in Building A' },
        { time: '1:15 PM', action: 'Switched to Building A Directory' }
      ]
    };

    function generateRoomData() {
      return ROOM_NUMBERS.map(roomNum => {
        let available = Math.random() > 0.3;
        if ([4, 6].includes(roomNum)) available = true;
        if (roomNum === 12) available = false;

        return {
          name: `Room ${roomNum}`,
          building: state.activeBuilding,
          timeSlot: "3:00 pm - 5:00 pm",
          locationTag: "AVHL ROOM",
          available: available
        };
      });
    }

    let currentRooms = generateRoomData();

    document.addEventListener('DOMContentLoaded', () => {
      renderAnimatedH3("PLMun Classroom Search & Spatial Finder");
      renderRooms();
      renderHistory();
    });

    // PART 3: Staggered Letter Animation Component
    function renderAnimatedH3(text) {
      const headingEl = document.getElementById('animated-hero-heading');
      headingEl.innerHTML = '';
      
      const words = text.split(' ');
      let charCount = 0;

      words.forEach((word) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'inline-block whitespace-nowrap mr-3';

        for (let i = 0; i < word.length; i++) {
          const charSpan = document.createElement('span');
          charSpan.className = 'stagger-char';
          charSpan.textContent = word[i];
          charSpan.style.animationDelay = `${charCount * 0.035}s`;
          wordSpan.appendChild(charSpan);
          charCount++;
        }

        headingEl.appendChild(wordSpan);
      });
    }

    // View Switching
    function navigateTo(viewId) {
      document.querySelectorAll('.view-panel').forEach(panel => {
        panel.classList.add('hidden');
        panel.classList.remove('flex');
      });

      const target = document.getElementById(viewId);
      target.classList.remove('hidden');
      target.classList.add('flex');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Building Selector Engine
    function selectBuilding(bldgName) {
      state.activeBuilding = bldgName;
      document.getElementById('welcome-message').textContent = `Welcome to ${bldgName}`;
      document.getElementById('account-active-bldg').textContent = bldgName;
      
      ['Building A', 'Building B', 'Building C'].forEach((bldg, idx) => {
        const btnId = ['btn-bldg-a', 'btn-bldg-b', 'btn-bldg-c'][idx];
        const btn = document.getElementById(btnId);
        if (bldg === bldgName) {
          btn.className = "building-btn active-bldg px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all bg-white text-plmun-green shadow-sm";
        } else {
          btn.className = "building-btn px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all text-white/80 hover:text-white";
        }
      });

      currentRooms = generateRoomData();
      renderRooms();
      if(state.searchQuery) executeSearch();
    }

    // Render Room Card Grid
    function renderRooms() {
      const container = document.getElementById('room-list-container');
      container.innerHTML = '';
      let availCount = 0;

      currentRooms.forEach(room => {
        if(room.available) availCount++;
        const card = document.createElement('div');
        card.className = "bg-white rounded-2xl p-5 flex flex-col justify-between border border-zinc-200/80 shadow-sm hover:border-plmun-green/40 hover:shadow-md transition-all duration-300 group";
        card.innerHTML = `
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">${room.locationTag}</span>
              <span class="w-2.5 h-2.5 rounded-full ${room.available ? 'bg-emerald-500 shadow-[0_0_8px_#10B981]' : 'bg-red-500'}"></span>
            </div>
            <h5 class="text-xl font-bold text-zinc-900 group-hover:text-plmun-green transition-colors">${room.name}</h5>
            <p class="text-xs text-zinc-400 mt-1 font-mono">${room.timeSlot}</p>
          </div>
          <div class="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
            <span class="${room.available ? 'text-emerald-600' : 'text-red-500'} font-semibold">
              ${room.available ? 'Available' : 'Occupied'}
            </span>
            <button onclick="bookRoom('${room.name}')" ${!room.available ? 'disabled' : ''} 
              class="${room.available ? 'bg-plmun-green text-white hover:bg-plmun-lightgreen' : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'} px-3 py-1.5 rounded-full font-semibold text-[11px] transition-all">
              Book
            </button>
          </div>
        `;
        container.appendChild(card);
      });

      document.getElementById('stat-total-rooms').textContent = currentRooms.length.toString().padStart(2, '0');
      document.getElementById('stat-available').textContent = availCount.toString().padStart(2, '0');
    }

    // Automatic Search and Comparison Logic Trigger
    function handleSearchTrigger() {
      const query = document.getElementById('main-search-input').value.trim();
      state.searchQuery = query;
      if (query.length > 0) {
        executeSearch();
      } else {
        clearSearch();
      }
    }

    function executeSearch() {
      const wrapper = document.getElementById('search-results-wrapper');
      const container = document.getElementById('search-results-container');
      const query = document.getElementById('main-search-input').value.toLowerCase();
      
      wrapper.classList.remove('hidden');
      container.innerHTML = '';

      const matchingRooms = currentRooms.filter(room => 
        room.name.toLowerCase().includes(query) || 
        room.timeSlot.toLowerCase().includes(query) ||
        room.locationTag.toLowerCase().includes(query) ||
        query === ""
      );

      if (matchingRooms.length === 0) {
        container.innerHTML = `<p class="text-sm text-zinc-500 col-span-full py-4 text-center">No matching PLMun classroom schedules found.</p>`;
      } else {
        matchingRooms.forEach(room => {
          const resCard = document.createElement('div');
          resCard.className = "bg-white border border-zinc-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm";
          resCard.innerHTML = `
            <div>
              <div class="flex justify-between items-center mb-1">
                <span class="text-xs font-mono text-plmun-green font-bold">${room.timeSlot}</span>
                <span class="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${room.available ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}">
                  ${room.available ? 'YES (Available)' : 'NO (Occupied)'}
                </span>
              </div>
              <h5 class="text-lg font-bold text-zinc-900">${room.name}</h5>
              <p class="text-xs text-zinc-400 uppercase tracking-wider">${room.locationTag} - ${room.building}</p>
            </div>
            <div class="mt-3 flex justify-end">
              <button onclick="bookRoom('${room.name}')" ${!room.available ? 'disabled' : ''} 
                class="${room.available ? 'bg-plmun-green text-white hover:bg-plmun-lightgreen' : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'} px-4 py-1.5 rounded-full text-xs font-bold transition-all">
                ${room.available ? 'Reserve Now' : 'Unavailable'}
              </button>
            </div>
          `;
          container.appendChild(resCard);
        });
      }

      state.history.unshift({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: `Searched query "${query || 'All Rooms'}" in ${state.activeBuilding}`
      });
      renderHistory();
    }

    function clearSearch() {
      document.getElementById('main-search-input').value = '';
      document.getElementById('search-results-wrapper').classList.add('hidden');
      state.searchQuery = '';
    }

    // Auth Logic
    function handleLogin(event) {
      event.preventDefault();
      const userId = document.getElementById('user-id').value.trim();
      
      let role = 'Student';
      if (userId.toLowerCase().includes('tch') || userId.toLowerCase().includes('teacher')) {
        role = 'Faculty (Teacher)';
      }

      state.currentUser = { id: userId, role: role };

      document.getElementById('nav-auth-btn').innerHTML = `
        <button onclick="navigateTo('account-view')" class="bg-emerald-100 text-plmun-green hover:bg-emerald-200 text-xs tracking-wider uppercase font-bold px-5 py-2.5 rounded-full transition-all flex items-center gap-2">
          <i class="fa-solid fa-user-check"></i>
          <span>${userId}</span>
        </button>
      `;

      document.getElementById('account-user-id').textContent = userId;
      document.getElementById('account-user-role').textContent = role;
      document.getElementById('account-status-badge').textContent = 'Authenticated';
      document.getElementById('account-status-badge').className = 'px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700';

      alert(`Welcome to PLMun Portal! Logged in as ${role} (${userId})`);
      navigateTo('home-view');
    }

    function handleLogout() {
      state.currentUser = null;
      document.getElementById('nav-auth-btn').innerHTML = `
        <button onclick="navigateTo('login-view')" class="bg-plmun-green hover:bg-plmun-lightgreen text-white text-xs tracking-wider uppercase font-semibold px-5 py-2.5 rounded-full transition-all flex items-center gap-2">
          <span>Login</span>
          <i class="fa-solid fa-arrow-right text-[10px]"></i>
        </button>
      `;
      document.getElementById('account-user-id').textContent = 'Not Logged In';
      document.getElementById('account-user-role').textContent = 'Guest Session';
      document.getElementById('account-status-badge').textContent = 'Logged Out';
      document.getElementById('account-status-badge').className = 'px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600';
      
      alert('You have logged out from PLMun Portal.');
      navigateTo('home-view');
    }

    function bookRoom(roomName) {
      if (!state.currentUser) {
        alert('Please log in with your PLMun credentials to reserve a classroom.');
        navigateTo('login-view');
        return;
      }
      alert(`Success! ${roomName} (${state.activeBuilding}) reserved for ${state.currentUser.id} (${state.currentUser.role}).`);
      
      state.history.unshift({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: `Reserved ${roomName} (${state.activeBuilding})`
      });
      renderHistory();
    }

    function renderHistory() {
      const container = document.getElementById('history-list-container');
      container.innerHTML = '';

      state.history.forEach(item => {
        const row = document.createElement('div');
        row.className = "flex items-center justify-between p-4 rounded-2xl bg-white border border-zinc-200/80 text-sm shadow-sm";
        row.innerHTML = `
          <div class="flex items-center gap-3">
            <i class="fa-solid fa-bolt text-plmun-green"></i>
            <span class="text-zinc-700 font-medium">${item.action}</span>
          </div>
          <span class="text-xs font-mono text-zinc-400">${item.time}</span>
        `;
        container.appendChild(row);
      });
    }
  </script>
</body>
</html>