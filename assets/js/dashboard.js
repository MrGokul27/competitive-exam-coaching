document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // 1. Role Definitions & Default Mock Profiles
  const roleProfiles = {
    student_upsc: {
      roleKey: "student_upsc",
      roleLabel: "UPSC Civil Services Aspirant",
      badgeColor: "dash-badge-primary",
      defaultName: "Aditya Verma",
      defaultEmail: "aditya.upsc2026@stackly.edu",
      avatar: "../assets/images/home/home-topper-photo-1.webp",
      enrollmentId: "UPSC-2026-8842",
      targetExam: "UPSC CSE Prelims & Mains 2026",
      mentor: "Dr. Vikas Sharma (Ex-IAS)",
      batch: "GS Foundation Super-50 Batch A-1",
      countdownDays: 142,
    },
    student_banking: {
      roleKey: "student_banking",
      roleLabel: "Banking & SSC Aspirant",
      badgeColor: "dash-badge-warning",
      defaultName: "Pooja Deshmukh",
      defaultEmail: "pooja.bankpo@stackly.edu",
      avatar: "../assets/images/home/home-topper-photo-2.webp",
      enrollmentId: "BANK-2026-3490",
      targetExam: "SBI PO & IBPS PO 2026",
      mentor: "Prof. Rajesh Nair (Quant Specialist)",
      batch: "Banking Speed Pro Batch B-3",
      countdownDays: 58,
    },
    student_state: {
      roleKey: "student_state",
      roleLabel: "State PSC & Defense Aspirant",
      badgeColor: "dash-badge-info",
      defaultName: "Vikramaditya Singh",
      defaultEmail: "vikram.statepsc@stackly.edu",
      avatar: "../assets/images/home/home-topper-photo-3.webp",
      enrollmentId: "STATE-2026-6120",
      targetExam: "State Combined Civil Services & NDA",
      mentor: "Col. Sanjeev Rawat (Defense Mentor)",
      batch: "State PSC + SSB Command Batch",
      countdownDays: 89,
    },
    faculty: {
      roleKey: "faculty",
      roleLabel: "Faculty / Subject Mentor",
      badgeColor: "dash-badge-success",
      defaultName: "Dr. Vikas Sharma",
      defaultEmail: "vikas.sharma@stackly.edu",
      avatar: "../assets/images/home/home-mentor-image-1.webp",
      enrollmentId: "FAC-POL-014",
      targetExam: "Indian Polity & Governance Faculty",
      mentor: "Academic Dean",
      batch: "Assigned Batches: UPSC A-1, B-2, Weekend Pro",
      countdownDays: null,
    },
    admin: {
      roleKey: "admin",
      roleLabel: "Academy Administrator",
      badgeColor: "dash-badge-danger",
      defaultName: "Prof. Arthur Pendelton",
      defaultEmail: "admin@stackly.edu",
      avatar: "../assets/images/home/home-mentor-image-2.webp",
      enrollmentId: "ADM-SUPER-001",
      targetExam: "Central Academy Administration",
      mentor: "Governing Board",
      batch: "All 28 Academy Batches Active",
      countdownDays: null,
    },
    parent: {
      roleKey: "parent",
      roleLabel: "Parent / Guardian",
      badgeColor: "dash-badge-info",
      defaultName: "Suresh & Meena Verma",
      defaultEmail: "suresh.verma@gmail.com",
      avatar: "../assets/images/home/home-testimonial-author-1.webp",
      enrollmentId: "PAR-8842-GUARDIAN",
      targetExam: "Ward: Aditya Verma (UPSC 2026)",
      mentor: "Dr. Vikas Sharma (Mentor)",
      batch: "Ward in GS Foundation Super-50",
      countdownDays: 142,
    },
  };

  // 2. Resolve Current User Profile & Role
  let currentUser = null;
  const storedUserRaw =
    localStorage.getItem("stackly_user_profile") ||
    sessionStorage.getItem("stackly_user_profile");

  if (storedUserRaw) {
    try {
      currentUser = JSON.parse(storedUserRaw);
    } catch (e) {
      console.warn("Could not parse stored session user profile", e);
    }
  }

  // Check URL query parameters for ?role=...
  const urlParams = new URLSearchParams(window.location.search);
  const queryRole = urlParams.get("role");

  let currentRoleKey = "student_upsc";
  if (queryRole && roleProfiles[queryRole]) {
    currentRoleKey = queryRole;
  } else if (
    currentUser &&
    currentUser.role &&
    roleProfiles[currentUser.role]
  ) {
    currentRoleKey = currentUser.role;
  }

  // If user object not populated, use role profile defaults
  const baseProfile = roleProfiles[currentRoleKey] || roleProfiles.student_upsc;
  const activeUser = {
    role: currentRoleKey,
    name:
      currentUser && currentUser.name
        ? currentUser.name
        : baseProfile.defaultName,
    email:
      currentUser && currentUser.email
        ? currentUser.email
        : baseProfile.defaultEmail,
    avatar:
      currentUser && currentUser.avatar
        ? currentUser.avatar
        : baseProfile.avatar,
    enrollmentId: baseProfile.enrollmentId,
    targetExam: baseProfile.targetExam,
    mentor: baseProfile.mentor,
    batch: baseProfile.batch,
    roleLabel: baseProfile.roleLabel,
  };

  // Save current active state
  localStorage.setItem("stackly_user_profile", JSON.stringify(activeUser));

  // 3. Update DOM UI with User Profile Data
  function updateUIProfile(user) {
    const profile = roleProfiles[user.role] || roleProfiles.student_upsc;

    // Topbar Profile
    const topbarName = document.getElementById("topbarUserName");
    const topbarRole = document.getElementById("topbarUserRole");
    const topbarAvatar = document.getElementById("topbarUserAvatar");
    const roleSelect = document.getElementById("topbarRoleSelect");

    if (topbarName) topbarName.textContent = user.name;
    if (topbarRole) topbarRole.textContent = profile.roleLabel;
    if (topbarAvatar) topbarAvatar.src = user.avatar;
    if (roleSelect) roleSelect.value = user.role;

    // Sidebar Profile
    const sidebarName = document.getElementById("sidebarUserName");
    const sidebarRoleBadge = document.getElementById("sidebarUserRoleBadge");
    const sidebarAvatar = document.getElementById("sidebarUserAvatar");

    if (sidebarName) sidebarName.textContent = user.name;
    if (sidebarRoleBadge) {
      sidebarRoleBadge.textContent =
        profile.roleLabel.split(" ")[0] + " Portal";
    }
    if (sidebarAvatar) sidebarAvatar.src = user.avatar;

    // Dynamic Greetings in Hero Banners
    document
      .querySelectorAll(".dyn-user-name")
      .forEach((el) => (el.textContent = user.name));
    document
      .querySelectorAll(".dyn-user-email")
      .forEach((el) => (el.textContent = user.email));
    document
      .querySelectorAll(".dyn-user-batch")
      .forEach((el) => (el.textContent = user.batch));
    document
      .querySelectorAll(".dyn-user-mentor")
      .forEach((el) => (el.textContent = user.mentor));
    document
      .querySelectorAll(".dyn-user-id")
      .forEach((el) => (el.textContent = user.enrollmentId));
  }

  // 4. Role Views & Sidebar Menus Configuration
  const sidebarMenus = {
    student_upsc: [
      {
        id: "upsc-overview",
        icon: "fa-gauge-high",
        label: "Overview & Targets",
        badge: "Live",
      },
      {
        id: "upsc-courses",
        icon: "fa-book-open-reader",
        label: "My Courses & Syllabus",
        badge: "3 Active",
      },
      {
        id: "upsc-mocks",
        icon: "fa-file-lines",
        label: "Mock Tests & Answer Copies",
        badge: "8 Mocks",
      },
      {
        id: "upsc-analytics",
        icon: "fa-chart-pie",
        label: "Performance & AIR Matrix",
      },
      {
        id: "upsc-classes",
        icon: "fa-calendar-days",
        label: "Live Timetable & Classes",
        badge: "Today",
      },
      {
        id: "upsc-materials",
        icon: "fa-folder-open",
        label: "PYQs & Monthly Capsules",
      },
      {
        id: "upsc-doubts",
        icon: "fa-comments",
        label: "1-on-1 Mentor Doubt Desk",
      },
      {
        id: "upsc-fees",
        icon: "fa-receipt",
        label: "Fee Receipts & Hall Ticket",
      },
    ],
    student_banking: [
      {
        id: "banking-overview",
        icon: "fa-gauge-high",
        label: "Banking Speed Center",
        badge: "AIR 142",
      },
      {
        id: "banking-courses",
        icon: "fa-graduation-cap",
        label: "SBI & IBPS Batches",
      },
      {
        id: "banking-speedtests",
        icon: "fa-stopwatch-20",
        label: "Sectional Speed Tests",
        badge: "Daily",
      },
      {
        id: "banking-analytics",
        icon: "fa-chart-line",
        label: "Quant & Reasoning Matrix",
      },
      {
        id: "banking-classes",
        icon: "fa-video",
        label: "Shortcut Tricks Live Studio",
      },
      {
        id: "banking-capsules",
        icon: "fa-newspaper",
        label: "Monthly Banking Capsules",
      },
    ],
    student_state: [
      {
        id: "state-overview",
        icon: "fa-gauge-high",
        label: "State & Defense Overview",
        badge: "Target 2026",
      },
      {
        id: "state-modules",
        icon: "fa-landmark",
        label: "State Special GK & History",
      },
      {
        id: "state-mocks",
        icon: "fa-bullseye",
        label: "State PSC & SSB Tests",
        badge: "New",
      },
      {
        id: "state-materials",
        icon: "fa-book-bookmark",
        label: "Economic Survey & Maps",
      },
    ],
    faculty: [
      {
        id: "faculty-overview",
        icon: "fa-chalkboard-user",
        label: "Mentor Command Center",
        badge: "3 Live Today",
      },
      {
        id: "faculty-batches",
        icon: "fa-users-rectangle",
        label: "My Batches & Roster",
        badge: "1,420 Aspirants",
      },
      {
        id: "faculty-grading",
        icon: "fa-pen-to-square",
        label: "Mains Copy Grading",
        badge: "18 Pending",
      },
      {
        id: "faculty-studio",
        icon: "fa-tower-broadcast",
        label: "Live Lecture Studio",
      },
      {
        id: "faculty-quizzes",
        icon: "fa-circle-question",
        label: "Create Tests & MCQs",
      },
      {
        id: "faculty-doubts",
        icon: "fa-inbox",
        label: "Student Doubt Inbox",
        badge: "9 Unread",
      },
    ],
    admin: [
      {
        id: "admin-overview",
        icon: "fa-building-columns",
        label: "Academy Master KPI",
        badge: "Live",
      },
      {
        id: "admin-students",
        icon: "fa-user-graduate",
        label: "Student Directory",
        badge: "12,450",
      },
      {
        id: "admin-faculty",
        icon: "fa-user-tie",
        label: "Faculty & Mentors",
        badge: "48 Mentors",
      },
      {
        id: "admin-batches",
        icon: "fa-layer-group",
        label: "Batch & Room Scheduler",
      },
      {
        id: "admin-finance",
        icon: "fa-sack-dollar",
        label: "Revenue & Fee Ledger",
        badge: "₹48.5L",
      },
      {
        id: "admin-notices",
        icon: "fa-bullhorn",
        label: "Broadcast Notice Board",
      },
      {
        id: "admin-logs",
        icon: "fa-shield-halved",
        label: "System & Server Logs",
      },
    ],
    parent: [
      {
        id: "parent-overview",
        icon: "fa-house-user",
        label: "Ward Academic Progress",
        badge: "Rank 8%",
      },
      {
        id: "parent-growth",
        icon: "fa-chart-simple",
        label: "Month-on-Month Growth",
      },
      {
        id: "parent-fees",
        icon: "fa-file-invoice-dollar",
        label: "Fee Ledger & Receipts",
      },
      {
        id: "parent-mentor",
        icon: "fa-phone-volume",
        label: "Mentor Call Booking",
      },
    ],
  };

  // 5. Render Sidebar Navigation for Active Role
  function renderSidebar(roleKey) {
    const navContainer = document.getElementById("sidebarNavList");
    if (!navContainer) return;

    const items = sidebarMenus[roleKey] || sidebarMenus.student_upsc;
    let html = "";

    items.forEach((item, index) => {
      const isFirst = index === 0;
      html += `
        <li>
          <button type="button" 
                  class="sidebar-nav-link ${isFirst ? "active" : ""}" 
                  data-target-pane="${item.id}">
            <i class="fa-solid ${item.icon}"></i>
            <span>${item.label}</span>
            ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ""}
          </button>
        </li>
      `;
    });

    navContainer.innerHTML = html;

    // Attach click listener to each sidebar link for smooth tab switching
    navContainer.querySelectorAll(".sidebar-nav-link").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Update active class in sidebar
        navContainer
          .querySelectorAll(".sidebar-nav-link")
          .forEach((b) => b.classList.remove("active"));
        this.classList.add("active");

        const targetPaneId = this.getAttribute("data-target-pane");
        switchTabPane(targetPaneId);

        // On mobile view, auto-close sidebar after tab click
        if (window.innerWidth < 992) {
          closeMobileSidebar();
        }
      });
    });
  }

  // 6. Switch Role View Container
  function switchRole(newRoleKey) {
    if (!roleProfiles[newRoleKey]) newRoleKey = "student_upsc";
    currentRoleKey = newRoleKey;

    // Update activeUser
    activeUser.role = currentRoleKey;
    const base = roleProfiles[currentRoleKey];
    activeUser.roleLabel = base.roleLabel;
    activeUser.avatar = base.avatar;
    activeUser.targetExam = base.targetExam;
    activeUser.batch = base.batch;
    activeUser.mentor = base.mentor;
    activeUser.enrollmentId = base.enrollmentId;

    localStorage.setItem("stackly_user_profile", JSON.stringify(activeUser));
    updateUIProfile(activeUser);

    // Hide all role wrappers, display active role wrapper
    document.querySelectorAll(".role-dashboard-view").forEach((view) => {
      view.classList.remove("active");
    });

    const activeView = document.getElementById(`role-view-${currentRoleKey}`);
    if (activeView) {
      activeView.classList.add("active");
    }

    // Re-render sidebar navigation items
    renderSidebar(currentRoleKey);

    // Show first tab in this role view
    const firstMenu =
      sidebarMenus[currentRoleKey] && sidebarMenus[currentRoleKey][0]
        ? sidebarMenus[currentRoleKey][0].id
        : null;
    if (firstMenu) {
      switchTabPane(firstMenu);
    }

    // Initialize/refresh charts for this role
    initRoleCharts(currentRoleKey);
  }

  // 7. Tab Pane Switching Logic
  function switchTabPane(paneId) {
    const currentView = document.getElementById(`role-view-${currentRoleKey}`);
    if (!currentView) return;

    // Hide all panes inside the current role view
    currentView.querySelectorAll(".tab-pane-content").forEach((pane) => {
      pane.classList.remove("active");
    });

    // Show target pane
    const targetPane = document.getElementById(paneId);
    if (targetPane) {
      targetPane.classList.add("active");
    }

    // Update breadcrumb subtitle
    const breadcrumbSub = document.getElementById("topbarBreadcrumbSub");
    if (breadcrumbSub) {
      const activeNavBtn = document.querySelector(
        `.sidebar-nav-link[data-target-pane="${paneId}"] span`,
      );
      if (activeNavBtn) {
        breadcrumbSub.innerHTML = `<i class="fa-solid fa-angle-right"></i> ${activeNavBtn.textContent}`;
      }
    }

    // Smooth scroll to top of content area on view switch
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // 8. Topbar Role Selector Switcher Event
  const topbarRoleSelect = document.getElementById("topbarRoleSelect");
  if (topbarRoleSelect) {
    topbarRoleSelect.addEventListener("change", function () {
      switchRole(this.value);
    });
  }

  // 9. Mobile Sidebar Drawer Toggles
  const sidebarToggleBtn = document.getElementById("sidebarToggleBtn");
  const sidebarCloseBtn = document.getElementById("sidebarCloseBtn");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const dashboardSidebar = document.getElementById("dashboardSidebar");

  function openMobileSidebar() {
    if (dashboardSidebar) dashboardSidebar.classList.add("show");
    if (sidebarOverlay) sidebarOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeMobileSidebar() {
    if (dashboardSidebar) dashboardSidebar.classList.remove("show");
    if (sidebarOverlay) sidebarOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (sidebarToggleBtn)
    sidebarToggleBtn.addEventListener("click", openMobileSidebar);
  if (sidebarCloseBtn)
    sidebarCloseBtn.addEventListener("click", closeMobileSidebar);
  if (sidebarOverlay)
    sidebarOverlay.addEventListener("click", closeMobileSidebar);

  // 10. Logout Action Event
  const logoutButtons = document.querySelectorAll(
    ".sidebar-logout-btn, .user-logout-action",
  );
  logoutButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      localStorage.removeItem("stackly_user_profile");
      sessionStorage.removeItem("stackly_user_profile");
      window.location.href = "login.html";
    });
  });

  // 11. Chart.js Graphs Initialization
  const chartInstances = {};

  function initRoleCharts(role) {
    if (typeof Chart === "undefined") return;

    // Theme Color Palette
    const colorPrimary = "#31645e";
    const colorSecondary = "#e6a735";
    const colorAccent = "#ffe4aa";
    const colorMuted = "#6c757d";

    // Chart 1: UPSC Score Progression Chart
    if (role === "student_upsc") {
      const upscCtx = document.getElementById("upscScoreChart");
      if (upscCtx) {
        if (chartInstances.upscScore) chartInstances.upscScore.destroy();
        chartInstances.upscScore = new Chart(upscCtx, {
          type: "line",
          data: {
            labels: [
              "Mock 1",
              "Mock 2",
              "Mock 3",
              "Mock 4",
              "Mock 5",
              "Mock 6",
              "Mock 7",
              "Mock 8",
            ],
            datasets: [
              {
                label: "Prelims GS Paper 1 (Marks / 200)",
                data: [78, 86, 94, 98, 106, 114, 122, 128],
                borderColor: colorPrimary,
                backgroundColor: "rgba(49, 100, 94, 0.12)",
                fill: true,
                tension: 0.35,
                borderWidth: 3,
                pointRadius: 4,
                pointBackgroundColor: colorPrimary,
              },
              {
                label: "All India Cutoff Benchmark",
                data: [88, 88, 88, 88, 88, 88, 88, 88],
                borderColor: "#dc3545",
                borderDash: [5, 5],
                borderWidth: 2,
                fill: false,
                pointRadius: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 200,
            animation: {
              duration: 600,
              easing: "easeOutQuart",
            },
            plugins: {
              legend: {
                position: "top",
                labels: { boxWidth: 12, font: { family: "Roboto" } },
              },
            },
            scales: {
              y: { min: 50, max: 160, grid: { color: "#f0f4f4" } },
              x: { grid: { display: false } },
            },
          },
        });
      }

      // UPSC Subject Radar / Accuracy Breakdown
      const upscRadarCtx = document.getElementById("upscSubjectChart");
      if (upscRadarCtx) {
        if (chartInstances.upscRadar) chartInstances.upscRadar.destroy();
        chartInstances.upscRadar = new Chart(upscRadarCtx, {
          type: "bar",
          data: {
            labels: [
              "Polity",
              "Modern Hist.",
              "Economy",
              "Geography",
              "Env & Eco",
              "Sci & Tech",
              "CSAT Quant",
            ],
            datasets: [
              {
                label: "Accuracy %",
                data: [92, 84, 76, 88, 70, 68, 82],
                backgroundColor: [
                  "rgba(49, 100, 94, 0.85)",
                  "rgba(49, 100, 94, 0.7)",
                  "rgba(230, 167, 53, 0.85)",
                  "rgba(49, 100, 94, 0.75)",
                  "rgba(230, 167, 53, 0.7)",
                  "rgba(220, 53, 69, 0.75)",
                  "rgba(49, 100, 94, 0.9)",
                ],
                borderRadius: 6,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 200,
            animation: {
              duration: 600,
              easing: "easeOutQuart",
            },
            plugins: { legend: { display: false } },
            scales: {
              y: {
                min: 0,
                max: 100,
                ticks: { callback: (v) => v + "%" },
                grid: { color: "#f0f4f4" },
              },
              x: { grid: { display: false } },
            },
          },
        });
      }
    }

    // Chart 2: Banking Speed Drill Chart
    if (role === "student_banking") {
      const bankCtx = document.getElementById("bankingSpeedChart");
      if (bankCtx) {
        if (chartInstances.bankingSpeed) chartInstances.bankingSpeed.destroy();
        chartInstances.bankingSpeed = new Chart(bankCtx, {
          type: "bar",
          data: {
            labels: [
              "Quant Drill",
              "Reasoning Puzzles",
              "English Cloze",
              "Banking GA",
              "Computer Aptitude",
            ],
            datasets: [
              {
                label: "Attempted in 20 min",
                data: [32, 35, 28, 38, 36],
                backgroundColor: colorPrimary,
                borderRadius: 4,
              },
              {
                label: "Correct Answers",
                data: [29, 33, 25, 36, 34],
                backgroundColor: colorSecondary,
                borderRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 200,
            animation: {
              duration: 600,
              easing: "easeOutQuart",
            },
            plugins: { legend: { position: "top" } },
            scales: {
              y: { min: 0, max: 40, grid: { color: "#f0f4f4" } },
              x: { grid: { display: false } },
            },
          },
        });
      }
    }

    // Chart 3: Faculty Grading Volume
    if (role === "faculty") {
      const facCtx = document.getElementById("facultyGradingChart");
      if (facCtx) {
        if (chartInstances.facGrading) chartInstances.facGrading.destroy();
        chartInstances.facGrading = new Chart(facCtx, {
          type: "line",
          data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
              {
                label: "Mains Answer Copies Evaluated",
                data: [14, 22, 18, 25, 30, 16, 20],
                borderColor: colorPrimary,
                backgroundColor: "rgba(49, 100, 94, 0.15)",
                fill: true,
                tension: 0.3,
                borderWidth: 3,
                pointBackgroundColor: colorPrimary,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 200,
            animation: {
              duration: 600,
              easing: "easeOutQuart",
            },
            scales: { y: { beginAtZero: true, grid: { color: "#f0f4f4" } } },
          },
        });
      }
    }

    // Chart 4: Admin Revenue & Admissions
    if (role === "admin") {
      const adminCtx = document.getElementById("adminRevenueChart");
      if (adminCtx) {
        if (chartInstances.adminRev) chartInstances.adminRev.destroy();
        chartInstances.adminRev = new Chart(adminCtx, {
          type: "bar",
          data: {
            labels: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
            ],
            datasets: [
              {
                type: "bar",
                label: "New Admissions",
                data: [320, 410, 480, 590, 680, 720, 810, 890, 940],
                backgroundColor: "rgba(49, 100, 94, 0.85)",
                borderRadius: 4,
                yAxisID: "y",
              },
              {
                type: "line",
                label: "Fee Collection (in ₹ Lakhs)",
                data: [18, 22, 28, 34, 38, 41, 44, 46, 48.5],
                borderColor: colorSecondary,
                backgroundColor: colorSecondary,
                borderWidth: 3,
                yAxisID: "y1",
                tension: 0.3,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 200,
            animation: {
              duration: 600,
              easing: "easeOutQuart",
            },
            scales: {
              y: {
                type: "linear",
                position: "left",
                title: { display: true, text: "Students" },
                grid: { color: "#f0f4f4" },
              },
              y1: {
                type: "linear",
                position: "right",
                title: { display: true, text: "Lakhs (₹)" },
                grid: { display: false },
              },
            },
          },
        });
      }
    }

    // Chart 5: Parent Ward Performance
    if (role === "parent") {
      const parentCtx = document.getElementById("parentWardScoreChart");
      if (parentCtx) {
        if (chartInstances.parentWard) chartInstances.parentWard.destroy();
        chartInstances.parentWard = new Chart(parentCtx, {
          type: "line",
          data: {
            labels: ["May", "Jun", "Jul", "Aug", "Sep"],
            datasets: [
              {
                label: "Ward Overall Test Score %",
                data: [64, 71, 78, 83, 89],
                borderColor: colorPrimary,
                backgroundColor: "rgba(49, 100, 94, 0.15)",
                fill: true,
                borderWidth: 3,
                tension: 0.3,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 200,
            animation: {
              duration: 600,
              easing: "easeOutQuart",
            },
            scales: {
              y: {
                min: 50,
                max: 100,
                ticks: { callback: (v) => v + "%" },
                grid: { color: "#f0f4f4" },
              },
            },
          },
        });
      }
    }
  }

  // 12. Smart 404 Interceptor for Empty Links & Dead Action Buttons
  // Requirement 7: Dashboard all the empty links, # and buttons click and redirect to 404 page,
  // just add a script for that. The sidebar menu or logout button should NOT redirect to 404 page.
  function initDashboard404Interceptor() {
    document.addEventListener("click", function (e) {
      const target = e.target;

      // 1. Check if it is an anchor <a>
      const anchor = target.closest("a");
      if (anchor) {
        // Exemptions:
        if (
          anchor.classList.contains("sidebar-nav-link") ||
          anchor.classList.contains("sidebar-logout-btn") ||
          anchor.classList.contains("user-logout-action") ||
          anchor.hasAttribute("data-target-pane") ||
          anchor.hasAttribute("data-bs-toggle") ||
          anchor.hasAttribute("data-bs-target") ||
          anchor.hasAttribute("data-bs-dismiss") ||
          anchor.classList.contains("dropdown-toggle") ||
          anchor.classList.contains("sidebar-toggle-btn") ||
          anchor.classList.contains("sidebar-close-btn") ||
          anchor.closest(".modal")
        ) {
          return;
        }

        const rawHref = anchor.getAttribute("href");
        const isEmptyOrHash =
          rawHref === null ||
          rawHref === undefined ||
          rawHref.trim() === "" ||
          rawHref.trim() === "#" ||
          rawHref.trim().toLowerCase() === "javascript:void(0)" ||
          rawHref.trim().toLowerCase() === "javascript:void(0);" ||
          rawHref.trim().toLowerCase() === "javascript:;";

        if (isEmptyOrHash) {
          e.preventDefault();
          e.stopPropagation();
          window.location.href = "../404.html";
          return;
        }
      }

      // 2. Check if it is a button <button> without custom functional handler or type="button" dummy
      const button = target.closest("button");
      if (button) {
        // Exemptions:
        if (
          button.classList.contains("sidebar-nav-link") ||
          button.classList.contains("sidebar-logout-btn") ||
          button.classList.contains("user-logout-action") ||
          button.classList.contains("sidebar-toggle-btn") ||
          button.classList.contains("sidebar-close-btn") ||
          button.hasAttribute("data-target-pane") ||
          button.hasAttribute("data-bs-toggle") ||
          button.hasAttribute("data-bs-target") ||
          button.hasAttribute("data-bs-dismiss") ||
          button.classList.contains("dropdown-toggle") ||
          button.getAttribute("type") === "submit" ||
          button.closest(".modal-footer") ||
          button.closest(".modal-header") ||
          button.id === "sidebarToggleBtn" ||
          button.id === "sidebarCloseBtn"
        ) {
          return;
        }

        // Check if button has dummy or empty action marker
        if (
          button.classList.contains("dummy-action-btn") ||
          button.getAttribute("data-action") === "dummy"
        ) {
          e.preventDefault();
          e.stopPropagation();
          window.location.href = "../404.html";
          return;
        }
      }
    });
  }

  // 13. Initialize Everything on Load
  updateUIProfile(activeUser);
  switchRole(currentRoleKey);
  initDashboard404Interceptor();
});
