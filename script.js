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
      description: "RESTful API terisolasi berbasis Laravel 11 untuk pengelolaan task terotentikasi. Dibangun dengan mematuhi standar REST, query scoping, validasi form terpusat, dan token security.",
      stats: [
        ["STATUS", "Production Ready"],
        ["ROLE", "Backend Architect"],
        ["TYPE", "REST API & Sanctum"],
        ["YEAR", "2026"],
      ],
      caseStudy: {
        problem: "Kebutuhan sistem API todo multi-user yang aman, cepat, dan mencegah user mengakses data milik user lain (Data Leakage & Insecure Direct Object References).",
        solution: "Menerapkan middleware autentikasi Sanctum Bearer Token, Policy Authorization, Eloquent Global Scope berdasarkan `auth()->id()`, serta validasi request terstruktur.",
      },
      features: [
        "CRUD Endpoint Lengkap: Create, Read, Update, Delete dengan HTTP status code presisi (200, 201, 401, 403, 422, 500)",
        "Sanctum Bearer Token Auth: Token issuance, expiration, dan revoke on logout",
        "Form Request Validation: Sanitasi input otomatis dengan format error JSON terstandar",
        "Query Filtering & Search: Filter status `selesai` / `belum` dan pencarian judul berbasis indeks",
        "Pagination & Resource Transformers: Menghasilkan struktur response JSON seragam",
      ],
      tags: ["Laravel", "PHP 8.2+", "MySQL", "Sanctum", "RESTful API", "Postman"],
      visual: "api",
      apiEndpoints: [
        {
          method: "GET",
          path: "/api/todos?search=laravel&status=selesai",
          desc: "Mengambil daftar todo user dengan query filter & search terindeks.",
          payload: "// Query Params:\n// search: 'laravel'\n// status: 'selesai'\n// page: 1",
          status: "200 OK",
          statusCode: 200,
          response: {
            success: true,
            message: "Daftar todo berhasil diambil",
            meta: { current_page: 1, total_items: 4, per_page: 10 },
            data: [
              { id: 1, title: "Selesaikan REST API Sanctum", status: "selesai", priority: "high", created_at: "2026-08-20T10:15:00Z" },
              { id: 2, title: "Optimasi Query Indexing MySQL", status: "selesai", priority: "medium", created_at: "2026-08-21T14:30:00Z" }
            ]
          }
        },
        {
          method: "POST",
          path: "/api/todos",
          desc: "Membuat todo baru dengan validasi field `title` (required, max:100) dan `priority`.",
          payload: "{\n  \"title\": \"Implementasi Redis Cache\",\n  \"description\": \"Caching query response untuk mengurangi load MySQL\",\n  \"priority\": \"high\",\n  \"due_date\": \"2026-09-01\"\n}",
          status: "201 Created",
          statusCode: 201,
          response: {
            success: true,
            message: "Todo baru berhasil dibuat",
            data: { id: 5, user_id: 1, title: "Implementasi Redis Cache", priority: "high", status: "pending", created_at: "2026-08-24T07:45:00Z" }
          }
        },
        {
          method: "POST",
          path: "/api/auth/login",
          desc: "Otentikasi kredensial user dan menghasilkan Bearer Token Sanctum.",
          payload: "{\n  \"email\": \"aziel@dev.local\",\n  \"password\": \"••••••••••••\"\n}",
          status: "200 OK",
          statusCode: 200,
          response: {
            success: true,
            token_type: "Bearer",
            access_token: "1|3f9a72b8c0e14d5e9f8a2b1c4d7e0f9a",
            user: { id: 1, name: "Muhammad Aziel", email: "aziel@dev.local", role: "developer" }
          }
        }
      ],
      erdTables: [
        {
          name: "users",
          tag: "TABLE",
          fields: [
            { name: "id", type: "BIGINT (PK)", isPk: true },
            { name: "name", type: "VARCHAR(255)" },
            { name: "email", type: "VARCHAR(255) UNIQUE" },
            { name: "password", type: "VARCHAR(255)" },
            { name: "created_at", type: "TIMESTAMP" }
          ]
        },
        {
          name: "personal_access_tokens",
          tag: "AUTH / SANCTUM",
          fields: [
            { name: "id", type: "BIGINT (PK)", isPk: true },
            { name: "tokenable_id", type: "BIGINT (FK)", isFk: true },
            { name: "name", type: "VARCHAR(255)" },
            { name: "token", type: "VARCHAR(64) UNIQUE" },
            { name: "last_used_at", type: "TIMESTAMP" }
          ]
        },
        {
          name: "todos",
          tag: "TABLE",
          fields: [
            { name: "id", type: "BIGINT (PK)", isPk: true },
            { name: "user_id", type: "BIGINT (FK -> users.id)", isFk: true },
            { name: "title", type: "VARCHAR(100) INDEX" },
            { name: "description", type: "TEXT" },
            { name: "status", type: "ENUM('pending','selesai')" },
            { name: "priority", type: "ENUM('low','medium','high')" },
            { name: "due_date", type: "DATE" }
          ]
        }
      ]
    },
    "booking-lapangan": {
      kicker: "FULLSTACK WEB APPLICATION / PRODUCTION",
      title: "Sport Court Booking Platform",
      description: "Platform reservasi lapangan olahraga anti-bentrok online berbasis Laravel & Blade yang aktif live di Railway Cloud. Dilengkapi manajemen slot waktu real-time, database transaction, dan multi-role authorization.",
      liveUrl: "https://booking-lapangan-production.up.railway.app/",
      stats: [
        ["PLATFORM", "Laravel & Blade"],
        ["DATABASE", "MySQL Relational"],
        ["HOSTING", "Railway Cloud"],
        ["STATUS", "Live on Railway"],
      ],
      caseStudy: {
        problem: "Mencegah terjadinya race condition & double-booking saat dua user memesan lapangan dan jam yang sama pada detik yang bersamaan.",
        solution: "Menggunakan validasi query rentang waktu anti-bentrok (`WHERE court_id = ? AND date = ? AND (start_time < ? AND end_time > ?)`) yang dibungkus dalam `DB::transaction()` dan locking row sebelum commit.",
      },
      features: [
        "Real-time Slot Scheduling: Validasi rentang jam pemesanan otomatis mencegah bentrok jadwal (anti-conflict)",
        "Multi-Field Support: Pengelolaan lapangan Futsal, Badminton, dan Mini Soccer",
        "Multi-Role Authorization: Hak akses terpisah antara Penyewa (User) dan Admin Lapangan",
        "Booking Lifecycle: Alur status pemesanan terstruktur (Pending, Confirmed, Cancelled, Completed)",
        "Admin Dashboard: Monitoring rekap pemesanan masuk, kelola tarif lapangan, dan status jadwal",
      ],
      tags: ["Laravel", "PHP", "MySQL", "Blade", "Railway", "RESTful Controller", "Responsive UI"],
      visual: "booking",
      apiEndpoints: [
        {
          method: "GET",
          path: "/api/courts",
          desc: "Mengambil daftar lapangan olahraga beserta tipe dan tarif per jam.",
          payload: "// Headers:\n// Accept: application/json",
          status: "200 OK",
          statusCode: 200,
          response: {
            success: true,
            total_courts: 3,
            data: [
              { id: 1, name: "Futsal Court A (Vinyl)", sport: "Futsal", hourly_rate: 150000, status: "active" },
              { id: 2, name: "Badminton Court 1", sport: "Badminton", hourly_rate: 60000, status: "active" },
              { id: 3, name: "Mini Soccer Arena", sport: "Mini Soccer", hourly_rate: 350000, status: "active" }
            ]
          }
        },
        {
          method: "POST",
          path: "/api/bookings/check-availability",
          desc: "Mengecek apakah tanggal & slot jam yang dipilih masih kosong tanpa bentrok.",
          payload: "{\n  \"court_id\": 1,\n  \"booking_date\": \"2026-08-28\",\n  \"start_time\": \"14:00\",\n  \"end_time\": \"16:00\"\n}",
          status: "200 OK",
          statusCode: 200,
          response: {
            is_available: true,
            message: "Slot waktu tersedia untuk dipesan!",
            court: "Futsal Court A (Vinyl)",
            duration_hours: 2,
            estimated_total: 300000
          }
        },
        {
          method: "POST",
          path: "/api/bookings/reserve",
          desc: "Mengeksekusi reservasi baru dengan atomic DB transaction dan kode booking unik.",
          payload: "{\n  \"court_id\": 1,\n  \"booking_date\": \"2026-08-28\",\n  \"start_time\": \"14:00\",\n  \"end_time\": \"16:00\",\n  \"payment_method\": \"QRIS\"\n}",
          status: "201 Created",
          statusCode: 201,
          response: {
            success: true,
            booking_code: "BK-20260828-9842",
            status: "CONFIRMED",
            total_amount: 300000,
            reserved_at: "2026-08-24T15:00:00Z"
          }
        }
      ],
      erdTables: [
        {
          name: "users",
          tag: "AUTH TABLE",
          fields: [
            { name: "id", type: "BIGINT (PK)", isPk: true },
            { name: "name", type: "VARCHAR(255)" },
            { name: "email", type: "VARCHAR(255) UNIQUE" },
            { name: "role", type: "ENUM('customer', 'admin')" },
            { name: "phone", type: "VARCHAR(20)" }
          ]
        },
        {
          name: "courts",
          tag: "ENTITY TABLE",
          fields: [
            { name: "id", type: "BIGINT (PK)", isPk: true },
            { name: "name", type: "VARCHAR(100)" },
            { name: "sport_type", type: "VARCHAR(50)" },
            { name: "hourly_rate", type: "DECIMAL(10,2)" },
            { name: "status", type: "ENUM('active','maintenance')" }
          ]
        },
        {
          name: "bookings",
          tag: "TRANSACTION TABLE",
          fields: [
            { name: "id", type: "BIGINT (PK)", isPk: true },
            { name: "booking_code", type: "VARCHAR(30) UNIQUE INDEX" },
            { name: "user_id", type: "BIGINT (FK -> users.id)", isFk: true },
            { name: "court_id", type: "BIGINT (FK -> courts.id)", isFk: true },
            { name: "booking_date", type: "DATE INDEX" },
            { name: "start_time", type: "TIME" },
            { name: "end_time", type: "TIME" },
            { name: "total_amount", type: "DECIMAL(10,2)" },
            { name: "status", type: "ENUM('pending','confirmed','cancelled')" }
          ]
        }
      ]
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
  const modalCaseStudy = $("#modalCaseStudy");
  const pmodalTabBtns = $$("[data-pmodal-tab]", projectModal);
  const pmodalPanels = {
    overview: $("#pmodalTabOverview"),
    api: $("#pmodalTabApi"),
    erd: $("#pmodalTabErd")
  };
  const apiEndpointSelect = $("#apiEndpointSelect");
  const apiMethodBadge = $("#apiMethodBadge");
  const apiSendBtn = $("#apiSendBtn");
  const apiReqPayload = $("#apiReqPayload");
  const apiDocText = $("#apiDocText");
  const apiStatusBadge = $("#apiStatusBadge");
  const apiLatencyBadge = $("#apiLatencyBadge");
  const apiJsonBody = $("#apiJsonBody");
  const erdGrid = $("#erdGrid");
  let currentActiveProjectKey = "todo-api";
  let lastModalTrigger = null;

  function switchProjectModalTab(tabKey) {
    pmodalTabBtns.forEach((btn) => btn.classList.toggle("active", btn.dataset.pmodalTab === tabKey));
    Object.entries(pmodalPanels).forEach(([key, panel]) => {
      if (panel) panel.classList.toggle("active", key === tabKey);
    });

    if (tabKey === "api") {
      setupApiTester(currentActiveProjectKey);
    } else if (tabKey === "erd") {
      setupErdViewer(currentActiveProjectKey);
    }
  }

  pmodalTabBtns.forEach((btn) => {
    btn.addEventListener("click", () => switchProjectModalTab(btn.dataset.pmodalTab));
  });

  function setupApiTester(projectKey) {
    const data = projectData[projectKey];
    if (!data?.apiEndpoints || !apiEndpointSelect) return;

    apiEndpointSelect.innerHTML = data.apiEndpoints
      .map((ep, idx) => `<option value="${idx}">[${ep.method}] ${ep.path}</option>`)
      .join("");

    const updateEndpointView = (idx) => {
      const ep = data.apiEndpoints[idx];
      if (!ep) return;
      if (apiMethodBadge) {
        apiMethodBadge.textContent = ep.method;
        apiMethodBadge.className = `api-method-badge ${ep.method.toLowerCase()}`;
      }
      if (apiReqPayload) {
        apiReqPayload.innerHTML = `<pre style="margin:0; font-family:inherit;"><code>${ep.payload.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c])}</code></pre>`;
      }
      if (apiDocText) apiDocText.textContent = ep.desc;
      if (apiStatusBadge) {
        apiStatusBadge.textContent = "READY";
        apiStatusBadge.className = "status-badge";
      }
      if (apiLatencyBadge) apiLatencyBadge.textContent = "⚡ -- ms";
      if (apiJsonBody) {
        apiJsonBody.innerHTML = `<code>// Klik tombol SEND REQUEST di atas untuk mengeksekusi endpoint ini.</code>`;
      }
    };

    apiEndpointSelect.onchange = () => updateEndpointView(Number(apiEndpointSelect.value));
    updateEndpointView(0);
  }

  apiSendBtn?.addEventListener("click", () => {
    const data = projectData[currentActiveProjectKey];
    if (!data?.apiEndpoints) return;
    const epIdx = Number(apiEndpointSelect?.value || 0);
    const ep = data.apiEndpoints[epIdx];
    if (!ep) return;

    apiSendBtn.classList.add("loading");
    apiSendBtn.innerHTML = `<span>SENDING...</span><i>⏳</i>`;
    if (apiStatusBadge) {
      apiStatusBadge.textContent = "CONNECTING...";
      apiStatusBadge.className = "status-badge";
    }

    const latency = Math.floor(Math.random() * 32) + 24;
    window.setTimeout(() => {
      apiSendBtn.classList.remove("loading");
      apiSendBtn.innerHTML = `<span>SEND REQUEST</span><i>▶</i>`;

      if (apiStatusBadge) {
        apiStatusBadge.textContent = ep.status;
        apiStatusBadge.className = `status-badge ${ep.statusCode < 300 ? "status-200" : "status-error"}`;
      }
      if (apiLatencyBadge) {
        apiLatencyBadge.textContent = `⚡ ${latency}ms`;
      }
      if (apiJsonBody) {
        const jsonStr = JSON.stringify(ep.response, null, 2);
        apiJsonBody.innerHTML = `<code>${jsonStr.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c])}</code>`;
      }
      createToast(`Simulasi API: ${ep.method} ${ep.path} [${ep.status}]`);
    }, 380);
  });

  function setupErdViewer(projectKey) {
    const data = projectData[projectKey];
    if (!data?.erdTables || !erdGrid) return;

    erdGrid.innerHTML = data.erdTables.map((table) => `
      <div class="erd-card">
        <div class="erd-table-header">
          <strong>🗃️ ${table.name}</strong>
          <span class="erd-table-badge">${table.tag}</span>
        </div>
        <div class="erd-fields">
          ${table.fields.map((f) => `
            <div class="erd-field-row">
              <span class="erd-field-name">
                ${f.isPk ? '<span class="erd-pk">PK</span>' : ''}
                ${f.isFk ? '<span class="erd-fk">FK</span>' : ''}
                ${f.name}
              </span>
              <span class="erd-field-type">${f.type}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `).join("");
  }

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
    currentActiveProjectKey = projectKey;
    lastModalTrigger = trigger || document.activeElement;

    modalKicker.textContent = data.kicker;
    modalTitle.textContent = data.title;
    modalDescription.textContent = data.description;
    modalStats.innerHTML = data.stats.map(([label, value]) => `<div class="modal-stat"><span>${label}</span><strong>${value}</strong></div>`).join("");
    
    if (modalCaseStudy && data.caseStudy) {
      modalCaseStudy.innerHTML = `
        <div class="case-study-box">
          <strong>⚠️ Problem Statement:</strong>
          <p>${data.caseStudy.problem}</p>
        </div>
        <div class="case-study-box solution">
          <strong>💡 Backend Solution:</strong>
          <p>${data.caseStudy.solution}</p>
        </div>
      `;
    }

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

    switchProjectModalTab("overview");
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
     COMMENTS WITH AUTO-MODERATION & BLACKLIST ENGINE
  ====================================================== */

  const commentForm = $("#commentForm");
  const commentList = $("#commentList");
  const commentStatus = $("#commentStatus");
  const storageKey = "azielPortfolioCommentsV2";

  const defaultComments = [
    { name: "Aziel (Admin)", text: "Selamat datang di portfolio backend saya! Silakan tinggalkan feedback di sini.", time: "24 Agu 2026" },
    { name: "Tech Recruiter", text: "Clean portfolio and impressive API simulation! Keep it up Aziel.", time: "24 Agu 2026" },
    { name: "Senior Dev", text: "Struktur REST API dan validasi anti-bentroknya rapi bro.", time: "24 Agu 2026" }
  ];

  // Comprehensive Profanity & Blacklist List with Anti-Bypass
  const bannedKeywords = {
    budi: {
      words: ["budi", "budy", "boedi"],
      reason: "Kata 'budi' masuk dalam daftar hitam (blacklist) sistem komentar ini."
    },
    idub: {
      words: ["idub", "idup", "ydub"],
      reason: "Kata 'idub' masuk dalam daftar hitam (blacklist) sistem komentar ini."
    },
    kasar: {
      words: [
        "kontol", "kntl", "kntol", "memek", "mmk", "pantek", "pntk", "pepek", "ppk",
        "anjing", "anjir", "anj", "anjg", "asw", "asu", "babi", "bb", "bangsat", "bgst",
        "bajingan", "tolol", "tlol", "goblok", "gblk", "bego", "ngentot", "ngntt", "ngentd",
        "jancok", "jnck", "jancuk", "itil", "perek", "lonte", "lont", "kampang", "puki", "pukimak",
        "tai", "taek", "silit", "jembut", "titit", "tetek", "toket", "tempik", "banci", "bencong",
        "fuck", "fck", "shit", "bitch", "btch", "asshole", "dick", "pussy", "cunt", "whore", "slut",
        "nigger", "nigga", "bastard"
      ],
      reason: "Mengandung kata-kata kasar / umpatan yang dilarang."
    },
    spam: {
      words: ["slot", "judi", "judol", "gacor88", "zeus", "pragmatic", "togel", "bokep", "porn", "xnxx", "xvideos"],
      reason: "Terdeteksi sebagai spam / promosi terlarang."
    }
  };

  function normalizeText(input) {
    let str = String(input || "").toLowerCase();

    // 1. Leetspeak numbers & symbols decoding
    const leetMap = {
      '0': 'o',
      '1': 'i',
      '!': 'i',
      '|': 'i',
      '3': 'e',
      '4': 'a',
      '@': 'a',
      '5': 's',
      '$': 's',
      '7': 't',
      '+': 't',
      '8': 'b',
      '9': 'g',
      'v': 'u',
      '(': 'c',
      '[': 'c'
    };

    let converted = "";
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      converted += leetMap[char] || char;
    }

    // 2. String without symbols
    const cleanedWithSpaces = converted.replace(/[^a-z\s]/g, "");

    // 3. Collapsed string (no spaces, no symbols)
    const collapsed = converted.replace(/[^a-z]/g, "");

    // 4. Character De-duplication (e.g. "kontolllll" -> "kontol", "buuudiii" -> "budi")
    const deDupedWithSpaces = cleanedWithSpaces.replace(/(.)\1+/g, "$1");
    const collapsedDeDuped = collapsed.replace(/(.)\1+/g, "$1");

    return {
      raw: str,
      converted,
      cleanedWithSpaces,
      collapsed,
      deDupedWithSpaces,
      collapsedDeDuped
    };
  }

  function checkBlacklist(name, text) {
    const rawCombined = `${name} ${text}`;
    const norm = normalizeText(rawCombined);

    // Array of text variants to scan
    const textVariants = [
      norm.raw,
      norm.converted,
      norm.cleanedWithSpaces,
      norm.collapsed,
      norm.deDupedWithSpaces,
      norm.collapsedDeDuped
    ];

    // Check each category
    for (const [category, data] of Object.entries(bannedKeywords)) {
      for (const word of data.words) {
        // Flexible regex with repetition tolerance (e.g., k+o+n+t+o+l+)
        const flexibleRegex = new RegExp(word.split("").map((c) => `${c}+[\\W_]*`).join(""), "i");

        for (const variant of textVariants) {
          if (variant.includes(word) || flexibleRegex.test(variant)) {
            return {
              blocked: true,
              word: category === "budi" || category === "idub" ? word : category,
              reason: data.reason
            };
          }
        }
      }
    }

    return { blocked: false };
  }

  const getComments = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) || "null");
      return Array.isArray(stored) && stored.length > 0 ? stored : defaultComments;
    } catch {
      return defaultComments;
    }
  };

  const saveComments = (comments) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(comments.slice(0, 15)));
    } catch {
      /* storage limit safe */
    }
  };

  const renderComments = () => {
    if (!commentList) return;
    const comments = getComments();
    commentList.innerHTML = comments.map((comment) => {
      const safeName = String(comment.name).replace(/[<>&"']/g, "");
      const safeText = String(comment.text).replace(/[<>&"']/g, "");
      const initials = safeName.slice(0, 2).toUpperCase();
      const isAdmin = safeName.toLowerCase().includes("aziel");
      return `
        <article class="comment-item">
          <span class="comment-avatar ${isAdmin ? 'admin-avatar' : ''}">${initials}</span>
          <div class="comment-copy">
            <div style="display:flex; align-items:center; gap:8px;">
              <strong>${safeName}</strong>
              ${isAdmin ? '<span style="font-size:0.55rem; background:rgba(184,255,107,0.15); color:var(--lime); padding:1px 6px; border-radius:4px; border:1px solid rgba(184,255,107,0.3); font-family:var(--font-mono);">OWNER</span>' : ''}
            </div>
            <p>${safeText}</p>
          </div>
          <span class="comment-time">${comment.time || "Now"}</span>
        </article>`;
    }).join("");
  };
  renderComments();

  commentForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(commentForm);
    const name = String(data.get("commentName") || "").trim();
    const text = String(data.get("commentText") || "").trim();

    if (!name || !text) return;

    // Run Auto-Moderation & Blacklist Check
    const checkResult = checkBlacklist(name, text);

    if (checkResult.blocked) {
      if (commentStatus) {
        commentStatus.className = "comment-status error";
        commentStatus.style.display = "block";
        commentStatus.innerHTML = `<strong>❌ Komentar Ditolak!</strong><br />${checkResult.reason} Harap gunakan bahasa yang santun dan profesional.`;
      }
      commentForm.classList.remove("comment-shake");
      void commentForm.offsetWidth; // Trigger reflow for animation
      commentForm.classList.add("comment-shake");
      createToast(`Ditolak: Mengandung kata dilarang (${checkResult.word})`);
      return;
    }

    // Format current date in Indonesian
    const now = new Date();
    const dateStr = `${now.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}, ${now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`;

    const comments = getComments();
    comments.unshift({ name, text, time: dateStr });
    saveComments(comments);
    renderComments();

    if (commentStatus) {
      commentStatus.className = "comment-status success";
      commentStatus.style.display = "block";
      commentStatus.innerHTML = `✓ <strong>Komentar Berhasil Terbit!</strong> Terima kasih atas feedback Anda.`;
      window.setTimeout(() => {
        if (commentStatus) commentStatus.style.display = "none";
      }, 4000);
    }

    commentForm.reset();
    createToast("✓ Komentar berhasil diposting!");
  });

  /* =====================================================
     QUICK EMAIL COPY (1-CLICK)
  ====================================================== */
  const copyEmailBtn = $("#copyEmailBtn");
  const copyBtnIcon = $("#copyBtnIcon");
  const copyBtnLabel = $("#copyBtnLabel");
  const targetEmail = "azielakbar22@gmail.com";

  copyEmailBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(targetEmail);
      if (copyEmailBtn) copyEmailBtn.classList.add("copied");
      if (copyBtnIcon) copyBtnIcon.textContent = "✓";
      if (copyBtnLabel) copyBtnLabel.textContent = "Copied!";
      createToast("Email tersalin ke clipboard: azielakbar22@gmail.com");

      window.setTimeout(() => {
        if (copyEmailBtn) copyEmailBtn.classList.remove("copied");
        if (copyBtnIcon) copyBtnIcon.textContent = "📋";
        if (copyBtnLabel) copyBtnLabel.textContent = "Copy";
      }, 2200);
    } catch {
      createToast("Gagal menyalin email otomatis.");
    }
  });

  /* =====================================================
     DEVELOPER CLI TERMINAL (CTRL + K)
  ====================================================== */
  const terminalLauncher = $("#terminalLauncher");
  const terminalModal = $("#terminalModal");
  const terminalBackdrop = $("#terminalBackdrop");
  const terminalCloseBtn = $("#terminalCloseBtn");
  const terminalForm = $("#terminalForm");
  const terminalInput = $("#terminalInput");
  const terminalOutput = $("#terminalOutput");
  const terminalChips = $("#terminalChips");
  let terminalHistory = [];
  let historyIndex = -1;
  let lastTerminalTrigger = null;

  const terminalCommands = {
    help: () => `
      <table class="term-table">
        <tr><td class="cmd-name">help</td><td>Menampilkan daftar perintah terminal</td></tr>
        <tr><td class="cmd-name">about</td><td>Informasi singkat profil Muhammad Aziel</td></tr>
        <tr><td class="cmd-name">skills</td><td>Daftar keahlian teknis (Laravel, PHP, MySQL, API)</td></tr>
        <tr><td class="cmd-name">projects</td><td>Ringkasan project pilihan & live demo link</td></tr>
        <tr><td class="cmd-name">api</td><td>Simulasi request API internal (cURL /api/v1/health)</td></tr>
        <tr><td class="cmd-name">contact</td><td>Email, LinkedIn, TikTok, & GitHub repository</td></tr>
        <tr><td class="cmd-name">cv</td><td>Buka formulir permintaan / ringkasan CV resmi</td></tr>
        <tr><td class="cmd-name">whoami</td><td>Informasi sesi pengguna saat ini</td></tr>
        <tr><td class="cmd-name">date</td><td>Waktu dan tanggal sistem saat ini</td></tr>
        <tr><td class="cmd-name">clear</td><td>Membersihkan tampilan terminal</td></tr>
        <tr><td class="cmd-name">exit</td><td>Menutup jendela terminal</td></tr>
      </table>`,

    about: () => `
      <p class="term-line"><strong>Muhammad Aziel Akbar Santoso</strong></p>
      <p class="term-line term-dim">Siswa Rekayasa Perangkat Lunak di SMKN 1 Sukorejo (2024 - Sekarang).</p>
      <p class="term-line term-dim">Saat ini menjalani PKL sebagai <strong>Backend Developer Intern di Aziel Software House</strong>.</p>
      <p class="term-line" style="color:var(--lime);">Fokus utama: Laravel, Database Schema & Relational Design, Sanctum Token Auth, REST API Architecture.</p>`,

    skills: () => `
      <table class="term-table">
        <tr><td class="cmd-name">Framework</td><td>Laravel 11, Blade Engine</td></tr>
        <tr><td class="cmd-name">Language</td><td>PHP 8.2+, JavaScript (ES6+), SQL</td></tr>
        <tr><td class="cmd-name">Database</td><td>MySQL (Relational, Indexing, Transactions)</td></tr>
        <tr><td class="cmd-name">API & Tools</td><td>REST API, Sanctum Auth, Postman, Git, Railway Cloud</td></tr>
      </table>`,

    projects: () => `
      <p class="term-line"><strong>🚀 Project Pilihan:</strong></p>
      <p class="term-line">1. <span class="term-hl">Sport Court Booking Platform</span> — Live on Railway</p>
      <p class="term-line term-dim">&nbsp;&nbsp;&nbsp;🔗 Link: <a href="https://booking-lapangan-production.up.railway.app/" target="_blank" style="color:var(--lime)">https://booking-lapangan-production.up.railway.app/</a></p>
      <p class="term-line">2. <span class="term-hl">Todo REST API</span> — Auth with Sanctum, Filtering & Search</p>`,

    api: () => `
      <p class="term-line" style="color:#f59e0b;">$ curl -X GET https://azielganteng.vercel.app/api/v1/health</p>
      <p class="term-line" style="color:var(--lime);">HTTP/1.1 200 OK (Latency: 28ms)</p>
      <pre style="margin:4px 0; font-family:inherit; color:#e2e8f0;"><code>{
  "status": "UP",
  "developer": "Muhammad Aziel",
  "engine": "Laravel 11.x / PHP 8.2",
  "database": "MySQL Connected",
  "environment": "production"
}</code></pre>`,

    contact: () => `
      <table class="term-table">
        <tr><td class="cmd-name">Email</td><td><a href="mailto:azielakbar22@gmail.com" style="color:var(--lime);">azielakbar22@gmail.com</a></td></tr>
        <tr><td class="cmd-name">GitHub</td><td><a href="https://github.com/azielganteng" target="_blank" style="color:var(--lime);">https://github.com/azielganteng</a></td></tr>
        <tr><td class="cmd-name">TikTok</td><td>@ellzznotgutt</td></tr>
        <tr><td class="cmd-name">Location</td><td>Pasuruan, Jawa Timur, Indonesia</td></tr>
      </table>`,

    cv: () => {
      window.setTimeout(() => {
        closeTerminal();
        openCvModal();
      }, 300);
      return `<p class="term-line" style="color:var(--lime);">✓ Membuka modal Curriculum Vitae...</p>`;
    },

    whoami: () => `
      <p class="term-line">User: <strong class="term-hl">guest@aziel.dev</strong></p>
      <p class="term-line term-dim">Role: Authorized Visitor / Recruiter</p>
      <p class="term-line term-dim">Access: Read-Only Portfolio Explorer</p>`,

    date: () => `<p class="term-line">${new Date().toLocaleString("id-ID", { dateStyle: "full", timeStyle: "medium" })}</p>`,

    clear: () => {
      if (terminalOutput) terminalOutput.innerHTML = "";
      return null;
    },

    exit: () => {
      closeTerminal();
      return null;
    }
  };

  function openTerminal(trigger) {
    if (!terminalModal) return;
    lastTerminalTrigger = trigger || document.activeElement;
    terminalModal.classList.add("is-open");
    terminalModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    window.setTimeout(() => terminalInput?.focus(), 100);
  }

  function closeTerminal() {
    if (!terminalModal?.classList.contains("is-open")) return;
    terminalModal.classList.remove("is-open");
    terminalModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    lastTerminalTrigger?.focus?.();
  }

  function executeTerminalCommand(rawCmd) {
    const trimmed = rawCmd.trim();
    if (!trimmed || !terminalOutput) return;

    terminalHistory.push(trimmed);
    historyIndex = terminalHistory.length;

    // Append user input line
    const userLine = document.createElement("div");
    userLine.className = "term-line term-user-cmd";
    userLine.innerHTML = `<span style="color:var(--lime);">guest@aziel.dev:~$</span> ${trimmed.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c])}`;
    terminalOutput.appendChild(userLine);

    const parts = trimmed.toLowerCase().split(/\s+/);
    const cmd = parts[0];

    if (terminalCommands[cmd]) {
      const result = terminalCommands[cmd](parts.slice(1));
      if (result) {
        const resLine = document.createElement("div");
        resLine.className = "term-line";
        resLine.innerHTML = result;
        terminalOutput.appendChild(resLine);
      }
    } else {
      const errLine = document.createElement("div");
      errLine.className = "term-line";
      errLine.style.color = "#ef4444";
      errLine.innerHTML = `Perintah tidak dikenali: <strong>${cmd}</strong>. Ketik <span class="term-hl">help</span> untuk daftar perintah yang tersedia.`;
      terminalOutput.appendChild(errLine);
    }

    if (terminalInput) terminalInput.value = "";
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    $("#terminalBody")?.scrollTo({ top: $("#terminalBody").scrollHeight, behavior: "smooth" });
  }

  terminalLauncher?.addEventListener("click", () => openTerminal(terminalLauncher));
  terminalBackdrop?.addEventListener("click", closeTerminal);
  terminalCloseBtn?.addEventListener("click", closeTerminal);

  terminalForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (terminalInput) executeTerminalCommand(terminalInput.value);
  });

  terminalChips?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-cmd]");
    if (btn) {
      executeTerminalCommand(btn.dataset.cmd);
      terminalInput?.focus();
    }
  });

  // History & Hotkey support
  window.addEventListener("keydown", (e) => {
    // Ctrl + K or Cmd + K toggles terminal
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (terminalModal?.classList.contains("is-open")) {
        closeTerminal();
      } else {
        openTerminal();
      }
      return;
    }

    // Escape closes terminal if open
    if (e.key === "Escape" && terminalModal?.classList.contains("is-open")) {
      closeTerminal();
      return;
    }

    // Arrow up / down in terminal input
    if (document.activeElement === terminalInput) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          terminalInput.value = terminalHistory[historyIndex] || "";
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex < terminalHistory.length - 1) {
          historyIndex++;
          terminalInput.value = terminalHistory[historyIndex] || "";
        } else {
          historyIndex = terminalHistory.length;
          terminalInput.value = "";
        }
      } else if (e.key === "Tab") {
        e.preventDefault();
        const currentVal = terminalInput.value.trim().toLowerCase();
        if (currentVal) {
          const match = Object.keys(terminalCommands).find((c) => c.startsWith(currentVal));
          if (match) terminalInput.value = match;
        }
      }
    }
  });
});
