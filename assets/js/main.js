/**
 * Pinwatta Village Portal - JavaScript
 * Common functionality for all pages
 */

// Tailwind CSS Configuration
window.tailwindConfig = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0ea5e9",
          600: "#0284c7",
        },
        secondary: {
          DEFAULT: "#14b8a6",
          600: "#0d9488",
        },
        dark: "#111827",
        light: "#f9fafb",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
};

// Apply Tailwind config
if (typeof tailwind !== "undefined") {
  tailwind.config = window.tailwindConfig;
}

/**
 * Theme Management System
 */
class ThemeManager {
  constructor() {
    this.htmlElement = document.documentElement;
    this.themeToggle = null;
    this.mobileThemeToggle = null;
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setupTheme());
    } else {
      this.setupTheme();
    }
  }

  setupTheme() {
    // Get toggle buttons
    this.themeToggle = document.getElementById("theme-toggle");
    this.mobileThemeToggle = document.getElementById("mobile-theme-toggle");

    // Load saved theme
    this.loadSavedTheme();

    // Setup event listeners
    this.setupEventListeners();

    // Update toggle button states
    this.updateToggleStates();
  }

  loadSavedTheme() {
    const savedTheme = localStorage.getItem("pinwatta-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    // Use saved theme or system preference
    const shouldUseDark = savedTheme ? savedTheme === "dark" : prefersDark;

    if (shouldUseDark) {
      this.htmlElement.classList.add("dark");
    } else {
      this.htmlElement.classList.remove("dark");
    }
  }

  setupEventListeners() {
    // Desktop theme toggle
    if (this.themeToggle) {
      this.themeToggle.addEventListener("click", () => this.toggleTheme());
    }

    // Mobile theme toggle
    if (this.mobileThemeToggle) {
      this.mobileThemeToggle.addEventListener("click", () =>
        this.toggleTheme()
      );
    }

    // Listen for system theme changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem("pinwatta-theme")) {
          if (e.matches) {
            this.setDarkTheme();
          } else {
            this.setLightTheme();
          }
        }
      });
  }

  toggleTheme() {
    const isDark = this.htmlElement.classList.contains("dark");

    if (isDark) {
      this.setLightTheme();
    } else {
      this.setDarkTheme();
    }

    this.updateToggleStates();

    // Add visual feedback
    this.addToggleFeedback();
  }

  setDarkTheme() {
    this.htmlElement.classList.add("dark");
    localStorage.setItem("pinwatta-theme", "dark");
  }

  setLightTheme() {
    this.htmlElement.classList.remove("dark");
    localStorage.setItem("pinwatta-theme", "light");
  }

  updateToggleStates() {
    const isDark = this.htmlElement.classList.contains("dark");

    // Update both desktop and mobile toggles
    [this.themeToggle, this.mobileThemeToggle].forEach((toggle) => {
      if (toggle) {
        const sunIcon = toggle.querySelector('[data-lucide="sun"]');
        const moonIcon = toggle.querySelector('[data-lucide="moon"]');

        if (sunIcon && moonIcon) {
          if (isDark) {
            sunIcon.classList.remove("hidden");
            moonIcon.classList.add("hidden");
          } else {
            sunIcon.classList.add("hidden");
            moonIcon.classList.remove("hidden");
          }
        }
      }
    });

    // Refresh Lucide icons to ensure proper visibility
    if (typeof lucide !== "undefined") {
      setTimeout(() => {
        lucide.createIcons();
      }, 50);
    }
  }

  addToggleFeedback() {
    // Add subtle animation feedback when toggling
    [this.themeToggle, this.mobileThemeToggle].forEach((toggle) => {
      if (toggle) {
        toggle.style.transform = "scale(0.9)";
        setTimeout(() => {
          toggle.style.transform = "";
        }, 100);
      }
    });
  }
}

/**
 * Navigation Manager
 */
