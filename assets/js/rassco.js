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

(function initClientsSlider() {
  var root = document.querySelector("[data-clients-slider]");
  if (!root) return;

  var track = root.querySelector("[data-clients-track]");
  var prevBtn = root.querySelector("[data-clients-prev]");
  var nextBtn = root.querySelector("[data-clients-next]");
  var dotsHost = root.querySelector("[data-clients-dots]");
  var slides = track ? track.children : [];
  var n = slides.length;
  if (!track || n === 0 || !prevBtn || !nextBtn || !dotsHost) return;

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
