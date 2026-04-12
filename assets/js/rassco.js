(function () {
  "use strict";

  var toggle = document.querySelector("[data-nav-toggle]");
  var panel = document.querySelector("[data-nav-panel]");
  if (!toggle || !panel) return;

  toggle.addEventListener("click", function () {
    var open = !panel.classList.contains("is-open");
    panel.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  panel.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      panel.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
})();

/* Paths relative to site root; matches ClientLogos/ in repo (spaces in filenames). */
var RASSCO_CLIENT_LOGOS = [
  "ClientLogos/Seperate Clients-01.png",
  "ClientLogos/Seperate Clients-02.png",
  "ClientLogos/Seperate Clients-03.png",
  "ClientLogos/Seperate Clients-04.png",
  "ClientLogos/Seperate Clients-05.png",
  "ClientLogos/Seperate Clients-06.png",
  "ClientLogos/Seperate Clients-07.png",
  "ClientLogos/Seperate Clients-08.png",
  "ClientLogos/Seperate Clients-09.png",
  "ClientLogos/Seperate Clients-10.png",
  "ClientLogos/Seperate Clients-11.png",
  "ClientLogos/Seperate Clients-12.png",
  "ClientLogos/Seperate Clients-13.png",
  "ClientLogos/Seperate Clients-14.png",
  "ClientLogos/Seperate Clients-15.png",
  "ClientLogos/Seperate Clients-16.png",
  "ClientLogos/Seperate Clients-17.png",
  "ClientLogos/Seperate Clients-18.png",
  "ClientLogos/Seperate Clients-19.png",
  "ClientLogos/Seperate Clients-20.png",
  "ClientLogos/Seperate Clients-21.png",
  "ClientLogos/Seperate Clients-22.png",
  "ClientLogos/Seperate Clients-23.png",
  "ClientLogos/Seperate Clients-24.png",
  "ClientLogos/Seperate Clients-25.png",
  "ClientLogos/Seperate Clients-26.png",
  "ClientLogos/Seperate Clients-27.png",
  "ClientLogos/Seperate Clients-28.png",
  "ClientLogos/Seperate Clients-29.png",
  "ClientLogos/Seperate Clients-30.png",
  "ClientLogos/Seperate Clients-31.png",
  "ClientLogos/Seperate Clients-32.png",
  "ClientLogos/Seperate Clients-33.png",
  "ClientLogos/Seperate Clients-34.png",
  "ClientLogos/Seperate Clients-35.png",
  "ClientLogos/Seperate Clients-36.png",
  "ClientLogos/Seperate Clients-37.png",
  "ClientLogos/Seperate Clients-38.png",
  "ClientLogos/Seperate Clients-39.png",
  "ClientLogos/Seperate Clients-40.png",
  "ClientLogos/Seperate Clients-41.png",
  "ClientLogos/Seperate Clients-42.png",
  "ClientLogos/Seperate Clients-43.png",
  "ClientLogos/Seperate Clients-44.png",
  "ClientLogos/Seperate Clients-45.png",
  "ClientLogos/Seperate Clients-46.png",
  "ClientLogos/Seperate Clients-47.png",
  "ClientLogos/Seperate Clients-48.png",
  "ClientLogos/Seperate Clients-49.png",
  "ClientLogos/Seperate Clients-50.png",
  "ClientLogos/Seperate Clients-51.png",
  "ClientLogos/Seperate Clients-52.png",
  "ClientLogos/Seperate Clients-53.png",
  "ClientLogos/Seperate Clients-54.png",
  "ClientLogos/Seperate Clients-55.png",
  "ClientLogos/Seperate Clients-56.png",
  "ClientLogos/Seperate Clients-57.png",
  "ClientLogos/Seperate Clients-58.png",
  "ClientLogos/Seperate Clients-59.png",
  "ClientLogos/Seperate Clients-60.png",
  "ClientLogos/Seperate Clients-61.png",
  "ClientLogos/Seperate Clients-62.png",
  "ClientLogos/Seperate Clients-63.png",
  "ClientLogos/Seperate Clients-64.png",
  "ClientLogos/Seperate Clients-65.png",
  "ClientLogos/Seperate Clients-66.png",
  "ClientLogos/Seperate Clients-67.png",
  "ClientLogos/Seperate Clients-68.png"
];

function buildClientLogoSlides(track, paths, perSlide) {
  perSlide = perSlide || 3;
  track.innerHTML = "";
  if (!paths || !paths.length) return;
  var nSlides = Math.ceil(paths.length / perSlide);
  for (var s = 0; s < nSlides; s++) {
    var slide = document.createElement("div");
    slide.className = "clients-slider-slide";
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-roledescription", "slide");
    slide.setAttribute("aria-label", s + 1 + " of " + nSlides);
    var inner = document.createElement("div");
    inner.className = "clients-slide-inner";
    var count = 0;
    for (var k = 0; k < perSlide; k++) {
      var idx = s * perSlide + k;
      if (idx >= paths.length) break;
      var card = document.createElement("div");
      card.className = "clients-logo-card";
      var img = document.createElement("img");
      img.src = encodeURI(paths[idx]);
      img.alt = "Client partner logo";
      img.loading = "lazy";
      img.decoding = "async";
      card.appendChild(img);
      inner.appendChild(card);
      count++;
    }
    if (count < perSlide) inner.classList.add("clients-slide-inner--few");
    slide.appendChild(inner);
    track.appendChild(slide);
  }
}

(function initClientsSlider() {
  var root = document.querySelector("[data-clients-slider]");
  if (!root) return;

  var track = root.querySelector("[data-clients-track]");
  var prevBtn = root.querySelector("[data-clients-prev]");
  var nextBtn = root.querySelector("[data-clients-next]");
  var dotsHost = root.querySelector("[data-clients-dots]");
  if (!track || !prevBtn || !nextBtn || !dotsHost) return;

  if (track.hasAttribute("data-clients-auto") && RASSCO_CLIENT_LOGOS.length) {
    buildClientLogoSlides(track, RASSCO_CLIENT_LOGOS, 3);
  }

  var slides = track.children;
  var n = slides.length;
  if (n === 0) return;

  var i = 0;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var autoplayMs = reduceMotion ? 0 : 5500;
  var timerId = null;

  function setSlideVisibility() {
    for (var s = 0; s < slides.length; s++) {
      slides[s].setAttribute("aria-hidden", s === i ? "false" : "true");
    }
  }

  function go(index) {
    i = ((index % n) + n) % n;
    track.style.transform = "translateX(-" + i * 100 + "%)";
    var dots = dotsHost.querySelectorAll(".clients-slider-dot");
    for (var d = 0; d < dots.length; d++) {
      var on = d === i;
      dots[d].setAttribute("aria-selected", on ? "true" : "false");
      if (on) dots[d].setAttribute("aria-current", "true");
      else dots[d].removeAttribute("aria-current");
    }
    setSlideVisibility();
  }

  function buildDots() {
    dotsHost.innerHTML = "";
    for (var s = 0; s < n; s++) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "clients-slider-dot";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", "Show client logos slide " + (s + 1) + " of " + n);
      b.setAttribute("aria-selected", s === 0 ? "true" : "false");
      if (s === 0) b.setAttribute("aria-current", "true");
      (function (idx) {
        b.addEventListener("click", function () {
          stopAutoplay();
          go(idx);
          startAutoplay();
        });
      })(s);
      dotsHost.appendChild(b);
    }
  }

  function startAutoplay() {
    if (autoplayMs <= 0) return;
    stopAutoplay();
    timerId = window.setInterval(function () {
      go(i + 1);
    }, autoplayMs);
  }

  function stopAutoplay() {
    if (timerId !== null) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  buildDots();
  go(0);

  prevBtn.addEventListener("click", function () {
    stopAutoplay();
    go(i - 1);
    startAutoplay();
  });
  nextBtn.addEventListener("click", function () {
    stopAutoplay();
    go(i + 1);
    startAutoplay();
  });

  root.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      stopAutoplay();
      go(i - 1);
      startAutoplay();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      stopAutoplay();
      go(i + 1);
      startAutoplay();
    }
  });

  root.addEventListener("mouseenter", stopAutoplay);
  root.addEventListener("mouseleave", startAutoplay);
  root.addEventListener("focusin", stopAutoplay);
  root.addEventListener("focusout", function (e) {
    if (!root.contains(e.relatedTarget)) startAutoplay();
  });

  if (autoplayMs > 0) startAutoplay();

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });
})();
