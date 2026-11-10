/* =====================================================================
   PAWSCURA – CONFIGURATION
   Paste your Expo .apk link (e.g. "https://expo.dev/artifacts/eas/xxxx.apk")
   or a local file path (e.g. "./PawsCura.apk") below.
   ===================================================================== */
const APK_DOWNLOAD_URL = "./PawsCura.apk";
const APP_VERSION = "v1.0.0";
/* ===================================================================== */

(function () {
  "use strict";

  /* ---------- Icons ---------- */
  if (window.lucide) lucide.createIcons();

  /* ---------- Version + year ---------- */
  document.querySelectorAll(".js-version").forEach((el) => (el.textContent = APP_VERSION));
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- APK links ---------- */
  document.querySelectorAll(".js-apk-link").forEach((a) => {
    if (a.dataset.direct === "true") {
      // Hero CTA: scroll to the download section (guide + QR).
      return;
    }
    a.href = APK_DOWNLOAD_URL;
    a.setAttribute("download", "PawsCura.apk");
  });

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById("hamburger");
  const links = document.getElementById("navLinks");
  const setMenu = (open) => {
    burger.setAttribute("aria-expanded", String(open));
    links.classList.toggle("open", open);
    burger.classList.toggle("open", open);
  };
  burger.addEventListener("click", () => setMenu(!links.classList.contains("open")));
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  /* ---------- Navbar shadow on scroll ---------- */
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Active link highlighting ---------- */
  const sections = [...document.querySelectorAll("main section[id]")];
  const navAnchors = [...document.querySelectorAll(".nav-links a[href^='#']")];
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            navAnchors.forEach((a) =>
              a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id)
            );
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- 3D phone tilt ---------- */
  const stage = document.getElementById("phoneStage");
  const phone = document.getElementById("phone");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (stage && phone && !reduceMotion) {
    stage.addEventListener("pointermove", (e) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      phone.style.transform = `rotateY(${-14 + x * 18}deg) rotateX(${6 - y * 14}deg) rotateZ(2deg)`;
    });
    stage.addEventListener("pointerleave", () => (phone.style.transform = ""));
  }

  /* ---------- Cycling scan result (Safe → Mild → Moderate → Urgent) ---------- */
  const results = [
    { level: "safe", label: "Safe", img: "Images/DogCheck.png", cond: "Healthy skin & coat",
      tip: "No concerning signs detected. Keep up the regular grooming routine.", conf: 94 },
    { level: "mild", label: "Mild", img: "Images/DogGlass.png", cond: "Minor skin irritation",
      tip: "Likely a mild allergy. Monitor for 48 hrs and keep the area clean.", conf: 87 },
    { level: "moderate", label: "Moderate", img: "Images/CatQuestion.png", cond: "Possible eye infection",
      tip: "Schedule a vet visit within a few days if discharge continues.", conf: 82 },
    { level: "urgent", label: "Urgent", img: "Images/CatSad.png", cond: "Severe skin lesion",
      tip: "Red flag detected. See a veterinarian as soon as possible.", conf: 91 },
  ];
  const card = document.getElementById("scanCard");
  if (card) {
    const $ = (id) => document.getElementById(id);
    let i = 0;
    const render = (r) => {
      card.dataset.level = r.level;
      $("statusBadge").textContent = r.label;
      $("scanMascot").src = r.img;
      $("scanCondition").textContent = r.cond;
      $("scanTip").textContent = r.tip;
      $("confFill").style.width = r.conf + "%";
      $("confVal").textContent = r.conf + "%";
    };
    results.forEach((r) => ((new Image()).src = r.img));
    if (!reduceMotion) {
      setInterval(() => {
        i = (i + 1) % results.length;
        render(results[i]);
      }, 3200);
    }
  }

  /* ---------- FAQ: only one open at a time ---------- */
  const faqs = document.querySelectorAll(".faq details");
  faqs.forEach((d) =>
    d.addEventListener("toggle", () => {
      if (d.open) faqs.forEach((o) => o !== d && (o.open = false));
    })
  );

  /* ---------- QR code for APK ---------- */
  const qrEl = document.getElementById("qrCode");
  if (qrEl && typeof qrcode === "function") {
    try {
      const absolute = new URL(APK_DOWNLOAD_URL, window.location.href).href;
      const qr = qrcode(0, "M");
      qr.addData(absolute);
      qr.make();
      qrEl.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
      const svg = qrEl.querySelector("svg");
      if (svg) {
        svg.setAttribute("role", "img");
        svg.querySelectorAll("[fill]").forEach((p) => {
          if (p.getAttribute("fill") === "black") p.setAttribute("fill", "#302B29");
        });
      }
    } catch (err) {
      /* keep placeholder */
    }
  }
})();

