(function () {
  var shop = window.SHOP || {};
  var number = String(shop.whatsapp || "").replace(/\D/g, "");

  // Every WhatsApp button opens a chat with its own ready-made message.
  document.querySelectorAll("[data-wa]").forEach(function (link) {
    var text = link.getAttribute("data-wa");
    if (number) link.href = "https://wa.me/" + number + (text ? "?text=" + encodeURIComponent(text) : "");
    if (link.hasAttribute("data-wa-display") && shop.whatsappDisplay) link.textContent = shop.whatsappDisplay;
  });

  document.querySelectorAll("[data-email]").forEach(function (link) {
    if (!shop.email) return;
    link.href = "mailto:" + shop.email;
    link.textContent = shop.email;
  });

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Mobile menu
  var menuBtn = document.querySelector(".menu-btn");
  var nav = document.getElementById("nav");
  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  menuBtn.addEventListener("click", function () {
    setMenu(!document.body.classList.contains("menu-open"));
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) setMenu(false);
  });

  // Solid header once the page is scrolled
  var header = document.querySelector(".header");
  function onScroll() {
    header.classList.toggle("scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Sections fade in as they come into view. Anything already on screen shows straight away.
  var items = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -5% 0px", threshold: 0.05 });
  items.forEach(function (el) { observer.observe(el); });
})();
