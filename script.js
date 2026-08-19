document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const Motion = window.AzielMotion;
  const reduceMotion = Motion?.reduceMotion ?? false;
  const supportsMouse = window.matchMedia("(pointer: fine)").matches;

  /* =====================================================
     HELPERS
  ====================================================== */

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const createToast = (message) => {
    let toast = $(".site-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "site-toast";
      Object.assign(toast.style, {
        position: "fixed",
        left: "50%",
        bottom: "22px",
        zIndex: "500",
        maxWidth: "calc(100% - 30px)",
        padding: "11px 14px",
        border: "1px solid rgba(255,255,255,.14)",
        borderRadius: "10px",
        color: "#f5f5f2",
        background: "rgba(12,12,12,.94)",
        boxShadow: "0 18px 60px rgba(0,0,0,.42)",
        backdropFilter: "blur(14px)",
        font: "500 11px 'JetBrains Mono', monospace",
        opacity: "0",
        transform: "translate(-50%, 15px)",
        pointerEvents: "none",
      });
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    Motion.animate(
      toast,
      [
        { opacity: 0, transform: "translate(-50%, 15px)" },
        { opacity: 1, transform: "translate(-50%, 0)" },
      ],
      { duration: 350 }
    );

    window.clearTimeout(toast.hideTimer);
    toast.hideTimer = window.setTimeout(() => {
      Motion.animate(
        toast,
        [
          { opacity: 1, transform: "translate(-50%, 0)" },
          { opacity: 0, transform: "translate(-50%, 10px)" },
        ],
        { duration: 280 }
      );
    }, 2600);
  };

  /* =====================================================
     PRELOADER + INITIAL HERO
  ====================================================== */

  const preloader = $("#preloader");
  const preloaderBar = $("#preloaderBar");
  const preloaderValue = $("#preloaderValue");
  const preloaderState = $("#preloaderState");
  const introStartedAt = performance.now();
  const minimumIntroDuration = reduceMotion ? 0 : 2450;
  let loadingValue = 0;
  let loadingTarget = 4;
  let loadingFinished = false;
  let loadingRaf = 0;

  const updatePreloaderState = (value) => {
    if (!preloaderState) return;
    if (value < 32) preloaderState.textContent = "ENTERING DIGITAL SPACE";
    else if (value < 68) preloaderState.textContent = "SYNCING PORTFOLIO LAYERS";
    else if (value < 96) preloaderState.textContent = "PREPARING EXPERIENCE";
    else preloaderState.textContent = "WELCOME, YOU'RE IN";
  };

  const renderPreloaderProgress = () => {
    loadingValue += (loadingTarget - loadingValue) * 0.115;
    if (Math.abs(loadingTarget - loadingValue) < 0.08) loadingValue = loadingTarget;

    const displayValue = Math.round(loadingValue);
    if (preloaderBar) preloaderBar.style.width = `${displayValue}%`;
    if (preloaderValue) preloaderValue.textContent = `${String(displayValue).padStart(2, "0")}%`;
    updatePreloaderState(displayValue);

    if (!loadingFinished || Math.abs(loadingTarget - loadingValue) > 0.1) {
      loadingRaf = window.requestAnimationFrame(renderPreloaderProgress);
    }
  };

  const prepareIntroTitle = () => {
    const introWords = $$("[data-intro-word]", preloader || document);
    const introChars = [];

    introWords.forEach((word, wordIndex) => {
      const letters = Array.from(word.textContent || "");
      word.textContent = "";
      word.style.setProperty("--intro-word-index", String(wordIndex));

      letters.forEach((letter, charIndex) => {
        const char = document.createElement("span");
        char.className = "intro-char";
        char.textContent = letter;
        char.style.setProperty("--intro-char-index", String(charIndex));
        word.appendChild(char);
        introChars.push(char);
      });
    });

    if (!introChars.length || reduceMotion) {
      introChars.forEach((char) => {
        char.style.opacity = "1";
        char.style.transform = "none";
        char.style.filter = "none";
      });
      preloader?.classList.add("is-intro-ready");
      return;
    }

    const introWordsList = $$("[data-intro-word]", preloader || document);
    Motion.animate(introWordsList, [
      { opacity: 0, transform: "translateY(26px) scale(.965)", filter: "blur(12px)" },
      { opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0)" },
    ], {
      duration: 860,
      delay: 80,
      stagger: 90,
      easing: "cubic-bezier(.16,1,.3,1)",
    });

    Motion.animate(introChars, [
      { opacity: 0, transform: "translate3d(0,72%,0) rotateX(-64deg) scale(.97)", filter: "blur(8px)" },
      { opacity: 1, transform: "translate3d(0,0,0) rotateX(0) scale(1)", filter: "blur(0)" },
    ], {
      duration: 920,
      delay: 120,
      stagger: 22,
      easing: "cubic-bezier(.16,1,.3,1)",
    });

    window.setTimeout(() => preloader?.classList.add("is-intro-ready"), 720);
  };

  prepareIntroTitle();

  const revealHero = () => {
    const heroKicker = $("#home .section-kicker");
    const heroLines = $$("#home [data-split='lines'] > span");
    const heroReveals = $$("#home .reveal");
    const hangingStage = $("#hangingStage");

    if (heroKicker) {
      Motion.animate(heroKicker, [
        { opacity: 0, transform: "translateY(22px)", filter: "blur(8px)" },
        { opacity: 1, transform: "translateY(0)", filter: "blur(0)" },
      ], { duration: 760 });
    }

    Motion.animate(heroLines, [
      { opacity: 0, transform: "translateY(76px) scale(.985)", filter: "blur(11px)" },
      { opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0)" },
    ], { duration: 1050, delay: 70, stagger: 115, easing: "cubic-bezier(.16,1,.3,1)" });

    Motion.animate(heroReveals.filter((item) => item !== heroKicker), [
      { opacity: 0, transform: "translateY(30px)", filter: "blur(8px)" },
      { opacity: 1, transform: "translateY(0)", filter: "blur(0)" },
    ], { duration: 800, delay: 330, stagger: 80 });

    if (hangingStage) {
      Motion.animate(hangingStage, [
        { opacity: 0, transform: "translateY(-55px) scale(.91) rotate(1.5deg)", filter: "blur(12px)" },
        { opacity: 1, transform: "translateY(0) scale(1) rotate(0)", filter: "blur(0)" },
      ], { duration: 1200, delay: 260, easing: "cubic-bezier(.16,1,.3,1)" });
    }
  };

  const finishPreloader = () => {
    if (!preloader || loadingFinished) return;
    loadingFinished = true;
    loadingTarget = 100;

    const elapsed = performance.now() - introStartedAt;
    const introRemaining = Math.max(0, minimumIntroDuration - elapsed);

    window.setTimeout(() => {
      preloader.classList.add("is-leaving");

      const content = $(".preloader-content", preloader);
      const rings = $(".preloader-depth-rings", preloader);

      if (content) {
        Motion.animate(content, [
          { opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0)" },
          { opacity: 0, transform: "translateY(-22px) scale(.972)", filter: "blur(10px)" },
        ], { duration: 720, easing: "cubic-bezier(.4,0,.2,1)" });
      }

      if (rings) {
        Motion.animate(rings, [
          { opacity: 1, transform: "translate(-50%,-50%) scale(1)" },
          { opacity: 0, transform: "translate(-50%,-50%) scale(1.28)" },
        ], { duration: 900, easing: "cubic-bezier(.16,1,.3,1)" });
      }

      Motion.animate(preloader, [
        { opacity: 1, transform: "scale(1)", filter: "blur(0)" },
        { opacity: 0, transform: "scale(1.035)", filter: "blur(8px)" },
      ], { duration: 900, delay: 220, easing: "cubic-bezier(.4,0,.2,1)" });

      window.setTimeout(() => {
        preloader.classList.add("is-hidden");
        if (loadingRaf) window.cancelAnimationFrame(loadingRaf);
        document.body.classList.remove("is-loading");
        revealHero();
      }, reduceMotion ? 0 : 920);
    }, reduceMotion ? 0 : introRemaining + 100);
  };

  if (preloader && !reduceMotion) {
    loadingRaf = window.requestAnimationFrame(renderPreloaderProgress);

    const loadingTimer = window.setInterval(() => {
      const remaining = 96 - loadingTarget;
      const step = Math.max(.55, remaining * (.08 + Math.random() * .045));
      loadingTarget = Math.min(96, loadingTarget + step);
    }, 95);

    window.addEventListener("load", () => {
      window.clearInterval(loadingTimer);
      finishPreloader();
    }, { once: true });

    window.setTimeout(() => {
      window.clearInterval(loadingTimer);
      finishPreloader();
    }, 3000);
  } else {
    loadingTarget = 100;
    loadingValue = 100;
    if (preloaderBar) preloaderBar.style.width = "100%";
    if (preloaderValue) preloaderValue.textContent = "100%";
    updatePreloaderState(100);
    finishPreloader();
  }

  /* =====================================================
     REVEALS
  ====================================================== */

  const animateReveal = (element) => {
    const delay = Number(element.dataset.delay || 0);
    let from = { opacity: 0, transform: "translateY(35px)", filter: "blur(7px)" };

    if (element.classList.contains("reveal-left")) {
      from = { opacity: 0, transform: "translateX(-50px)", filter: "blur(6px)" };
    } else if (element.classList.contains("reveal-right")) {
      from = { opacity: 0, transform: "translateX(50px)", filter: "blur(6px)" };
    } else if (element.classList.contains("reveal-scale")) {
      from = { opacity: 0, transform: "scale(.91)", filter: "blur(8px)" };
    }

    Motion.animate(element, [from, { opacity: 1, transform: "translate(0,0) scale(1)", filter: "blur(0)" }], {
      duration: 780,
      delay,
    });
    element.dataset.revealed = "true";
  };

  const observeVisibleElements = (scope = document) => {
    const elements = $$(".reveal, .reveal-left, .reveal-right, .reveal-scale", scope).filter(
      (element) => !element.closest("#home") && element.dataset.revealed !== "true"
    );
    Motion.observe(elements, animateReveal);

    const splitGroups = $$('[data-split="lines"]', scope).filter((group) => !group.closest("#home") && group.dataset.revealed !== "true");
    Motion.observe(splitGroups, (group) => {
      group.dataset.revealed = "true";
      Motion.animate($$(":scope > span", group), [
        { opacity: 0, transform: "translateY(55px)", filter: "blur(7px)" },
        { opacity: 1, transform: "translateY(0)", filter: "blur(0)" },
      ], { duration: 820, stagger: 95 });
    });
  };

  observeVisibleElements();

  /* =====================================================
     HEADER, PROGRESS, ACTIVE NAV
  ====================================================== */

  const header = $("#siteHeader");
  const progressBar = $(".scroll-progress span");
  const navLinks = $$(".desktop-nav a, .mobile-nav a");
  const sections = $$("main section[id]");

  const updateScrollUI = Motion.rafThrottle(() => {
    const top = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = height > 0 ? (top / height) * 100 : 0;
    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (header) header.classList.toggle("scrolled", top > 60);
  });

  updateScrollUI();
  window.addEventListener("scroll", updateScrollUI, { passive: true });

  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`));
    }, { threshold: [0.25, 0.45, 0.65] });
    sections.forEach((section) => navObserver.observe(section));
  }

  /* =====================================================
     MOBILE MENU
  ====================================================== */

  const menuToggle = $("#menuToggle");
  const mobileMenu = $("#mobileMenu");

  const setMenuState = (open, focusToggle = false) => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.classList.toggle("is-active", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    mobileMenu.classList.toggle("is-open", open);
    mobileMenu.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("menu-open", open);
    if (focusToggle && !open) menuToggle.focus();
  };

  menuToggle?.addEventListener("click", () => setMenuState(menuToggle.getAttribute("aria-expanded") !== "true"));
  $$('[data-menu-close]').forEach((button) => button.addEventListener("click", () => setMenuState(false, true)));
  $$('[data-menu-link]').forEach((link) => link.addEventListener("click", () => setMenuState(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuState(false, true);
      closeProjectModal();
      closeCertificateModal();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1050) setMenuState(false);
  });

  /* =====================================================
     NAVIGATION WIPE + SMOOTH SCROLL
  ====================================================== */

  const transitionOverlay = $("#pageTransition");
  const transitionLayer = $("#pageTransition span");
  let transitionRunning = false;

  const navigateTo = (target) => {
    if (!target) return;
    if (reduceMotion || !transitionOverlay || !transitionLayer) {
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      return;
    }
    if (transitionRunning) return;
    transitionRunning = true;
    transitionOverlay.classList.add("is-running");

    const cover = Motion.animate(transitionLayer, [
      { transform: "scaleY(0)", transformOrigin: "bottom" },
      { transform: "scaleY(1)", transformOrigin: "bottom" },
    ], { duration: 360 });

    Promise.all(cover.map((animation) => animation.finished)).then(() => {
      target.scrollIntoView({ behavior: "auto", block: "start" });
      Motion.animate(transitionLayer, [
        { transform: "scaleY(1)", transformOrigin: "top" },
        { transform: "scaleY(0)", transformOrigin: "top" },
      ], { duration: 430, delay: 70 });
      window.setTimeout(() => {
        transitionOverlay.classList.remove("is-running");
        transitionRunning = false;
      }, 520);
    });
  };

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const selector = link.getAttribute("href");
      if (!selector) return;
      if (selector === "#") {
        event.preventDefault();
        return;
      }
      const target = $(selector);
      if (!target) return;
      event.preventDefault();
      navigateTo(target);
    });
  });

  /* =====================================================
     CURSOR
  ====================================================== */

  const cursorDot = $(".cursor-dot");
  const cursorRing = $(".cursor-ring");

  if (supportsMouse && !reduceMotion && cursorDot && cursorRing) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      cursorDot.style.opacity = "1";
      cursorRing.style.opacity = "1";
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    const renderCursor = () => {
      ringX = Motion.lerp(ringX, mouseX, 0.14);
      ringY = Motion.lerp(ringY, mouseY, 0.14);
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursor);
    };
    renderCursor();

    $$('a, button, input, textarea, .tilt-card, .stat-card, .tech-card').forEach((element) => {
      element.addEventListener("mouseenter", () => cursorRing.classList.add("is-hovering"));
      element.addEventListener("mouseleave", () => cursorRing.classList.remove("is-hovering"));
    });
    document.addEventListener("mouseleave", () => {
      cursorDot.style.opacity = "0";
      cursorRing.style.opacity = "0";
    });
  }

  /* =====================================================
     POINTER PARALLAX, TILT, MAGNETIC
  ====================================================== */

  const hangingStage = $("#hangingStage");
  const heroSpotlight = $(".hero-spotlight");

  if (supportsMouse && !reduceMotion) {
    window.addEventListener("mousemove", Motion.rafThrottle((event) => {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      if (hangingStage) hangingStage.style.transform = `translate3d(${nx * 15}px, ${ny * 8}px, 0)`;
      if (heroSpotlight) heroSpotlight.style.transform = `translate3d(${nx * 22}px, ${ny * 16}px, 0)`;
    }));

    $$(".tilt-card").forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const ry = (x / rect.width - 0.5) * 7;
        const rx = (y / rect.height - 0.5) * -7;
        card.style.setProperty("--tilt-transform", `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`);
        if (!card.matches("#hangingCard")) card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.removeProperty("--tilt-transform");
        if (!card.matches("#hangingCard")) card.style.transform = "";
      });
    });

    $$(".magnetic").forEach((element) => {
      element.addEventListener("mousemove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        element.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
      });
      element.addEventListener("mouseleave", () => {
        element.style.transform = "";
      });
    });


  }

  /* =====================================================
     CINEMATIC PHOTO GLARE (Desktop Mouse & Mobile Touch/Click)
  ====================================================== */

  const initPhotoGlare = () => {
    const photoConfigs = [
      {
        host: $("#hangingCard"),
        target: $(".portrait-frame"),
        parentClass: "is-card-lit"
      },
      {
        host: $(".about-portrait"),
        target: $(".round-portrait"),
        parentClass: "is-portrait-lit"
      }
    ];

    photoConfigs.forEach(({ host, target, parentClass }) => {
      const element = host || target;
      const lightTarget = target || host;
      if (!element || !lightTarget) return;

      let holdTimer = null;

      const updateCoordinates = (clientX, clientY) => {
        const rect = lightTarget.getBoundingClientRect();
        const x = Motion.clamp(((clientX - rect.left) / Math.max(rect.width, 1)) * 100, 0, 100);
        const y = Motion.clamp(((clientY - rect.top) / Math.max(rect.height, 1)) * 100, 0, 100);
        lightTarget.style.setProperty("--glare-x", `${x.toFixed(1)}%`);
        lightTarget.style.setProperty("--glare-y", `${y.toFixed(1)}%`);
      };

      const igniteGlare = (clientX, clientY, autoHoldMs = 0) => {
        if (holdTimer) {
          clearTimeout(holdTimer);
          holdTimer = null;
        }
        lightTarget.classList.add("is-photo-lit");
        if (host && parentClass) host.classList.add(parentClass);
        if (typeof clientX === "number" && typeof clientY === "number") {
          updateCoordinates(clientX, clientY);
        }
        if (autoHoldMs > 0) {
          holdTimer = setTimeout(dimGlare, autoHoldMs);
        }
      };

      const dimGlare = () => {
        lightTarget.classList.remove("is-photo-lit");
        if (host && parentClass) host.classList.remove(parentClass);
        lightTarget.style.setProperty("--glare-x", "50%");
        lightTarget.style.setProperty("--glare-y", "50%");
      };

      // Pointer events for modern touch & mouse
      element.addEventListener("pointerdown", (e) => {
        igniteGlare(e.clientX, e.clientY, 3500);
      });

      element.addEventListener("pointermove", Motion.rafThrottle((e) => {
        if (lightTarget.classList.contains("is-photo-lit")) {
          updateCoordinates(e.clientX, e.clientY);
        }
      }));

      element.addEventListener("pointerenter", (e) => {
        if (e.pointerType === "mouse") {
          igniteGlare(e.clientX, e.clientY);
        }
      });

      element.addEventListener("pointerleave", (e) => {
        if (e.pointerType === "mouse") {
          dimGlare();
        }
      });

      // Mobile Touch listeners
      element.addEventListener("touchstart", (e) => {
        if (e.touches && e.touches[0]) {
          igniteGlare(e.touches[0].clientX, e.touches[0].clientY, 3500);
        }
      }, { passive: true });

      element.addEventListener("touchmove", Motion.rafThrottle((e) => {
        if (e.touches && e.touches[0]) {
          updateCoordinates(e.touches[0].clientX, e.touches[0].clientY);
        }
      }), { passive: true });

      // Click / Tap
      element.addEventListener("click", (e) => {
        igniteGlare(e.clientX, e.clientY, 3500);
      });
    });
  };

  initPhotoGlare();

  /* Scroll-linked floating motion. */
  const updateParallax = Motion.rafThrottle(() => {
    if (reduceMotion) return;
    const hero = $("#home");
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    const progress = Motion.clamp(-rect.top / Math.max(rect.height, 1), 0, 1);
    const card = $("#hangingCard");
    if (card && !supportsMouse) card.style.transform = `translateY(${progress * 35}px) rotate(${6 - progress * 5}deg)`;
    hero.style.setProperty("--hero-fade", String(1 - progress * 0.65));
  });
  window.addEventListener("scroll", updateParallax, { passive: true });

  /* =====================================================
     COUNTERS
  ====================================================== */

  const animateCounter = (counter) => {
    const target = Number(counter.dataset.target || 0);
    const start = performance.now();
    const duration = 1250;

    const frame = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = String(Math.floor(target * eased));
      if (progress < 1) requestAnimationFrame(frame);
      else counter.textContent = String(target);
    };
    requestAnimationFrame(frame);
  };
  Motion.observe($$(".counter"), animateCounter, { threshold: 0.65 });

  /* =====================================================
     SHOWCASE TABS
  ====================================================== */

  const tabs = $$(".showcase-tab");
  const panels = $$(".showcase-panel");

  const activatePanel = (name) => {
    tabs.forEach((tab) => {
      const active = tab.dataset.tab === name;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    panels.forEach((panel) => {
      const active = panel.dataset.panel === name;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
      if (active) {
        observeVisibleElements(panel);
        Motion.animate(panel, [
          { opacity: 0, transform: "translateY(15px)", filter: "blur(5px)" },
          { opacity: 1, transform: "translateY(0)", filter: "blur(0)" },
        ], { duration: 480 });
      }
    });
  };
  tabs.forEach((tab) => tab.addEventListener("click", () => activatePanel(tab.dataset.tab)));

  /* =====================================================
     PROJECT MODAL
  ====================================================== */

  const projectData = {
    "todo-api": {
      kicker: "BACKEND API / MAIN PROJECT",
      title: "Todo REST API",
      description: "Project Laravel untuk mengelola todo berdasarkan user yang login. Project ini digunakan untuk memahami alur request, keamanan akses, query database, validation, dan response API.",
      stats: [
        ["STATUS", "In Development"],
        ["ROLE", "Backend Developer"],
        ["TYPE", "REST API"],
        ["YEAR", "2026"],
      ],
      features: ["CRUD endpoint lengkap", "Login dan register dengan token", "Token authentication & authorization", "Request validation & error response", "Search berdasarkan judul & filter status"],
      tags: ["Laravel", "PHP", "MySQL", "Sanctum", "Postman"],
      visual: "api",
    },
    "booking-lapangan": {
      kicker: "FULLSTACK WEB APPLICATION / PRODUCTION",
      title: "Sport Court Booking Platform",
      description: "Platform sistem pemesanan lapangan olahraga online berbasis Laravel yang aktif di Railway Cloud. Memungkinkan penyewa memilih slot jam dan tanggal secara real-time tanpa bentrok jadwal (conflict detection), serta memudahkan admin mengelola verifikasi transaksi dan ketersediaan lapangan.",
      liveUrl: "https://booking-lapangan-production.up.railway.app/",
      stats: [
        ["PLATFORM", "Laravel & Blade"],
        ["DATABASE", "MySQL"],
        ["HOSTING", "Railway Cloud"],
        ["STATUS", "Live on Railway"],
      ],
      features: [
        "Real-time Slot Scheduling: Pemilihan tanggal & jam otomatis mencegah jadwal bentrok (anti-conflict)",
        "Multi-Field Support: Pengelolaan lapangan Futsal, Badminton, dan Mini Soccer",
        "Multi-Role Authorization: Hak akses terpisah antara Penyewa (User) dan Admin Lapangan",
        "Booking Lifecycle: Alur status pemesanan terstruktur (Pending, Confirmed, Cancelled, Completed)",
        "Admin Dashboard: Monitoring rekap pemesanan masuk, kelola tarif lapangan, dan status jadwal",
      ],
      tags: ["Laravel", "PHP", "MySQL", "Blade", "Railway", "RESTful Controller", "Responsive UI"],
      visual: "booking",
    },
  };

  const projectModal = $("#projectModal");
  const modalKicker = $("#modalKicker");
  const modalTitle = $("#modalTitle");
  const modalDescription = $("#modalDescription");
  const modalStats = $("#modalStats");
  const modalFeatures = $("#modalFeatures");
  const modalTags = $("#modalTags");
  const modalVisual = $("#modalVisual");
  let lastModalTrigger = null;

  function buildModalVisual(type) {
    if (type === "booking") {
      return `
        <div class="modal-booking">
          <div class="modal-api-top">
            <span>BOOKING PLATFORM · RAILWAY LIVE</span>
            <span style="color:var(--lime)">● LIVE ON RAILWAY</span>
          </div>
          <div class="modal-booking-body">
            <div class="modal-booking-court-select">
              <span class="active">⚽ Futsal Court A</span>
              <span>🏸 Badminton 1</span>
              <span>🥅 Mini Soccer</span>
            </div>
            <div class="modal-booking-slots">
              <div class="modal-slot-card is-available">
                <small>08:00 - 10:00</small>
                <strong>Available</strong>
                <span>Pagi / Siang</span>
              </div>
              <div class="modal-slot-card is-booked">
                <small>10:00 - 12:00</small>
                <strong>Booked</strong>
                <span>Sudah Dipesan</span>
              </div>
              <div class="modal-slot-card is-available">
                <small>14:00 - 16:00</small>
                <strong>Available</strong>
                <span>Siang / Sore</span>
              </div>
              <div class="modal-slot-card is-booked">
                <small>19:00 - 21:00</small>
                <strong>Booked</strong>
                <span>Sudah Dipesan</span>
              </div>
            </div>
            <div class="modal-booking-action">
              <a href="https://booking-lapangan-production.up.railway.app/" target="_blank" rel="noopener noreferrer" class="button button-primary" style="width:100%; text-decoration:none;">
                <span>Kunjungi Live Website di Railway</span><i>↗</i>
              </a>
            </div>
          </div>
        </div>`;
    }

    return `
      <div class="modal-api">
        <div class="modal-api-top"><span>TODO API / POSTMAN PREVIEW</span><span>● SERVER ONLINE</span></div>
        <div class="modal-api-body">
          <aside class="modal-api-nav"><span class="active">GET Todos</span><span>POST Create</span><span>PUT Update</span><span>DEL Delete</span><span>POST Login</span></aside>
          <div class="modal-api-main">
            <div class="modal-endpoint"><b>GET</b><span>/api/todos?search=laravel&amp;status=selesai</span><em>200 OK</em></div>
            <div class="modal-json"><span>{</span><span class="indent"><i>"success"</i>: <b>true</b>,</span><span class="indent"><i>"message"</i>: <em>"Todo berhasil ditemukan"</em>,</span><span class="indent"><i>"data"</i>: [...]</span><span>}</span></div>
          </div>
        </div>
      </div>`;
  }

  function openProjectModal(projectKey, trigger) {
    const data = projectData[projectKey];
    if (!data || !projectModal) return;
    lastModalTrigger = trigger || document.activeElement;
    modalKicker.textContent = data.kicker;
    modalTitle.textContent = data.title;
    modalDescription.textContent = data.description;
    modalStats.innerHTML = data.stats.map(([label, value]) => `<div class="modal-stat"><span>${label}</span><strong>${value}</strong></div>`).join("");
    modalFeatures.innerHTML = data.features.map((feature) => `<li>${feature}</li>`).join("");
    modalTags.innerHTML = data.tags.map((tag) => `<span>${tag}</span>`).join("");
    modalVisual.innerHTML = buildModalVisual(data.visual);

    // Live URL CTA in modal
    const existingCta = $(".modal-live-cta", projectModal);
    if (existingCta) existingCta.remove();
    if (data.liveUrl) {
      const cta = document.createElement("div");
      cta.className = "modal-live-cta";
      cta.style.marginTop = "24px";
      cta.innerHTML = `
        <a href="${data.liveUrl}" target="_blank" rel="noopener noreferrer" class="button button-primary" style="display:inline-flex; width:auto; text-decoration:none;">
          <span>Lihat Live Website</span><i>↗</i>
        </a>
      `;
      $(".modal-copy", projectModal)?.appendChild(cta);
    }

    projectModal.classList.add("is-open");
    projectModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    window.setTimeout(() => $("[data-close-modal]", projectModal)?.focus(), 120);
  }

  function closeProjectModal() {
    if (!projectModal?.classList.contains("is-open")) return;
    projectModal.classList.remove("is-open");
    projectModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    lastModalTrigger?.focus?.();
  }

  $$('[data-open-project]').forEach((button) => button.addEventListener("click", () => openProjectModal(button.dataset.openProject, button)));
  $$('[data-close-modal]').forEach((button) => button.addEventListener("click", closeProjectModal));

  /* =====================================================
     CERTIFICATE MODAL
  ====================================================== */

  const certificateModal = $("#certificateModal");
  const certModalImage = $("#certModalImage");
  const certModalCaption = $("#certModalCaption");
  let lastCertificateTrigger = null;

  function openCertificateModal(trigger) {
    if (!certificateModal) return;
    lastCertificateTrigger = trigger || document.activeElement;
    if (trigger) {
      const img = trigger.dataset.certImg || "assets/images/sertifikat.jpg";
      const title = trigger.dataset.certTitle || "Sertifikat";
      const desc = trigger.dataset.certDesc || "";
      if (certModalImage) {
        certModalImage.src = img;
        certModalImage.alt = `Pratinjau ${title}`;
      }
      if (certModalCaption) {
        certModalCaption.innerHTML = `<strong>${title}</strong><br />${desc}`;
      }
    }
    certificateModal.classList.add("is-open");
    certificateModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    window.setTimeout(() => $("[data-close-certificate]", certificateModal)?.focus(), 120);
  }
  function closeCertificateModal() {
    if (!certificateModal?.classList.contains("is-open")) return;
    certificateModal.classList.remove("is-open");
    certificateModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    lastCertificateTrigger?.focus?.();
  }
  $$('[data-certificate]').forEach((button) => button.addEventListener("click", () => openCertificateModal(button)));
  $$('[data-close-certificate]').forEach((button) => button.addEventListener("click", closeCertificateModal));

  /* =====================================================
     CV PREVIEW & PERMISSION MODAL
  ====================================================== */

  const cvModal = $("#cvModal");
  const downloadCvBtn = $("#downloadCv");
  const cvTabButtons = $$("[data-cv-tab]", cvModal);
  const cvTabPanels = {
    summary: $("#cvTabSummary"),
    request: $("#cvTabRequest")
  };
  const cvSwitchTabBtn = $("#cvSwitchTabBtn");
  const cvRequestForm = $("#cvRequestForm");
  const cvReqStatus = $("#cvReqStatus");
  const cvSubmitBtn = $("#cvSubmitBtn");
  let lastCvTrigger = null;

  function switchCvTab(tabKey) {
    cvTabButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.cvTab === tabKey));
    if (cvTabPanels.summary) cvTabPanels.summary.classList.toggle("active", tabKey === "summary");
    if (cvTabPanels.request) cvTabPanels.request.classList.toggle("active", tabKey === "request");
    if (cvSwitchTabBtn) {
      if (tabKey === "summary") {
        cvSwitchTabBtn.innerHTML = `<span>🔒 Minta File CV Lengkap</span><i>→</i>`;
        cvSwitchTabBtn.onclick = () => switchCvTab("request");
      } else {
        cvSwitchTabBtn.innerHTML = `<span>📄 Kembali ke Ringkasan</span><i>←</i>`;
        cvSwitchTabBtn.onclick = () => switchCvTab("summary");
      }
    }
  }

  cvTabButtons.forEach((btn) => {
    btn.addEventListener("click", () => switchCvTab(btn.dataset.cvTab));
  });

  if (cvSwitchTabBtn) {
    cvSwitchTabBtn.onclick = () => switchCvTab("request");
  }

  function openCvModal(trigger) {
    if (!cvModal) return;
    lastCvTrigger = trigger || document.activeElement;
    switchCvTab("summary");
    cvModal.classList.add("is-open");
    cvModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    window.setTimeout(() => $("[data-close-cv]", cvModal)?.focus(), 120);
  }

  function closeCvModal() {
    if (!cvModal?.classList.contains("is-open")) return;
    cvModal.classList.remove("is-open");
    cvModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    lastCvTrigger?.focus?.();
  }

  if (downloadCvBtn) {
    downloadCvBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openCvModal(downloadCvBtn);
    });
  }

  $$('[data-close-cv]').forEach((button) => button.addEventListener("click", closeCvModal));

  // CV Request Form Handler (Formspree)
  cvRequestForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const endpoint = "https://formspree.io/f/xljroywk";
    const formData = new FormData(cvRequestForm);
    formData.append("_subject", `[CV Request] Permintaan CV dari ${formData.get("name")}`);

    if (cvSubmitBtn) {
      cvSubmitBtn.disabled = true;
      cvSubmitBtn.innerHTML = `<span>Mengirim Permintaan...</span>`;
    }
    if (cvReqStatus) {
      cvReqStatus.className = "cv-req-status";
      cvReqStatus.textContent = "Menghubungi server...";
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      });

      if (response.ok) {
        if (cvReqStatus) {
          cvReqStatus.className = "cv-req-status success";
          cvReqStatus.textContent = "✓ Permintaan terkirim! Aziel akan mengirimkan CV resmi ke email Anda.";
        }
        cvRequestForm.reset();
        createToast("Permintaan CV berhasil dikirim ke Aziel!");
      } else {
        throw new Error("Gagal mengirim");
      }
    } catch {
      if (cvReqStatus) {
        cvReqStatus.className = "cv-req-status error";
        cvReqStatus.textContent = "Gagal kirim via form. Silakan gunakan tombol Kirim Email Langsung di bawah.";
      }
    } finally {
      if (cvSubmitBtn) {
        cvSubmitBtn.disabled = false;
        cvSubmitBtn.innerHTML = `<span>Kirim Permintaan CV</span><i>→</i>`;
      }
    }
  });

  const contactForm = $("#contactForm");
  const formStatus = $("#formStatus");
  const contactSubmitBtn = $("#contactSubmitBtn");

  contactForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const actionUrl = contactForm.getAttribute("action") || "";
    const isPlaceholder = !actionUrl || actionUrl.includes("ID_FORMSPREE_LU");

    if (contactSubmitBtn) {
      contactSubmitBtn.disabled = true;
      contactSubmitBtn.style.opacity = "0.7";
    }

    if (formStatus) {
      formStatus.textContent = "Mengirim pesan...";
      formStatus.style.color = "var(--muted)";
    }

    // Jika belum memasukkan ID Formspree asli (Mode Simulasi / Demo Aman)
    if (isPlaceholder) {
      window.setTimeout(() => {
        if (formStatus) {
          formStatus.textContent = "Pesan tersimulasi (Demo Mode). Masukkan Formspree ID di index.html untuk email langsung.";
          formStatus.style.color = "var(--lime)";
        }
        createToast("Demo: Pesan disimulasikan!");
        contactForm.reset();
        if (contactSubmitBtn) {
          contactSubmitBtn.disabled = false;
          contactSubmitBtn.style.opacity = "";
        }
      }, 600);
      return;
    }

    // Mengirim ke Formspree asli secara async
    try {
      const response = await fetch(actionUrl, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        if (formStatus) {
          formStatus.textContent = "Terima kasih! Pesan Anda berhasil terkirim.";
          formStatus.style.color = "var(--lime)";
        }
        createToast("Pesan berhasil terkirim!");
        contactForm.reset();
      } else {
        const result = await response.json().catch(() => null);
        const errorMsg = result?.errors?.map((e) => e.message).join(", ") || "Terjadi kendala saat mengirim pesan.";
        if (formStatus) {
          formStatus.textContent = errorMsg;
          formStatus.style.color = "var(--red)";
        }
        createToast("Gagal mengirim pesan.");
      }
    } catch (err) {
      if (formStatus) {
        formStatus.textContent = "Koneksi terganggu. Silakan coba lagi.";
        formStatus.style.color = "var(--red)";
      }
      createToast("Terjadi kesalahan jaringan.");
    } finally {
      if (contactSubmitBtn) {
        contactSubmitBtn.disabled = false;
        contactSubmitBtn.style.opacity = "";
      }
    }
  });

  /* =====================================================
     COMMENTS / LOCAL STORAGE
  ====================================================== */

  const commentForm = $("#commentForm");
  const commentList = $("#commentList");
  const storageKey = "azielPortfolioCommentsV1";
  const defaultComments = [
    { name: "Aziel", text: "Portfolio backend sedang terus dikembangkan.", time: "Now" },
    { name: "Visitor", text: "Clean design and smooth interaction!", time: "Demo" },
  ];

  const getComments = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || "null");
      return Array.isArray(stored) ? stored : defaultComments;
    } catch {
      return defaultComments;
    }
  };

  const saveComments = (comments) => {
    try { localStorage.setItem(storageKey, JSON.stringify(comments.slice(0, 8))); } catch { /* storage may be unavailable */ }
  };

  const renderComments = () => {
    if (!commentList) return;
    const comments = getComments();
    commentList.innerHTML = comments.map((comment) => {
      const safeName = String(comment.name).replace(/[<>&"']/g, "");
      const safeText = String(comment.text).replace(/[<>&"']/g, "");
      const initials = safeName.slice(0, 2).toUpperCase();
      return `<article class="comment-item"><span class="comment-avatar">${initials}</span><div class="comment-copy"><strong>${safeName}</strong><p>${safeText}</p></div><span class="comment-time">${comment.time || "Now"}</span></article>`;
    }).join("");
  };
  renderComments();

  commentForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(commentForm);
    const name = String(data.get("commentName") || "").trim();
    const text = String(data.get("commentText") || "").trim();
    if (!name || !text) return;
    const comments = getComments();
    comments.unshift({ name, text, time: "Now" });
    saveComments(comments);
    renderComments();
    commentForm.reset();
    createToast("Komentar tersimpan di browser ini.");
  });
});
