document.addEventListener("DOMContentLoaded", function () {
  "use strict";

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

    // Newsletter submit handler
    const newsletterForm = document.querySelector(".footer-newsletter-form");
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const btn = newsletterForm.querySelector('button[type="submit"]');
        if (btn) {
          const original = btn.textContent;
          btn.textContent = "✓ Joined!";
          newsletterForm.reset();
          setTimeout(() => {
            btn.textContent = original;
          }, 3000);
        }
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
    // 1. Letters Only (Full Name / Username) - prevents typing, pasting, dragging numbers & special characters
    const lettersOnlyInputs = document.querySelectorAll(
      '.letters-only-input, [data-restrict="letters-only"], #contactFullName'
    );

    lettersOnlyInputs.forEach((input) => {
      // Keydown block
      input.addEventListener("keydown", function (e) {
        // Allow control & navigation keys
        if (
          e.key === "Backspace" ||
          e.key === "Delete" ||
          e.key === "Tab" ||
          e.key === "Escape" ||
          e.key === "Enter" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight" ||
          e.key === "ArrowUp" ||
          e.key === "ArrowDown" ||
          e.key === "Home" ||
          e.key === "End" ||
          e.key === "PageUp" ||
          e.key === "PageDown" ||
          e.ctrlKey ||
          e.metaKey
        ) {
          return;
        }

        // Only allow a-z, A-Z and space
        if (e.key.length === 1 && !/^[a-zA-Z\s]$/.test(e.key)) {
          e.preventDefault();
        }
      });

      // Beforeinput block for mobile keyboards / autocomplete
      input.addEventListener("beforeinput", function (e) {
        if (e.data && !/^[a-zA-Z\s]+$/.test(e.data)) {
          e.preventDefault();
        }
      });

      // Input event cleaning (handles copy-paste, autofill, drag-drop)
      input.addEventListener("input", function () {
        const cleaned = this.value.replace(/[^a-zA-Z\s]/g, "");
        if (this.value !== cleaned) {
          this.value = cleaned;
        }
      });

      // Paste event handling
      input.addEventListener("paste", function (e) {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData("text");
        const cleaned = text.replace(/[^a-zA-Z\s]/g, "");
        const start = this.selectionStart || 0;
        const end = this.selectionEnd || 0;
        this.value =
          this.value.substring(0, start) + cleaned + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + cleaned.length;
      });

      // Prevent dropping invalid data
      input.addEventListener("drop", function (e) {
        e.preventDefault();
        const text = e.dataTransfer.getData("text");
        const cleaned = text.replace(/[^a-zA-Z\s]/g, "");
        const start = this.selectionStart || 0;
        const end = this.selectionEnd || 0;
        this.value =
          this.value.substring(0, start) + cleaned + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + cleaned.length;
      });
    });

    // 2. Numbers Only (Phone Number / Mobile) - prevents typing, pasting, dragging alphabets & special characters
    const numbersOnlyInputs = document.querySelectorAll(
      '.numbers-only-input, [data-restrict="numbers-only"], #contactPhone'
    );

    numbersOnlyInputs.forEach((input) => {
      // Keydown block
      input.addEventListener("keydown", function (e) {
        // Allow control & navigation keys
        if (
          e.key === "Backspace" ||
          e.key === "Delete" ||
          e.key === "Tab" ||
          e.key === "Escape" ||
          e.key === "Enter" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight" ||
          e.key === "ArrowUp" ||
          e.key === "ArrowDown" ||
          e.key === "Home" ||
          e.key === "End" ||
          e.key === "PageUp" ||
          e.key === "PageDown" ||
          e.ctrlKey ||
          e.metaKey
        ) {
          return;
        }

        // Only allow 0-9 digits
        if (e.key.length === 1 && !/^[0-9]$/.test(e.key)) {
          e.preventDefault();
        }
      });

      // Beforeinput block for mobile keyboards
      input.addEventListener("beforeinput", function (e) {
        if (e.data && !/^[0-9]+$/.test(e.data)) {
          e.preventDefault();
        }
      });

      // Input event cleaning
      input.addEventListener("input", function () {
        const cleaned = this.value.replace(/[^0-9]/g, "");
        if (this.value !== cleaned) {
          this.value = cleaned;
        }
      });

      // Paste event handling
      input.addEventListener("paste", function (e) {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData("text");
        const cleaned = text.replace(/[^0-9]/g, "");
        const start = this.selectionStart || 0;
        const end = this.selectionEnd || 0;
        this.value =
          this.value.substring(0, start) + cleaned + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + cleaned.length;
      });

      // Prevent dropping invalid data
      input.addEventListener("drop", function (e) {
        e.preventDefault();
        const text = e.dataTransfer.getData("text");
        const cleaned = text.replace(/[^0-9]/g, "");
        const start = this.selectionStart || 0;
        const end = this.selectionEnd || 0;
        this.value =
          this.value.substring(0, start) + cleaned + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + cleaned.length;
      });
    });
  }

  initInputRestrictions();

  // 6. Generic Form Submission handler with validation
  const contactForms = document.querySelectorAll(".ajax-contact-form");
  contactForms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML =
          '<i class="fa-solid fa-check"></i> Inquiry Sent Successfully!';
        btn.classList.remove("btn-primary-theme");
        btn.classList.add("btn-success");
        form.reset();
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.add("btn-primary-theme");
          btn.classList.remove("btn-success");
          btn.disabled = false;
        }, 4000);
      }, 1200);
    });
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
      if (icon && icon.classList.contains("fa-regular") && icon.classList.contains("fa-thumbs-up")) {
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
        this.style.background = "rgba(49, 100, 94, 0.15)";
        this.style.color = "var(--main-color)";
        const textSpan = this.querySelector("span");
        if (textSpan && textSpan.textContent.includes("428")) {
          textSpan.textContent = "Helpful (429)";
        }
      } else if (icon && icon.classList.contains("fa-regular") && icon.classList.contains("fa-bookmark")) {
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
        this.style.background = "rgba(49, 100, 94, 0.15)";
        this.style.color = "var(--main-color)";
        const textSpan = this.querySelector("span");
        if (textSpan) textSpan.textContent = "Saved!";
      }
    });
  });
});

