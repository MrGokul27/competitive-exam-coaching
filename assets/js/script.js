document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // 0. Theme Preloader Controller (2 Seconds Duration)
  function initThemePreloader() {
    const preloader = document.getElementById("themePreloader");
    if (!preloader) return;

    document.body.classList.add("preloader-active");

    const progressBar = document.getElementById("preloaderProgressBar");
    const percentEl = document.getElementById("preloaderPercent");
    const statusTextEl = document.getElementById("preloaderStatusText");

    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    const milestones = [
      {
        threshold: 0,
        text: '<i class="fa-solid fa-circle-notch fa-spin me-2"></i>Initializing Rankers\' Portal...',
      },
      {
        threshold: 30,
        text: '<i class="fa-solid fa-book-open-reader me-2"></i>Loading Comprehensive Syllabus...',
      },
      {
        threshold: 65,
        text: '<i class="fa-solid fa-chart-line me-2"></i>Calibrating AI Test Analytics...',
      },
      {
        threshold: 88,
        text: '<i class="fa-solid fa-user-graduate me-2"></i>Synchronizing Faculty Mentorship...',
      },
      {
        threshold: 100,
        text: '<i class="fa-solid fa-circle-check text-warning me-2"></i>Ready for Success!',
      },
    ];

    let lastMilestoneIndex = -1;

    function updateProgress(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const percent = Math.floor(progress * 100);

      if (progressBar) {
        progressBar.style.width = percent + "%";
      }
      if (percentEl) {
        percentEl.textContent = percent + "%";
      }

      for (let i = milestones.length - 1; i >= 0; i--) {
        if (percent >= milestones[i].threshold) {
          if (lastMilestoneIndex !== i) {
            lastMilestoneIndex = i;
            if (statusTextEl) {
              statusTextEl.innerHTML = milestones[i].text;
            }
          }
          break;
        }
      }

      if (progress < 1) {
        requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => {
          preloader.classList.add("fade-out");
          document.body.classList.remove("preloader-active");

          setTimeout(() => {
            preloader.style.display = "none";
          }, 650);
        }, 150);
      }
    }

    requestAnimationFrame(updateProgress);
  }

  initThemePreloader();

  // Determine if current page is inside the 'pages/' directory
  const currentPath = window.location.pathname.replace(/\\/g, "/");
  const isInPagesDir = currentPath.includes("/pages/");

  const headerPath = isInPagesDir
    ? "components/header.html"
    : "pages/components/header.html";
  const footerPath = isInPagesDir
    ? "components/footer.html"
    : "pages/components/footer.html";

  // Helper to adjust relative paths based on current page location
  function adjustPaths(htmlContent, inPages) {
    if (!htmlContent) return "";
    let adjusted = htmlContent;

    if (inPages) {
      // Inside pages/ directory:
      // Point asset paths to ../assets/
      adjusted = adjusted.replace(/(src|href)=["']assets\//g, '$1="../assets/');
      // Point home link to ../index.html
      adjusted = adjusted.replace(
        /href=["']index\.html["']/g,
        'href="../index.html"',
      );
      // Subpage links in components (pages/xxx.html -> xxx.html)
      adjusted = adjusted.replace(/href=["']pages\/([^"']+)["']/g, 'href="$1"');
      adjusted = adjusted.replace(
        /action=["']pages\/([^"']+)["']/g,
        'action="$1"',
      );
    } else {
      // In root directory:
      // Ensure subpage links point to pages/
      const subpages = [
        "about.html",
        "courses.html",
        "services.html",
        "projects.html",
        "blog.html",
        "contact.html",
        "login.html",
        "register.html",
        "dashboard.html",
      ];
      subpages.forEach((page) => {
        const hrefRegex = new RegExp(
          `href=["'](?!(?:pages\\/|#|http|tel:|mailto:))` +
            page.replace(".", "\\.") +
            `["']`,
          "g",
        );
        adjusted = adjusted.replace(hrefRegex, `href="pages/${page}"`);
      });
    }

    return adjusted;
  }

  // Highlight active page in navigation menu
  function highlightActiveNav() {
    const rawPath = window.location.pathname.replace(/\\/g, "/");
    let pageName =
      rawPath.substring(rawPath.lastIndexOf("/") + 1).toLowerCase() ||
      "index.html";
    if (!pageName || pageName === "/" || pageName === "index.htm") {
      pageName = "index.html";
    }

    const allNavLinks = document.querySelectorAll(
      ".navbar-nav .nav-link, .mobile-nav-links a",
    );

    allNavLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      const linkPage = href.substring(href.lastIndexOf("/") + 1).toLowerCase();

      const isCurrent =
        linkPage === pageName ||
        (pageName === "index.html" &&
          (linkPage === "index.html" || linkPage === ""));

      if (isCurrent) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
        const parentNavItem = link.closest(".nav-item");
        if (parentNavItem) parentNavItem.classList.add("active");
        const parentLi = link.closest("li");
        if (parentLi) parentLi.classList.add("active");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
        const parentNavItem = link.closest(".nav-item");
        if (parentNavItem) parentNavItem.classList.remove("active");
        const parentLi = link.closest("li");
        if (parentLi) parentLi.classList.remove("active");
      }
    });
  }

  // Initialize Header interactivity
  function initHeaderFeatures() {
    // 1. Sticky Header
    const header = document.querySelector(".main-header");
    window.addEventListener("scroll", function () {
      if (header) {
        if (window.scrollY > 120) {
          header.classList.add("is-sticky");
        } else {
          header.classList.remove("is-sticky");
        }
      }
    });

    // 2. Full-Screen Mobile Menu Drawer
    const mobileToggler = document.querySelector(".mobile-nav-toggler");
    const mobileMenu = document.getElementById("fullscreenMobileMenu");
    const closeMobileBtn = document.querySelector(".close-mobile-menu");
    const mobileLinks = document.querySelectorAll(".mobile-nav-links a");

    function openMobileMenu() {
      if (mobileMenu) {
        mobileMenu.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    }

    function closeMobileMenu() {
      if (mobileMenu) {
        mobileMenu.classList.remove("active");
        document.body.style.overflow = "";
      }
    }

    if (mobileToggler) {
      mobileToggler.addEventListener("click", openMobileMenu);
    }

    if (closeMobileBtn) {
      closeMobileBtn.addEventListener("click", closeMobileMenu);
    }

    mobileLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    // Close on escape key
    document.addEventListener("keydown", function (e) {
      if (
        e.key === "Escape" &&
        mobileMenu &&
        mobileMenu.classList.contains("active")
      ) {
        closeMobileMenu();
      }
    });

    highlightActiveNav();
  }

  // Helper to redirect to 404 page accurately from root or sub-pages
  function redirectTo404() {
    const isCurrentlyInPages = window.location.pathname
      .replace(/\\/g, "/")
      .includes("/pages/");
    const target404Url = isCurrentlyInPages ? "../404.html" : "404.html";
    window.location.href = target404Url;
  }

  // Initialize Footer interactivity
  function initFooterFeatures() {
    // Scroll-to-Top Button Visibility & Action
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    window.addEventListener("scroll", function () {
      if (scrollTopBtn) {
        if (window.scrollY > 300) {
          scrollTopBtn.classList.add("show");
        } else {
          scrollTopBtn.classList.remove("show");
        }
      }
    });

    if (scrollTopBtn) {
      scrollTopBtn.addEventListener("click", function (e) {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    }

    // Newsletter submit handler -> Redirect to 404 page
    const newsletterForm = document.querySelector(".footer-newsletter-form");
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!newsletterForm.checkValidity()) {
          newsletterForm.reportValidity();
          return;
        }
        redirectTo404();
      });
    }
  }

  // 1. Load Header Component
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (headerPlaceholder) {
    fetch(headerPath)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load header component");
        return res.text();
      })
      .then((html) => {
        headerPlaceholder.innerHTML = adjustPaths(html, isInPagesDir);
        initHeaderFeatures();
      })
      .catch((err) => {
        console.warn("Header fetch failed:", err);
        initHeaderFeatures();
      });
  } else {
    initHeaderFeatures();
  }

  // 2. Load Footer Component
  const footerPlaceholder = document.getElementById("footer-placeholder");
  if (footerPlaceholder) {
    fetch(footerPath)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load footer component");
        return res.text();
      })
      .then((html) => {
        footerPlaceholder.innerHTML = adjustPaths(html, isInPagesDir);
        initFooterFeatures();
      })
      .catch((err) => {
        console.warn("Footer fetch failed:", err);
        initFooterFeatures();
      });
  } else {
    initFooterFeatures();
  }

  // 3. Number Counters Animation
  const counters = document.querySelectorAll(".counter-value");
  let animated = false;

  function countUp() {
    counters.forEach((counter) => {
      const target = +counter.getAttribute("data-target");
      const speed = 200; // lower number = faster
      let count = 0;
      const inc = target / speed;

      const updateCount = () => {
        count += inc;
        if (count < target) {
          counter.innerText = Math.ceil(count).toLocaleString();
          setTimeout(updateCount, 15);
        } else {
          counter.innerText = target.toLocaleString();
        }
      };
      updateCount();
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          countUp();
          animated = true;
        }
      });
    },
    { threshold: 0.5 },
  );

  const statsSection = document.querySelector(".stats-counter-section");
  if (statsSection) {
    observer.observe(statsSection);
  }

  // 4. Interactive Batch / Fee Calculator (Home Page & Courses Page)
  const examSelect = document.getElementById("calcExam");
  const modeSelect = document.getElementById("calcMode");
  const durationSelect = document.getElementById("calcDuration");
  const feeDisplay = document.getElementById("calculatedFee");
  const durationDisplay = document.getElementById("calculatedDuration");

  function updateFeeCalculation() {
    if (!examSelect || !modeSelect || !durationSelect || !feeDisplay) return;

    let baseFee = 45000;
    const exam = examSelect.value;
    const mode = modeSelect.value;
    const duration = durationSelect.value;

    if (exam === "upsc") baseFee = 85000;
    else if (exam === "statepcs") baseFee = 55000;
    else if (exam === "banking") baseFee = 32000;
    else if (exam === "ssc") baseFee = 28000;
    else if (exam === "defence") baseFee = 40000;

    let multiplier = 1;
    if (mode === "offline") multiplier = 1.4;
    else if (mode === "hybrid") multiplier = 1.2;

    if (duration === "2year") multiplier *= 1.7;
    else if (duration === "crash") multiplier *= 0.5;

    const totalFee = Math.round(baseFee * multiplier);
    feeDisplay.textContent = "₹" + totalFee.toLocaleString("en-IN");

    if (durationDisplay) {
      if (duration === "1year")
        durationDisplay.textContent = "12 Months Comprehensive";
      else if (duration === "2year")
        durationDisplay.textContent = "24 Months Integrated";
      else if (duration === "crash")
        durationDisplay.textContent = "3 Months Intensive";
    }
  }

  if (examSelect) examSelect.addEventListener("change", updateFeeCalculation);
  if (modeSelect) modeSelect.addEventListener("change", updateFeeCalculation);
  if (durationSelect)
    durationSelect.addEventListener("change", updateFeeCalculation);

  // Initial update
  updateFeeCalculation();

  // 5. Real-Time Strict Input Validation & Restrictions
  function initInputRestrictions() {
    const lettersSelector =
      '.letters-only-input, [data-restrict="letters-only"], #contactFullName, #scholarshipName';
    const numbersSelector =
      '.numbers-only-input, [data-restrict="numbers-only"], #contactPhone, #scholarshipPhone';

    function isLettersOnly(el) {
      return el && el.matches && el.matches(lettersSelector);
    }

    function isNumbersOnly(el) {
      return el && el.matches && el.matches(numbersSelector);
    }

    const allowedNavKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
      "PageUp",
      "PageDown",
    ];

    // Keydown block - prevent typing invalid characters at the event source
    document.addEventListener("keydown", function (e) {
      const target = e.target;
      if (isLettersOnly(target)) {
        if (
          allowedNavKeys.includes(e.key) ||
          e.ctrlKey ||
          e.metaKey ||
          e.altKey
        ) {
          return;
        }
        // Only allow a-z, A-Z and space
        if (e.key.length === 1 && !/^[a-zA-Z\s]$/.test(e.key)) {
          e.preventDefault();
          e.stopPropagation();
        }
      } else if (isNumbersOnly(target)) {
        if (
          allowedNavKeys.includes(e.key) ||
          e.ctrlKey ||
          e.metaKey ||
          e.altKey
        ) {
          return;
        }
        // Only allow digits 0-9
        if (e.key.length === 1 && !/^[0-9]$/.test(e.key)) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    });

    // Keypress block for broader legacy/browser support
    document.addEventListener("keypress", function (e) {
      const target = e.target;
      if (isLettersOnly(target)) {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        const char = String.fromCharCode(e.which || e.keyCode);
        if (!/^[a-zA-Z\s]$/.test(char)) {
          e.preventDefault();
          e.stopPropagation();
        }
      } else if (isNumbersOnly(target)) {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        const char = String.fromCharCode(e.which || e.keyCode);
        if (!/^[0-9]$/.test(char)) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    });

    // Beforeinput block for mobile keyboards / autocomplete / voice typing
    document.addEventListener("beforeinput", function (e) {
      const target = e.target;
      if (isLettersOnly(target)) {
        if (e.data && !/^[a-zA-Z\s]+$/.test(e.data)) {
          e.preventDefault();
        }
      } else if (isNumbersOnly(target)) {
        if (e.data && !/^[0-9]+$/.test(e.data)) {
          e.preventDefault();
        }
      }
    });

    // Input event cleaning (handles copy-paste, autofill, drag-drop)
    document.addEventListener("input", function (e) {
      const target = e.target;
      if (isLettersOnly(target)) {
        const cleaned = target.value.replace(/[^a-zA-Z\s]/g, "");
        if (target.value !== cleaned) {
          target.value = cleaned;
        }
      } else if (isNumbersOnly(target)) {
        const cleaned = target.value.replace(/[^0-9]/g, "");
        if (target.value !== cleaned) {
          target.value = cleaned;
        }
      }
    });

    // Paste event handling
    document.addEventListener("paste", function (e) {
      const target = e.target;
      if (isLettersOnly(target)) {
        e.preventDefault();
        const text =
          (e.clipboardData || window.clipboardData).getData("text") || "";
        const cleaned = text.replace(/[^a-zA-Z\s]/g, "");
        const start = target.selectionStart || 0;
        const end = target.selectionEnd || 0;
        target.value =
          target.value.substring(0, start) +
          cleaned +
          target.value.substring(end);
        target.selectionStart = target.selectionEnd = start + cleaned.length;
        target.dispatchEvent(new Event("input", { bubbles: true }));
      } else if (isNumbersOnly(target)) {
        e.preventDefault();
        const text =
          (e.clipboardData || window.clipboardData).getData("text") || "";
        const cleaned = text.replace(/[^0-9]/g, "");
        const start = target.selectionStart || 0;
        const end = target.selectionEnd || 0;
        target.value =
          target.value.substring(0, start) +
          cleaned +
          target.value.substring(end);
        target.selectionStart = target.selectionEnd = start + cleaned.length;
        target.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });

    // Drop event handling
    document.addEventListener("drop", function (e) {
      const target = e.target;
      if (isLettersOnly(target)) {
        e.preventDefault();
        const text = e.dataTransfer.getData("text") || "";
        const cleaned = text.replace(/[^a-zA-Z\s]/g, "");
        const start = target.selectionStart || 0;
        const end = target.selectionEnd || 0;
        target.value =
          target.value.substring(0, start) +
          cleaned +
          target.value.substring(end);
        target.selectionStart = target.selectionEnd = start + cleaned.length;
        target.dispatchEvent(new Event("input", { bubbles: true }));
      } else if (isNumbersOnly(target)) {
        e.preventDefault();
        const text = e.dataTransfer.getData("text") || "";
        const cleaned = text.replace(/[^0-9]/g, "");
        const start = target.selectionStart || 0;
        const end = target.selectionEnd || 0;
        target.value =
          target.value.substring(0, start) +
          cleaned +
          target.value.substring(end);
        target.selectionStart = target.selectionEnd = start + cleaned.length;
        target.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
  }

  initInputRestrictions();

  // 6. Generic Form Submission handler with validation -> Redirect to 404 Page
  document.addEventListener("submit", function (e) {
    const form = e.target;
    if (!form) return;

    if (
      form.classList.contains("ajax-contact-form") ||
      form.classList.contains("footer-newsletter-form") ||
      form.classList.contains("blog-newsletter-form") ||
      form.id === "admissionInquiryForm" ||
      form.id === "scholarshipForm" ||
      form.id === "blogNewsletterForm"
    ) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      redirectTo404();
    }
  });

  // 7. Course / Project Filter Buttons
  const filterBtns = document.querySelectorAll(".filter-btn");
  const filterItems = document.querySelectorAll(".filterable-item");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      filterBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      const filterValue = this.getAttribute("data-filter");

      filterItems.forEach((item) => {
        if (filterValue === "all" || item.classList.contains(filterValue)) {
          item.style.display = "block";
          setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "scale(1)";
          }, 50);
        } else {
          item.style.opacity = "0";
          item.style.transform = "scale(0.95)";
          setTimeout(() => {
            item.style.display = "none";
          }, 250);
        }
      });
    });
  });

  // 8. Blog Aspirant Doubt & Reaction Buttons Interactivity
  const reactionButtons = document.querySelectorAll(".reaction-btn");
  reactionButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const icon = this.querySelector("i");
      if (
        icon &&
        icon.classList.contains("fa-regular") &&
        icon.classList.contains("fa-thumbs-up")
      ) {
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
        this.style.background = "rgba(49, 100, 94, 0.15)";
        this.style.color = "var(--main-color)";
        const textSpan = this.querySelector("span");
        if (textSpan && textSpan.textContent.includes("428")) {
          textSpan.textContent = "Helpful (429)";
        }
      } else if (
        icon &&
        icon.classList.contains("fa-regular") &&
        icon.classList.contains("fa-bookmark")
      ) {
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
        this.style.background = "rgba(49, 100, 94, 0.15)";
        this.style.color = "var(--main-color)";
        const textSpan = this.querySelector("span");
        if (textSpan) textSpan.textContent = "Saved!";
      }
    });
  });

  // 9. Global Empty / Hash (#) Link Interceptor -> Redirect to 404 Page
  function initEmptyLinkRedirects() {
    document.addEventListener("click", function (e) {
      const anchor = e.target.closest("a");
      if (!anchor) return;

      // Ignore elements with special behaviors or interactive components
      if (
        anchor.id === "scrollTopBtn" ||
        anchor.hasAttribute("data-bs-toggle") ||
        anchor.hasAttribute("data-bs-target") ||
        anchor.hasAttribute("data-bs-slide") ||
        anchor.getAttribute("role") === "button" ||
        anchor.getAttribute("role") === "tab" ||
        anchor.classList.contains("mobile-nav-toggler") ||
        anchor.classList.contains("close-mobile-menu") ||
        anchor.classList.contains("filter-btn") ||
        anchor.classList.contains("reaction-btn") ||
        anchor.classList.contains("password-toggle-btn")
      ) {
        return;
      }

      const rawHref = anchor.getAttribute("href");

      // Check if href is empty, #, or javascript pseudo-void
      const isEmptyOrHash =
        rawHref === null ||
        rawHref === undefined ||
        rawHref.trim() === "" ||
        rawHref.trim() === "#" ||
        rawHref.trim().toLowerCase() === "javascript:void(0)" ||
        rawHref.trim().toLowerCase() === "javascript:void(0);" ||
        rawHref.trim().toLowerCase() === "javascript:;" ||
        rawHref.trim().toLowerCase() === "javascript:void(0)";

      // Check if href is a dead in-page anchor (#something where element doesn't exist)
      let isDeadAnchor = false;
      if (rawHref && rawHref.startsWith("#") && rawHref.length > 1) {
        try {
          const targetElem = document.querySelector(rawHref);
          if (!targetElem) {
            isDeadAnchor = true;
          }
        } catch (err) {
          isDeadAnchor = true;
        }
      }

      if (isEmptyOrHash || isDeadAnchor) {
        e.preventDefault();
        e.stopPropagation();

        const isCurrentlyInPages = window.location.pathname
          .replace(/\\/g, "/")
          .includes("/pages/");
        const target404Url = isCurrentlyInPages ? "../404.html" : "404.html";
        window.location.href = target404Url;
      }
    });
  }

  initEmptyLinkRedirects();
});
