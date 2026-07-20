/* Shared site behaviour: mobile nav, dropdowns, scroll reveal, lightbox */
(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var navPrimary = document.querySelector(".nav-primary");
  if (navToggle && navPrimary) {
    navToggle.addEventListener("click", function () {
      var open = navPrimary.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
  }

  /* ---------- Dropdown menus ---------- */
  var dropdownTriggers = document.querySelectorAll(".nav-link.has-dropdown");
  dropdownTriggers.forEach(function (trigger) {
    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      var item = trigger.closest(".nav-item");
      var wasOpen = item.classList.contains("is-open");
      document.querySelectorAll(".nav-item.is-open").forEach(function (i) { i.classList.remove("is-open"); });
      if (!wasOpen) item.classList.add("is-open");
      trigger.setAttribute("aria-expanded", !wasOpen);
    });
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".nav-item")) {
      document.querySelectorAll(".nav-item.is-open").forEach(function (i) { i.classList.remove("is-open"); });
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".nav-item.is-open").forEach(function (i) { i.classList.remove("is-open"); });
      if (navPrimary && navPrimary.classList.contains("is-open")) {
        navPrimary.classList.remove("is-open");
        if (navToggle) navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    }
  });

  /* ---------- Scroll reveal ---------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Lightbox (certifications / games / photos) ---------- */
  var lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    var lbImg = lightbox.querySelector("img");
    var lbCaption = lightbox.querySelector("figcaption");
    var lastFocused = null;

    function openLightbox(src, caption) {
      lastFocused = document.activeElement;
      lbImg.src = src;
      lbImg.alt = caption || "";
      if (lbCaption) lbCaption.textContent = caption || "";
      lightbox.classList.add("is-open");
      lightbox.querySelector(".lightbox-close").focus();
      document.body.style.overflow = "hidden";
    }
    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lbImg.src = "";
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }

    document.addEventListener("click", function (e) {
      var trigger = e.target.closest("[data-lightbox]");
      if (trigger) {
        e.preventDefault();
        openLightbox(trigger.getAttribute("data-lightbox"), trigger.getAttribute("data-caption"));
        return;
      }
      if (e.target.closest(".lightbox-close") || e.target === lightbox) {
        closeLightbox();
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
    });
  }
})();