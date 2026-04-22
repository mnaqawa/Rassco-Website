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

(function redirectGetInTouchLinks() {
  var isArabicPage = document.documentElement.getAttribute("lang") === "ar";
  var contactPageUrl = isArabicPage ? "/ar/contact.html" : "/contact.html";
  var selectors = [
    ".nav-btn[href^='mailto:info@rassco.com']",
    ".hero-cta[href^='mailto:info@rassco.com']",
    ".cta-banner-btn[href^='mailto:info@rassco.com']"
  ];
  var links = document.querySelectorAll(selectors.join(","));
  if (!links.length) return;

  links.forEach(function (link) {
    link.setAttribute("href", contactPageUrl);
  });
})();

/* Paths relative to site root; matches ClientLogos/ in repo (spaces in filenames).
   Re-order this list to show priority clients first in the marquee. PNG + .webp (same base name). */
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

function appendLogoPicture(card, pngPath) {
  // Keep client logo URLs rooted at the site base so they work
  // from both / and /ar/ pages.
  if (!/^https?:\/\//i.test(pngPath) && pngPath.charAt(0) !== "/") {
    pngPath = "/" + pngPath;
  }
  var webpPath = pngPath.replace(/\.png$/i, ".webp");
  var picture = document.createElement("picture");
  var source = document.createElement("source");
  source.type = "image/webp";
  source.srcset = encodeURI(webpPath);
  var img = document.createElement("img");
  img.src = encodeURI(pngPath);
  img.alt = "Client partner logo";
  img.loading = "lazy";
  img.decoding = "async";
  picture.appendChild(source);
  picture.appendChild(img);
  card.appendChild(picture);
}

function buildLogoCard(pngPath) {
  var card = document.createElement("div");
  card.className = "clients-logo-card";
  appendLogoPicture(card, pngPath);
  return card;
}

function buildClientMarqueeSets(paths) {
  var set = document.createElement("div");
  set.className = "clients-marquee-set";
  for (var i = 0; i < paths.length; i++) {
    set.appendChild(buildLogoCard(paths[i]));
  }
  return set;
}

(function initClientsMarquee() {
  var track = document.querySelector("[data-clients-marquee-track]");
  if (!track || !RASSCO_CLIENT_LOGOS.length) return;

  track.innerHTML = "";
  track.appendChild(buildClientMarqueeSets(RASSCO_CLIENT_LOGOS));
  var duplicate = buildClientMarqueeSets(RASSCO_CLIENT_LOGOS);
  duplicate.setAttribute("aria-hidden", "true");
  track.appendChild(duplicate);

  document.addEventListener("visibilitychange", function () {
    track.style.animationPlayState = document.hidden ? "paused" : "running";
  });
})();

(function initClientsGrid() {
  var grid = document.querySelector("[data-clients-grid]");
  if (!grid || !RASSCO_CLIENT_LOGOS.length) return;

  grid.innerHTML = "";
  for (var i = 0; i < RASSCO_CLIENT_LOGOS.length; i++) {
    var card = buildLogoCard(RASSCO_CLIENT_LOGOS[i]);
    card.setAttribute("role", "listitem");
    grid.appendChild(card);
  }
})();