class NavigationManager {
  constructor() {
    this.header = null;
    this.mobileMenuButton = null;
    this.mobileMenu = null;
    this.init();
  }

  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.setupNavigation()
      );
    } else {
      this.setupNavigation();
    }
  }

  setupNavigation() {
    this.header = document.getElementById("header");
    this.mobileMenuButton = document.getElementById("mobile-menu-button");
    this.mobileMenu = document.getElementById("mobile-menu");

    this.setupScrollEffects();
    this.setupMobileMenu();
    this.setupSmoothScrolling();
  }

  setupScrollEffects() {
    if (!this.header) return;

    let lastScroll = 0;
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      // Add shadow when scrolled
      if (currentScroll > 10) {
        this.header.classList.add("shadow-md");
      } else {
        this.header.classList.remove("shadow-md");
      }

      // Optional: Hide header on scroll down, show on scroll up
      if (currentScroll > lastScroll && currentScroll > 100) {
        this.header.style.transform = "translateY(-100%)";
      } else {
        this.header.style.transform = "translateY(0)";
      }

      lastScroll = currentScroll;
    };

    // Throttle scroll events for performance
    let scrollTimeout;
    window.addEventListener("scroll", () => {
      if (scrollTimeout) {
        cancelAnimationFrame(scrollTimeout);
      }
      scrollTimeout = requestAnimationFrame(handleScroll);
    });
  }

  setupMobileMenu() {
    if (!this.mobileMenuButton || !this.mobileMenu) return;

    this.mobileMenuButton.addEventListener("click", () => {
      const isHidden = this.mobileMenu.classList.contains("hidden");

      if (isHidden) {
        this.openMobileMenu();
      } else {
        this.closeMobileMenu();
      }
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !this.mobileMenu.contains(e.target) &&
        !this.mobileMenuButton.contains(e.target)
      ) {
        this.closeMobileMenu();
      }
    });

    // Close mobile menu on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeMobileMenu();
      }
    });
  }

  openMobileMenu() {
    this.mobileMenu.classList.remove("hidden");
    this.mobileMenuButton.setAttribute("aria-expanded", "true");

    // Animate menu items
    const menuItems = this.mobileMenu.querySelectorAll("a, button");
    menuItems.forEach((item, index) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(-10px)";
      setTimeout(() => {
        item.style.transition =
          "opacity 200ms ease-out, transform 200ms ease-out";
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      }, index * 50);
    });
  }

  closeMobileMenu() {
    this.mobileMenu.classList.add("hidden");
    this.mobileMenuButton.setAttribute("aria-expanded", "false");
  }

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();

        const targetId = anchor.getAttribute("href");
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          const headerHeight = this.header ? this.header.offsetHeight : 0;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }

        // Close mobile menu after clicking a link
        this.closeMobileMenu();
      });
    });
  }
}

/**
 * Animation Manager
 */
