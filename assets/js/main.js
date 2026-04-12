(function () {
  "use strict";

  var header = document.querySelector("[data-header]");
  var nav = document.querySelector("[data-nav]");
  var toggle = document.querySelector("[data-nav-toggle]");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  function animateCount(el, target, duration) {
    var start = 0;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var p = Math.min((ts - startTime) / duration, 1);
      el.textContent = String(Math.floor(start + (target - start) * p));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var stats = document.querySelectorAll(".stat-value[data-count]");
  if (stats.length && "IntersectionObserver" in window) {
    var obs = new IntersectionObserver(
      function (entries, o) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var n = parseInt(el.getAttribute("data-count"), 10);
          if (!isNaN(n)) animateCount(el, n, 1200);
          o.unobserve(el);
        });
      },
      { threshold: 0.3 }
    );
    stats.forEach(function (s) {
      obs.observe(s);
    });
  } else {
    stats.forEach(function (el) {
      var n = parseInt(el.getAttribute("data-count"), 10);
      if (!isNaN(n)) el.textContent = String(n);
    });
  }

  var form = document.querySelector("[data-contact-form]");
  var note = document.querySelector("[data-form-note]");
  if (form && note) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      note.hidden = false;
      note.classList.remove("is-error");
      note.textContent =
        "This is a static demo: connect the form to your backend or a service " +
        "(e.g. Formspree, email API) before going live.";
    });
  }
})();
