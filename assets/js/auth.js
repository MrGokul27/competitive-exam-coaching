document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // 1. Password Visibility Toggle Functionality
  const togglePasswordButtons = document.querySelectorAll(
    ".password-toggle-btn",
  );
  togglePasswordButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const passwordInput = document.getElementById(targetId);
      if (!passwordInput) return;

      const isPassword = passwordInput.getAttribute("type") === "password";
      passwordInput.setAttribute("type", isPassword ? "text" : "password");

      const icon = this.querySelector("i");
      if (icon) {
        if (isPassword) {
          icon.classList.remove("fa-eye");
          icon.classList.add("fa-eye-slash");
          this.setAttribute("aria-label", "Hide password");
        } else {
          icon.classList.remove("fa-eye-slash");
          icon.classList.add("fa-eye");
          this.setAttribute("aria-label", "Show password");
        }
      }
    });
  });

  // 2. REGISTER PAGE VALIDATION & INTERACTIONS
  const registerForm = document.getElementById("registerForm");
  const regUsernameInput = document.getElementById("regUsername");
  const regPasswordInput = document.getElementById("regPassword");
  const regConfirmPasswordInput = document.getElementById("regConfirmPassword");
  const regRoleSelect = document.getElementById("regRole");
  const regEmailInput = document.getElementById("regEmail");
  const regTermsCheckbox = document.getElementById("regTerms");

  // Username: Strictly prevent typing numbers or special characters
  if (regUsernameInput) {
    const usernameHint = document.getElementById("usernameHint");

    // Block keystrokes that are not alphabetic letters or spaces
    regUsernameInput.addEventListener("keydown", function (e) {
      // Allow navigation keys, backspace, delete, tab, arrows
      const allowedSpecialKeys = [
        "Backspace",
        "Tab",
        "Enter",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Delete",
        "Home",
        "End",
      ];

      if (
        allowedSpecialKeys.includes(e.key) ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey
      ) {
        return;
      }

      // Check if character is a letter (A-Z, a-z) or space
      const isAlphabetOrSpace = /^[a-zA-Z\s]$/.test(e.key);
      if (!isAlphabetOrSpace) {
        e.preventDefault();
        if (usernameHint) {
          usernameHint.textContent =
            "Numbers and special characters are not allowed!";
          usernameHint.className = "auth-field-hint error-text";
          setTimeout(() => {
            if (regUsernameInput.value.trim().length > 0) {
              usernameHint.textContent =
                "Only alphabetic letters (A-Z, a-z) allowed";
              usernameHint.className = "auth-field-hint info-text";
            }
          }, 2500);
        }
      }
    });

    // Handle beforeinput for virtual keyboards / IME
    regUsernameInput.addEventListener("beforeinput", function (e) {
      if (e.data && !/^[a-zA-Z\s]+$/.test(e.data)) {
        e.preventDefault();
      }
    });

    // Sanitize input in real-time (for paste, drag-and-drop, autofill)
    regUsernameInput.addEventListener("input", function () {
      const sanitized = this.value.replace(/[^a-zA-Z\s]/g, "");
      if (this.value !== sanitized) {
        this.value = sanitized;
      }

      if (this.value.trim().length >= 3) {
        this.classList.remove("is-invalid");
        this.classList.add("is-valid");
        if (usernameHint) {
          usernameHint.textContent = "Username format valid";
          usernameHint.className = "auth-field-hint success-text";
        }
      } else if (this.value.length > 0) {
        this.classList.remove("is-valid");
        if (usernameHint) {
          usernameHint.textContent = "Minimum 3 letters required";
          usernameHint.className = "auth-field-hint info-text";
        }
      } else {
        this.classList.remove("is-valid", "is-invalid");
        if (usernameHint) {
          usernameHint.textContent =
            "Only alphabetic letters (A-Z, a-z) allowed";
          usernameHint.className = "auth-field-hint info-text";
        }
      }
    });

    // Handle paste event
    regUsernameInput.addEventListener("paste", function (e) {
      e.preventDefault();
      const pasteData = (e.clipboardData || window.clipboardData).getData(
        "text",
      );
      const cleanData = pasteData.replace(/[^a-zA-Z\s]/g, "");
      document.execCommand("insertText", false, cleanData);
    });
  }

  // Password Strength Evaluation Helper
  function evaluatePasswordStrength(password) {
    const rules = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numberOrSymbol: /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    let passedCount = Object.values(rules).filter(Boolean).length;
    let score = "weak";

    if (!rules.length || passedCount < 3) {
      score = "weak";
    } else if (
      passedCount === 3 ||
      (passedCount === 4 && password.length < 10)
    ) {
      score = "medium";
    } else if (passedCount === 4 && password.length >= 10) {
      score = "strong";
    }

    return { rules, score, passedCount };
  }

  // Register Password Strength Checking
  if (regPasswordInput) {
    const strengthMeter = document.getElementById("passwordStrengthMeter");
    const strengthScoreText = document.getElementById("strengthScoreText");
    const ruleLength = document.getElementById("ruleLength");
    const ruleUpper = document.getElementById("ruleUpper");
    const ruleLower = document.getElementById("ruleLower");
    const ruleNumberSymbol = document.getElementById("ruleNumberSymbol");

    regPasswordInput.addEventListener("input", function () {
      const val = this.value;

      if (!val) {
        if (strengthMeter) {
          strengthMeter.className = "password-strength-meter";
          if (strengthScoreText) strengthScoreText.textContent = "Weak";
        }
        [ruleLength, ruleUpper, ruleLower, ruleNumberSymbol].forEach((rule) => {
          if (rule) {
            rule.classList.remove("rule-passed");
            const icon = rule.querySelector("i");
            if (icon) icon.className = "fa-regular fa-circle";
          }
        });
        this.classList.remove("is-valid", "is-invalid");
        return;
      }

      const { rules, score } = evaluatePasswordStrength(val);

      // Update Checklist Rules UI
      function updateRuleUI(el, passed) {
        if (!el) return;
        const icon = el.querySelector("i");
        if (passed) {
          el.classList.add("rule-passed");
          if (icon) icon.className = "fa-solid fa-circle-check";
        } else {
          el.classList.remove("rule-passed");
          if (icon) icon.className = "fa-regular fa-circle";
        }
      }

      updateRuleUI(ruleLength, rules.length);
      updateRuleUI(ruleUpper, rules.uppercase);
      updateRuleUI(ruleLower, rules.lowercase);
      updateRuleUI(ruleNumberSymbol, rules.numberOrSymbol);

      // Update Strength Meter
      if (strengthMeter) {
        strengthMeter.className = `password-strength-meter strength-${score}`;
      }
      if (strengthScoreText) {
        strengthScoreText.textContent = score.toUpperCase();
      }

      if (score === "weak") {
        this.classList.add("is-invalid");
        this.classList.remove("is-valid");
      } else {
        this.classList.remove("is-invalid");
        this.classList.add("is-valid");
      }

      // Revalidate confirm password if it already has input
      if (regConfirmPasswordInput && regConfirmPasswordInput.value.length > 0) {
        validatePasswordMatch();
      }
    });
  }

  // Password & Confirm Password Match Validation
  function validatePasswordMatch() {
    if (!regPasswordInput || !regConfirmPasswordInput) return false;
    const pass = regPasswordInput.value;
    const confirmPass = regConfirmPasswordInput.value;
    const matchHint = document.getElementById("confirmPasswordHint");

    if (!confirmPass) {
      regConfirmPasswordInput.classList.remove("is-valid", "is-invalid");
      if (matchHint) {
        matchHint.textContent = "Please re-type your password";
        matchHint.className = "auth-field-hint info-text";
      }
      return false;
    }

    if (pass === confirmPass && pass.length >= 8) {
      regConfirmPasswordInput.classList.remove("is-invalid");
      regConfirmPasswordInput.classList.add("is-valid");
      if (matchHint) {
        matchHint.innerHTML =
          '<i class="fa-solid fa-check"></i> Passwords match perfectly';
        matchHint.className = "auth-field-hint success-text";
      }
      return true;
    } else {
      regConfirmPasswordInput.classList.remove("is-valid");
      regConfirmPasswordInput.classList.add("is-invalid");
      if (matchHint) {
        matchHint.innerHTML =
          '<i class="fa-solid fa-triangle-exclamation"></i> Passwords do not match';
        matchHint.className = "auth-field-hint error-text";
      }
      return false;
    }
  }

  if (regConfirmPasswordInput) {
    regConfirmPasswordInput.addEventListener("input", validatePasswordMatch);
  }

  // Register Form Submission Handler
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let isValid = true;
      const alertContainer = document.getElementById("registerAlert");

      // Validate Username
      if (!regUsernameInput || regUsernameInput.value.trim().length < 3) {
        isValid = false;
        if (regUsernameInput) regUsernameInput.classList.add("is-invalid");
      }

      // Validate Role
      if (!regRoleSelect || !regRoleSelect.value) {
        isValid = false;
        if (regRoleSelect) regRoleSelect.classList.add("is-invalid");
      } else {
        regRoleSelect.classList.remove("is-invalid");
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regEmailInput || !emailRegex.test(regEmailInput.value.trim())) {
        isValid = false;
        if (regEmailInput) regEmailInput.classList.add("is-invalid");
      } else {
        if (regEmailInput) {
          regEmailInput.classList.remove("is-invalid");
          regEmailInput.classList.add("is-valid");
        }
      }

      // Validate Password Strength
      const passwordVal = regPasswordInput ? regPasswordInput.value : "";
      const strength = evaluatePasswordStrength(passwordVal);
      if (strength.score === "weak" || passwordVal.length < 8) {
        isValid = false;
        if (regPasswordInput) regPasswordInput.classList.add("is-invalid");
        if (alertContainer) {
          alertContainer.className = "auth-alert auth-alert-danger";
          alertContainer.innerHTML =
            '<i class="fa-solid fa-circle-exclamation"></i> Please create a stronger password (minimum 8 characters with uppercase, lowercase, and numbers/symbols).';
          alertContainer.style.display = "flex";
        }
        return;
      }

      // Validate Password Match
      if (!validatePasswordMatch()) {
        isValid = false;
        if (alertContainer) {
          alertContainer.className = "auth-alert auth-alert-danger";
          alertContainer.innerHTML =
            '<i class="fa-solid fa-circle-exclamation"></i> Password and Confirm Password do not match.';
          alertContainer.style.display = "flex";
        }
        return;
      }

      // Validate Terms Checkbox
      if (!regTermsCheckbox || !regTermsCheckbox.checked) {
        isValid = false;
        if (regTermsCheckbox) regTermsCheckbox.classList.add("is-invalid");
        if (alertContainer) {
          alertContainer.className = "auth-alert auth-alert-danger";
          alertContainer.innerHTML =
            '<i class="fa-solid fa-circle-exclamation"></i> You must agree to the Terms & Conditions and Privacy Policy to register.';
          alertContainer.style.display = "flex";
        }
        return;
      }

      if (!isValid) {
        if (alertContainer) {
          alertContainer.className = "auth-alert auth-alert-danger";
          alertContainer.innerHTML =
            '<i class="fa-solid fa-circle-exclamation"></i> Please complete all required fields correctly.';
          alertContainer.style.display = "flex";
        }
        return;
      }

      // Show Success State & Redirect
      const submitBtn = document.getElementById("registerSubmitBtn");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML =
          '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Creating Account...';
      }

      if (alertContainer) {
        alertContainer.className = "auth-alert auth-alert-success";
        alertContainer.innerHTML =
          '<i class="fa-solid fa-circle-check"></i> Account created successfully! Redirecting to login...';
        alertContainer.style.display = "flex";
      }

      // Redirect to login page after short pleasant animation
      setTimeout(function () {
        window.location.href = "login.html?registered=true";
      }, 1200);
    });
  }

  // 3. LOGIN PAGE VALIDATION & INTERACTIONS
  const loginForm = document.getElementById("loginForm");
  const loginRoleSelect = document.getElementById("loginRole");
  const loginEmailInput = document.getElementById("loginEmail");
  const loginPasswordInput = document.getElementById("loginPassword");
  const loginRememberCheckbox = document.getElementById("loginRemember");
  const loginAlertContainer = document.getElementById("loginAlert");

  // Check URL query parameters on login page for ?registered=true
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("registered") === "true" && loginAlertContainer) {
    loginAlertContainer.className = "auth-alert auth-alert-success";
    loginAlertContainer.innerHTML =
      '<i class="fa-solid fa-circle-check"></i> Registration successful! Please log in with your credentials.';
    loginAlertContainer.style.display = "flex";
  }

  // Login Password Weakness / Format Validation
  if (loginPasswordInput) {
    const loginPasswordHint = document.getElementById("loginPasswordHint");

    loginPasswordInput.addEventListener("input", function () {
      const val = this.value;
      if (!val) {
        this.classList.remove("is-valid", "is-invalid");
        if (loginPasswordHint) {
          loginPasswordHint.textContent =
            "Enter your registered portal password";
          loginPasswordHint.className = "auth-field-hint info-text";
        }
        return;
      }

      if (val.length < 6) {
        this.classList.add("is-invalid");
        this.classList.remove("is-valid");
        if (loginPasswordHint) {
          loginPasswordHint.innerHTML =
            '<i class="fa-solid fa-triangle-exclamation"></i> Password too short (minimum 6 characters)';
          loginPasswordHint.className = "auth-field-hint error-text";
        }
      } else {
        this.classList.remove("is-invalid");
        this.classList.add("is-valid");
        if (loginPasswordHint) {
          loginPasswordHint.innerHTML =
            '<i class="fa-solid fa-check"></i> Password format valid';
          loginPasswordHint.className = "auth-field-hint success-text";
        }
      }
    });
  }

  // Login Form Submission
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      let isLoginFormValid = true;

      // Validate Role
      if (!loginRoleSelect || !loginRoleSelect.value) {
        isLoginFormValid = false;
        if (loginRoleSelect) loginRoleSelect.classList.add("is-invalid");
      } else {
        if (loginRoleSelect) loginRoleSelect.classList.remove("is-invalid");
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!loginEmailInput || !emailRegex.test(loginEmailInput.value.trim())) {
        isLoginFormValid = false;
        if (loginEmailInput) loginEmailInput.classList.add("is-invalid");
      } else {
        if (loginEmailInput) {
          loginEmailInput.classList.remove("is-invalid");
          loginEmailInput.classList.add("is-valid");
        }
      }

      // Validate Password
      if (!loginPasswordInput || loginPasswordInput.value.length < 6) {
        isLoginFormValid = false;
        if (loginPasswordInput) loginPasswordInput.classList.add("is-invalid");
        if (loginAlertContainer) {
          loginAlertContainer.className = "auth-alert auth-alert-danger";
          loginAlertContainer.innerHTML =
            '<i class="fa-solid fa-circle-exclamation"></i> Please enter a valid password (minimum 6 characters).';
          loginAlertContainer.style.display = "flex";
        }
        return;
      }

      // Validate Remember Me (as required by prompt specifications)
      if (!loginRememberCheckbox || !loginRememberCheckbox.checked) {
        isLoginFormValid = false;
        if (loginRememberCheckbox)
          loginRememberCheckbox.classList.add("is-invalid");
        if (loginAlertContainer) {
          loginAlertContainer.className = "auth-alert auth-alert-danger";
          loginAlertContainer.innerHTML =
            '<i class="fa-solid fa-circle-exclamation"></i> Please check the Remember Me option to proceed.';
          loginAlertContainer.style.display = "flex";
        }
        return;
      } else {
        if (loginRememberCheckbox)
          loginRememberCheckbox.classList.remove("is-invalid");
      }

      if (!isLoginFormValid) {
        if (loginAlertContainer) {
          loginAlertContainer.className = "auth-alert auth-alert-danger";
          loginAlertContainer.innerHTML =
            '<i class="fa-solid fa-circle-exclamation"></i> Please complete all required login fields.';
          loginAlertContainer.style.display = "flex";
        }
        return;
      }

      // Success State Simulation
      const submitBtn = document.getElementById("loginSubmitBtn");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML =
          '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Authenticating...';
      }

      if (loginAlertContainer) {
        loginAlertContainer.className = "auth-alert auth-alert-success";
        loginAlertContainer.innerHTML =
          '<i class="fa-solid fa-circle-check"></i> Login successful! Redirecting to student dashboard...';
        loginAlertContainer.style.display = "flex";
      }

      setTimeout(function () {
        window.location.href = "../index.html";
      }, 1500);
    });
  }

  // 4. Empty / Hash (#) Link Interceptor in Auth Pages
  document.addEventListener("click", function (e) {
    const anchor = e.target.closest("a");
    if (!anchor) return;

    if (
      anchor.id === "scrollTopBtn" ||
      anchor.hasAttribute("data-bs-toggle") ||
      anchor.classList.contains("password-toggle-btn")
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
      const isCurrentlyInPages = window.location.pathname
        .replace(/\\/g, "/")
        .includes("/pages/");
      window.location.href = isCurrentlyInPages ? "../404.html" : "404.html";
    }
  });
});