class AnimationManager {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };
    this.init();
  }

  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.setupAnimations()
      );
    } else {
      this.setupAnimations();
    }
  }

  setupAnimations() {
    this.setupScrollAnimations();
    this.setupCounterAnimations();
    this.setupProgressBars();
  }

  setupScrollAnimations() {
    const animateElements = document.querySelectorAll("[data-animate]");

    if (animateElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const animationType = element.getAttribute("data-animate");

          element.classList.add("animate-in");

          switch (animationType) {
            case "fade-up":
              element.style.opacity = "1";
              element.style.transform = "translateY(0)";
              break;
            case "fade-in":
              element.style.opacity = "1";
              break;
            case "scale-in":
              element.style.opacity = "1";
              element.style.transform = "scale(1)";
              break;
          }
        }
      });
    }, this.observerOptions);

    animateElements.forEach((element) => {
      // Set initial state
      element.style.transition =
        "opacity 0.6s ease-out, transform 0.6s ease-out";
      element.style.opacity = "0";

      const animationType = element.getAttribute("data-animate");
      switch (animationType) {
        case "fade-up":
          element.style.transform = "translateY(30px)";
          break;
        case "scale-in":
          element.style.transform = "scale(0.9)";
          break;
      }

      observer.observe(element);
    });
  }

  setupCounterAnimations() {
    const counters = document.querySelectorAll("[data-counter]");

    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute("data-counter"));
          const duration =
            parseInt(counter.getAttribute("data-duration")) || 2000;

          this.animateCounter(counter, target, duration);
          observer.unobserve(counter);
        }
      });
    }, this.observerOptions);

    counters.forEach((counter) => observer.observe(counter));
  }

  animateCounter(element, target, duration) {
    let start = 0;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out-cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * easeOut);

      element.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString();
      }
    };

    requestAnimationFrame(updateCounter);
  }

  setupProgressBars() {
    const progressBars = document.querySelectorAll("[data-progress]");

    if (progressBars.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const progressBar = entry.target;
          const target = parseFloat(progressBar.getAttribute("data-progress"));
          const duration =
            parseInt(progressBar.getAttribute("data-duration")) || 1500;

          this.animateProgressBar(progressBar, target, duration);
          observer.unobserve(progressBar);
        }
      });
    }, this.observerOptions);

    progressBars.forEach((bar) => observer.observe(bar));
  }

  animateProgressBar(element, target, duration) {
    const startTime = performance.now();

    const updateProgress = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out-cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = target * easeOut;

      element.style.width = `${current}%`;

      if (progress < 1) {
        requestAnimationFrame(updateProgress);
      }
    };

    requestAnimationFrame(updateProgress);
  }
}

/**
 * Performance Manager
 */
class PerformanceManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupImageLazyLoading();
    this.setupPreloadOptimizations();
  }

  setupImageLazyLoading() {
    const images = document.querySelectorAll("img[data-src]");

    if (images.length === 0) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }

  setupPreloadOptimizations() {
    // Preload critical resources
    const criticalResources = [
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
    ];

    criticalResources.forEach((resource) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "style";
      link.href = resource;
      document.head.appendChild(link);
    });
  }
}

/**
 * Accessibility Manager
 */
class AccessibilityManager {
  constructor() {
    this.init();
  }

  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.setupAccessibility()
      );
    } else {
      this.setupAccessibility();
    }
  }

  setupAccessibility() {
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupAriaLabels();
  }

  setupKeyboardNavigation() {
    // Handle escape key for modals and menus
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        // Close any open modals or menus
        const openElements = document.querySelectorAll(
          '[aria-expanded="true"]'
        );
        openElements.forEach((element) => {
          if (element.id === "mobile-menu-button") {
            document.getElementById("mobile-menu")?.classList.add("hidden");
            element.setAttribute("aria-expanded", "false");
          }
        });
      }
    });
  }

  setupFocusManagement() {
    // Improve focus visibility
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        document.body.classList.add("keyboard-navigation");
      }
    });

    document.addEventListener("mousedown", () => {
      document.body.classList.remove("keyboard-navigation");
    });
  }

  setupAriaLabels() {
    // Add missing aria labels
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle && !themeToggle.getAttribute("aria-label")) {
      themeToggle.setAttribute("aria-label", "Toggle theme");
    }

    const mobileMenuButton = document.getElementById("mobile-menu-button");
    if (mobileMenuButton && !mobileMenuButton.getAttribute("aria-label")) {
      mobileMenuButton.setAttribute("aria-label", "Toggle mobile menu");
    }
  }
}

/**
 * Initialize All Systems
 */
function initializePinwattaPortal() {
  // Initialize Lucide icons if available
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // Initialize all managers
  new ThemeManager();
  new NavigationManager();
  new AnimationManager();
  new PerformanceManager();
  new AccessibilityManager();

  // Custom event for when everything is initialized
  document.dispatchEvent(
    new CustomEvent("pinwattaPortalReady", {
      detail: { timestamp: Date.now() },
    })
  );
}

// Auto-initialize when script loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializePinwattaPortal);
} else {
  initializePinwattaPortal();
}

// Export for manual initialization if needed
window.PinwattaPortal = {
  init: initializePinwattaPortal,
  ThemeManager,
  NavigationManager,
  AnimationManager,
  PerformanceManager,
  AccessibilityManager,
};
